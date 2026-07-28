import asyncio
import logging
import re
from typing import Any, Dict, List
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.scrapers.constants import IT_KEYWORDS
from app.schemas.job import JobCreate

log = logging.getLogger(__name__)

PORTAL_CONFIGS = {
    "merojob": {
        "base_url": "https://merojob.com",
        "search_url_templates": ["https://merojob.com/search/?search={keyword}"],
        "card_selector": "div.job-post, div.search-result-item, div.card.job-card, article.job-item",
        "title_selector": "h1 a, h2 a, h3 a, .job-title a, a.job-title",
        "company_selector": ".company-name, .employer-name, span.job-company, .company",
        "location_selector": ".job-location, span.location, .location",
        "logo_selector": "img.company-logo, img.logo, img",
        "next_page_selector": "li.page-item a[rel='next'], a.next-page",
        "max_pages": 3,
    },
    "jobsnepal": {
        "base_url": "https://www.jobsnepal.com",
        "search_url_templates": [
            "https://www.jobsnepal.com/search-jobs?search={keyword}",
            "https://www.jobsnepal.com/jobs?q={keyword}",
            "https://www.jobsnepal.com/?s={keyword}"
        ],
        "card_selector": "article.job-item, div.job-listing, div.job-list-item, .single-job, div.job-post, .job-card, li.job-item",
        "title_selector": "h2 a, h3 a, .job-title a, a.job-title, h1 a, .title a, a.title",
        "company_selector": ".company, .employer, .company-name, .employer-name, span.company",
        "location_selector": ".location, .job-location, span.location, .address, .place",
        "logo_selector": "img",
        "next_page_selector": "a[rel='next'], li.next a, a.next-page",
        "max_pages": 3,
    },
    "linkedin": {
        "base_url": "https://www.linkedin.com",
        "search_url_templates": ["https://www.linkedin.com/jobs/search?keywords={keyword}&location=Nepal"],
        "card_selector": "div.base-card, li.result-card, div.job-search-card",
        "title_selector": "h3.base-search-card__title, span.screen-reader-text, h3",
        "company_selector": "h4.base-search-card__subtitle, a.hidden-nested-link",
        "location_selector": "span.job-search-card__location",
        "logo_selector": "img.artdeco-entity-image",
        "next_page_selector": None, # Ignore pagination for linkedin to avoid heavy rate-limits
        "max_pages": 1,
    }
}

class SmartPortalScraper(BaseScraper):
    def __init__(self, portal_name: str) -> None:
        self.portal_name = portal_name.lower()
        if self.portal_name not in PORTAL_CONFIGS:
            raise ValueError(f"Unknown portal: {self.portal_name}")
        self.config = PORTAL_CONFIGS[self.portal_name]
        super().__init__(source_name=self.portal_name, base_url=self.config["base_url"])

    async def fetch(self) -> List[str]:
        pages: List[str] = []
        for keyword in IT_KEYWORDS:
            fetched_any = False
            for template in self.config["search_url_templates"]:
                search_url = template.replace("{keyword}", keyword.replace(" ", "%20"))
                try:
                    log.info(f"[{self.source_name}] Keyword='{keyword}': {search_url}")
                    html = await self.fetch_html(search_url)
                    soup = BeautifulSoup(html, "html.parser")

                    has_results = bool(soup.select(self.config["card_selector"]))
                    if not has_results:
                        continue

                    pages.append(html)
                    fetched_any = True

                    page_num = 2
                    next_selector = self.config["next_page_selector"]
                    max_pages = self.config["max_pages"]
                    
                    next_link = soup.select_one(next_selector) if next_selector else None
                    
                    while next_link and page_num <= max_pages:
                        next_url = urljoin(self.base_url, next_link["href"])
                        log.info(f"[{self.source_name}] Keyword='{keyword}' page {page_num}: {next_url}")
                        try:
                            next_html = await self.fetch_html(next_url)
                            pages.append(next_html)
                            next_soup = BeautifulSoup(next_html, "html.parser")
                            next_link = next_soup.select_one(next_selector)
                            page_num += 1
                        except Exception as exc:
                            log.warning(f"[{self.source_name}] Pagination stopped: {exc}")
                            break

                    break  # Found working template

                except Exception as exc:
                    log.warning(f"[{self.source_name}] Failed '{search_url}': {exc}")
                    continue

            if not fetched_any:
                log.warning(f"[{self.source_name}] No results found for keyword: '{keyword}'")

        return pages

    def parse(self, raw_data: List[str]) -> List[Dict[str, Any]]:
        jobs: List[Dict[str, Any]] = []

        for html in raw_data:
            soup = BeautifulSoup(html, "html.parser")
            cards = soup.select(self.config["card_selector"])

            for card in cards:
                try:
                    title_tag = card.select_one(self.config["title_selector"])
                    company_tag = card.select_one(self.config["company_selector"])
                    location_tag = card.select_one(self.config["location_selector"])
                    logo_tag = card.select_one(self.config["logo_selector"])

                    if not title_tag:
                        continue

                    href = title_tag.get("href", "")
                    if not href:
                        a_tag = card.select_one("a")
                        href = a_tag.get("href", "") if a_tag else ""
                        
                    apply_url = urljoin(self.base_url, href) if href else None
                    if not apply_url:
                        continue
                        
                    title = title_tag.get_text(strip=True)
                    if not title:
                         continue

                    raw_logo = logo_tag.get("src") if logo_tag else None
                    logo_url = urljoin(self.base_url, raw_logo) if raw_logo else None

                    jobs.append({
                        "title": title,
                        "company": company_tag.get_text(strip=True) if company_tag else "Unknown",
                        "location": location_tag.get_text(strip=True) if location_tag else "Nepal",
                        "logo_url": logo_url,
                        "apply_url": apply_url,
                    })
                except Exception as exc:
                    log.debug(f"[{self.source_name}] Skipping card: {exc}")

        log.info(f"[{self.source_name}] Parsed {len(jobs)} raw listings")
        return jobs

    async def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[JobCreate]:
        # Dedup first, then enrich with detail pages concurrently
        seen_urls: set[str] = set()
        unique_items: List[Dict[str, Any]] = []
        for item in parsed_data:
            url = item.get("apply_url", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique_items.append(item)

        log.info(f"[{self.source_name}] {len(unique_items)} unique jobs — fetching detail pages")
        details = await asyncio.gather(*[self.fetch_job_detail(item["apply_url"]) for item in unique_items])

        normalized: List[JobCreate] = []
        for item, detail in zip(unique_items, details):
            apply_url = item["apply_url"]
            title = item.get("title", "Untitled")
            slug_base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
            slug = f"{self.source_name}-{slug_base}-{hash(apply_url) & 0xFFFF:04x}"
            normalized.append(
                JobCreate(
                    title=title,
                    slug=slug,
                    location=item.get("location", "Nepal"),
                    employment_type=detail.get("employment_type") or "full-time",
                    remote_status=detail.get("remote_status") or "onsite",
                    experience_level=detail.get("experience_level") or "mid",
                    description=detail.get("description"),
                    requirements=detail.get("requirements"),
                    responsibilities=detail.get("responsibilities"),
                    apply_url=apply_url,
                    source_name=self.source_name,
                    company_name=item.get("company", "Unknown"),
                    company_logo=item.get("logo_url"),
                    company_website=None,
                    skills=[],
                )
            )
        return normalized

    async def _fetch_all_details(self, items: List[Dict[str, Any]]) -> List[Dict]:
        tasks = [self.fetch_job_detail(item["apply_url"]) for item in items]
        return await asyncio.gather(*tasks)
