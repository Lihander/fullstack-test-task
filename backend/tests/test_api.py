from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import select

from src.api.errors import ApiErrorCode
from src.domain.enums import (
    AlertLevel,
    AlertMessageCode,
    ProcessingStatus,
)
from src.infrastructure.persistence.models import Alert, StoredFile


async def seed_files(session_maker, count: int) -> list[StoredFile]:
    items: list[StoredFile] = []
    base_time = datetime(2026, 4, 1, tzinfo=UTC)

    async with session_maker() as session:
        for index in range(count):
            created_at = base_time + timedelta(minutes=index)
            item = StoredFile(
                id=f"file-{index}",
                title=f"File {index}",
                original_name=f"file-{index}.txt",
                stored_name=f"file-{index}.txt",
                mime_type="text/plain",
                size=100 + index,
                processing_status=ProcessingStatus.UPLOADED,
                requires_attention=False,
                created_at=created_at,
                updated_at=created_at,
            )
            session.add(item)
            items.append(item)

        await session.commit()

    return items


async def seed_alerts(session_maker, count: int) -> None:
    files = await seed_files(session_maker, count)
    base_time = datetime(2026, 4, 2, tzinfo=UTC)

    async with session_maker() as session:
        for index in range(count):
            session.add(
                Alert(
                    file_id=files[index].id,
                    level=AlertLevel.WARNING if index % 2 else AlertLevel.INFO,
                    message=(
                        AlertMessageCode.FILE_REQUIRES_ATTENTION
                        if index % 2
                        else AlertMessageCode.FILE_PROCESSED_SUCCESSFULLY
                    ),
                    created_at=base_time + timedelta(minutes=index),
                )
            )

        await session.commit()


@pytest.mark.asyncio
async def test_create_file_persists_record_and_queues_scan(client, test_context):
    response = await client.post(
        "/files",
        data={"title": "Contract"},
        files={"file": ("contract.txt", b"hello world", "text/plain")},
    )

    assert response.status_code == 201
    body = response.json()

    assert body["title"] == "Contract"
    assert body["processing_status"] == ProcessingStatus.UPLOADED
    assert body["scan_reason_codes"] == []
    assert test_context.queued_scan_jobs == [body["id"]]
    assert (test_context.storage_dir / body["original_name"]).exists() is False
    assert len(list(test_context.storage_dir.iterdir())) == 1


@pytest.mark.asyncio
async def test_create_file_rejects_empty_upload(client):
    response = await client.post(
        "/files",
        data={"title": "Empty"},
        files={"file": ("empty.txt", b"", "text/plain")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == ApiErrorCode.FILE_IS_EMPTY


@pytest.mark.asyncio
async def test_list_files_returns_paginated_response(client, test_context):
    await seed_files(test_context.session_maker, 5)

    response = await client.get("/files", params={"page": 2, "page_size": 2})

    assert response.status_code == 200
    body = response.json()

    assert body["page"] == 2
    assert body["page_size"] == 2
    assert body["total"] == 5
    assert body["pages"] == 3
    assert [item["id"] for item in body["items"]] == ["file-2", "file-1"]
    assert all(item["scan_reason_codes"] == [] for item in body["items"])


@pytest.mark.asyncio
async def test_list_alerts_returns_paginated_response(client, test_context):
    await seed_alerts(test_context.session_maker, 5)

    response = await client.get("/alerts", params={"page": 1, "page_size": 3})

    assert response.status_code == 200
    body = response.json()

    assert body["page"] == 1
    assert body["page_size"] == 3
    assert body["total"] == 5
    assert body["pages"] == 2
    assert [item["message"] for item in body["items"]] == [
        AlertMessageCode.FILE_PROCESSED_SUCCESSFULLY,
        AlertMessageCode.FILE_REQUIRES_ATTENTION,
        AlertMessageCode.FILE_PROCESSED_SUCCESSFULLY,
    ]


@pytest.mark.asyncio
async def test_get_file_returns_404_for_missing_record(client):
    response = await client.get("/files/missing")

    assert response.status_code == 404
    assert response.json()["detail"] == ApiErrorCode.FILE_NOT_FOUND


@pytest.mark.asyncio
async def test_delete_file_removes_alerts_and_binary(client, test_context):
    created_at = datetime(2026, 4, 3, tzinfo=UTC)
    stored_file = StoredFile(
        id="file-delete",
        title="Delete me",
        original_name="delete.txt",
        stored_name="file-delete.txt",
        mime_type="text/plain",
        size=12,
        processing_status=ProcessingStatus.PROCESSED,
        requires_attention=False,
        created_at=created_at,
        updated_at=created_at,
    )

    async with test_context.session_maker() as session:
        session.add(stored_file)
        session.add(
            Alert(
                file_id="file-delete",
                level=AlertLevel.INFO,
                message=AlertMessageCode.FILE_PROCESSED_SUCCESSFULLY,
                created_at=created_at,
            )
        )
        await session.commit()

    (test_context.storage_dir / "file-delete.txt").write_text("to delete", encoding="utf-8")

    response = await client.delete("/files/file-delete")

    assert response.status_code == 204
    assert not (test_context.storage_dir / "file-delete.txt").exists()

    async with test_context.session_maker() as session:
        assert await session.get(StoredFile, "file-delete") is None
        alerts = (await session.execute(select(Alert))).scalars().all()
        assert alerts == []
