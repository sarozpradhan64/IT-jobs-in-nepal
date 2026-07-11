from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "IT Jobs Aggregator Nepal"
    API_V1_STR: str = "/api"

    # Primary database — SQLite (async)
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./it_jobs_nepal.db",
        validation_alias="DATABASE_URL"
    )

    # Sync URL for Alembic migrations
    SYNC_DATABASE_URL: str = Field(
        default="sqlite:///./it_jobs_nepal.db",
        validation_alias="SYNC_DATABASE_URL"
    )

    # SQLite cache (transient scraper results)
    CACHE_DB_URL: str = Field(
        default="sqlite+aiosqlite:///./cache.db",
        validation_alias="CACHE_DB_URL"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
