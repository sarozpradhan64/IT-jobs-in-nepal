from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.schemas.job import JobResponse
from app.repositories.job_repo import JobRepository
from app.services.search_service import SearchService

router = APIRouter()

@router.get("/", response_model=List[JobResponse])
async def list_jobs(
    skip: int = 0,
    limit: int = Query(50, le=100),
    q: str | None = None,
    company_id: int | None = None,
    location: str | None = None,
    employment_type: str | None = None,
    experience_level: str | None = None,
    remote_status: str | None = None,
    skill: str | None = None,
    category: str | None = None,
    sort_by: str = Query("date", description="Sort by date, salary, or title"),
    db: AsyncSession = Depends(get_db)
):
    repo = JobRepository(db)
    jobs = await repo.list_active_jobs(
        skip=skip,
        limit=limit,
        q=q,
        company_id=company_id,
        location=location,
        employment_type=employment_type,
        experience_level=experience_level,
        remote_status=remote_status,
        skill_name=skill,
        category_slug=category,
        sort_by=sort_by
    )
    return jobs

@router.get("/search", response_model=List[JobResponse])
async def search_jobs(
    q: str = Query(..., min_length=2),
    skip: int = 0,
    limit: int = Query(50, le=100),
    category: str | None = None,
    sort_by: str = Query("date", description="Sort by date, salary, or title"),
    db: AsyncSession = Depends(get_db)
):
    service = SearchService(db)
    jobs = await service.search_jobs(query=q, skip=skip, limit=limit, category_slug=category, sort_by=sort_by)
    return jobs

@router.get("/{slug}", response_model=JobResponse)
async def get_job(slug: str, db: AsyncSession = Depends(get_db)):
    repo = JobRepository(db)
    job = await repo.get_by_slug(slug)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
