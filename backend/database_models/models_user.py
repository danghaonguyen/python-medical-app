from database.database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
    )
    email = db.Column(
        db.String(100),
        unique=True,
        nullable=False,
    )
    password = db.Column(
        db.String(255),
        nullable=False,
    )
    username = db.Column(db.String(100), nullable=True)
    created_at = db.Column(
    db.DateTime,
    nullable=False,
    server_default=db.func.current_timestamp(),
    default=datetime.now,
)

    predictions = db.relationship(
        "Prediction",
        back_populates="user",
    )


