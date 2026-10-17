
"""Initial migration baseline.

Revision ID: 1eaf2fc81fd7
"""
from alembic import op
import sqlalchemy as sa

revision = "1eaf2fc81fd7"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Baseline: tables already exist in PostgreSQL.
    # Do not recreate or alter existing tables here.
    pass


def downgrade():
    # Keep existing tables and data intact.
    # No schema changes are reversed by this baseline.
    pass
