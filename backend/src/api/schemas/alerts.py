from datetime import datetime

from pydantic import BaseModel, ConfigDict

from src.api.schemas.common import PageParams
from src.domain.enums import AlertLevel, AlertMessageCode


class AlertItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    file_id: str
    level: AlertLevel
    message: AlertMessageCode
    created_at: datetime


class AlertPage(PageParams):
    items: list[AlertItem]
