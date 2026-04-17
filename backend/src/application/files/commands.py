import mimetypes
from pathlib import Path
from uuid import uuid4

from src.domain.enums import ProcessingStatus
from src.domain.errors import EmptyFileError, FileNotFoundError
from src.infrastructure.db.session import get_session_maker
from src.infrastructure.persistence.models import StoredFile
from src.infrastructure.persistence.repositories import AlertRepository, FileRepository
from src.infrastructure.storage.local_fs import get_stored_path


async def create_file(
    *,
    title: str,
    original_name: str | None,
    content: bytes,
    content_type: str | None,
) -> StoredFile:
    if not content:
        raise EmptyFileError()

    file_id = str(uuid4())
    suffix = Path(original_name or "").suffix
    stored_name = f"{file_id}{suffix}"
    stored_path = get_stored_path(stored_name)
    stored_path.write_bytes(content)

    file_item = StoredFile(
        id=file_id,
        title=title,
        original_name=original_name or stored_name,
        stored_name=stored_name,
        mime_type=content_type or mimetypes.guess_type(stored_name)[0] or "application/octet-stream",
        size=len(content),
        processing_status=ProcessingStatus.UPLOADED,
    )

    async with get_session_maker()() as session:
        return await FileRepository(session).add(file_item)


async def update_file(file_id: str, title: str) -> StoredFile:
    async with get_session_maker()() as session:
        repository = FileRepository(session)
        file_item = await repository.get_by_id(file_id)
        if not file_item:
            raise FileNotFoundError(file_id)

        file_item.title = title
        await session.commit()
        await session.refresh(file_item)
        return file_item


async def delete_file(file_id: str) -> None:
    async with get_session_maker()() as session:
        file_repository = FileRepository(session)
        alert_repository = AlertRepository(session)
        file_item = await file_repository.get_by_id(file_id)
        if not file_item:
            raise FileNotFoundError(file_id)

        stored_path = get_stored_path(file_item.stored_name)
        if stored_path.exists():
            stored_path.unlink()

        await alert_repository.delete_for_file(file_id)
        await file_repository.delete(file_item)
