from pathlib import Path

from src.infrastructure.config import get_settings


def get_storage_dir() -> Path:
    storage_dir = get_settings().storage_dir
    storage_dir.mkdir(parents=True, exist_ok=True)
    return storage_dir


def get_stored_path(stored_name: str) -> Path:
    return get_storage_dir() / stored_name
