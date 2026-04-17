from datetime import UTC, datetime

import pytest
from sqlalchemy import select

from src.domain.enums import AlertLevel, AlertMessageCode, ProcessingStatus, ScanReasonCode, ScanStatus
from src.infrastructure.persistence.models import Alert, StoredFile
from src.application.scanning.service import extract_file_metadata_async, scan_file_for_threats_async, send_file_alert_async


@pytest.mark.asyncio
async def test_worker_pipeline_marks_suspicious_file_and_creates_warning_alert(test_context):
    created_at = datetime(2026, 4, 5, tzinfo=UTC)
    stored_file = StoredFile(
        id="script-file",
        title="Script",
        original_name="script.sh",
        stored_name="script-file.sh",
        mime_type="text/plain",
        size=18,
        processing_status=ProcessingStatus.UPLOADED,
        requires_attention=False,
        created_at=created_at,
        updated_at=created_at,
    )

    async with test_context.session_maker() as session:
        session.add(stored_file)
        await session.commit()

    (test_context.storage_dir / "script-file.sh").write_text("echo 1\necho 2\n", encoding="utf-8")

    await scan_file_for_threats_async("script-file")
    await extract_file_metadata_async("script-file")
    await send_file_alert_async("script-file")

    async with test_context.session_maker() as session:
        file_item = await session.get(StoredFile, "script-file")
        alert = (await session.execute(select(Alert))).scalar_one()

    assert file_item is not None
    assert file_item.processing_status == ProcessingStatus.PROCESSED
    assert file_item.scan_status == ScanStatus.SUSPICIOUS
    assert file_item.scan_reason_codes == [ScanReasonCode.SUSPICIOUS_EXTENSION]
    assert file_item.scan_details is None
    assert file_item.requires_attention is True
    assert file_item.metadata_json == {
        "extension": ".sh",
        "size_bytes": 18,
        "mime_type": "text/plain",
        "line_count": 2,
        "char_count": 14,
    }
    assert alert.level == AlertLevel.WARNING
    assert alert.message == AlertMessageCode.FILE_REQUIRES_ATTENTION


@pytest.mark.asyncio
async def test_worker_pipeline_marks_missing_binary_as_failed_and_creates_critical_alert(test_context):
    created_at = datetime(2026, 4, 6, tzinfo=UTC)
    stored_file = StoredFile(
        id="missing-binary",
        title="Missing",
        original_name="missing.pdf",
        stored_name="missing-binary.pdf",
        mime_type="application/pdf",
        size=1024,
        processing_status=ProcessingStatus.UPLOADED,
        requires_attention=False,
        created_at=created_at,
        updated_at=created_at,
    )

    async with test_context.session_maker() as session:
        session.add(stored_file)
        await session.commit()

    await scan_file_for_threats_async("missing-binary")
    await extract_file_metadata_async("missing-binary")
    await send_file_alert_async("missing-binary")

    async with test_context.session_maker() as session:
        file_item = await session.get(StoredFile, "missing-binary")
        alert = (await session.execute(select(Alert))).scalar_one()

    assert file_item is not None
    assert file_item.processing_status == ProcessingStatus.FAILED
    assert file_item.scan_status == ScanStatus.CLEAN
    assert file_item.scan_reason_codes == [ScanReasonCode.STORED_FILE_NOT_FOUND]
    assert file_item.scan_details is None
    assert alert.level == AlertLevel.CRITICAL
    assert alert.message == AlertMessageCode.FILE_PROCESSING_FAILED
