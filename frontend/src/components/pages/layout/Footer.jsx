import "../css/Footer.css";

const Footer = () => (
  <footer className="footer-section">
    <div className="container footer-content">
      <div className="footer-col footer-brand">
        <img
          src="/assets/img/logo/assistant.png"
          alt="Health"
          className="health-icon"
        />

        <p className="footer-description">
          Ứng dụng tiên phong trong việc dự đoán nguy cơ mắc bệnh tiểu đường, hỗ
          trợ theo dõi và cải thiện sức khỏe của bạn mỗi ngày.
        </p>
        <div className="footer-left">
        <a href="tel:+840384611449">
          <i className="lni lni-phone" aria-hidden="true" />
          <span>+84 0384 611 449</span>
        </a>

        <span className="divider" aria-hidden="true" />

        <a href="mailto:vinaihn@gmail.com">
          <i className="lni lni-envelope" aria-hidden="true" />
          <span>vinaihn@gmail.com</span>
        </a>
      </div>
        <div className="footer-socials">
          <a href="https://www.facebook.com/haonguyenhype" aria-label="Facebook">
            <i className="lni lni-linkedin-original" />
          </a>
          <a href="https://github.com/danghaonguyen" aria-label="GitHub">
            <i className="lni lni-github-original" />
          </a>
          <a href="#instagram" aria-label="Instagram">
            <i className="lni lni-instagram-filled" />
          </a>
        </div>
      </div>

      <div className="footer-col footer-location">
        <h4 className="footer-heading">Địa Chỉ Y Tế</h4>

        <div className="footer-map">
          <iframe
            title="Google map of medical location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1260734411057!2d106.3439443758779!3d9.92345687434543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a019e205ae8969%3A0xddb4876985fbda25!2zQuG7h25oIHZp4buHbiBUcsaw4budbmcgxJDhuqFpIEjhu41jIFRyw6AgVmluaA!5e0!3m2!1svi!2sus!4v1748882750290!5m2!1svi!2sus"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
