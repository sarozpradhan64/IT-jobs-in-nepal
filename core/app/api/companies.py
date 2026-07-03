from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.schemas.company import Company as CompanySchema
from app.repositories.company_repo import CompanyRepository

router = APIRouter()

@router.get("/", response_model=List[CompanySchema])
async def list_companies(
    skip: int = 0,
    limit: int = Query(50, le=100),
    search: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    repo = CompanyRepository(db)
    companies = await repo.list_all(skip=skip, limit=limit, search=search)
    return companies

@router.get("/{slug}", response_model=CompanySchema)
async def get_company(slug: str, db: AsyncSession = Depends(get_db)):
    repo = CompanyRepository(db)
    company = await repo.get_by_slug(slug)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
