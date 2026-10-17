
from datetime import datetime, timedelta
from secrets import randbelow

from flask import Blueprint, jsonify, request, session
from pydantic import ValidationError
from werkzeug.security import check_password_hash, generate_password_hash

from database.database import db
from database_models.models_user import User
from schemas.schemas_user import (
    PasswordReset,
    PasswordResetRequest,
    PasswordResetVerify,
    UserLogin,
    UserRegister,
)
from services.email_service import send_email


auth_bp = Blueprint("auth", __name__)


# ================== HELPER ==================

def clean(value):
    return str(value).strip().lower() if value is not None else None


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def get_json_data():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else None


def generate_code():
    return f"{randbelow(900000) + 100000}"


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


# ================== SEND VERIFICATION CODE ==================

@auth_bp.route("/send_verification_code", methods=["POST"])
def send_verification_code():
    data = get_json_data()

    validated, error_response = validate_request(
        PasswordResetRequest,
        data,
    )
    if error_response:
        return error_response

    email = validated.email
    code = generate_code()

    try:
        send_email(
            email,
            "Mã xác thực",
            f"Mã của bạn là: {code}",
        )
    except Exception:
        return jsonify({
            "message": "Không thể gửi email xác thực"
        }), 500

    # Chỉ lưu mã sau khi gửi email thành công.
    session["verify_email"] = email
    session["verify_code"] = code
    session.modified = True

    return jsonify({
        "message": "Đã gửi mã xác thực"
    }), 200


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
    code = validated.code

    # Mã xác thực phải thuộc email đã yêu cầu gửi mã.
    if (
        session.get("verify_email") != email
        or clean(session.get("verify_code")) != code
    ):
        return jsonify({
            "message": "Mã xác thực không đúng"
        }), 400

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

        session.pop("verify_email", None)
        session.pop("verify_code", None)

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

    # Xóa session cũ trước khi tạo trạng thái đăng nhập mới.
    session.clear()
    session["user_id"] = user.id
    session["username"] = user.username

    return jsonify({
        "message": "Đăng nhập thành công",
        "user_id": user.id,
        "username": user.username,
    }), 200


# ================== LOGOUT ==================

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({
        "message": "Đã đăng xuất"
    }), 200


# ================== SEND PASSWORD RESET ==================

@auth_bp.route("/send_password_reset", methods=["POST"])
def send_password_reset():
    data = get_json_data()

    validated, error_response = validate_request(
        PasswordResetRequest,
        data,
    )
    if error_response:
        return error_response

    email = validated.email
    user = get_user_by_email(email)

    if not user:
        return jsonify({
            "message": "Email không tồn tại"
        }), 404

    reset_code = generate_code()
    expiry = datetime.now() + timedelta(minutes=15)

    try:
        send_email(
            email,
            "Reset mật khẩu",
            f"Mã đặt lại mật khẩu của bạn là: {reset_code}",
        )

        user.reset_code = reset_code
        user.reset_code_expiry = expiry
        db.session.commit()

    except Exception:
        db.session.rollback()
        return jsonify({
            "message": "Không thể gửi mã đặt lại mật khẩu"
        }), 500

    return jsonify({
        "message": "Đã gửi mã reset"
    }), 200


# ================== VERIFY RESET CODE ==================

@auth_bp.route("/verify_reset_code", methods=["POST"])
def verify_reset_code():
    data = get_json_data()

    validated, error_response = validate_request(
        PasswordResetVerify,
        data,
    )
    if error_response:
        return error_response

    email = validated.email
    code = validated.code

    user = get_user_by_email(email)

    if not user:
        return jsonify({
            "message": "Email không tồn tại"
        }), 404

    if not user.reset_code:
        return jsonify({
            "message": "Chưa có mã xác thực"
        }), 400

    if clean(user.reset_code) != code:
        return jsonify({
            "message": "Sai mã xác thực"
        }), 400

    if (
        not user.reset_code_expiry
        or datetime.now() > user.reset_code_expiry
    ):
        return jsonify({
            "message": "Mã đã hết hạn"
        }), 400

    return jsonify({
        "message": "OK"
    }), 200


# ================== RESET PASSWORD ==================

@auth_bp.route("/reset_password", methods=["POST"])
def reset_password():
    data = get_json_data()

    validated, error_response = validate_request(PasswordReset, data)
    if error_response:
        return error_response

    email = validated.email
    code = validated.code
    new_password = validated.new_password

    user = get_user_by_email(email)

    if not user:
        return jsonify({
            "message": "Email không tồn tại"
        }), 404

    if not user.reset_code or clean(user.reset_code) != code:
        return jsonify({
            "message": "Sai mã xác thực"
        }), 400

    if (
        not user.reset_code_expiry
        or datetime.now() > user.reset_code_expiry
    ):
        return jsonify({
            "message": "Mã đã hết hạn"
        }), 400

    try:
        user.password = generate_password_hash(new_password)
        user.reset_code = None
        user.reset_code_expiry = None
        db.session.commit()

    except Exception:
        db.session.rollback()
        return jsonify({
            "message": "Không thể đổi mật khẩu"
        }), 500

    return jsonify({
        "message": "Đổi mật khẩu thành công"
    }), 200
