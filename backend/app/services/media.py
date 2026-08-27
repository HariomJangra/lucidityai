import requests
from concurrent.futures import ThreadPoolExecutor
from app.core.config import get_settings

settings = get_settings()

def search_media(query: str):
    """
    Fetch images and videos from SearXNG for the given query.
    """
    def fetch_category(category: str):
        try:
            response = requests.get(
                f"{settings.searxng_url.rstrip('/')}/search",
                params={
                    "q": query,
                    "format": "json",
                    "categories": category,
                    "language": "en-IN",
                    "safesearch": 0,
                    "pageno": 1,
                },
                timeout=3.0
            )
            response.raise_for_status()
            return response.json().get("results", [])
        except Exception as e:
            print(f"Error fetching {category} from SearXNG: {e}")
            return []

    # Query image and video categories concurrently to minimize latency
    with ThreadPoolExecutor(max_workers=2) as executor:
        future_images = executor.submit(fetch_category, "images")
        future_videos = executor.submit(fetch_category, "videos")
        
        images_results = future_images.result()
        videos_results = future_videos.result()

    # Format top 8 images
    images = []
    for item in images_results[:8]:
        thumbnail = item.get("thumbnail_src")
        img_src = item.get("img_src")

        if thumbnail and thumbnail.startswith("/"):
            thumbnail = settings.searxng_url.rstrip('/') + thumbnail
        if img_src and img_src.startswith("/"):
            img_src = settings.searxng_url.rstrip('/') + img_src

        url = thumbnail or img_src
        if url:
            images.append({
                "title": item.get("title") or "Image",
                "url": url,
                "fallback_url": img_src if thumbnail else None
            })

    # Format top 6 videos
    videos = []
    for item in videos_results[:6]:
        url = item.get("url")
        if url:
            videos.append({
                "title": item.get("title") or "Video",
                "url": url,
                "thumbnail": item.get("thumbnail") or item.get("img_src") or "",
                "length": item.get("length") or "",
                "iframe_src": item.get("iframe_src") or ""
            })

    return {
        "images": images,
        "videos": videos
    }
