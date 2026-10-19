
import os
import secrets
from flask import Blueprint, jsonify, request, session, current_app, redirect, url_for
from pydantic import ValidationError
from werkzeug.security import check_password_hash, generate_password_hash
from authlib.integrations.flask_client import OAuth
from database.database import db
from database_models.models_user import User
from schemas.schemas_user import (
    UserLogin,
    UserRegister,
)

auth_bp = Blueprint("auth", __name__)

oauth = OAuth()

# ================== HELPER ==================

def init_google_oauth(app):
    oauth.init_app(app)
    oauth.register(
        name="google",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url=(
            "https://accounts.google.com/.well-known/openid-configuration"
        ),
        client_kwargs={"scope": "openid email profile"},
    )

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

    # Xóa session cũ trước khi tạo trạng thái đăng nhập mới.
    session.clear()
    session["user_id"] = user.id
    session["username"] = user.username

    return jsonify({
        "message": "Đăng nhập thành công",
        "user_id": user.id,
        "username": user.username,
    }), 200

# ================== GOOGLE AUTH ==================

@auth_bp.route("/google", methods=["GET"])
def google_login():
    redirect_uri = url_for(
        "auth.google_callback",
        _external=True,
    )
    return oauth.google.authorize_redirect(redirect_uri)


@auth_bp.route("/google/callback", methods=["GET"])
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = token.get("userinfo")

    if not user_info:
        return jsonify({"message": "Không lấy được thông tin Google"}), 400

    email = user_info.get("email")
    email_verified = user_info.get("email_verified", False)
    google_name = user_info.get("name") or user_info.get("given_name") or "Google User"

    if not email or not email_verified:
        return jsonify({
            "message": "Google chưa xác minh địa chỉ email",
        }), 400

    user = get_user_by_email(email)

    if not user:
        user = User(
            username=google_name,
            email=email,
            password=generate_password_hash(secrets.token_urlsafe(32)),
        )
        try:
            db.session.add(user)
            db.session.commit()
        except Exception:
            db.session.rollback()
            current_app.logger.exception("Google account creation failed")
            return jsonify({"message": "Không thể tạo tài khoản Google"}), 500

    session.clear()
    session["user_id"] = user.id
    session["username"] = user.username

    return redirect("http://127.0.0.1:3000/")


# ================== CURRENT USER ==================

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "authenticated": False,
            "message": "Chưa đăng nhập",
        }), 401

    user = db.session.get(User, user_id)

    if not user:
        session.clear()
        return jsonify({
            "authenticated": False,
            "message": "Tài khoản không tồn tại",
        }), 401

    return jsonify({
        "authenticated": True,
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
    }), 200


# ================== LOGOUT ==================

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({
        "message": "Đã đăng xuất"
    }), 200

