"""Initial migration

Revision ID: 2273eeae74ee
Revises: 
Create Date: 2026-07-03 20:31:12.547195

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = '2273eeae74ee'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(conn, table_name: str) -> bool:
    return table_name in inspect(conn).get_table_names()


def upgrade() -> None:
    conn = op.get_bind()

    # Guard: skip if tables already exist (created via create_all on existing DBs)
    if _table_exists(conn, 'companies'):
        return

    op.create_table(
        'companies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('website', sa.String(length=500), nullable=True),
        sa.Column('career_page', sa.String(length=500), nullable=True),
        sa.Column('logo_url', sa.String(length=500), nullable=True),
        sa.Column('overview', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index('ix_companies_id', 'companies', ['id'], unique=False)
    op.create_index('ix_companies_name', 'companies', ['name'], unique=True)
    op.create_index('ix_companies_slug', 'companies', ['slug'], unique=True)

    op.create_table(
        'scraper_sources',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('source_type', sa.String(length=50), nullable=False),
        sa.Column('base_url', sa.String(length=500), nullable=False),
        sa.Column('last_scraped_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )
    op.create_index('ix_scraper_sources_id', 'scraper_sources', ['id'], unique=False)
    op.create_index('ix_scraper_sources_name', 'scraper_sources', ['name'], unique=True)

    op.create_table(
        'skills',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index('ix_skills_id', 'skills', ['id'], unique=False)
    op.create_index('ix_skills_name', 'skills', ['name'], unique=True)
    op.create_index('ix_skills_slug', 'skills', ['slug'], unique=True)

    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('location', sa.String(length=255), nullable=False),
        sa.Column('employment_type', sa.String(length=50), nullable=False),
        sa.Column('experience_level', sa.String(length=50), nullable=False),
        sa.Column('salary', sa.String(length=100), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('requirements', sa.Text(), nullable=True),
        sa.Column('responsibilities', sa.Text(), nullable=True),
        sa.Column('posted_date', sa.DateTime(), nullable=False),
        sa.Column('expiry_date', sa.DateTime(), nullable=True),
        sa.Column('apply_url', sa.String(length=1000), nullable=False),
        sa.Column('source_id', sa.Integer(), nullable=True),
        sa.Column('source_url', sa.String(length=1000), nullable=True),
        sa.Column('remote_status', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['source_id'], ['scraper_sources.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('apply_url'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index('ix_jobs_id', 'jobs', ['id'], unique=False)
    op.create_index('ix_jobs_title', 'jobs', ['title'], unique=False)
    op.create_index('ix_jobs_slug', 'jobs', ['slug'], unique=True)
    op.create_index('ix_jobs_is_active', 'jobs', ['is_active'], unique=False)

    op.create_table(
        'job_skills',
        sa.Column('job_id', sa.Integer(), nullable=False),
        sa.Column('skill_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['skill_id'], ['skills.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('job_id', 'skill_id'),
    )


def downgrade() -> None:
    op.drop_table('job_skills')
    op.drop_index('ix_jobs_is_active', table_name='jobs')
    op.drop_index('ix_jobs_slug', table_name='jobs')
    op.drop_index('ix_jobs_title', table_name='jobs')
    op.drop_index('ix_jobs_id', table_name='jobs')
    op.drop_table('jobs')
    op.drop_index('ix_skills_slug', table_name='skills')
    op.drop_index('ix_skills_name', table_name='skills')
    op.drop_index('ix_skills_id', table_name='skills')
    op.drop_table('skills')
    op.drop_index('ix_scraper_sources_name', table_name='scraper_sources')
    op.drop_index('ix_scraper_sources_id', table_name='scraper_sources')
    op.drop_table('scraper_sources')
    op.drop_index('ix_companies_slug', table_name='companies')
    op.drop_index('ix_companies_name', table_name='companies')
    op.drop_index('ix_companies_id', table_name='companies')
    op.drop_table('companies')
