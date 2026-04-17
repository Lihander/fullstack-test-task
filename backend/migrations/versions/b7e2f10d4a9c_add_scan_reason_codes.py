"""add scan reason codes

Revision ID: b7e2f10d4a9c
Revises: a5f4f7f2c123
Create Date: 2026-04-17 15:30:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b7e2f10d4a9c"
down_revision: Union[str, Sequence[str], None] = "a5f4f7f2c123"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("files", sa.Column("scan_reason_codes", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("files", "scan_reason_codes")
