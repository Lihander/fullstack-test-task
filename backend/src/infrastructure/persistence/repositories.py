from collections.abc import Sequence
from typing import Generic, TypeVar

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.persistence.models import Alert, StoredFile

EntityT = TypeVar("EntityT", Alert, StoredFile)


class BaseRepository(Generic[EntityT]):
    model: type[EntityT]

    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_paginated(self, *, offset: int, limit: int) -> tuple[Sequence[EntityT], int]:
        result = await self.session.execute(
            select(self.model).order_by(self.model.created_at.desc()).offset(offset).limit(limit)
        )
        total = await self.session.scalar(select(func.count()).select_from(self.model))
        return list(result.scalars().all()), total or 0

    async def add(self, item: EntityT) -> EntityT:
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item


class FileRepository(BaseRepository[StoredFile]):
    model = StoredFile

    async def get_by_id(self, file_id: str) -> StoredFile | None:
        return await self.session.get(StoredFile, file_id)

    async def delete(self, file_item: StoredFile) -> None:
        await self.session.delete(file_item)
        await self.session.commit()


class AlertRepository(BaseRepository[Alert]):
    model = Alert

    async def delete_for_file(self, file_id: str) -> None:
        await self.session.execute(delete(Alert).where(Alert.file_id == file_id))
