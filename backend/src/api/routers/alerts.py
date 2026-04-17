from fastapi import APIRouter, Query

from src.api.schemas.alerts import AlertPage
from src.application.alerts.queries import list_alerts


router = APIRouter(tags=["alerts"])


@router.get("/alerts", response_model=AlertPage)
async def list_alerts_view(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    result = await list_alerts(page=page, page_size=page_size)
    return AlertPage(items=result.items, page=result.page, page_size=result.page_size, total=result.total, pages=result.pages)
