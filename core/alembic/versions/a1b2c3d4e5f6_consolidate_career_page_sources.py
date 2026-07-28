"""consolidate_career_page_sources

Revision ID: a1b2c3d4e5f6
Revises: 3942ca961f8f
Create Date: 2026-07-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '3942ca961f8f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()

    # 1. Ensure canonical 'career_page' source row exists
    existing = conn.execute(
        text("SELECT id FROM scraper_sources WHERE name = 'career_page'")
    ).fetchone()

    if existing is None:
        conn.execute(text(
            "INSERT INTO scraper_sources (name, source_type, base_url, status) "
            "VALUES ('career_page', 'career_page', '', 'active')"
        ))

    canonical_id = conn.execute(
        text("SELECT id FROM scraper_sources WHERE name = 'career_page'")
    ).scalar()

    # 2. Remap all jobs from CareerPage:* sources to the canonical row
    conn.execute(text(
        "UPDATE jobs SET source_id = :cid "
        "WHERE source_id IN ("
        "  SELECT id FROM scraper_sources WHERE name LIKE 'CareerPage:%'"
        ")"
    ), {"cid": canonical_id})

    # 3. Delete stale CareerPage:* source rows
    conn.execute(text(
        "DELETE FROM scraper_sources WHERE name LIKE 'CareerPage:%'"
    ))


def downgrade() -> None:
    # Reverting is not practical — CareerPage:* rows and their per-company
    # mapping cannot be reconstructed from the consolidated data.
    pass
