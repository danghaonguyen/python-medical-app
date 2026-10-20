
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import {
  formatDateTime,
  formatGender,
  formatProbability,
  formatRisk,
  getRiskClass,
} from "./historyUtils";
import "../css/HistoryDetailsModal.css";

Modal.setAppElement("#root");

const indicators = (record) => [
  {
    name: "Đường huyết",
    user: Number(record.glucose),
    unit: "mmol/L",
    normal: 5.5,
    min: 3.9,
    max: 7,
  },
  {
    name: "BMI",
    user: Number(record.bmi),
    unit: "kg/m²",
    normal: 22,
    min: 18.5,
    max: 24.9,
  },
  {
    name: "Huyết áp tâm thu",
    user: Number(record.systolic_bp),
    unit: "mmHg",
    normal: 110,
    min: 90,
    max: 120,
  },
  {
    name: "Huyết áp tâm trương",
    user: Number(record.diastolic_bp),
    unit: "mmHg",
    normal: 75,
    min: 60,
    max: 80,
  },
  {
    name: "Nhịp tim",
    user: Number(record.pulse_rate),
    unit: "bpm",
    normal: 80,
    min: 60,
    max: 100,
  },
];

const formatValue = (value) =>
  Number.isFinite(value)
    ? Number(value.toFixed(1)).toLocaleString("vi-VN", {
        maximumFractionDigits: 1,
      })
    : "Chưa có dữ liệu";

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

const getIndicatorStatus = (item, hasValue) => {
  if (!hasValue) {
    return {
      label: "Chưa có dữ liệu",
      className: "health-status-unavailable",
    };
  }

  const color = getColor(item.user, item.min, item.max);

  if (color === "#319b68") {
    return {
      label: "Trong khoảng tham khảo",
      className: "health-status-normal",
    };
  }

  if (color === "#e8a33d") {
    return {
      label: "Ngoài khoảng tham khảo",
      className: "health-status-warning",
    };
  }

  return {
    label: "Lệch xa khoảng tham khảo",
    className: "health-status-alert",
  };
};

const getComparisonScale = (item) => {
  const range = item.max - item.min;
  const padding = range * 0.25;

  // Nếu thiếu dữ liệu, dùng mốc ổn định để tính thang đo.
  const valueForScale = Number.isFinite(item.user)
    ? item.user
    : item.normal;

  const scaleMin = Math.max(
    0,
    Math.min(item.min, item.normal, valueForScale) - padding,
  );

  const scaleMax =
    Math.max(item.max, item.normal, valueForScale) + padding;

  const scaleWidth = scaleMax - scaleMin;

  const getPosition = (value) =>
    ((value - scaleMin) / scaleWidth) * 100;

  return {
    scaleMin,
    scaleMax,
    userWidth: getPosition(valueForScale),
    normalWidth: getPosition(item.normal),
    rangeLeft: getPosition(item.min),
    rangeWidth: getPosition(item.max) - getPosition(item.min),
  };
};

