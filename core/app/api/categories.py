from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models import Category
from app.schemas.category import CategoryResponse

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category).order_by(Category.name.asc())
    )
    categories = result.scalars().all()
    return categories
