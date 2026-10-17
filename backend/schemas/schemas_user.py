
import re

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


class UserRegister(BaseModel):
    """Validate dữ liệu đăng ký tài khoản."""

    model_config = ConfigDict(extra="ignore", strict=True)

    username: str = Field(min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    code: str = Field(min_length=6, max_length=6)

    @field_validator("username", "password", mode="before")
    @classmethod
    def validate_string_fields(cls, value):
        if not isinstance(value, str):
            raise ValueError("Giá trị phải là chuỗi.")

        if not value.strip():
            raise ValueError("Không được để trống.")

        return value

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if not isinstance(value, str):
            raise ValueError("Email phải là chuỗi.")

        return value.strip().lower()

    @field_validator("code", mode="before")
    @classmethod
    def validate_code(cls, value):
        if not isinstance(value, str) or not re.fullmatch(r"\d{6}", value):
            raise ValueError("Mã xác thực phải gồm 6 chữ số.")

        return value


class UserLogin(BaseModel):
    """Validate dữ liệu đăng nhập."""

    model_config = ConfigDict(extra="ignore", strict=True)

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if not isinstance(value, str):
            raise ValueError("Email phải là chuỗi.")

        return value.strip().lower()


class PasswordResetRequest(BaseModel):
    """Validate yêu cầu gửi mã đặt lại mật khẩu."""

    model_config = ConfigDict(extra="ignore", strict=True)

    email: EmailStr

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if not isinstance(value, str):
            raise ValueError("Email phải là chuỗi.")

        return value.strip().lower()


class PasswordResetVerify(BaseModel):
    """Validate email và mã xác thực đặt lại mật khẩu."""

    model_config = ConfigDict(extra="ignore", strict=True)

    email: EmailStr
    code: str = Field(min_length=6, max_length=6)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if not isinstance(value, str):
            raise ValueError("Email phải là chuỗi.")

        return value.strip().lower()

    @field_validator("code", mode="before")
    @classmethod
    def validate_code(cls, value):
        if not isinstance(value, str) or not re.fullmatch(r"\d{6}", value):
            raise ValueError("Mã xác thực phải gồm 6 chữ số.")

        return value


class PasswordReset(BaseModel):
    """Validate dữ liệu đổi mật khẩu."""

    model_config = ConfigDict(extra="ignore", strict=True)

    email: EmailStr
    code: str = Field(min_length=6, max_length=6)
    new_password: str = Field(min_length=8, max_length=128)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if not isinstance(value, str):
            raise ValueError("Email phải là chuỗi.")

        return value.strip().lower()

    @field_validator("code", mode="before")
    @classmethod
    def validate_code(cls, value):
        if not isinstance(value, str) or not re.fullmatch(r"\d{6}", value):
            raise ValueError("Mã xác thực phải gồm 6 chữ số.")

        return value

    @field_validator("new_password", mode="before")
    @classmethod
    def validate_password(cls, value):
        if not isinstance(value, str):
            raise ValueError("Mật khẩu mới phải là chuỗi.")

        if not value.strip():
            raise ValueError("Mật khẩu mới không được để trống.")

        return value
