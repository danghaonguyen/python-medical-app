
"""Initial migration.

Revision ID: 1eaf2fc81fd7
"""
from alembic import op
import sqlalchemy as sa

revision = "1eaf2fc81fd7"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table.
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(100), nullable=False),
        sa.Column("password", sa.String(255), nullable=False),
        sa.Column("username", sa.String(100), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.current_timestamp(),
        ),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )

    # Create predictions table.
    op.create_table(
        "predictions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column("age", sa.Integer(), nullable=True),
        sa.Column("gender", sa.SmallInteger(), nullable=True),
        sa.Column("pulse_rate", sa.Integer(), nullable=True),
        sa.Column("systolic_bp", sa.Integer(), nullable=True),
        sa.Column("diastolic_bp", sa.Integer(), nullable=True),
        sa.Column("glucose", sa.REAL(), nullable=True),
        sa.Column("height", sa.REAL(), nullable=True),
        sa.Column("weight", sa.REAL(), nullable=True),
        sa.Column("bmi", sa.REAL(), nullable=True),
        sa.Column("family_diabetes", sa.SmallInteger(), nullable=True),
        sa.Column("hypertensive", sa.SmallInteger(), nullable=True),
        sa.Column("family_hypertension", sa.SmallInteger(), nullable=True),
        sa.Column("cardiovascular_disease", sa.SmallInteger(), nullable=True),
        sa.Column("stroke", sa.SmallInteger(), nullable=True),
        sa.Column("prediction_result", sa.String(100), nullable=True),
        sa.Column("prediction_probability", sa.REAL(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )


def downgrade():
    op.drop_table("predictions")
    op.drop_table("users")
