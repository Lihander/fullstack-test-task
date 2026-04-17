import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent


@dataclass(frozen=True)
class Settings:
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host: str
    postgres_port: str
    redis_url: str
    storage_dir: Path

    @property
    def db_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:"
            f"{self.postgres_password}@{self.postgres_host}:"
            f"{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings(
        postgres_user=os.environ.get("POSTGRES_USER", "postgres"),
        postgres_password=os.environ.get("POSTGRES_PASSWORD", "postgres"),
        postgres_db=os.environ.get("POSTGRES_DB", "postgres"),
        postgres_host=os.environ.get("POSTGRES_HOST", "localhost"),
        postgres_port=os.environ.get("PGPORT", "5432"),
        redis_url=os.environ.get("REDIS_URL", "redis://backend-redis:6379/0"),
        storage_dir=BASE_DIR / "storage" / "files",
    )
