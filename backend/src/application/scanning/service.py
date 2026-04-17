from collections.abc import Awaitable, Callable
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.enums import AlertLevel, AlertMessageCode, ProcessingStatus, ScanReasonCode, ScanStatus
from src.domain.scan_rules import MAX_SCAN_FILE_SIZE_BYTES, PDF_ALLOWED_MIME_TYPES, SUSPICIOUS_FILE_EXTENSIONS
from src.infrastructure.db.session import get_session_maker
from src.infrastructure.persistence.models import Alert, StoredFile
from src.infrastructure.persistence.repositories import AlertRepository, FileRepository
from src.infrastructure.storage.local_fs import get_stored_path


async def _with_file(
    file_id: str,
    callback: Callable[[AsyncSession, StoredFile], Awaitable[None]],
) -> None:
    async with get_session_maker()() as session:
        file_item = await FileRepository(session).get_by_id(file_id)
        if not file_item:
            return

        await callback(session, file_item)


async def scan_file_for_threats_async(file_id: str) -> None:
    async def process(session: AsyncSession, file_item: StoredFile) -> None:
        file_item.processing_status = ProcessingStatus.PROCESSING
        reasons: list[ScanReasonCode] = []
        extension = Path(file_item.original_name).suffix.lower()

        if extension in SUSPICIOUS_FILE_EXTENSIONS:
            reasons.append(ScanReasonCode.SUSPICIOUS_EXTENSION)

        if file_item.size > MAX_SCAN_FILE_SIZE_BYTES:
            reasons.append(ScanReasonCode.FILE_TOO_LARGE)

        if extension == ".pdf" and file_item.mime_type not in PDF_ALLOWED_MIME_TYPES:
            reasons.append(ScanReasonCode.PDF_MIME_TYPE_MISMATCH)

        file_item.scan_status = ScanStatus.SUSPICIOUS if reasons else ScanStatus.CLEAN
        file_item.scan_reason_codes = reasons
        file_item.scan_details = None
        file_item.requires_attention = bool(reasons)
        await session.commit()

    await _with_file(file_id, process)


async def extract_file_metadata_async(file_id: str) -> None:
    async def process(session: AsyncSession, file_item: StoredFile) -> None:
        stored_path = get_stored_path(file_item.stored_name)
        if not stored_path.exists():
            file_item.processing_status = ProcessingStatus.FAILED
            file_item.scan_status = file_item.scan_status or ScanStatus.FAILED
            file_item.scan_reason_codes = [ScanReasonCode.STORED_FILE_NOT_FOUND]
            file_item.scan_details = None
            await session.commit()
            return

        metadata = {
            "extension": Path(file_item.original_name).suffix.lower(),
            "size_bytes": file_item.size,
            "mime_type": file_item.mime_type,
        }

        if file_item.mime_type.startswith("text/"):
            content = stored_path.read_text(encoding="utf-8", errors="ignore")
            metadata["line_count"] = len(content.splitlines())
            metadata["char_count"] = len(content)
        elif file_item.mime_type == "application/pdf":
            content = stored_path.read_bytes()
            metadata["approx_page_count"] = max(content.count(b"/Type /Page"), 1)

        file_item.metadata_json = metadata
        file_item.processing_status = ProcessingStatus.PROCESSED
        await session.commit()

    await _with_file(file_id, process)


async def send_file_alert_async(file_id: str) -> None:
    async def process(session: AsyncSession, file_item: StoredFile) -> None:
        alert_repository = AlertRepository(session)

        if file_item.processing_status == ProcessingStatus.FAILED:
            alert = Alert(file_id=file_id, level=AlertLevel.CRITICAL, message=AlertMessageCode.FILE_PROCESSING_FAILED)
        elif file_item.requires_attention:
            alert = Alert(
                file_id=file_id,
                level=AlertLevel.WARNING,
                message=AlertMessageCode.FILE_REQUIRES_ATTENTION,
            )
        else:
            alert = Alert(file_id=file_id, level=AlertLevel.INFO, message=AlertMessageCode.FILE_PROCESSED_SUCCESSFULLY)

        await alert_repository.add(alert)

    await _with_file(file_id, process)
