from pydantic import BaseModel, HttpUrl
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    website: str | None = None
    career_page: str | None = None
    logo_url: str | None = None
    overview: str | None = None

class CompanyCreate(CompanyBase):
    slug: str

class CompanyUpdate(BaseModel):
    name: str | None = None
    website: str | None = None
    career_page: str | None = None
    logo_url: str | None = None
    overview: str | None = None
    is_active: bool | None = None

class Company(CompanyBase):
    id: int
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    active_job_count: int = 0

    class Config:
        from_attributes = True
