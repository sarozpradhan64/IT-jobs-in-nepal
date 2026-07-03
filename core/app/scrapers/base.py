from abc import ABC, abstractmethod
from typing import Any, List, Dict
from app.schemas.job import JobCreate
from app.repositories.job_repo import JobRepository
from app.repositories.company_repo import CompanyRepository
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
import asyncio

class BaseScraper(ABC):
    def __init__(self, source_name: str, base_url: str):
        self.source_name = source_name
        self.base_url = base_url

    async def fetch_html(self, url: str) -> str:
        """Helper to fetch HTML using httpx."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ITJobsNepal/1.0"})
            response.raise_for_status()
            return response.text

    @abstractmethod
    async def fetch(self) -> List[Any]:
        """Fetch raw HTML or JSON payload using httpx or Playwright."""
        pass

    @abstractmethod
    def parse(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        """Extract structured fields using BeautifulSoup or dict parsing."""
        pass

    @abstractmethod
    def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[JobCreate]:
        """Map fields to the standard Pydantic schema."""
        pass

    async def save(self, db: AsyncSession, normalized_jobs: List[JobCreate], source_id: int | None = None) -> None:
        """Write to DB, check duplicates, and handle company association."""
        company_repo = CompanyRepository(db)
        job_repo = JobRepository(db)
        
        for job_data in normalized_jobs:
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
            # Check for existing job based on apply_url to avoid duplicates
            # In a real scenario, a more robust duplicate check is needed
            
            # TODO: create skills
            
            await job_repo.create(
                obj_in=job_data,
                company_id=company.id,
                source_id=source_id,
                skills_list=[]
            )

    async def run(self, db: AsyncSession, source_id: int | None = None) -> None:
        """Execute the full scraping pipeline."""
        raw_data = await self.fetch()
        parsed_data = self.parse(raw_data)
        normalized = self.normalize(parsed_data)
        await self.save(db, normalized, source_id)
