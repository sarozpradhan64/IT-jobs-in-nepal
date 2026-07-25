from pydantic import BaseModel
from datetime import datetime

class CategoryBase(BaseModel):
    slug: str
    name: str

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
