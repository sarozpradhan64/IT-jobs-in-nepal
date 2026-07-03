from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models import Company
from app.schemas.company import CompanyCreate, CompanyUpdate

class CompanyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, company_id: int) -> Company | None:
        result = await self.db.execute(select(Company).where(Company.id == company_id))
        return result.scalars().first()

    async def get_by_slug(self, slug: str) -> Company | None:
        result = await self.db.execute(select(Company).where(Company.slug == slug))
        return result.scalars().first()

    async def get_by_name(self, name: str) -> Company | None:
        # Case insensitive check
        result = await self.db.execute(select(Company).where(func.lower(Company.name) == name.lower()))
        return result.scalars().first()

    async def list_all(self, skip: int = 0, limit: int = 100, search: str | None = None) -> list[Company]:
        query = select(Company).where(Company.is_active == True)
        if search:
            query = query.where(Company.name.ilike(f"%{search}%"))
        query = query.order_by(Company.name).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, obj_in: CompanyCreate) -> Company:
        db_obj = Company(
            name=obj_in.name,
            slug=obj_in.slug,
            website=obj_in.website,
            career_page=obj_in.career_page,
            logo_url=obj_in.logo_url,
            overview=obj_in.overview,
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def get_or_create(self, name: str, slug: str, logo_url: str | None = None, website: str | None = None) -> Company:
        company = await self.get_by_name(name)
        if company:
            if logo_url and not company.logo_url:
                company.logo_url = logo_url
                await self.db.commit()
                await self.db.refresh(company)
            return company
        
        company_in = CompanyCreate(
            name=name,
            slug=slug,
            logo_url=logo_url,
            website=website,
            career_page=website
        )
        return await self.create(company_in)
