from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, func, text
from app.models import Job, Company, Skill
from app.schemas.job import JobResponse
from datetime import datetime

class SearchService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def search_jobs(
        self,
        query: str,
        skip: int = 0,
        limit: int = 50,
        category_slug: str | None = None,
        sort_by: str = "date"
    ) -> list[Job]:
        # Using simple ILIKE for fallback, but full-text search is configured via GIN indexes in postgres.
        # For a truly robust FTS in SQLAlchemy 2.0 with Postgres:
        # query_term = text("to_tsvector('english', jobs.title || ' ' || coalesce(jobs.description, '')) @@ plainto_tsquery('english', :q)")
        
        search_pattern = f"%{query}%"
        
        stmt = (
            select(Job)
            .options(selectinload(Job.company), selectinload(Job.skills))
            .join(Company)
            .outerjoin(Job.skills)
            .where(Job.is_active == True)
            .where((Job.expiry_date == None) | (Job.expiry_date > datetime.utcnow()))
            .where(
                or_(
                    Job.title.ilike(search_pattern),
                    Job.description.ilike(search_pattern),
                    Company.name.ilike(search_pattern),
                    Skill.name.ilike(search_pattern)
                )
            )
        )
        
        if category_slug:
            from app.models import Category
            stmt = stmt.join(Job.category).where(Category.slug == category_slug)
            
        if sort_by == "date":
            stmt = stmt.order_by(Job.posted_date.desc())
        elif sort_by == "salary":
            stmt = stmt.order_by(Job.salary.desc().nulls_last())
        elif sort_by == "title":
            stmt = stmt.order_by(Job.title.asc())
        else:
            stmt = stmt.order_by(Job.posted_date.desc())
            
        stmt = stmt.offset(skip).limit(limit)
        
        result = await self.db.execute(stmt)
        # Unique is needed because of joins producing multiple rows per job
        return list(result.scalars().unique().all())
