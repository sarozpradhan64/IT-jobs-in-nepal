from pydantic import BaseModel
from datetime import datetime

class ScraperSourceBase(BaseModel):
    name: str
    source_type: str
    base_url: str

class ScraperSourceCreate(ScraperSourceBase):
    pass

class ScraperSourceUpdate(BaseModel):
    name: str | None = None
    source_type: str | None = None
    base_url: str | None = None
    status: str | None = None

class ScraperSource(ScraperSourceBase):
    id: int
    last_scraped_at: datetime | None = None
    status: str
    active_jobs_count: int = 0

    class Config:
        from_attributes = True
