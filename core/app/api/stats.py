from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models import Job, Company, Category
from app.scrapers.portal_engine import PORTAL_CONFIGS

router = APIRouter()

@router.get("/")
async def get_stats(db: AsyncSession = Depends(get_db)):
    jobs_count = (await db.execute(select(func.count(Job.id)).where(Job.is_active == True))).scalar() or 0
    companies_count = (await db.execute(
        select(func.count(Company.id)).where(Company.career_page.isnot(None))
    )).scalar() or 0

    return {
        "total_jobs": jobs_count,
        "total_companies": companies_count,
        "portals_integrated": len(PORTAL_CONFIGS),
    }

@router.get("/roles")
async def get_role_stats(db: AsyncSession = Depends(get_db)):
    rows = await db.execute(
        select(Category.slug, func.count(Job.id))
        .join(Job, Job.category_id == Category.id)
        .where(Job.is_active == True)
        .group_by(Category.slug)
    )
    return {slug: count for slug, count in rows.all()}
