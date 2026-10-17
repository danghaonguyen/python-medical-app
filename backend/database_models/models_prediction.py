from database.database import db
from datetime import datetime

class Prediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
    )

    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.SmallInteger, nullable=True)
    pulse_rate = db.Column(db.Integer, nullable=True)
    systolic_bp = db.Column(db.Integer, nullable=True)
    diastolic_bp = db.Column(db.Integer, nullable=True)

    glucose = db.Column(db.REAL, nullable=True)
    height = db.Column(db.REAL, nullable=True)
    weight = db.Column(db.REAL, nullable=True)
    bmi = db.Column(db.REAL, nullable=True)

    family_diabetes = db.Column(db.SmallInteger, nullable=True)
    hypertensive = db.Column(db.SmallInteger, nullable=True)
    family_hypertension = db.Column(db.SmallInteger, nullable=True)
    cardiovascular_disease = db.Column(db.SmallInteger, nullable=True)
    stroke = db.Column(db.SmallInteger, nullable=True)

    prediction_result = db.Column(db.String(100), nullable=True)
    prediction_probability = db.Column(db.REAL, nullable=True)

    created_at = db.Column(
        db.DateTime,
        nullable=True,
        default=datetime.now,
    )

    user = db.relationship(
        "User",
        back_populates="predictions",
    )