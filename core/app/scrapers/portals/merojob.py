"""
MeroJob scraper — uses the site's search endpoint to query IT keywords.
Search URL: https://merojob.com/search/?search=<keyword>
"""
import logging
import re
from typing import Any, Dict, List
from urllib.parse import urljoin, urlencode

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.scrapers.constants import IT_KEYWORDS
from app.schemas.job import JobCreate

log = logging.getLogger(__name__)

BASE_URL = "https://merojob.com"

# IT_KEYWORDS is imported from app.scrapers.constants


class MerojobScraper(BaseScraper):
    def __init__(self) -> None:
        super().__init__(source_name="MeroJob", base_url=BASE_URL)

    # ------------------------------------------------------------------
    # Step 1: Fetch search result pages for every keyword
    # ------------------------------------------------------------------
    async def fetch(self) -> List[str]:
        """Search for each IT keyword and collect all result pages."""
        pages: List[str] = []

        for keyword in IT_KEYWORDS:
            search_url = f"{BASE_URL}/search/?{urlencode({'search': keyword})}"
            page_num = 1

            while search_url and page_num <= 3:  # max 3 pages per keyword
                log.info(f"[MeroJob] Keyword='{keyword}' page {page_num}: {search_url}")
                try:
                    html = await self.fetch_html(search_url)
                    pages.append(html)

                    # Follow pagination
                    soup = BeautifulSoup(html, "html.parser")
                    next_link = soup.select_one("li.page-item a[rel='next'], a.next-page")
                    search_url = urljoin(BASE_URL, next_link["href"]) if next_link else None
                    page_num += 1
                except Exception as exc:
                    log.warning(f"[MeroJob] Stopped '{keyword}' at page {page_num}: {exc}")
                    break

        return pages

    # ------------------------------------------------------------------
    # Step 2: Parse search results
    # ------------------------------------------------------------------
    def parse(self, raw_data: List[str]) -> List[Dict[str, Any]]:
        jobs: List[Dict[str, Any]] = []

        for html in raw_data:
            soup = BeautifulSoup(html, "html.parser")
            # MeroJob search results appear as cards with class 'job-post' or 'card'
            cards = soup.select("div.job-post, div.search-result-item, div.card.job-card, article.job-item")

            for card in cards:
                try:
                    title_tag = card.select_one("h1 a, h2 a, h3 a, .job-title a, a.job-title")
                    company_tag = card.select_one(".company-name, .employer-name, span.job-company, .company")
                    location_tag = card.select_one(".job-location, span.location, .location")
                    logo_tag = card.select_one("img.company-logo, img.logo, img")

                    if not title_tag:
                        continue

                    href = title_tag.get("href", "")
                    apply_url = urljoin(BASE_URL, href) if href else None
                    if not apply_url:
                        continue

                    jobs.append({
                        "title": title_tag.get_text(strip=True),
                        "company": company_tag.get_text(strip=True) if company_tag else "Unknown",
                        "location": location_tag.get_text(strip=True) if location_tag else "Nepal",
                        "logo_url": logo_tag.get("src") if logo_tag else None,
                        "apply_url": apply_url,
                    })
                except Exception as exc:
                    log.debug(f"[MeroJob] Skipping card: {exc}")

        log.info(f"[MeroJob] Parsed {len(jobs)} raw listings (before dedup)")
        return jobs

    # ------------------------------------------------------------------
    # Step 3: Normalize to standard schema
    # ------------------------------------------------------------------
    def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[JobCreate]:
        normalized: List[JobCreate] = []
        seen_urls: set[str] = set()

        for item in parsed_data:
            apply_url = item.get("apply_url", "")
            if not apply_url or apply_url in seen_urls:
                continue
            seen_urls.add(apply_url)

            title = item.get("title", "Untitled")
            slug_base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
            slug = f"merojob-{slug_base}-{hash(apply_url) & 0xFFFF:04x}"

            normalized.append(
                JobCreate(
                    title=title,
                    slug=slug,
                    location=item.get("location", "Nepal"),
                    employment_type="full-time",
                    remote_status="onsite",
                    experience_level="mid",
                    apply_url=apply_url,
                    source_name="merojob",
                    company_name=item.get("company", "Unknown"),
                    company_logo=item.get("logo_url"),
                    company_website=None,
                    skills=[],
                )
            )

        log.info(f"[MeroJob] {len(normalized)} unique jobs after dedup")
        return normalized
