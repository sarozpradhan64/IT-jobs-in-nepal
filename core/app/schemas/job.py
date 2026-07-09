from pydantic import BaseModel
from datetime import datetime
from app.schemas.company import Company

class SkillBase(BaseModel):
    name: str

class SkillCreate(SkillBase):
    slug: str

class Skill(SkillBase):
    id: int
    slug: str

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    location: str = "Nepal"
    employment_type: str = "full-time"
    experience_level: str = "mid"
    salary: str | None = None
    description: str | None = None
    requirements: str | None = None
    responsibilities: str | None = None
    posted_date: datetime | None = None
    expiry_date: datetime | None = None
    apply_url: str
    source_url: str | None = None
    remote_status: str = "onsite"

class JobCreate(JobBase):
    slug: str
    company_name: str
    company_logo: str | None = None
    company_website: str | None = None
    skills: list[str] = []
    source_name: str

class JobUpdate(BaseModel):
    title: str | None = None
    location: str | None = None
    employment_type: str | None = None
    experience_level: str | None = None
    salary: str | None = None
    description: str | None = None
    requirements: str | None = None
    responsibilities: str | None = None
    expiry_date: datetime | None = None
    apply_url: str | None = None
    remote_status: str | None = None
    is_active: bool | None = None

class JobResponse(JobBase):
    id: int
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    company: Company  # Company includes: id, slug, name, logo_url, website, overview
    skills: list[Skill] = []

    class Config:
        from_attributes = True
