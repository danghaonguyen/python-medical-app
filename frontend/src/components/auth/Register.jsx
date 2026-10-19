
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";
import "./css/Auth.css";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (userId) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return toast.warning("Vui lòng nhập đầy đủ thông tin");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      return toast.warning("Mật khẩu phải >= 8 ký tự, gồm chữ + số");
    }

    if (password !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    try {
      const res = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      toast.success(res.data.message);

      if (res.status === 201) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng Ký</h2>

        <input
          type="text"
          placeholder="Họ tên"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="input-with-toggle">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "ẨN" : "HIỆN"}
          </button>
        </div>

        <div className="input-with-toggle">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "ẨN" : "HIỆN"}
          </button>
        </div>

        <button
          className="auth-button"
          onClick={handleRegister}
        >
          Đăng ký
        </button>

        <p className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>

        <Link to="/" className="back-home">
          ← Quay về Trang chủ
        </Link>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
