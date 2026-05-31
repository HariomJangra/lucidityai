import hashlib
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import numpy as np
import requests
import trafilatura
from huggingface_hub import InferenceClient

# -------------------------------------------------------------
# Configuration & API Setup
# -------------------------------------------------------------
# Replace with your actual Hugging Face API token ('hf_...')
client = InferenceClient(api_key="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")

BI_ENCODER_MODEL = "BAAI/bge-base-en-v1.5"
CROSS_ENCODER_MODEL = "BAAI/bge-reranker-base"


# -------------------------------------------------------------
# Text Processing & Chunking
# -------------------------------------------------------------
def chunk_text(text, chunk_size=400, overlap=50):
    words = text.split()
    chunks = []
    step = chunk_size - overlap

    for i in range(0, len(words), step):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk:
            chunks.append(chunk)

    return chunks


def build_chunks(content: dict) -> list:
    all_chunks = []

    for url, text in content.items():
        if not text or text.startswith("Error:"):
            continue

        domain = url.split("//")[-1].split("/")[0].replace("www.", "")
        raw_chunks = chunk_text(text)

        for idx, chunk_text_str in enumerate(raw_chunks):
            chunk_id = hashlib.md5(f"{url}-{idx}".encode()).hexdigest()[:12]

            all_chunks.append(
                {
                    "chunk_id": chunk_id,
                    "url": url,
                    "domain": domain,
                    "text": chunk_text_str,
                    "chunk_index": idx,
                    "total_chunks": len(raw_chunks),
                    "metadata": {
                        "char_count": len(chunk_text_str),
                        "word_count": len(chunk_text_str.split()),
                    },
                }
            )

    return all_chunks


# -------------------------------------------------------------
# Hugging Face API Embeddings & Reranking
# -------------------------------------------------------------
def bi_encode_chunks(chunks: list, batch_size=32) -> np.ndarray:
    """Fetches embeddings from HF Serverless API in manageable batches."""
    texts = [c["text"] for c in chunks]
    all_embeddings = []

    # Batching prevents hitting payload size limitations
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        try:
            embeddings = client.feature_extraction(
                text=batch, model=BI_ENCODER_MODEL
            )
            all_embeddings.extend(embeddings)
        except Exception as e:
            print(f"Error extracting features for batch {i}: {e}")
            # Fallback to zero vectors if a batch completely fails
            all_embeddings.extend([np.zeros(768) for _ in batch])

    embedding_matrix = np.array(all_embeddings)

    # Normalize embeddings manually
    norms = np.linalg.norm(embedding_matrix, axis=1, keepdims=True)
    # Avoid division by zero
    norms[norms == 0] = 1.0

    return embedding_matrix / norms


def retrieve_top_k(
    query: str, chunks: list, chunk_embeddings: np.ndarray, k=50
):
    """Fetches query embedding from HF and performs cosine similarity locally."""
    try:
        query_emb = np.array(
            client.feature_extraction(text=query, model=BI_ENCODER_MODEL)
        )
    except Exception as e:
        print(f"Error fetching query embedding: {e}")
        return []

    # Compute dot product similarity matrix (since vectors are normalized)
    scores = np.dot(chunk_embeddings, query_emb.T).squeeze()

    # Handle edge case where only 1 chunk exists
    if scores.ndim == 0:
        scores = np.array([scores])

    top_k_idx = np.argsort(scores)[::-1][:k]

    return [(chunks[i], float(scores[i])) for i in top_k_idx]


def rerank(query: str, candidates: list, top_n=5):
    """Reranks candidates via HF Text Classification API (CrossEncoder)."""
    ranked_results = []

    for chunk, bi_score in candidates:
        try:
            # Cross-encoders act as Text Classification tasks on Hugging Face Serverless API
            api_response = client.post(
                json={"inputs": {"text": query, "text_pair": chunk["text"]}},
                model=CROSS_ENCODER_MODEL,
            )

            response_data = json.loads(api_response.decode("utf-8"))

            # Serverless API maps outputs to a standard label probability array
            # The top class score reflects the similarity/relevance score
            ce_score = response_data["score"]

        except Exception as e:
            # Fallback to 0 if API rate limits or drops a payload chunk
            ce_score = 0.0

        ranked_results.append((chunk, bi_score, float(ce_score)))

    # Sort candidates dynamically by their ce_score
    ranked = sorted(ranked_results, key=lambda x: x[2], reverse=True)

    return [
        {**chunk, "bi_score": bi_score, "ce_score": ce_score}
        for chunk, bi_score, ce_score in ranked[:top_n]
    ]


def search(
    query: str, chunks: list, chunk_embeddings: np.ndarray, k=50, top_n=5
):
    candidates = retrieve_top_k(query, chunks, chunk_embeddings, k=k)

    if not candidates:
        return []

    results = rerank(query, candidates, top_n=top_n)
    return results


