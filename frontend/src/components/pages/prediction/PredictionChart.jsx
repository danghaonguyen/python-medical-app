import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import "../css/PredictionChart.css";

Modal.setAppElement("#root");

const ageGroupLabel = (age) => {
  if (age < 18) return "<18";
  if (age <= 30) return "18-30";
  if (age <= 45) return "31-45";
  if (age <= 60) return "46-60";
  return ">=60";
};

const getColor = (value, min, max) => {
  const range = max - min;

  if (value < min - range * 0.2 || value > max + range * 0.2) {
    return "#d94a4a";
  }

  if (value < min || value > max) {
    return "#e8a33d";
  }

  return "#319b68";
};

const getStatus = (value, min, max) => {
  const color = getColor(value, min, max);

  if (color === "#319b68") {
    return {
      label: "Trong khoảng tham khảo",
      className: "status-normal",
    };
  }

  if (color === "#e8a33d") {
    return {
      label: "Ngoài khoảng tham khảo",
      className: "status-warning",
    };
  }

  return {
    label: "Lệch xa khoảng tham khảo",
    className: "status-alert",
  };
};

const buildChartData = (formData) => [
  {
    name: "Đường huyết",
    user: Number(formData.glucose) || 0,
    normal: 5.5,
    normalMin: 3.9,
    normalMax: 7,
  },
  {
    name: "BMI",
    user: Number(formData.bmi) || 0,
    normal: 22,
    normalMin: 18.5,
    normalMax: 24.9,
  },
  {
    name: "Huyết áp tâm thu",
    user: Number(formData.systolic_bp) || 0,
    normal: 110,
    normalMin: 90,
    normalMax: 120,
  },
  {
    name: "Huyết áp tâm trương",
    user: Number(formData.diastolic_bp) || 0,
    normal: 75,
    normalMin: 60,
    normalMax: 80,
  },
  {
    name: "Nhịp tim",
    user: Number(formData.pulse_rate) || 0,
    normal: 80,
    normalMin: 60,
    normalMax: 100,
  },
];

const units = {
  "Đường huyết": "mmol/L",
  BMI: "kg/m²",
  "Huyết áp tâm thu": "mmHg",
  "Huyết áp tâm trương": "mmHg",
  "Nhịp tim": "bpm",
};

const formatValue = (value) =>
  Number.isInteger(value) ? value : Number(value.toFixed(1));

const getRangePosition = (item) => {
  const range = item.normalMax - item.normalMin;
  const padding = range * 0.25;

  const scaleMin = Math.max(
    0,
    Math.min(item.normalMin, item.normal, item.user) - padding,
  );

  const scaleMax = Math.max(item.normalMax, item.normal, item.user) + padding;

  const scaleWidth = scaleMax - scaleMin;

  const getPosition = (value) => ((value - scaleMin) / scaleWidth) * 100;

  return {
    scaleMin,
    scaleMax,
    rangeLeft: getPosition(item.normalMin),
    rangeWidth: getPosition(item.normalMax) - getPosition(item.normalMin),
    userWidth: getPosition(item.user),
    normalWidth: getPosition(item.normal),
  };
};

