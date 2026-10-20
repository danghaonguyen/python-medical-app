
from datetime import datetime, timedelta, timezone

import jwt
from flask import Blueprint, jsonify, request, current_app
from pydantic import ValidationError
from werkzeug.security import check_password_hash, generate_password_hash

from database.database import db
from database_models.models_user import User
from schemas.schemas_user import (
    UserLogin,
    UserRegister,
)

auth_bp = Blueprint("auth", __name__)


# ================== HELPER ==================

def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def get_json_data():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else None


def validate_request(schema, data):
    if data is None:
        return None, (
            jsonify({
                "message": "Dữ liệu đầu vào phải là JSON object.",
                "errors": [
                    {
                        "field": "",
                        "message": "JSON object không hợp lệ.",
                    }
                ],
            }),
            400,
        )

    try:
        validated_data = schema.model_validate(data)
        return validated_data, None

    except ValidationError as exc:
        errors = [
            {
                "field": ".".join(str(part) for part in error["loc"]),
                "message": error["msg"],
            }
            for error in exc.errors()
        ]

        return None, (
            jsonify({
                "message": "Dữ liệu đầu vào không hợp lệ",
                "errors": errors,
            }),
            400,
        )


def create_access_token(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
    }

    return jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )


# ================== REGISTER ==================

@auth_bp.route("/register", methods=["POST"])
def register():
    data = get_json_data()

    validated, error_response = validate_request(UserRegister, data)
    if error_response:
        return error_response

    username = validated.username.strip()
    email = validated.email
    password = validated.password

    if get_user_by_email(email):
        return jsonify({
            "message": "Email đã tồn tại"
        }), 409

    user = User(
        username=username,
        email=email,
        password=generate_password_hash(password),
    )

    try:
        db.session.add(user)
        db.session.commit()

    except Exception:
        db.session.rollback()
        return jsonify({
            "message": "Không thể đăng ký tài khoản"
        }), 500

    return jsonify({
        "message": "Đăng ký thành công"
    }), 201


# ================== LOGIN ==================

@auth_bp.route("/login", methods=["POST"])
def login():
    data = get_json_data()

    validated, error_response = validate_request(UserLogin, data)
    if error_response:
        return error_response

    email = validated.email
    password = validated.password

    user = get_user_by_email(email)

    if not user or not check_password_hash(user.password, password):
        return jsonify({
            "message": "Email hoặc mật khẩu không đúng"
        }), 401

    access_token = create_access_token(user)

    return jsonify({
        "message": "Đăng nhập thành công",
        "access_token": access_token,
        "token_type": "Bearer",
        "expires_in": 3600,
        "user_id": user.id,
        "username": user.username,
    }), 200


# ================== LOGOUT ==================

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({
        "message": "Đăng xuất thành công"
    }), 200
