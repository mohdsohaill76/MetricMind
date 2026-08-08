"""create public reports table

Revision ID: ea03ef4ba501
Revises: 
Create Date: 2026-08-09 01:05:24.124728

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'ea03ef4ba501'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "reports",
        sa.Column("report_id", sa.String(length=64), nullable=False),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("dataset_quality", sa.String(length=50), nullable=False),
        sa.Column("payload", postgresql.JSONB(), nullable=False),
        sa.PrimaryKeyConstraint("report_id"),
        schema="public",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("reports", schema="public")
