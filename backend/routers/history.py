
from datetime import datetime

from flask import Blueprint, jsonify, session

from database.database import db
from database_models.models_prediction import Prediction

history_bp = Blueprint("history", __name__)

DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"


def serialize_prediction(prediction):
    """Chuyển một đối tượng Prediction thành dictionary để trả JSON."""
    result = {}

    for column in Prediction.__table__.columns:
        value = getattr(prediction, column.name)

        if isinstance(value, datetime):
            value = value.strftime(DATETIME_FORMAT)

        result[column.name] = value

    return result


# ================== LẤY LỊCH SỬ ==================

@history_bp.route("/history/<int:user_id>", methods=["GET"])
def get_history(user_id):
    if session.get("user_id") != user_id:
        return jsonify({"message": "Không có quyền truy cập"}), 403

    try:
        predictions = (
            Prediction.query
            .filter_by(user_id=user_id)
            .order_by(Prediction.created_at.desc())
            .all()
        )

        return jsonify([
            serialize_prediction(prediction)
            for prediction in predictions
        ]), 200

    except Exception:
        db.session.rollback()
        return jsonify({
            "message": "Không thể tải lịch sử. Vui lòng thử lại."
        }), 500


# ================== XÓA LỊCH SỬ ==================

@history_bp.route("/history/<int:prediction_id>", methods=["DELETE"])
def delete_prediction(prediction_id):
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"message": "Vui lòng đăng nhập"}), 401

    try:
        prediction = Prediction.query.filter_by(
            id=prediction_id,
            user_id=user_id,
        ).first()

        if prediction is None:
            return jsonify({
                "message": "Không thấy bản ghi hoặc không có quyền xóa"
            }), 404

        db.session.delete(prediction)
        db.session.commit()

        return jsonify({"message": "Đã xóa thành công"}), 200

    except Exception:
        db.session.rollback()
        return jsonify({
            "message": "Xóa thất bại. Vui lòng thử lại."
        }), 500
