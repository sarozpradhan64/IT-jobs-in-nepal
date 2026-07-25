"""
Category Seeder
===============
Reads `core/data/categories.json` and syncs the `categories` and
`category_keywords` tables in the database.

Behaviour
---------
- Inserts missing categories (identified by slug).
- Updates the category name if it has changed.
- Inserts missing keywords for each category.
- Removes stale keywords that no longer exist in the JSON file.
- Fully idempotent: safe to run multiple times without creating duplicates.

Usage (from the `core/` directory with venv activated)::

    python seed_categories.py

Or with explicit DB override::

    DATABASE_URL=sqlite+aiosqlite:///./it_jobs_nepal.db python seed_categories.py
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.future import select
from sqlalchemy import delete

# ---------------------------------------------------------------------------
# Make sure `app` package is importable when running as a script from /core
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).parent))

from app.config import settings
from app.database import Base
from app.models import Category, CategoryKeyword

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("seed_categories")

# Path to the JSON data file — resolved relative to this script
DATA_FILE = Path(__file__).parent / "data" / "categories.json"


async def seed(db: AsyncSession) -> None:
    """Sync categories and keywords from the JSON file into the database."""

    if not DATA_FILE.exists():
        log.error(f"Data file not found: {DATA_FILE}")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    categories_data = data.get("categories", [])
    log.info(f"Found {len(categories_data)} categories in {DATA_FILE.name}")

    for cat_entry in categories_data:
        slug: str = cat_entry["slug"]
        name: str = cat_entry["name"]
        json_keywords: list[str] = [kw.lower().strip() for kw in cat_entry.get("keywords", [])]

        # ------------------------------------------------------------------
        # Upsert category
        # ------------------------------------------------------------------
        result = await db.execute(select(Category).where(Category.slug == slug))
        category = result.scalars().first()

        if category is None:
            category = Category(slug=slug, name=name, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
            db.add(category)
            await db.flush()  # get category.id without committing
            log.info(f"  [INSERT] Category: {name!r} ({slug})")
        else:
            if category.name != name:
                category.name = name
                category.updated_at = datetime.utcnow()
                log.info(f"  [UPDATE] Category name → {name!r} ({slug})")

        # ------------------------------------------------------------------
        # Sync keywords: insert new, remove stale
        # ------------------------------------------------------------------
        # Fetch existing keywords for this category
        kw_result = await db.execute(
            select(CategoryKeyword).where(CategoryKeyword.category_id == category.id)
        )
        existing_keywords_objs = kw_result.scalars().all()
        existing_set = {kw_obj.keyword for kw_obj in existing_keywords_objs}
        json_set = set(json_keywords)

        # Insert new keywords
        for kw in json_set - existing_set:
            new_kw = CategoryKeyword(category_id=category.id, keyword=kw)
            db.add(new_kw)
            log.debug(f"    [KW INSERT] {kw!r}")

        added_count = len(json_set - existing_set)
        if added_count:
            log.info(f"    Added {added_count} keyword(s) to {slug!r}")

        # Remove stale keywords
        stale = existing_set - json_set
        if stale:
            await db.execute(
                delete(CategoryKeyword).where(
                    CategoryKeyword.category_id == category.id,
                    CategoryKeyword.keyword.in_(stale),
                )
            )
            log.info(f"    Removed {len(stale)} stale keyword(s) from {slug!r}: {stale}")

    await db.commit()
    log.info("Seeding complete.")


async def main() -> None:
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=False,
        future=True,
        connect_args={"check_same_thread": False},
    )

    # Ensure tables exist (in case migration hasn't been run yet)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False)

    async with Session() as db:
        await seed(db)

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
