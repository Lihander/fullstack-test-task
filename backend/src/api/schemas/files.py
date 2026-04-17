from datetime import datetime

from pydantic import BaseModel, ConfigDict

from src.api.schemas.common import PageParams
from src.domain.enums import ProcessingStatus, ScanReasonCode, ScanStatus


class FileItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    original_name: str
    mime_type: str
    size: int
    processing_status: ProcessingStatus
    scan_status: ScanStatus | None
    scan_reason_codes: list[ScanReasonCode]
    scan_details: str | None
    metadata_json: dict | None
    requires_attention: bool
    created_at: datetime
    updated_at: datetime


class FileUpdate(BaseModel):
    title: str


class FilePage(PageParams):
    items: list[FileItem]
