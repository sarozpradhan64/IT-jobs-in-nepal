from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from app.models import Job, Company, Skill
from app.schemas.job import JobCreate, JobUpdate
from datetime import datetime

class JobRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, job_id: int) -> Job | None:
        result = await self.db.execute(
            select(Job)
            .options(selectinload(Job.company), selectinload(Job.skills), selectinload(Job.source))
            .where(Job.id == job_id)
        )
        return result.scalars().first()

    async def get_by_slug(self, slug: str) -> Job | None:
        result = await self.db.execute(
            select(Job)
            .options(selectinload(Job.company), selectinload(Job.skills), selectinload(Job.source))
            .where(Job.slug == slug)
        )
        return result.scalars().first()

    async def get_by_apply_url(self, apply_url: str) -> Job | None:
        result = await self.db.execute(
            select(Job).where(Job.apply_url == apply_url)
        )
        return result.scalars().first()

    async def get_by_company_and_title(self, company_id: int, title: str) -> Job | None:
        result = await self.db.execute(
            select(Job).where(Job.company_id == company_id, Job.title == title)
        )
        return result.scalars().first()

    async def delete(self, job_id: int) -> None:
        result = await self.db.execute(select(Job).where(Job.id == job_id))
        job = result.scalars().first()
        if job:
            await self.db.delete(job)
            await self.db.commit()

    async def list_active_jobs(
        self, 
        skip: int = 0, 
        limit: int = 100,
        q: str | None = None,
        company_id: int | None = None,
        location: str | None = None,
        employment_type: str | None = None,
        experience_level: str | None = None,
        remote_status: str | None = None,
        skill_name: str | None = None,
        category_slug: str | None = None,
        sort_by: str | None = "date"
    ) -> list[Job]:
        query = self._build_active_jobs_query(q, company_id, location, employment_type, experience_level, remote_status, skill_name, category_slug)
        
        if sort_by == "date":
            query = query.order_by(Job.posted_date.desc())
        elif sort_by == "salary":
            query = query.order_by(Job.salary.desc().nulls_last())
        elif sort_by == "title":
            query = query.order_by(Job.title.asc())
        else:
            query = query.order_by(Job.posted_date.desc())
            
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())

    async def count_active_jobs(
        self, 
        q: str | None = None,
        company_id: int | None = None,
        location: str | None = None,
        employment_type: str | None = None,
        experience_level: str | None = None,
        remote_status: str | None = None,
        skill_name: str | None = None,
        category_slug: str | None = None
    ) -> int:
        query = self._build_active_jobs_query(q, company_id, location, employment_type, experience_level, remote_status, skill_name, category_slug)
        # Convert to count query
        from sqlalchemy import func
        count_query = select(func.count()).select_from(query.subquery())
        result = await self.db.execute(count_query)
        return result.scalar() or 0

    def _build_active_jobs_query(
        self,
        q: str | None = None,
        company_id: int | None = None,
        location: str | None = None,
        employment_type: str | None = None,
        experience_level: str | None = None,
        remote_status: str | None = None,
        skill_name: str | None = None,
        category_slug: str | None = None
    ):
        from sqlalchemy import or_
        query = select(Job).options(selectinload(Job.company), selectinload(Job.skills), selectinload(Job.source), selectinload(Job.category)).where(Job.is_active == True)
        
        # We also want to filter out expired jobs if expiry_date is set
        query = query.where((Job.expiry_date == None) | (Job.expiry_date > datetime.utcnow()))
        
        if q:
            search_pattern = f"%{q}%"
            query = query.join(Company, isouter=True)
            # Need to avoid double join if skill_name is also provided, so we do it carefully
            # For simplicity, we just use title, description, company name
            query = query.where(
                or_(
                    Job.title.ilike(search_pattern),
                    Job.description.ilike(search_pattern),
                    Company.name.ilike(search_pattern)
                )
            )

        if company_id:
            query = query.where(Job.company_id == company_id)
        if location:
            query = query.where(Job.location.ilike(f"%{location}%"))
        if employment_type:
            types = [t.strip() for t in employment_type.split(',')]
            query = query.where(Job.employment_type.in_(types))
        if experience_level:
            levels = [l.strip() for l in experience_level.split(',')]
            query = query.where(Job.experience_level.in_(levels))
        if remote_status:
            statuses = [s.strip() for s in remote_status.split(',')]
            query = query.where(Job.remote_status.in_(statuses))
        if skill_name:
            skills = [s.strip() for s in skill_name.split(',')]
            # Add outer join to skills if not already joined, but SQLAlchemy handles it if we use explicit join
            # We can use an EXISTS subquery for skills to avoid messing up the main query joins
            from sqlalchemy import exists
            query = query.where(
                Job.skills.any(Skill.name.in_(skills))
                if len(skills) > 0 else True
            )
            
        if category_slug:
            from app.models import Category
            query = query.join(Job.category).where(Category.slug == category_slug)
            
        return query

    async def create(self, obj_in: JobCreate, company_id: int, source_id: int | None, skills_list: list[Skill], category_id: int | None = None) -> Job:
        db_obj = Job(
            title=obj_in.title,
            slug=f"{obj_in.company_name.lower().replace(' ', '-')}-{obj_in.title.lower().replace(' ', '-')}", # Basic slug fallback
            company_id=company_id,
            location=obj_in.location,
            employment_type=obj_in.employment_type,
            experience_level=obj_in.experience_level,
            salary=obj_in.salary,
            description=obj_in.description,
            requirements=obj_in.requirements,
            responsibilities=obj_in.responsibilities,
            posted_date=obj_in.posted_date,
            expiry_date=obj_in.expiry_date,
            apply_url=obj_in.apply_url,
            source_id=source_id,
            source_url=obj_in.source_url,
            remote_status=obj_in.remote_status,
            category_id=category_id,
        )
        
        db_obj.skills.extend(skills_list)
        
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, db_obj: Job, obj_in: JobUpdate | dict) -> Job:
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