# -------------------------------------------------------------
# Web Scraping & Main Search Control Flow
# -------------------------------------------------------------
def scrape_url(url):
    try:
        downloaded = trafilatura.fetch_url(url)
        result = trafilatura.extract(
            downloaded, include_comments=False, include_tables=False
        )
        return url, result
    except Exception as e:
        return url, f"Error: {e}"


def websearch(query: str, include_timings: bool = True):
    timings = {}
    start_total = time.perf_counter()

    # -----------------------------
    # Search Engine Query
    # -----------------------------
    start = time.perf_counter()
    response = requests.get(
        "http://searxng-railway-production-5eae.up.railway.app/search",
        params={
            "q": query,
            "format": "json",
            "categories": "general",
            "language": "en-IN",
            "time_range": "month",
            "safesearch": 0,
            "pageno": 1,
        },
    )

    data = response.json()

    # Extract real 7 links generated by SearXNG in the first step of the tool
    links = []
    for idx, item in enumerate(data.get("results", [])):
        if idx >= 7:
            break
        url = item.get("url")
        if not url:
            continue
        domain = url.split("//")[-1].split("/")[0].replace("www.", "")
        title = item.get("title") or f"{domain.capitalize()} Reference [{idx + 1}]"
        
        # Fetch favicon via Google Favicon API
        logo = f"https://www.google.com/s2/favicons?domain={domain}&sz=32"
            
        links.append({
            "title": title,
            "url": url,
            "domain": domain,
            "logo": logo
        })

    # Dispatch links thread-safely to active SSE streams in routes.py
    try:
        from app.api.routes import active_streams, active_streams_lock
        q_key = query.strip().lower()
        with active_streams_lock:
            target_contexts = []
            for original_q, contexts in active_streams.items():
                if q_key in original_q or original_q in q_key or any(w in original_q for w in q_key.split() if len(w) > 3):
                    target_contexts.extend(contexts)
            
            # Fallback: if no query-specific match, send to all active streams
            if not target_contexts:
                for contexts in active_streams.values():
                    target_contexts.extend(contexts)
                    
            for ctx in target_contexts:
                event_data = f"data: {json.dumps({'type': 'search_links', 'links': links})}\n\n"
                ctx.loop.call_soon_threadsafe(ctx.queue.put_nowait, event_data)
    except Exception as e:
        print(f"Error dispatching search links: {e}")

    urls = [item["url"] for item in data.get("results", [])]
    urls = urls[:7]
    timings["search"] = time.perf_counter() - start

    if not urls:
        return "No search results found."

    # -----------------------------
    # Parallel Scraping
    # -----------------------------
    start = time.perf_counter()
    content = {}

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(scrape_url, url) for url in urls]
        for future in as_completed(futures):
            url, result = future.result()
            content[url] = result

    timings["scrape"] = time.perf_counter() - start

    # -----------------------------
    # Chunking
    # -----------------------------
    start = time.perf_counter()
    chunks = build_chunks(content)
    timings["chunking"] = time.perf_counter() - start

    if not chunks:
        return "No clean text content could be processed from the search results."

    # -----------------------------
    # Retrieval + Reranking (via API)
    # -----------------------------
    start = time.perf_counter()
    chunk_embeddings = bi_encode_chunks(chunks)
    candidates = retrieve_top_k(query, chunks, chunk_embeddings, k=50)
    timings["bi_encoder"] = time.perf_counter() - start

    start = time.perf_counter()
    results = rerank(query, candidates, top_n=5) if candidates else []
    timings["cross_encoder"] = time.perf_counter() - start
    timings["retrieval_rerank"] = (
        timings["bi_encoder"] + timings["cross_encoder"]
    )

    # -----------------------------
    # Build Context Text Block
    # -----------------------------
    start = time.perf_counter()
    url_to_idx = {}
    context_lines = []

    for r in results:
        url = r["url"]
        if url not in url_to_idx:
            url_to_idx[url] = len(url_to_idx) + 1

        idx = url_to_idx[url]
        context_lines.append(f"[{idx}] {url}\n{r['text']}")

    context = "\n\n".join(context_lines)
    timings["build_context"] = time.perf_counter() - start
    timings["total"] = time.perf_counter() - start_total

    if include_timings:
        timing_lines = ["---", "Timing (seconds):"]
        for key in [
            "search",
            "scrape",
            "chunking",
            "bi_encoder",
            "cross_encoder",
            "retrieval_rerank",
            "build_context",
            "total",
        ]:
            if key in timings:
                timing_lines.append(f"- {key}: {timings[key]:.4f}")

        context = context + "\n\n" + "\n".join(timing_lines)

    return context


# Execution block for testing:
# if __name__ == "__main__":
#     print(websearch("What are the latest advancements in AI research?"))