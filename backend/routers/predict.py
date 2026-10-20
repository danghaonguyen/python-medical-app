
import logging

from flask import Blueprint, jsonify, request
from services.auth_middleware import token_required

from database.database import db
from database_models.models_prediction import Prediction
from services.prediction_service import calc_bmi, predict_from_input

from pydantic import ValidationError
from schemas.schemas_prediction import PredictionInput

predict_bp = Blueprint("predict", __name__)

logger = logging.getLogger(__name__)


# =========================
# HELPERS
# =========================

def clean_prediction(result):
    return {
        "prediction": int(result.get("prediction", 0)),
        "probability": float(result.get("probability", 0)),
        "risk_level": result.get("risk_level", "Không rõ"),
    }


def to_number(value, default=0):
    """Chuyển dữ liệu sang số; dùng giá trị mặc định nếu không hợp lệ."""
    try:
        if value is None or isinstance(value, bool):
            return default

        number = float(value)

        if not __import__("math").isfinite(number):
            return default

        return number
    except (TypeError, ValueError, OverflowError):
        return default


def to_integer(value, default=0):
    """Chuyển dữ liệu sang số nguyên cho các cột integer/smallint."""
    return int(to_number(value, default))


def build_prediction(user_id, data, bmi, result):
    """Tạo đối tượng Prediction từ dữ liệu đầu vào và kết quả ML."""
    return Prediction(
        user_id=user_id,
        age=to_integer(data.get("age")),
        gender=to_integer(data.get("gender")),
        pulse_rate=to_integer(data.get("pulse_rate")),
        systolic_bp=to_integer(data.get("systolic_bp")),
        diastolic_bp=to_integer(data.get("diastolic_bp")),

        glucose=to_number(data.get("glucose")),
        height=to_number(data.get("height")),
        weight=to_number(data.get("weight")),
        bmi=bmi,

        family_diabetes=to_integer(data.get("family_diabetes")),
        hypertensive=to_integer(data.get("hypertensive")),
        family_hypertension=to_integer(
            data.get("family_hypertension")
        ),
        cardiovascular_disease=to_integer(
            data.get("cardiovascular_disease")
        ),
        stroke=to_integer(data.get("stroke")),

        prediction_result=result["risk_level"],
        prediction_probability=result["probability"],
    )


def save_prediction(prediction):
    """Lưu dự đoán bằng SQLAlchemy; trả về True nếu thành công."""
    try:
        db.session.add(prediction)
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        logger.exception(
            "Không thể lưu kết quả dự đoán cho user_id=%s",
            prediction.user_id,
        )
        return False


# =========================
# ROUTE
# =========================


@predict_bp.route("/predict", methods=["POST"])
@token_required
def predict():
    # 1. Nhận JSON từ Postman hoặc frontend.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "message": "Dữ liệu JSON không hợp lệ"
        }), 400

   # 2. Lấy user_id từ token đã xác minh.
    user_id = request.user_id

    # 3. Kiểm tra dữ liệu bằng Pydantic.
    try:
        validated_data = (
            PredictionInput.model_validate(data).model_dump()
        )
    except ValidationError as exc:
        errors = [
            {
                "field": ".".join(str(part) for part in error["loc"]),
                "message": error["msg"],
            }
            for error in exc.errors()
        ]

        return jsonify({
            "message": "Dữ liệu đầu vào không hợp lệ",
            "errors": errors,
        }), 400

    # 4. Chạy model Machine Learning.
    try:
        raw_result = predict_from_input(validated_data)
        result = clean_prediction(raw_result)

        # 5. Tính BMI.
        bmi = round(
            calc_bmi(
                validated_data["weight"],
                validated_data["height"],
            ),
            2,
        )

        # 6. Tạo bản ghi lịch sử.
        prediction = build_prediction(
            user_id=user_id,
            data=validated_data,
            bmi=bmi,
            result=result,
        )

        # 7. Lưu vào PostgreSQL.
        if not save_prediction(prediction):
            return jsonify({
                "message": "Đã dự đoán nhưng không lưu được vào lịch sử.",
                **result,
            }), 500

        # 8. Trả kết quả dự đoán.
        return jsonify(result), 200

    except Exception:
        db.session.rollback()
        logger.exception(
            "Lỗi khi xử lý dự đoán cho user_id=%s",
            user_id,
        )

        return jsonify({
            "message": "Không thể dự đoán. Vui lòng thử lại."
        }), 500
