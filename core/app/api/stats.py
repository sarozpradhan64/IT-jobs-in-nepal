from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models import Job, Company

router = APIRouter()

@router.get("/")
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Count active jobs
    jobs_count_query = select(func.count(Job.id)).where(Job.is_active == True)
    jobs_count_result = await db.execute(jobs_count_query)
    jobs_count = jobs_count_result.scalar() or 0

    # Count companies
    companies_count_query = select(func.count(Company.id))
    companies_count_result = await db.execute(companies_count_query)
    companies_count = companies_count_result.scalar() or 0

    # Number of portals/career pages can be mocked or derived from the companies
    # Let's say portals integrated is 10 for now, and career pages is companies_count
    
    return {
        "total_jobs": jobs_count,
        "total_companies": companies_count,
        "portals_integrated": 10
    }
