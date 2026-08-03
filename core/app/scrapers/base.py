from abc import ABC, abstractmethod
from typing import Any, List, Dict, Optional
from app.schemas.job import JobCreate
from app.repositories.job_repo import JobRepository
from app.repositories.company_repo import CompanyRepository
from app.services.category_classifier import CategoryClassifier
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
import asyncio
import re
from bs4 import BeautifulSoup

# Section heading patterns for description / requirements / responsibilities
_SECTION_RE = re.compile(
    r'(?i)(job\s+description|about\s+the\s+(role|job|position)|overview|summary|'
    r'requirements?|qualifications?|what\s+you.?ll\s+(need|bring)|'
    r'responsibilities|what\s+you.?ll\s+do|key\s+responsibilities|duties)',
)


def _clean_soup(soup: BeautifulSoup) -> None:
    """Remove navigation/chrome noise in-place."""
    for tag in soup.select("nav, header, footer, script, style"):
        tag.decompose()


def _process_html_links(html: Optional[str]) -> Optional[str]:
    """Ensure all links have target='_blank' and rel='noopener noreferrer'."""
    if not html:
        return html
    try:
        soup = BeautifulSoup(html, "html.parser")
        for a in soup.find_all('a', href=True):
            a['target'] = '_blank'
            
            rel = a.get('rel', [])
            if isinstance(rel, str):
                rel = rel.split()
            if 'noreferrer' not in rel:
                rel.append('noreferrer')
            if 'noopener' not in rel:
                rel.append('noopener')
            a['rel'] = " ".join(rel)
        return str(soup)
    except Exception:
        return html

