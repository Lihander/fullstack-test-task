from pathlib import Path

from src.application.pagination import PageResult, build_page_result
from src.domain.errors import FileNotFoundError, StoredFileNotFoundError
from src.infrastructure.db.session import get_session_maker
from src.infrastructure.persistence.models import StoredFile
from src.infrastructure.persistence.repositories import FileRepository
from src.infrastructure.storage.local_fs import get_stored_path


async def list_files(*, page: int, page_size: int) -> PageResult:
    offset = (page - 1) * page_size
    async with get_session_maker()() as session:
        items, total = await FileRepository(session).list_paginated(offset=offset, limit=page_size)
        return build_page_result(items=list(items), total=total, page=page, page_size=page_size)


async def get_file(file_id: str) -> StoredFile:
    async with get_session_maker()() as session:
        file_item = await FileRepository(session).get_by_id(file_id)
        if not file_item:
            raise FileNotFoundError(file_id)
        return file_item


async def get_file_download_path(file_id: str) -> tuple[StoredFile, Path]:
    file_item = await get_file(file_id)
    stored_path = get_stored_path(file_item.stored_name)
    if not stored_path.exists():
        raise StoredFileNotFoundError(file_id)
    return file_item, stored_path
