from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_FILE = (BASE_DIR / "it_jobs_nepal.db").as_posix()
CACHE_FILE = (BASE_DIR / "cache.db").as_posix()

class Settings(BaseSettings):
    PROJECT_NAME: str = "IT Jobs Aggregator Nepal"
    API_V1_STR: str = "/api"

    # Primary database — SQLite (async)
    DATABASE_URL: str = Field(
        default=f"sqlite+aiosqlite:///{DB_FILE}",
        validation_alias="DATABASE_URL"
    )

    # Sync URL for Alembic migrations
    SYNC_DATABASE_URL: str = Field(
        default=f"sqlite:///{DB_FILE}",
        validation_alias="SYNC_DATABASE_URL"
    )

    # SQLite cache (transient scraper results)
    CACHE_DB_URL: str = Field(
        default=f"sqlite+aiosqlite:///{CACHE_FILE}",
        validation_alias="CACHE_DB_URL"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
