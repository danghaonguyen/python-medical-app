
import math
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PredictionInput(BaseModel):
    """Validate dữ liệu đầu vào của API dự đoán."""

    model_config = ConfigDict(
        extra="ignore",
        strict=True,
    )

    age: int = Field(gt=0, le=120)
    gender: int
    pulse_rate: int = Field(gt=0)
    systolic_bp: int = Field(gt=0)
    diastolic_bp: int = Field(gt=0)

    glucose: float = Field(gt=0)
    height: float = Field(gt=0)
    weight: float = Field(gt=0)

    family_diabetes: int = Field(ge=0, le=1)
    hypertensive: int = Field(ge=0, le=1)
    family_hypertension: int = Field(ge=0, le=1)

    cardiovascular_disease: int = Field(default=0, ge=0, le=1)
    stroke: int = Field(default=0, ge=0, le=1)

    @field_validator("*", mode="before")
    @classmethod
    def reject_boolean_and_non_finite(cls, value: Any) -> Any:
        if isinstance(value, bool):
            raise ValueError("Giá trị không được là true/false.")

        if isinstance(value, float) and not math.isfinite(value):
            raise ValueError("Giá trị phải là số hữu hạn.")

        return value

    @field_validator(
        "age",
        "gender",
        "pulse_rate",
        "systolic_bp",
        "diastolic_bp",
        "family_diabetes",
        "hypertensive",
        "family_hypertension",
        "cardiovascular_disease",
        "stroke",
        mode="before",
    )
    @classmethod
    def require_integer(cls, value: Any) -> Any:
        if isinstance(value, bool):
            raise ValueError("Giá trị phải là số nguyên.")

        if isinstance(value, float):
            if not math.isfinite(value) or not value.is_integer():
                raise ValueError("Giá trị phải là số nguyên.")

        if isinstance(value, str):
            try:
                number = float(value)
            except ValueError:
                raise ValueError("Giá trị phải là số nguyên.")

            if not math.isfinite(number) or not number.is_integer():
                raise ValueError("Giá trị phải là số nguyên.")

            return int(number)

        return value

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, value: int) -> int:
        if value not in (0, 1):
            raise ValueError("Giới tính phải là 0 (nữ) hoặc 1 (nam).")
        return value

    @field_validator("diastolic_bp")
    @classmethod
    def validate_blood_pressure(cls, value: int, info):
        systolic_bp = info.data.get("systolic_bp")

        if systolic_bp is not None and systolic_bp <= value:
            raise ValueError(
                "Huyết áp tâm thu phải lớn hơn huyết áp tâm trương."
            )

        return value
