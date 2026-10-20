import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Intrust from "./Intrust";
import Footer from "../layout/Footer";
import "../css/HomePage.css";

const HomePage = () => {
  useEffect(() => {
    const scrollToId = localStorage.getItem("scrollTo");

    if (scrollToId) {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(scrollToId);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }

        localStorage.removeItem("scrollTo");
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <div className="home-page" id="home">
      <Navbar />

      <main>
        <section className="home-intro">
          <div className="home-intro-container">
            <div className="home-intro-content">
              <span className="home-eyebrow">MEDIC DIABETES</span>

              <h1>
                Chủ động theo dõi
                <br />
                <span>nguy cơ tiểu đường</span>
              </h1>

              <p>
                Nhập các chỉ số sức khỏe để nhận kết quả đánh giá nguy cơ mắc
                bệnh tiểu đường và theo dõi các kết quả đã lưu.
              </p>

              <div className="home-intro-actions">
                <Link to="/prediction" className="home-primary-button">
                  Bắt đầu dự đoán
                  <span aria-hidden="true">→</span>
                </Link>

                <a href="/intrust" className="home-secondary-button">
                  Xem hướng dẫn
                </a>
              </div>

              <div className="home-intro-note">
                <span className="home-note-icon" aria-hidden="true">
                  i
                </span>
                <p>
                  Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán của
                  y tế.
                </p>
              </div>
            </div>

            <div className="home-intro-visual" aria-hidden="true">
                <div className="home-visual-icon">
                  <img
                    src="/assets/img/logo/healthcare.png"
                    alt="Medic Diabetes"
                  />
              </div>
            </div>
          </div>
        </section>

        <section className="home-actions" aria-label="Chức năng chính">
          <div className="home-section-container">
            <div className="home-section-heading">
              <span className="home-eyebrow">CHỨC NĂNG</span>
              <h2>Bạn muốn làm gì hôm nay?</h2>
            </div>

            <div className="home-action-grid">
              <Link to="/prediction" className="home-action-card">
                <div className="home-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 12H7L10 5L14 19L17 12H21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="home-action-text">
                  <h3>Dự đoán nguy cơ</h3>
                  <p>Nhập thông tin sức khỏe và xem kết quả phân tích.</p>
                </div>

                <span className="home-action-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link to="/history" className="home-action-card">
                <div className="home-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="8.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 7V12L15.5 14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="home-action-text">
                  <h3>Lịch sử dự đoán</h3>
                  <p>Xem lại các kết quả dự đoán đã lưu trước đây.</p>
                </div>

                <span className="home-action-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        <div id="intrust" className="home-guide">
          <Intrust />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
