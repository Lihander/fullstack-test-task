from src.application.pagination import PageResult, build_page_result
from src.infrastructure.db.session import get_session_maker
from src.infrastructure.persistence.repositories import AlertRepository


async def list_alerts(*, page: int, page_size: int) -> PageResult:
    offset = (page - 1) * page_size
    async with get_session_maker()() as session:
        items, total = await AlertRepository(session).list_paginated(offset=offset, limit=page_size)
        return build_page_result(items=list(items), total=total, page=page, page_size=page_size)
