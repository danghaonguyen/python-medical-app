
import pytest
from pydantic import ValidationError

from schemas.schemas_user import (
    UserRegister,
    UserLogin,
    PasswordResetRequest,
    PasswordResetVerify,
    PasswordReset,
)


def test_user_register_valid_data():
    data = UserRegister(
        username="Benjamin",
        email="Benjamin@example.com",
        password="Password123",
        code="123456",
    )

    assert data.username == "Benjamin"
    assert data.email == "benjamin@example.com"


def test_user_register_rejects_invalid_email():
    with pytest.raises(ValidationError):
        UserRegister(
            username="Benjamin",
            email="invalid-email",
            password="Password123",
            code="123456",
        )


def test_user_register_rejects_short_password():
    with pytest.raises(ValidationError):
        UserRegister(
            username="Benjamin",
            email="benjamin@example.com",
            password="123",
            code="123456",
        )


def test_user_register_rejects_invalid_code():
    with pytest.raises(ValidationError):
        UserRegister(
            username="Benjamin",
            email="benjamin@example.com",
            password="Password123",
            code="12AB56",
        )


def test_user_login_valid_data():
    data = UserLogin(
        email="Benjamin@example.com",
        password="Password123",
    )

    assert data.email == "benjamin@example.com"


def test_user_login_rejects_invalid_email():
    with pytest.raises(ValidationError):
        UserLogin(
            email="invalid-email",
            password="Password123",
        )


def test_password_reset_request_valid_email():
    data = PasswordResetRequest(email="Benjamin@example.com")

    assert data.email == "benjamin@example.com"


def test_password_reset_verify_rejects_invalid_code():
    with pytest.raises(ValidationError):
        PasswordResetVerify(
            email="benjamin@example.com",
            code="abc123",
        )


def test_password_reset_accepts_valid_data():
    data = PasswordReset(
        email="Benjamin@example.com",
        code="123456",
        new_password="NewPassword123",
    )

    assert data.email == "benjamin@example.com"


def test_password_reset_rejects_short_password():
    with pytest.raises(ValidationError):
        PasswordReset(
            email="benjamin@example.com",
            code="123456",
            new_password="123",
        )