function HistorySummary({ record }) {
  const fields = [
    ["Tuổi", record.age],
    ["Giới tính", formatGender(record.gender)],
    ["Nhịp tim", `${record.pulse_rate} nhịp/phút`],
    ["Huyết áp tâm thu", `${record.systolic_bp} mmHg`],
    ["Huyết áp tâm trương", `${record.diastolic_bp} mmHg`],
    ["Đường huyết", `${record.glucose} mmol/L`],
    ["Chiều cao", `${record.height} m`],
    ["Cân nặng", `${record.weight} kg`],
    ["BMI", `${record.bmi} kg/m²`],
    [
      "Tiền sử tiểu đường gia đình",
      Number(record.family_diabetes) === 1 ? "Có" : "Không",
    ],
    [
      "Tăng huyết áp",
      Number(record.hypertensive) === 1 ? "Có" : "Không",
    ],
    [
      "Tiền sử cao huyết áp gia đình",
      Number(record.family_hypertension) === 1 ? "Có" : "Không",
    ],
    [
      "Kết quả",
      <strong className={getRiskClass(record.prediction_result)}>
        {formatRisk(record.prediction_result)}
      </strong>,
    ],
    ["Xác suất", formatProbability(record.prediction_probability)],
  ];

  return (
    <section
      className="history-summary-section"
      aria-label="Thông tin lần dự đoán"
    >
      <div className="history-section-title">
        <div>
          <span className="history-section-eyebrow">TỔNG QUAN</span>
          <h4>Thông tin lần dự đoán</h4>
        </div>

        <span className="history-field-count">
          {fields.length} thông tin
        </span>
      </div>

      <div className="modal-content-grid">
        {fields.map(([label, value]) => (
          <div className="history-summary-field" key={label}>
            <span>{label}</span>
            <div className="history-summary-value">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HealthIndicatorsChart({ record }) {
  const data = indicators(record);

  return (
    <section
      className="history-chart-section"
      aria-label="Biểu đồ đối chiếu các chỉ số sức khỏe"
    >
      <div className="history-chart-heading">
        <div>
          <span className="history-section-eyebrow">
            PHÂN TÍCH CHỈ SỐ
          </span>

          <h4>Phân tích và so sánh sức khỏe</h4>

          <p>
            So sánh chỉ số được ghi nhận trong lần dự đoán với mốc
            đối chiếu và khoảng tham khảo của từng chỉ số.
          </p>
        </div>
      </div>

      <div className="health-chart-legend" aria-label="Chú giải biểu đồ">
        <div className="health-chart-legend-item">
          <span className="health-legend-marker health-legend-user" />
          <span>Chỉ số của bạn</span>
        </div>

        <div className="health-chart-legend-item">
          <span className="health-legend-marker health-legend-normal" />
          <span>Chỉ số ổn định</span>
        </div>

        <div className="health-chart-legend-item">
          <span className="health-legend-range" />
          <span>Khoảng tham khảo</span>
        </div>
      </div>

      <p className="health-chart-guide">
        Mỗi chỉ số có hai thanh riêng để so sánh. Dải xanh nhạt chỉ
        xuất hiện trên thanh Chỉ số ổn định; chiều dài thanh thể hiện
        vị trí của giá trị trên thang đo.
      </p>

      <div className="health-indicator-chart-list">
        {data.map((item) => {
          const hasValue = Number.isFinite(item.user);
          const status = getIndicatorStatus(item, hasValue);

          const userColor = hasValue
            ? getColor(item.user, item.min, item.max)
            : "#64748b";

          const comparison = hasValue
            ? item.user - item.normal
            : null;

          const scale = getComparisonScale(item);

          return (
            <article className="health-chart-row" key={item.name}>
              <div className="health-chart-row-heading">
                <div className="health-chart-label">
                  <h5>{item.name}</h5>
                  <span>
                    Khoảng tham khảo: {formatValue(item.min)}–
                    {formatValue(item.max)} {item.unit}
                  </span>
                </div>

                <span
                  className={`health-indicator-status ${status.className}`}
                >
                  <span className="health-status-dot" />
                  {status.label}
                </span>
              </div>

              <div className="health-bar-comparison">
                <div className="health-bar-label">
                  <span className="health-bar-label-dot health-dot-user" />
                  <span>Chỉ số của bạn</span>
                  <strong>
                    {hasValue ? formatValue(item.user) : "—"}
                    {hasValue ? ` ${item.unit}` : ""}
                  </strong>
                </div>

                <div
                  className="health-bar-track"
                  role="img"
                  aria-label={
                    hasValue
                      ? `${item.name}, chỉ số của bạn ${formatValue(item.user)} ${item.unit}`
                      : `${item.name}, chưa có dữ liệu`
                  }
                >
                  {hasValue && (
                    <div
                      className="health-bar-fill health-user-bar"
                      style={{
                        width: `${scale.userWidth}%`,
                        backgroundColor: userColor,
                      }}
                    />
                  )}
                </div>

                <div className="health-bar-label">
                  <span className="health-bar-label-dot health-dot-normal" />
                  <span>Chỉ số ổn định</span>
                  <strong>
                    {formatValue(item.normal)} {item.unit}
                  </strong>
                </div>

                <div
                  className="health-bar-track"
                  role="img"
                  aria-label={`${item.name}, chỉ số ổn định ${formatValue(item.normal)} ${item.unit}; khoảng tham khảo từ ${formatValue(item.min)} đến ${formatValue(item.max)} ${item.unit}`}
                >
                  <div
                    className="health-bar-reference-range"
                    style={{
                      left: `${scale.rangeLeft}%`,
                      width: `${scale.rangeWidth}%`,
                    }}
                  />

                  <div
                    className="health-bar-fill health-normal-bar"
                    style={{ width: `${scale.normalWidth}%` }}
                  />
                </div>

                <div className="health-bar-scale">
                  <span>{formatValue(scale.scaleMin)}</span>
                  <span>{formatValue(scale.scaleMax)}</span>
                </div>
              </div>

              <div className="health-chart-comparison-explanation">
                <span>Chênh lệch so với chỉ số ổn định</span>

                <strong>
                  {!hasValue
                    ? "Chưa có dữ liệu"
                    : comparison === 0
                      ? "Ổn định"
                      : `${comparison > 0 ? "+" : "−"}${formatValue(
                          Math.abs(comparison),
                        )} ${item.unit}`}
                </strong>
              </div>
            </article>
          );
        })}
      </div>

      <div className="health-indicator-note">
        <strong>Lưu ý:</strong> Trạng thái chỉ phản ánh giá trị so với
        khoảng tham khảo được cấu hình, không phải chẩn đoán y tế.
        Các mốc tham khảo cần được xác minh theo hướng dẫn chuyên môn
        phù hợp trước khi sử dụng thực tế.
      </div>
    </section>
  );
}

function HistoryDetailsModal({ record, onClose }) {
  return (
    <Modal
      isOpen={Boolean(record)}
      onRequestClose={onClose}
      contentLabel="Chi tiết dự đoán"
      className="history-modal"
      overlayClassName="history-overlay"
    >
      {record && (
        <>
          <button
            type="button"
            className="history-modal-close"
            onClick={onClose}
            aria-label="Đóng chi tiết"
            title="Đóng"
          >
            <FiX aria-hidden="true" />
          </button>

          <header className="history-modal-header">
            <span className="history-section-eyebrow">
              LỊCH SỬ DỰ ĐOÁN
            </span>

            <h3>Chi tiết lần dự đoán</h3>
            <p>{formatDateTime(record.created_at)}</p>
          </header>

          <HistorySummary record={record} />
          <HealthIndicatorsChart record={record} />
        </>
      )}
    </Modal>
  );
}

export default HistoryDetailsModal;
