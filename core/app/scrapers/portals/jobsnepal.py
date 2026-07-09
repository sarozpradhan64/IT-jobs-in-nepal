"""
JobsNepal scraper — uses the site's search endpoint to query IT keywords.
Search URL: https://www.jobsnepal.com/search-jobs?search=<keyword>
Follows redirects automatically via httpx (301 to www.jobsnepal.com).
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

# Use www. directly to avoid 301 redirects
BASE_URL = "https://www.jobsnepal.com"

# IT_KEYWORDS is imported from app.scrapers.constants


class JobsNepalScraper(BaseScraper):
    def __init__(self) -> None:
        super().__init__(source_name="JobsNepal", base_url=BASE_URL)

    # ------------------------------------------------------------------
    # Step 1: Fetch search result pages for every keyword
    # ------------------------------------------------------------------
    async def fetch(self) -> List[str]:
        """Search for each IT keyword using JobsNepal's search endpoint."""
        pages: List[str] = []

        for keyword in IT_KEYWORDS:
            # JobsNepal search: /search-jobs?search=<keyword> or /?s=<keyword>
            # Try both common patterns; the first that yields results wins per-keyword.
            candidates = [
                f"{BASE_URL}/search-jobs?{urlencode({'search': keyword})}",
                f"{BASE_URL}/jobs?{urlencode({'q': keyword})}",
                f"{BASE_URL}/?{urlencode({'s': keyword})}",
            ]

            fetched_any = False
            for search_url in candidates:
                try:
                    log.info(f"[JobsNepal] Keyword='{keyword}': {search_url}")
                    html = await self.fetch_html(search_url)
                    soup = BeautifulSoup(html, "html.parser")

                    # If there are no job cards, try the next candidate URL pattern
                    has_results = bool(soup.select(
                        "article.job-item, div.job-listing, div.job-list-item, "
                        ".single-job, div.job-post, .job-card, li.job-item"
                    ))
                    if not has_results:
                        log.debug(f"[JobsNepal] No results for pattern: {search_url}")
                        continue

                    pages.append(html)

                    # Paginate up to 3 pages for this keyword
                    next_link = soup.select_one("a[rel='next'], li.next a, a.next-page")
                    page_num = 2
                    while next_link and page_num <= 3:
                        next_url = urljoin(BASE_URL, next_link["href"])
                        log.info(f"[JobsNepal] Keyword='{keyword}' page {page_num}: {next_url}")
                        try:
                            next_html = await self.fetch_html(next_url)
                            pages.append(next_html)
                            next_soup = BeautifulSoup(next_html, "html.parser")
                            next_link = next_soup.select_one("a[rel='next'], li.next a, a.next-page")
                            page_num += 1
                        except Exception as exc:
                            log.warning(f"[JobsNepal] Pagination stopped: {exc}")
                            break

                    fetched_any = True
                    break  # Successful pattern found, skip remaining candidates

                except Exception as exc:
                    log.warning(f"[JobsNepal] Failed '{search_url}': {exc}")
                    continue

            if not fetched_any:
                log.warning(f"[JobsNepal] No results found for keyword: '{keyword}'")

        return pages

    # ------------------------------------------------------------------
    # Step 2: Parse search result pages
    # ------------------------------------------------------------------
    def parse(self, raw_data: List[str]) -> List[Dict[str, Any]]:
        jobs: List[Dict[str, Any]] = []

        for html in raw_data:
            soup = BeautifulSoup(html, "html.parser")
            cards = soup.select(
                "article.job-item, div.job-listing, div.job-list-item, "
                ".single-job, div.job-post, .job-card, li.job-item"
            )

            for card in cards:
                try:
                    title_tag = card.select_one(
                        "h2 a, h3 a, .job-title a, a.job-title, "
                        "h1 a, .title a, a.title"
                    )
                    company_tag = card.select_one(
                        ".company, .employer, .company-name, "
                        ".employer-name, span.company"
                    )
                    location_tag = card.select_one(
                        ".location, .job-location, span.location, "
                        ".address, .place"
                    )
                    logo_tag = card.select_one("img")

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
                    log.debug(f"[JobsNepal] Skipping card: {exc}")

        log.info(f"[JobsNepal] Parsed {len(jobs)} raw listings (before dedup)")
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
            slug = f"jobsnepal-{slug_base}-{hash(apply_url) & 0xFFFF:04x}"

            normalized.append(
                JobCreate(
                    title=title,
                    slug=slug,
                    location=item.get("location", "Nepal"),
                    employment_type="full-time",
                    remote_status="onsite",
                    experience_level="mid",
                    apply_url=apply_url,
                    source_name="jobsnepal",
                    company_name=item.get("company", "Unknown"),
                    company_logo=item.get("logo_url"),
                    company_website=None,
                    skills=[],
                )
            )

        log.info(f"[JobsNepal] {len(normalized)} unique jobs after dedup")
        return normalized