def _extract_sections(soup: BeautifulSoup) -> tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Walk headings and bucket sibling content into description / requirements /
    responsibilities. Returns inner HTML strings to preserve formatting.
    """
    desc_parts: list[str] = []
    req_parts:  list[str] = []
    resp_parts: list[str] = []

    for heading in soup.find_all(re.compile(r'^h[1-6]$')):
        text = heading.get_text(" ", strip=True)
        if not _SECTION_RE.search(text):
            continue
        siblings_html = "".join(
            str(sib)
            for sib in heading.find_next_siblings()
            if not (sib.name and re.match(r'^h[1-6]$', sib.name))
        )
        tl = text.lower()
        if any(k in tl for k in ("description", "about", "overview", "summary")):
            desc_parts.append(siblings_html)
        elif any(k in tl for k in ("requirement", "qualification", "need", "bring")):
            req_parts.append(siblings_html)
        elif any(k in tl for k in ("responsibilit", "what you", "duties")):
            resp_parts.append(siblings_html)

    return (
        "".join(desc_parts) or None,
        "".join(req_parts)  or None,
        "".join(resp_parts) or None,
    )


def _fallback_description(soup: BeautifulSoup, min_len: int = 200) -> Optional[str]:
    """Return inner HTML from the largest block element when no labelled sections exist."""
    candidates = [
        el for el in soup.find_all(["div", "section", "article"])
        if len(el.get_text(strip=True)) > min_len
    ]
    if not candidates:
        return None
    best = max(candidates, key=lambda el: len(el.get_text(strip=True)))
    return str(best)


def _infer_remote_status(text: str) -> Optional[str]:
    if re.search(r'\bremote\b', text, re.I):                          return "remote"
    if re.search(r'\bhybrid\b', text, re.I):                          return "hybrid"
    if re.search(r'\b(on.?site|in.?office|in.?person)\b', text, re.I): return "onsite"
    return None


def _infer_experience_level(text: str) -> Optional[str]:
    if re.search(r'\b(senior|sr\.?|lead|principal|staff|head of)\b', text, re.I):          return "senior"
    if re.search(r'\b(junior|jr\.?|entry.?level|fresher|graduate|intern(ship)?)\b', text, re.I): return "junior"
    if re.search(r'\b(mid.?level|associate|intermediate)\b', text, re.I):                  return "mid"
    return None


def _infer_employment_type(text: str) -> str:
    if re.search(r'\bintern(ship)?\b', text, re.I):              return "internship"
    if re.search(r'\bpart.?time\b', text, re.I):                 return "part-time"
    if re.search(r'\b(contract|freelance|consultant)\b', text, re.I): return "contract"
    return "full-time"


class BaseScraper(ABC):
    def __init__(self, source_name: str, base_url: str):
        self.source_name = source_name
        self.base_url = base_url

    async def fetch_html(self, url: str) -> str:
        """Helper to fetch HTML using httpx (follows redirects automatically)."""
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ITJobsNepal/1.0"})
            response.raise_for_status()
            return response.text

    async def fetch_job_detail(self, url: str) -> Dict[str, Optional[str]]:
        """Fetch a job detail page and return extracted fields."""
        result: Dict[str, Optional[str]] = {
            "description": None, "requirements": None, "responsibilities": None,
            "experience_level": None, "employment_type": None, "remote_status": None,
        }
        try:
            soup = BeautifulSoup(await self.fetch_html(url), "html.parser")
            _clean_soup(soup)

            desc, req, resp = _extract_sections(soup)
            result["description"]     = desc or _fallback_description(soup)
            result["requirements"]    = req
            result["responsibilities"] = resp

            full_text = soup.get_text(" ", strip=True)
            result["remote_status"]    = _infer_remote_status(full_text)
            result["experience_level"] = _infer_experience_level(full_text)
            result["employment_type"]  = _infer_employment_type(full_text)
        except Exception as exc:
            import logging
            logging.getLogger(__name__).debug(f"fetch_job_detail failed for {url}: {exc}")
        return result

    @abstractmethod
    async def fetch(self) -> List[Any]:
        """Fetch raw HTML or JSON payload using httpx."""
        pass

    @abstractmethod
    def parse(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        """Extract structured fields using BeautifulSoup or dict parsing."""
        pass

    @abstractmethod
    async def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[JobCreate]:
        """Map fields to the standard Pydantic schema, may fetch detail pages."""
        pass

    async def save(self, db: AsyncSession, normalized_jobs: List[JobCreate], source_id: int | None = None) -> tuple[int, List[int]]:
        """Write to DB, check duplicates, and handle company association."""
        company_repo = CompanyRepository(db)
        job_repo = JobRepository(db)
        
        if not source_id:
            from app.models import ScraperSource
            from sqlalchemy.future import select
            result = await db.execute(select(ScraperSource).where(ScraperSource.name == self.source_name))
            source_obj = result.scalars().first()
            if not source_obj:
                source_obj = ScraperSource(name=self.source_name, source_type="generic", base_url=self.base_url)
                db.add(source_obj)
                await db.commit()
                await db.refresh(source_obj)
            source_id = source_obj.id
        
        # Load category classifier once for all jobs
        classifier = await CategoryClassifier.load(db)
        saved_job_ids = []
        
        for job_data in normalized_jobs:
            # Process HTML fields to ensure external links open in a new tab securely
            job_data.description = _process_html_links(job_data.description)
            job_data.requirements = _process_html_links(job_data.requirements)
            job_data.responsibilities = _process_html_links(job_data.responsibilities)

            # Generate a simple slug for the company
            company_slug = job_data.company_name.lower().replace(" ", "-")
            
            # Get or create company
            company = await company_repo.get_or_create(
                name=job_data.company_name,
                slug=company_slug,
                logo_url=job_data.company_logo,
                website=job_data.company_website
            )
            
            # Create Job
            # Check for existing job based on apply_url or title
            existing_job = await job_repo.get_by_apply_url(job_data.apply_url)
            if not existing_job:
                existing_job = await job_repo.get_by_company_and_title(company.id, job_data.title)
            
            if existing_job:
                # Remove the previous one before creating the new one
                await job_repo.delete(existing_job.id)
            
            # Classify job
            category_id = classifier.classify(
                title=job_data.title,
                description=job_data.description,
                requirements=job_data.requirements,
                responsibilities=job_data.responsibilities,
            )
            
            # TODO: create skills
            
            new_job = await job_repo.create(
                obj_in=job_data,
                company_id=company.id,
                source_id=source_id,
                skills_list=[],
                category_id=category_id
            )
            saved_job_ids.append(new_job.id)
            
        return source_id, saved_job_ids

    async def run(self, db: AsyncSession, source_id: int | None = None) -> List[JobCreate]:
        """Execute the full scraping pipeline."""
        raw_data = await self.fetch()
        parsed_data = self.parse(raw_data)
        normalized = await self.normalize(parsed_data)
        
        actual_source_id, saved_job_ids = await self.save(db, normalized, source_id)
        
        if actual_source_id:
            job_repo = JobRepository(db)
            deleted_count = await job_repo.delete_by_source_except(actual_source_id, saved_job_ids)
            import logging
            logging.getLogger(__name__).info(f"Deleted {deleted_count} stale jobs for source {self.source_name}")
            
        return normalized
