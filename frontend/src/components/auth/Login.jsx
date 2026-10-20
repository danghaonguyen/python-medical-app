import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";
import "./css/Auth.css";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      return toast.warning("Vui lòng nhập email và mật khẩu");
    }

    try {
      const res = await loginUser({
        email: email.trim(),
        password,
      });

      toast.success(res.data.message || "Đăng nhập thành công");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng Nhập</h2>

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

        <button className="auth-button" onClick={handleLogin}>
          Đăng nhập
        </button>

        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>

        <Link to="/" className="back-home">
          ← Quay về Trang chủ
        </Link>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
