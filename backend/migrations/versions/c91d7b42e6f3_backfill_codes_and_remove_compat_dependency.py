"""backfill codes and enforce scan reason codes

Revision ID: c91d7b42e6f3
Revises: b7e2f10d4a9c
Create Date: 2026-04-17 16:10:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c91d7b42e6f3"
down_revision: Union[str, Sequence[str], None] = "b7e2f10d4a9c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _normalize_alert_message(message: str) -> str:
    if message == "File processing failed":
        return "FILE_PROCESSING_FAILED"

    if message == "File processed successfully":
        return "FILE_PROCESSED_SUCCESSFULLY"

    if message.startswith("File requires attention"):
        return "FILE_REQUIRES_ATTENTION"

    return message


def _scan_reason_codes_from_details(scan_details: str | None) -> list[str]:
    if not scan_details:
        return []

    codes: list[str] = []

    if "suspicious extension" in scan_details:
        codes.append("SUSPICIOUS_EXTENSION")

    if "file is larger than 10 MB" in scan_details:
        codes.append("FILE_TOO_LARGE")

    if "pdf extension does not match mime type" in scan_details:
        codes.append("PDF_MIME_TYPE_MISMATCH")

    if "stored file not found during metadata extraction" in scan_details:
        codes.append("STORED_FILE_NOT_FOUND")

    return codes


def upgrade() -> None:
    bind = op.get_bind()

    alerts = sa.table(
        "alerts",
        sa.column("id", sa.Integer()),
        sa.column("message", sa.String()),
    )
    files = sa.table(
        "files",
        sa.column("id", sa.String()),
        sa.column("scan_reason_codes", sa.JSON()),
        sa.column("scan_details", sa.String()),
    )

    alert_rows = bind.execute(sa.select(alerts.c.id, alerts.c.message)).mappings().all()
    for row in alert_rows:
        normalized_message = _normalize_alert_message(row["message"])
        if normalized_message != row["message"]:
            bind.execute(
                alerts.update()
                .where(alerts.c.id == row["id"])
                .values(message=normalized_message)
            )

    file_rows = bind.execute(
        sa.select(files.c.id, files.c.scan_reason_codes, files.c.scan_details)
    ).mappings().all()
    for row in file_rows:
        normalized_codes = row["scan_reason_codes"] or _scan_reason_codes_from_details(row["scan_details"])
        bind.execute(
            files.update()
            .where(files.c.id == row["id"])
            .values(scan_reason_codes=normalized_codes)
        )

    op.alter_column("files", "scan_reason_codes", existing_type=sa.JSON(), nullable=False)


def downgrade() -> None:
    op.alter_column("files", "scan_reason_codes", existing_type=sa.JSON(), nullable=True)
