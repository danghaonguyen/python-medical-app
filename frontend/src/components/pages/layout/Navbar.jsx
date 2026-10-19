import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../css/Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";

const navItems = [
  { text: "TRANG CHỦ", path: "/", targetId: "home", icon: "lni-home" },
  { text: "HƯỚNG DẪN", path: "/", targetId: "intrust", icon: "lni-book" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Kiểm tra trạng thái đăng nhập từ Flask session
  useEffect(() => {
  let cancelled = false;

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (!cancelled) setUser(null);
        return;
      }

      const data = await response.json();

      if (!cancelled) {
        setUser(
          data.authenticated
            ? {
                userId: data.user_id,
                username: data.username,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Không thể kiểm tra phiên đăng nhập:", error);

      if (!cancelled) setUser(null);
    }
  };

  checkSession();

  return () => {
    cancelled = true;
  };
}, [location.key]);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handlePredictClick = () => {
    closeMenus();

    if (location.pathname !== "/prediction") {
      navigate("/prediction");
    }
  };

  const scrollTo = (path, targetId) => {
    closeMenus();

    if (window.location.pathname === path) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      localStorage.setItem("scrollTo", targetId);
      navigate(path);
    }
  };

const handleLogout = async () => {
  closeMenus();

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Đăng xuất thất bại");
    }
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
  } finally {
    setUser(null);
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  }
};

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link
          className="site-navbar-brand"
          to="/"
          aria-label="Medic Diabetes - Trang chủ"
        >
          <img src="/assets/img/logo/logo.svg" alt="Medic Diabetes" />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Mở menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`site-nav ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Điều hướng chính"
        >
          <div className="site-nav-links">
            {navItems.map((item) => (
              <button
                type="button"
                className="site-nav-link"
                key={item.text}
                onClick={() => scrollTo(item.path, item.targetId)}
              >
                <i className={`lni ${item.icon}`} aria-hidden="true"></i>
                <span>{item.text}</span>
              </button>
            ))}

            {user && (
              <button
                type="button"
                className="site-nav-link"
                onClick={handlePredictClick}
              >
                <i className="lni lni-stats-up" aria-hidden="true"></i>
                <span>DỰ ĐOÁN</span>
              </button>
            )}

            {user ? (
              <div className="user-menu">
                <button
                  type="button"
                  className="site-nav-link user-menu-trigger"
                  aria-expanded={isUserMenuOpen}
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                >
                  <i className="lni lni-user" aria-hidden="true"></i>
                  <span>{user.username || user.userId}</span>
                  <FiChevronDown
                    className="user-menu-arrow"
                    aria-hidden="true"
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="user-menu-panel">
                    <button
                      type="button"
                      onClick={() => {
                        closeMenus();
                        navigate("/history");
                      }}
                    >
                      📊 Lịch sử dự đoán
                    </button>

                    <button type="button" onClick={handleLogout}>
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="site-nav-link"
                onClick={() => {
                  closeMenus();
                  navigate("/login");
                }}
              >
                <i className="lni lni-user" aria-hidden="true"></i>
                <span>ĐĂNG NHẬP</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
