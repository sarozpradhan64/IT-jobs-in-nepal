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

    # Airtable API Config
    AIRTABLE_API_KEY: str | None = Field(default=None, validation_alias="AIRTABLE_API_KEY")
    AIRTABLE_BASE_ID: str = Field(default="appOKzxYQLZOUbLwU", validation_alias="AIRTABLE_BASE_ID")
    AIRTABLE_TABLE_NAME: str = Field(default="tbl4qpt7D9j5LlcRH", validation_alias="AIRTABLE_TABLE_NAME")
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
