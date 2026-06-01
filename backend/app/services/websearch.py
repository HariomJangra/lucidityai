import hashlib
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

import numpy as np
import requests
import trafilatura

from app.core.config import get_settings
from app.services.reranker import CrossRank

# ============================================================================
# INITIALIZATION
# ============================================================================

settings = get_settings()
cross_ranker = CrossRank()


# ============================================================================
# CHUNKING UTILITIES
# ============================================================================
# Converts large documents into smaller overlapping chunks.
# This improves retrieval and reranking quality.
# ============================================================================

def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50):
    words = text.split()

    chunks = []
    step = chunk_size - overlap

    for i in range(0, len(words), step):
        chunk = " ".join(words[i : i + chunk_size])

        if chunk:
            chunks.append(chunk)

    return chunks


def build_chunks(content: dict):
    """
    Convert scraped webpages into chunk objects.
    """

    all_chunks = []

    for url, text in content.items():

        if not text or text.startswith("Error:"):
            continue

        domain = url.split("//")[-1].split("/")[0].replace("www.", "")

        raw_chunks = chunk_text(text)

        for idx, chunk in enumerate(raw_chunks):

            chunk_id = hashlib.md5(
                f"{url}-{idx}".encode()
            ).hexdigest()[:12]

            all_chunks.append(
                {
                    "chunk_id": chunk_id,
                    "url": url,
                    "domain": domain,
                    "text": chunk,
                    "chunk_index": idx,
                    "total_chunks": len(raw_chunks),
                    "metadata": {
                        "char_count": len(chunk),
                        "word_count": len(chunk.split()),
                    },
                }
            )

    return all_chunks


# ============================================================================
# WEB SCRAPING
# ============================================================================
# Responsible for downloading webpages and extracting clean text.
# ============================================================================

def scrape_url(url: str):

    try:
        downloaded = trafilatura.fetch_url(url)

        content = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=False,
        )

        return url, content

    except Exception as e:
        return url, f"Error: {e}"


# ============================================================================
# SEARCH ENGINE
# ============================================================================
# Queries SearXNG and returns search results.
# ============================================================================

def search_web(query: str):

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

    response.raise_for_status()

    return response.json()


# ============================================================================
# FRONTEND SEARCH EVENTS (OPTIONAL)
# ============================================================================
# Sends search results to active SSE streams.
# Used only for UI updates.
# ============================================================================

def dispatch_search_links(query: str, search_results: list):

    links = []

    for idx, item in enumerate(search_results[:7]):

        url = item.get("url")

        if not url:
            continue

        domain = url.split("//")[-1].split("/")[0].replace("www.", "")

        links.append(
            {
                "title": item.get("title")
                or f"{domain.capitalize()} Reference [{idx + 1}]",
                "url": url,
                "domain": domain,
                "logo": f"https://www.google.com/s2/favicons?domain={domain}&sz=32",
            }
        )

    try:
        from app.api.routes import (
            active_streams,
            active_streams_lock,
        )

        q_key = query.strip().lower()

        with active_streams_lock:

            target_contexts = []

            for original_q, contexts in active_streams.items():

                if (
                    q_key in original_q
                    or original_q in q_key
                    or any(
                        word in original_q
                        for word in q_key.split()
                        if len(word) > 3
                    )
                ):
                    target_contexts.extend(contexts)

            if not target_contexts:
                for contexts in active_streams.values():
                    target_contexts.extend(contexts)

            for ctx in target_contexts:

                event = (
                    f"data: {json.dumps({'type': 'search_links', 'links': links})}\n\n"
                )

                ctx.loop.call_soon_threadsafe(
                    ctx.queue.put_nowait,
                    event,
                )

    except Exception as e:
        print(f"SSE dispatch error: {e}")


# ============================================================================
# SCRAPE SEARCH RESULTS
# ============================================================================
# Downloads all URLs concurrently.
# ============================================================================

def scrape_search_results(urls: list):

    content = {}

    with ThreadPoolExecutor(max_workers=10) as executor:

        futures = [
            executor.submit(scrape_url, url)
            for url in urls
        ]

        for future in as_completed(futures):
            url, text = future.result()
            content[url] = text

    return content


# ============================================================================
# RETRIEVAL + RERANKING
# ============================================================================
# Uses CrossRank to select the most relevant chunks.
# ============================================================================

def retrieve_relevant_chunks(query: str, chunks: list):

    documents = [chunk["text"] for chunk in chunks]

    rerank_output = cross_ranker.rerank(
        query=query,
        documents=documents,
        candidate_k=50,
        top_k=5,
    )

    results = []

    for item in rerank_output["results"]:

        idx = item["index"]

        results.append(
            {
                **chunks[idx],
                "ce_score": item["relevance_score"],
            }
        )

    return results


# ============================================================================
# CONTEXT BUILDER
# ============================================================================
# Converts top reranked chunks into LLM context.
# ============================================================================

def build_context(results: list):

    context_lines = []
    url_to_reference = {}

    for result in results:

        url = result["url"]

        if url not in url_to_reference:
            url_to_reference[url] = len(url_to_reference) + 1

        ref = url_to_reference[url]

        context_lines.append(
            f"[{ref}] {url}\n{result['text']}"
        )

    return "\n\n".join(context_lines)


# ============================================================================
# MAIN PIPELINE
# ============================================================================
#
# Query
#   ↓
# Search
#   ↓
# Scrape
#   ↓
# Chunk
#   ↓
# Rerank
#   ↓
# Build Context
#   ↓
# Return
#
# ============================================================================

def websearch(query: str):

    # --------------------------------------------------
    # 1. Search Engine
    # --------------------------------------------------

    search_data = search_web(query)

    search_results = search_data.get("results", [])

    if not search_results:
        return "No search results found."

    # --------------------------------------------------
    # 2. Frontend Search Events
    # --------------------------------------------------

    dispatch_search_links(query, search_results)

    # --------------------------------------------------
    # 3. Extract URLs
    # --------------------------------------------------

    urls = [
        result["url"]
        for result in search_results[:7]
        if result.get("url")
    ]

    # --------------------------------------------------
    # 4. Scrape Webpages
    # --------------------------------------------------

    content = scrape_search_results(urls)

    # --------------------------------------------------
    # 5. Chunk Documents
    # --------------------------------------------------

    chunks = build_chunks(content)

    if not chunks:
        return "No clean text content could be processed."

    # --------------------------------------------------
    # 6. Retrieve Best Chunks
    # --------------------------------------------------

    top_chunks = retrieve_relevant_chunks(
        query=query,
        chunks=chunks,
    )

    # --------------------------------------------------
    # 7. Build Final Context
    # --------------------------------------------------

    context = build_context(top_chunks)

    return context