function PredictionChart({ formData, onClose }) {
  const data = buildChartData(formData);
  const age = Number(formData.age);

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      contentLabel="Biểu đồ so sánh chỉ số sức khỏe"
      className="prediction-chart-modal"
      overlayClassName="prediction-chart-overlay"
    >
      <button
        type="button"
        className="prediction-chart-close"
        onClick={onClose}
        aria-label="Đóng biểu đồ"
        title="Đóng"
      >
        <FiX aria-hidden="true" />
      </button>

      <section
        className="chart-box"
        aria-label="Biểu đồ so sánh chỉ số sức khỏe"
      >
        <div className="chart-header">
          <div className="chart-heading-content">
            <span className="chart-eyebrow">PHÂN TÍCH CHỈ SỐ</span>

            <h5>Phân tích và so sánh sức khỏe</h5>

            <p>
              So sánh chỉ số bạn đã nhập với mốc đối chiếu và khoảng tham khảo
              của từng chỉ số.
            </p>
          </div>

          <div className="age-group-badge">
            <span>Nhóm tuổi</span>
            <strong>{ageGroupLabel(age)} tuổi</strong>
          </div>
        </div>

        <div className="chart-guide">
          <div className="chart-guide-item">
            <span className="guide-user-marker" />
            <span>Chỉ số của bạn</span>
          </div>

          <div className="chart-guide-item">
            <span className="guide-reference-marker" />
            <span>Chỉ số ổn định</span>
          </div>

          <div className="chart-guide-item">
            <span className="guide-range" />
            <span>Khoảng tham khảo</span>
          </div>

          <p>
            Mỗi chỉ số có hai thanh riêng để so sánh. Dải xanh nhạt phía sau
            biểu thị khoảng tham khảo; chiều dài thanh biểu thị vị trí của giá
            trị trên thang đo.
          </p>
        </div>

        <div className="metric-chart-list">
          {data.map((item) => {
            const {
              scaleMin,
              scaleMax,
              rangeLeft,
              rangeWidth,
              userWidth,
              normalWidth,
            } = getRangePosition(item);

            const status = getStatus(item.user, item.normalMin, item.normalMax);

            const userColor = getColor(
              item.user,
              item.normalMin,
              item.normalMax,
            );

            return (
              <article className="metric-chart-row" key={item.name}>
                <div className="metric-chart-heading">
                  <div>
                    <h6 className="metric-chart-name">{item.name}</h6>
                    <p className="metric-chart-range-text">
                      Khoảng tham khảo: {item.normalMin}–{item.normalMax}{" "}
                      {units[item.name]}
                    </p>
                  </div>

                  <span className={`metric-status ${status.className}`}>
                    <span className="metric-status-dot" />
                    {status.label}
                  </span>
                </div>

                <div className="metric-bar-comparison">
                  <div className="metric-bar-label">
                    <span className="metric-bar-label-dot user-dot" />
                    <span>Chỉ số của bạn</span>
                    <strong>
                      {formatValue(item.user)} {units[item.name]}
                    </strong>
                  </div>

                  <div
                    className="metric-bar-track"
                    role="img"
                    aria-label={`${item.name}, chỉ số của bạn ${formatValue(item.user)} ${units[item.name]}.`}
                  >

                    <div
                      className="metric-bar-fill user-bar"
                      style={{
                        width: `${userWidth}%`,
                        backgroundColor: userColor,
                      }}
                    />
                  </div>

                  <div className="metric-bar-label reference-bar-label">
                    <span className="metric-bar-label-dot reference-dot" />
                    <span>Chỉ số ổn định</span>
                    <strong>
                      {formatValue(item.normal)} {units[item.name]}
                    </strong>
                  </div>

                  <div
                    className="metric-bar-track"
                    role="img"
                    aria-label={`${item.name}, mốc so sánh ${formatValue(item.normal)} ${units[item.name]}.`}
                  >
                    <div
                      className="metric-reference-range"
                      style={{
                        left: `${rangeLeft}%`,
                        width: `${rangeWidth}%`,
                      }}
                    />

                    <div
                      className="metric-bar-fill reference-bar"
                      style={{
                        width: `${normalWidth}%`,
                        backgroundColor: "#319b68",
                      }}
                    />
                  </div>

                  <div className="metric-chart-scale">
                    <span>{formatValue(scaleMin)}</span>
                    <span>{formatValue(scaleMax)}</span>
                  </div>
                </div>

                <div className="metric-comparison-result">
                  <span>Chênh lệch so với chỉ số ổn định</span>

                  <strong>
                    {item.user === item.normal
                      ? "Ổn định"
                      : `${item.user > item.normal ? "+" : "−"}${formatValue(
                          Math.abs(item.user - item.normal),
                        )} ${units[item.name]}`}
                  </strong>
                </div>
              </article>
            );
          })}
        </div>

        <div className="chart-medical-note">
          <strong>Lưu ý:</strong> Trạng thái chỉ phản ánh giá trị so với khoảng
          tham khảo được cấu hình, không phải chẩn đoán y tế. Các mốc và khoảng
          tham khảo cần được xác minh theo hướng dẫn chuyên môn phù hợp trước
          khi sử dụng thực tế.
        </div>
      </section>
    </Modal>
  );
}

export default PredictionChart;
