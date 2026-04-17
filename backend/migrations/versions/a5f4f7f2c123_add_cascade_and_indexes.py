"""add cascade delete and created_at indexes

Revision ID: a5f4f7f2c123
Revises: 0d6439d2e79f
Create Date: 2026-04-17 13:30:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a5f4f7f2c123"
down_revision: Union[str, Sequence[str], None] = "0d6439d2e79f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index("ix_files_created_at", "files", ["created_at"], unique=False)
    op.create_index("ix_alerts_created_at", "alerts", ["created_at"], unique=False)
    op.drop_constraint("alerts_file_id_fkey", "alerts", type_="foreignkey")
    op.create_foreign_key(
        "alerts_file_id_fkey",
        "alerts",
        "files",
        ["file_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("alerts_file_id_fkey", "alerts", type_="foreignkey")
    op.create_foreign_key("alerts_file_id_fkey", "alerts", "files", ["file_id"], ["id"])
    op.drop_index("ix_alerts_created_at", table_name="alerts")
    op.drop_index("ix_files_created_at", table_name="files")
