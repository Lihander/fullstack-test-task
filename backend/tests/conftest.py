from dataclasses import dataclass
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.api import main as app_module
from src.api.routers import files as files_router_module
from src.application.alerts import queries as alert_queries
from src.application.files import commands as file_commands
from src.application.files import queries as file_queries
from src.application.scanning import service as scanning_service
from src.infrastructure.persistence.models import Base


@dataclass
class TestContext:
    session_maker: async_sessionmaker[AsyncSession]
    storage_dir: Path
    queued_scan_jobs: list[str]


@pytest.fixture
async def test_context(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> TestContext:
    database_path = tmp_path / "test.db"
    engine = create_async_engine(f"sqlite+aiosqlite:///{database_path}")
    session_maker = async_sessionmaker(engine, expire_on_commit=False)
    storage_dir = tmp_path / "storage"
    storage_dir.mkdir()
    queued_scan_jobs: list[str] = []

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    def build_stored_path(stored_name: str) -> Path:
        return storage_dir / stored_name

    monkeypatch.setattr(file_commands, "get_session_maker", lambda: session_maker)
    monkeypatch.setattr(file_queries, "get_session_maker", lambda: session_maker)
    monkeypatch.setattr(alert_queries, "get_session_maker", lambda: session_maker)
    monkeypatch.setattr(scanning_service, "get_session_maker", lambda: session_maker)
    monkeypatch.setattr(file_commands, "get_stored_path", build_stored_path)
    monkeypatch.setattr(file_queries, "get_stored_path", build_stored_path)
    monkeypatch.setattr(scanning_service, "get_stored_path", build_stored_path)
    monkeypatch.setattr(files_router_module.scan_file_for_threats, "delay", queued_scan_jobs.append)

    yield TestContext(session_maker=session_maker, storage_dir=storage_dir, queued_scan_jobs=queued_scan_jobs)

    await engine.dispose()


@pytest.fixture
async def client(test_context: TestContext) -> AsyncClient:
    transport = ASGITransport(app=app_module.app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
        yield async_client
