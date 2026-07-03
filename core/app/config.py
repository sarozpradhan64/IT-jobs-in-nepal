import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "IT Jobs Aggregator Nepal"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/it_jobs_nepal",
        validation_alias="DATABASE_URL"
    )
    
    # Sync Database URL for Alembic migrations
    SYNC_DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/it_jobs_nepal",
        validation_alias="SYNC_DATABASE_URL"
    )

    # SQLite for Caching
    CACHE_DB_URL: str = Field(
        default="sqlite+aiosqlite:///./cache.db",
        validation_alias="CACHE_DB_URL"
    )
    
    # Scraper config
    AIRTABLE_URL: str = "https://airtable.com/appOKzxYQLZOUbLwU/shrXv3YvlfxLnHJfr/tbl4qpt7D9j5LlcRH/viwEYdZunRR9LhU97"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
