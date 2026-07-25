"""add_categories_tables

Revision ID: 3942ca961f8f
Revises: 23a7055c9094
Create Date: 2026-07-23 23:58:19.317310

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = '3942ca961f8f'
down_revision: Union[str, Sequence[str], None] = '23a7055c9094'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(conn, table_name: str) -> bool:
    insp = inspect(conn)
    return table_name in insp.get_table_names()


def _column_exists(conn, table_name: str, column_name: str) -> bool:
    insp = inspect(conn)
    cols = [c["name"] for c in insp.get_columns(table_name)]
    return column_name in cols


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()

    # Create categories table (guard against already-created by create_all)
    if not _table_exists(conn, 'categories'):
        op.create_table(
            'categories',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('slug', sa.String(length=100), nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint('id'),
        )
        op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)
        op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)

    # Create category_keywords table
    if not _table_exists(conn, 'category_keywords'):
        op.create_table(
            'category_keywords',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('category_id', sa.Integer(), nullable=False),
            sa.Column('keyword', sa.String(length=255), nullable=False),
            sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('category_id', 'keyword', name='uq_category_keyword'),
        )
        op.create_index(op.f('ix_category_keywords_category_id'), 'category_keywords', ['category_id'], unique=False)
        op.create_index(op.f('ix_category_keywords_id'), 'category_keywords', ['id'], unique=False)

    # Add category_id to jobs using batch mode (SQLite-compatible)
    if not _column_exists(conn, 'jobs', 'category_id'):
        with op.batch_alter_table('jobs') as batch_op:
            batch_op.add_column(sa.Column('category_id', sa.Integer(), nullable=True))
            batch_op.create_index('ix_jobs_category_id', ['category_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()

    if _column_exists(conn, 'jobs', 'category_id'):
        with op.batch_alter_table('jobs') as batch_op:
            batch_op.drop_index('ix_jobs_category_id')
            batch_op.drop_column('category_id')

    if _table_exists(conn, 'category_keywords'):
        op.drop_index(op.f('ix_category_keywords_id'), table_name='category_keywords')
        op.drop_index(op.f('ix_category_keywords_category_id'), table_name='category_keywords')
        op.drop_table('category_keywords')

    if _table_exists(conn, 'categories'):
        op.drop_index(op.f('ix_categories_slug'), table_name='categories')
        op.drop_index(op.f('ix_categories_id'), table_name='categories')
        op.drop_table('categories')
