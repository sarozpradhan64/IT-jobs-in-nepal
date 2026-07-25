from fastapi import APIRouter
from app.api import jobs, companies, stats, categories

api_router = APIRouter()
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
