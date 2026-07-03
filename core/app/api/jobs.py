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
    company_id: int | None = None,
    location: str | None = None,
    employment_type: str | None = None,
    experience_level: str | None = None,
    remote_status: str | None = None,
    skill: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    repo = JobRepository(db)
    jobs = await repo.list_active_jobs(
        skip=skip,
        limit=limit,
        company_id=company_id,
        location=location,
        employment_type=employment_type,
        experience_level=experience_level,
        remote_status=remote_status,
        skill_name=skill
    )
    return jobs

@router.get("/search", response_model=List[JobResponse])
async def search_jobs(
    q: str = Query(..., min_length=2),
    skip: int = 0,
    limit: int = Query(50, le=100),
    db: AsyncSession = Depends(get_db)
):
    service = SearchService(db)
    jobs = await service.search_jobs(query=q, skip=skip, limit=limit)
    return jobs

@router.get("/{slug}", response_model=JobResponse)
async def get_job(slug: str, db: AsyncSession = Depends(get_db)):
    repo = JobRepository(db)
    job = await repo.get_by_slug(slug)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
