import numpy as np
from .models import bi_encoder, cross_encoder


class CrossRank:
    def rerank(self, query: str, documents: list[str], candidate_k: int = 50, top_k: int = 5) -> dict:
        """
        Rerank a list of documents relative to a query using a two-stage approach:
        1. Bi-Encoder (BGE) for fast semantic filtering.
        2. Cross-Encoder (BGE Reranker) for highly accurate relevance scoring.
        """
        if not documents:
            return {"results": []}

        # Stage 1: Bi-Encoder (Fast Semantic Filtering)
        # Normalize embeddings during encoding to compute cosine similarity using dot products
        query_embedding = bi_encoder.encode(query, normalize_embeddings=True)
        docs_embeddings = bi_encoder.encode(documents, normalize_embeddings=True)

        # Vectorized cosine similarity computation via numpy dot product
        cosine_scores = np.dot(docs_embeddings, query_embedding)

        # Map scores to their original indices
        scores = [
            (i, doc, float(score))
            for i, (doc, score) in enumerate(zip(documents, cosine_scores))
        ]

        # Sort by score descending
        scores.sort(key=lambda x: x[2], reverse=True)

        # Select top candidates (preserve index and document)
        candidates = [(i, doc) for i, doc, _ in scores[:candidate_k]]

        # Stage 2: Cross-Encoder (Fine-grained Reranking)
        # Create Query-Document Pairs
        pairs = [(query, doc) for _idx, doc in candidates]

        # Predict Relevance Scores in a single optimized batch
        cross_scores = cross_encoder.predict(pairs)

        # Combine original indices with cross-encoder scores
        ranked = [
            (idx_doc[0], float(score))
            for idx_doc, score in zip(candidates, cross_scores)
        ]

        # Sort by cross-encoder score descending
        ranked.sort(key=lambda x: x[1], reverse=True)

        # Build response with top_k results
        results = [
            {"index": int(i), "relevance_score": float(s)}
            for i, s in ranked[:top_k]
        ]

        return {"results": results}