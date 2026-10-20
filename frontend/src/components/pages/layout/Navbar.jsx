import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiClock,
  FiLogOut,
  FiHome,
  FiBookOpen,
  FiActivity,
  FiUser,
} from "react-icons/fi";
import { logoutUser } from "../../../services/auth";
import "../css/Navbar.css";

const navItems = [
  { text: "Trang chủ", path: "/", targetId: "home", Icon: FiHome },
  { text: "Hướng dẫn", path: "/", targetId: "intrust", Icon: FiBookOpen },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("access_token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

   const handlePredictClick = () => {
    closeMenus();
  
    if (location.pathname !== "/prediction") {
      navigate("/prediction");
    }
  };;

  const scrollTo = (path, targetId) => {
    closeMenus();
    if (window.location.pathname === path) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      localStorage.setItem("scrollTo", targetId);
      navigate(path);
    }
  };

  const handleLogout = () => {
    closeMenus();
    logoutUser().catch(() => {});
    navigate("/login");
  };

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <a
          className="site-navbar-brand"
          href="/"
          aria-label="Medic Diabetes - Trang chủ"
        >
          <img
            src="/assets/img/logo/assistant.png"
            alt="Health"
            className="health-icon"
          />
          <h3>MEDICAL AI</h3>
        </a>

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
            {navItems.map((item) => {
              const Icon = item.Icon;

              return (
                <button
                  type="button"
                  className={`site-nav-link ${
                    item.text === "Trang chủ" && location.pathname === "/"
                      ? "is-active"
                      : ""
                  }`}
                  key={item.text}
                  onClick={() => scrollTo(item.path, item.targetId)}
                >
                  <Icon className="nav-link-icon" aria-hidden="true" />
                  <span>{item.text}</span>
                </button>
              );
            })}

            {token && (
              <button
                type="button"
                className={`site-nav-link ${
                  location.pathname === "/prediction" ? "is-active" : ""
                }`}
                onClick={handlePredictClick}
              >
                <FiActivity className="nav-link-icon" aria-hidden="true" />
                <span>Dự đoán</span>
              </button>
            )}

            {token ? (
              <div className="user-menu">
                <button
                  type="button"
                  className="site-nav-link user-menu-trigger"
                  aria-expanded={isUserMenuOpen}
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                >
                  <FiUser className="nav-link-icon" aria-hidden="true" />
                  <span>{username}</span>
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
                      <FiClock aria-hidden="true" />
                      <span>Lịch sử dự đoán</span>
                    </button>

                    <button
                      type="button"
                      className="user-menu-logout"
                      onClick={handleLogout}
                    >
                      <FiLogOut aria-hidden="true" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="site-nav-link nav-login"
                onClick={() => {
                  closeMenus();
                  navigate("/login");
                }}
              >
                <FiUser className="nav-link-icon" aria-hidden="true" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
