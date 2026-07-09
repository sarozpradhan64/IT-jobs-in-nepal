import asyncio
import logging
import re
from typing import List, Dict, Any, Optional
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.scrapers.constants import IT_KEYWORDS
from app.schemas.job import JobCreate

log = logging.getLogger(__name__)

# Common direct paths to check – all probed concurrently
CAREER_PATHS = ["/careers", "/jobs", "/openings", "/join-us", "/about/careers", "/work-with-us", "/vacancies"]

# Placeholder / non-real domains to skip
SKIP_DOMAINS = {"my.company", "example.com", "localhost", "yourdomain.com"}

class SmartCareerScraper(BaseScraper):
    def __init__(self, company_name: str, base_url: str):
        super().__init__(source_name=f"CareerPage:{company_name}", base_url=base_url)
        self.company_name = company_name

    async def run_smart_engine(self) -> List[JobCreate]:
        """Entry point for the Smart Engine."""
        # Guard: skip placeholder / invalid domains
        domain = urlparse(self.base_url).netloc.lower().lstrip("www.")
        if domain in SKIP_DOMAINS or not self.base_url.startswith("http"):
            return []

        log.info(f"[{self.company_name}] Starting Smart Engine for {self.base_url}")

        # Phase 1: Concurrent Discovery
        career_url = await self._discover_career_page()
        if not career_url:
            log.warning(f"[{self.company_name}] Could not discover a career page.")
            return []

        log.info(f"[{self.company_name}] Found career page: {career_url}")

        # Phase 2: ATS Recognition
        ats_type = self._identify_ats(career_url)
        if ats_type:
            log.info(f"[{self.company_name}] Recognized ATS: {ats_type}")
            return await self._parse_ats(career_url, ats_type)

        # Phase 3: Universal Heuristic Fallback
        log.info(f"[{self.company_name}] Using Universal Heuristic Fallback Engine")
        return await self._fallback_extract(career_url)

    # ---------------------------------------------------------
    # Discovery Phase (Fully Concurrent)
    # ---------------------------------------------------------
    # Regex that a URL path must match to be considered a career page
    CAREER_PATH_RE = re.compile(r'(?i)/(career|careers|jobs|vacancies|openings|join-us|work-with-us)')

    def _is_career_url(self, url: str) -> bool:
        """Return True only if the URL path looks like a dedicated career/jobs page."""
        path = urlparse(url).path
        return bool(self.CAREER_PATH_RE.search(path))

    async def _check_path(self, client: httpx.AsyncClient, path: str) -> Optional[str]:
        """Probe a single career path; return URL only if it exists and is not an error page."""
        url = urljoin(self.base_url, path)
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                title = (soup.title.string or "").lower()
                # Reject obvious 404 / error pages
                if not any(bad in title for bad in ["404", "not found", "error", "page not found"]):
                    return url
        except Exception:
            pass
        return None

    async def _scrape_homepage_for_career_link(self, client: httpx.AsyncClient) -> Optional[str]:
        """
        Fetch the homepage and look for links to a /career* page.
        We only return links whose resolved path actually starts with a career pattern
        (never the homepage itself or a generic service page).
        """
        try:
            resp = await client.get(self.base_url)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            career_regex = re.compile(r'(?i)\b(career|vacancies|job|opening|join.?us|work.?with)\b')
            for a in soup.find_all("a", href=True):
                text = a.get_text(strip=True)
                href = a["href"]
                if career_regex.search(text) or career_regex.search(href):
                    full = urljoin(self.base_url, href)
                    # Only accept if the resolved URL itself has a career-like path
                    if full.startswith("http") and self._is_career_url(full):
                        return full
        except Exception:
            pass
        return None

    async def _discover_career_page(self) -> Optional[str]:
        """
        Probe all common career paths and scan the homepage for links — concurrently.
        Only returns a URL if it genuinely looks like a /career* page.
        Never falls back to the homepage or a generic page.
        """
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ITJobsNepal/1.0"}
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, headers=headers) as client:
            tasks = [self._check_path(client, p) for p in CAREER_PATHS]
            tasks.append(self._scrape_homepage_for_career_link(client))
            results = await asyncio.gather(*tasks, return_exceptions=True)

        for r in results:
            if isinstance(r, str) and self._is_career_url(r):
                return r

        return None  # No career page found — skip this company entirely

    # ---------------------------------------------------------
    # ATS Phase
    # ---------------------------------------------------------
    def _identify_ats(self, url: str) -> Optional[str]:
        domain = urlparse(url).netloc.lower()
        if "lever.co" in domain: return "lever"
        if "greenhouse.io" in domain: return "greenhouse"
        if "workable.com" in domain: return "workable"
        if "bamboohr.com" in domain: return "bamboohr"
        return None

    async def _parse_ats(self, url: str, ats_type: str) -> List[JobCreate]:
        try:
            html = await self.fetch_html(url)
            soup = BeautifulSoup(html, "html.parser")
            jobs = []

            if ats_type == "lever":
                for posting in soup.select(".posting"):
                    title = posting.select_one("h5").get_text(strip=True) if posting.select_one("h5") else "Unknown"
                    link = posting.select_one("a.posting-title")["href"] if posting.select_one("a.posting-title") else url
                    location = posting.select_one(".sort-by-location").get_text(strip=True) if posting.select_one(".sort-by-location") else "Nepal"
                    jobs.append(self._create_schema(title, link, location))

            elif ats_type == "greenhouse":
                for posting in soup.select(".opening"):
                    title = posting.select_one("a").get_text(strip=True) if posting.select_one("a") else "Unknown"
                    link = urljoin(url, posting.select_one("a")["href"]) if posting.select_one("a") else url
                    location = posting.select_one(".location").get_text(strip=True) if posting.select_one(".location") else "Nepal"
                    jobs.append(self._create_schema(title, link, location))

            elif ats_type == "workable":
                for posting in soup.select("li[data-ui='job']"):
                    title = posting.select_one("h3").get_text(strip=True) if posting.select_one("h3") else "Unknown"
                    link = posting.select_one("a")["href"] if posting.select_one("a") else url
                    jobs.append(self._create_schema(title, link, "Nepal"))

            elif ats_type == "bamboohr":
                for posting in soup.select(".ResList-item"):
                    title = posting.select_one("a").get_text(strip=True) if posting.select_one("a") else "Unknown"
                    link = urljoin(url, posting.select_one("a")["href"]) if posting.select_one("a") else url
                    jobs.append(self._create_schema(title, link, "Nepal"))

            return self._filter_it_jobs(jobs)
        except Exception as e:
            log.error(f"[{self.company_name}] Error parsing ATS {ats_type}: {e}")
            return []

    # ---------------------------------------------------------
    # Universal Heuristic Phase
    # ---------------------------------------------------------
    async def _fallback_extract(self, career_url: str) -> List[JobCreate]:
        """
        Extract job listings from a confirmed career page.
        Rules to avoid picking up service/product pages:
          1. The career_url must itself be a /career* URL (guaranteed by _discover_career_page).
          2. Each candidate link must be a child path of the career page (same domain, path extends career path),
             OR an external ATS link (lever.co, greenhouse.io, etc.).
          3. The link text must mention a plausible job title (role keywords, not generic nav words).
        """
        try:
            html = await self.fetch_html(career_url)
            soup = BeautifulSoup(html, "html.parser")

            career_parsed = urlparse(career_url)
            career_domain = career_parsed.netloc.lower()
            career_path = career_parsed.path.rstrip("/")

            # Known external ATS domains that always host real job listings
            ATS_DOMAINS = {"lever.co", "greenhouse.io", "workable.com", "bamboohr.com", "jobvite.com", "smartrecruiters.com"}

            # Words that almost certainly indicate a job listing in the link text
            JOB_TITLE_PATTERNS = re.compile(
                r'(?i)\b(engineer|developer|designer|manager|analyst|architect|devops|qa|'
                r'intern|lead|officer|coordinator|specialist|consultant|scientist|'
                r'frontend|backend|fullstack|mobile|cloud|data|security|product|software|'
                r'network|system|support|administrator|director|head of)\b'
            )

            # Generic navigation / UI words that are NOT job titles
            NAV_NOISE = re.compile(
                r'(?i)^(home|about|contact|services|blog|careers|jobs|portfolio|team|'
                r'login|sign in|sign up|privacy|terms|apply|submit|view all|more|back|next|prev)$'
            )

            job_links = []
            seen_urls: set = set()

            for a in soup.find_all("a", href=True):
                text = a.get_text(strip=True)
                href = a["href"]
                if not text or NAV_NOISE.match(text.strip()):
                    continue

                full_url = urljoin(career_url, href)
                if full_url in seen_urls:
                    continue

                parsed = urlparse(full_url)
                link_domain = parsed.netloc.lower().lstrip("www.")
                link_path = parsed.path.rstrip("/")

                # Gate 1: Must be on same domain (sub-path of career page) OR an external ATS
                is_same_domain = parsed.netloc.lower() == career_domain
                is_ats = any(ats in link_domain for ats in ATS_DOMAINS)

                if not is_same_domain and not is_ats:
                    continue

                # Gate 2: If same domain, the sub-path must look job-related
                if is_same_domain:
                    # Accept sub-paths that extend the career page path (e.g. /careers/software-engineer)
                    # OR paths that have their own career/jobs pattern (e.g. /jobs/backend-developer)
                    extends_career = link_path.startswith(career_path + "/")
                    has_career_path = bool(self.CAREER_PATH_RE.search(link_path))
                    if not extends_career and not has_career_path:
                        continue
                    # Reject if the link path goes back to known non-job sections
                    non_job_sections = re.compile(r'(?i)/(about|service|solution|product|contact|blog|portfolio|team|press|news|pricing)')
                    if non_job_sections.search(link_path):
                        continue

                # Gate 3: The link text must look like a job title
                if not JOB_TITLE_PATTERNS.search(text):
                    # Also accept if the href itself contains job-id patterns
                    if not re.search(r'(?i)[/?](job[_-]?id|opening|vacancy|position)[=/]', href):
                        continue

                seen_urls.add(full_url)
                job_links.append((text.strip(), full_url))

            return [self._create_schema(title, link, "Nepal") for title, link in job_links]

        except Exception as e:
            log.error(f"[{self.company_name}] Error in Fallback Extractor: {e}")
            return []

    def _create_schema(self, title: str, apply_url: str, location: str) -> JobCreate:
        slug_base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
        company_slug = re.sub(r"[^a-z0-9]+", "-", self.company_name.lower()).strip("-")
        slug = f"{company_slug}-{slug_base}-{hash(apply_url) & 0xFFFF:04x}"

        return JobCreate(
            title=title,
            slug=slug,
            location=location,
            employment_type="full-time",
            remote_status="onsite",
            experience_level="mid",
            apply_url=apply_url,
            source_name=self.source_name,
            company_name=self.company_name,
            company_logo=None,
            company_website=self.base_url,
            skills=[],
        )

    def _filter_it_jobs(self, jobs: List[JobCreate]) -> List[JobCreate]:
        """Filter parsed ATS jobs to ensure they are IT related."""
        it_roles = ["engineer", "developer", "designer", "qa", "product", "data", "devops", "cloud", "security"]
        return [
            j for j in jobs
            if any(kw in j.title.lower() for kw in IT_KEYWORDS)
            or any(role in j.title.lower() for role in it_roles)
        ]

    # Abstract method implementations (not used directly)
    async def fetch(self) -> List[Any]:
        return []
    def parse(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        return []
    def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[JobCreate]:
        return []
