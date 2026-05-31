import requests
import trafilatura
import hashlib
import numpy as np

from concurrent.futures import ThreadPoolExecutor, as_completed
from sentence_transformers import SentenceTransformer, CrossEncoder

# Load models once
bi_encoder = SentenceTransformer("BAAI/bge-base-en-v1.5")
cross_encoder = CrossEncoder("BAAI/bge-reranker-base")


def chunk_text(text, chunk_size=400, overlap=50):
    words = text.split()
    chunks = []
    step = chunk_size - overlap

    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i + chunk_size])
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

            all_chunks.append({
                "chunk_id": chunk_id,
                "url": url,
                "domain": domain,
                "text": chunk_text_str,
                "chunk_index": idx,
                "total_chunks": len(raw_chunks),
                "metadata": {
                    "char_count": len(chunk_text_str),
                    "word_count": len(chunk_text_str.split()),
                }
            })

    return all_chunks


def bi_encode_chunks(chunks: list) -> np.ndarray:
    texts = [c["text"] for c in chunks]
    return bi_encoder.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False
    )


def retrieve_top_k(query: str, chunks: list, chunk_embeddings: np.ndarray, k=50):
    query_emb = bi_encoder.encode(
        [query],
        normalize_embeddings=True
    )

    scores = np.dot(chunk_embeddings, query_emb.T).squeeze()

    top_k_idx = np.argsort(scores)[::-1][:k]

    return [(chunks[i], float(scores[i])) for i in top_k_idx]


def rerank(query: str, candidates: list, top_n=5):
    pairs = [[query, c["text"]] for c, _ in candidates]

    ce_scores = cross_encoder.predict(pairs)

    ranked = sorted(
        zip(candidates, ce_scores),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        {**chunk, "bi_score": bi_score, "ce_score": float(ce_score)}
        for (chunk, bi_score), ce_score in ranked[:top_n]
    ]


def search(query: str, chunks: list, chunk_embeddings: np.ndarray, k=50, top_n=5):
    candidates = retrieve_top_k(
        query,
        chunks,
        chunk_embeddings,
        k=k
    )

    results = rerank(
        query,
        candidates,
        top_n=top_n
    )

    return results


def scrape_url(url):
    try:
        downloaded = trafilatura.fetch_url(url)

        result = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=False
        )

        return url, result

    except Exception as e:
        return url, f"Error: {e}"


def websearch(query: str):

    # -----------------------------
    # Search
    # -----------------------------
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
        }
    )

    data = response.json()

    urls = []

    for item in data["results"]:
        urls.append(item["url"])

    urls = urls[:7]

    # -----------------------------
    # Scrape
    # -----------------------------
    content = {}

    with ThreadPoolExecutor(max_workers=10) as executor:

        futures = [
            executor.submit(scrape_url, url)
            for url in urls
        ]

        for future in as_completed(futures):
            url, result = future.result()
            content[url] = result

    # -----------------------------
    # Chunking
    # -----------------------------
    chunks = build_chunks(content)

    # -----------------------------
    # Retrieval + Reranking
    # -----------------------------
    chunk_embeddings = bi_encode_chunks(chunks)

    results = search(
        query,
        chunks,
        chunk_embeddings,
        k=50,
        top_n=5
    )

    # -----------------------------
    # Build Context
    # -----------------------------
    url_to_idx = {}
    context_lines = []

    for r in results:

        url = r["url"]

        if url not in url_to_idx:
            url_to_idx[url] = len(url_to_idx) + 1

        idx = url_to_idx[url]

        context_lines.append(
            f"[{idx}] {url}\n{r['text']}"
        )

    context = "\n\n".join(context_lines)

    return context

# print(websearch("What are the latest advancements in AI research?"))