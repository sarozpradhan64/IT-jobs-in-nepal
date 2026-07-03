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
            .options(selectinload(Job.company), selectinload(Job.skills))
            .where(Job.id == job_id)
        )
        return result.scalars().first()

    async def get_by_slug(self, slug: str) -> Job | None:
        result = await self.db.execute(
            select(Job)
            .options(selectinload(Job.company), selectinload(Job.skills))
            .where(Job.slug == slug)
        )
        return result.scalars().first()

    async def list_active_jobs(
        self, 
        skip: int = 0, 
        limit: int = 100,
        company_id: int | None = None,
        location: str | None = None,
        employment_type: str | None = None,
        experience_level: str | None = None,
        remote_status: str | None = None,
        skill_name: str | None = None
    ) -> list[Job]:
        query = select(Job).options(selectinload(Job.company), selectinload(Job.skills)).where(Job.is_active == True)
        
        # We also want to filter out expired jobs if expiry_date is set
        query = query.where((Job.expiry_date == None) | (Job.expiry_date > datetime.utcnow()))
        
        if company_id:
            query = query.where(Job.company_id == company_id)
        if location:
            query = query.where(Job.location.ilike(f"%{location}%"))
        if employment_type:
            query = query.where(Job.employment_type == employment_type)
        if experience_level:
            query = query.where(Job.experience_level == experience_level)
        if remote_status:
            query = query.where(Job.remote_status == remote_status)
        if skill_name:
            query = query.join(Job.skills).where(Skill.name.ilike(f"%{skill_name}%"))
            
        query = query.order_by(Job.posted_date.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, obj_in: JobCreate, company_id: int, source_id: int | None, skills_list: list[Skill]) -> Job:
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
            remote_status=obj_in.remote_status
        )
        
        db_obj.skills.extend(skills_list)
        
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
