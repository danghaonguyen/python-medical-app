
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { predictDiabetes } from "../../../services/api";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import PredictionChart from "./PredictionChart";
import "../css/PatientForm.css";
import "../css/Navbar.css";

const initialFormData = {
  age: "",
  gender: "",
  pulse_rate: "",
  systolic_bp: "",
  diastolic_bp: "",
  glucose: "",
  height: "",
  weight: "",
  bmi: "",
  family_diabetes: "",
  hypertensive: "",
  family_hypertension: "",
};

const labels = {
  age: "Tuổi",
  gender: "Giới tính",
  pulse_rate: "Nhịp tim (bpm)",
  systolic_bp: "Huyết áp tâm thu (mmHg)",
  diastolic_bp: "Huyết áp tâm trương (mmHg)",
  glucose: "Chỉ số đường huyết (mmol/L)",
  height: "Chiều cao (m)",
  weight: "Cân nặng (kg)",
  bmi: "Chỉ số BMI (kg/m²)",
  family_diabetes: "Tiền sử tiểu đường gia đình",
  hypertensive: "Bản thân bị tăng huyết áp",
  family_hypertension: "Tiền sử cao huyết áp gia đình",
};

const placeholders = {
  age: "Ví dụ: 25",
  gender: "",
  pulse_rate: "Ví dụ: 75",
  systolic_bp: "Ví dụ: 120",
  diastolic_bp: "Ví dụ: 80",
  glucose: "Nhập chỉ số đường huyết",
  height: "Ví dụ: 1.70",
  weight: "Ví dụ: 65",
  bmi: "",
  family_diabetes: "",
  hypertensive: "",
  family_hypertension: "",
};

const booleanFields = [
  "family_diabetes",
  "hypertensive",
  "family_hypertension",
];

const fieldGroups = [
  {
    title: "Thông tin cơ bản",
    description: "Thông tin cá nhân của người được đánh giá.",
    fields: ["age", "gender"],
  },
  {
    title: "Chỉ số cơ thể",
    description: "Nhập chiều cao và cân nặng để tính BMI tự động.",
    fields: ["height", "weight", "bmi"],
  },
  {
    title: "Chỉ số sức khỏe",
    description: "Các chỉ số đường huyết, nhịp tim và huyết áp.",
    fields: [
      "glucose",
      "pulse_rate",
      "systolic_bp",
      "diastolic_bp",
    ],
  },
  {
    title: "Tiền sử sức khỏe",
    description: "Thông tin về tiền sử bệnh cá nhân và gia đình.",
    fields: [
      "family_diabetes",
      "hypertensive",
      "family_hypertension",
    ],
  },
];

function PatientForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      toast.warning("Bạn cần đăng nhập để sử dụng chức năng này!");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
    setShowChart(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "height" || name === "weight") {
      const height = parseFloat(
        updatedFormData.height.replace(",", ".")
      );
      const weight = parseFloat(
        updatedFormData.weight.replace(",", ".")
      );

      updatedFormData.bmi =
        !Number.isNaN(height) &&
        !Number.isNaN(weight) &&
        height > 0
          ? (weight / (height * height)).toFixed(2)
          : "";
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowChart(false);

    const numericData = {
      age: Number(formData.age || 0),
      gender: Number(formData.gender || 0),
      pulse_rate: Number(formData.pulse_rate || 0),
      systolic_bp: Number(formData.systolic_bp || 0),
      diastolic_bp: Number(formData.diastolic_bp || 0),
      glucose: Number(formData.glucose || 0),
      height: Number(formData.height || 0),
      weight: Number(formData.weight || 0),
      family_diabetes: Number(formData.family_diabetes ?? 0),
      hypertensive: Number(formData.hypertensive ?? 0),
      family_hypertension: Number(
        formData.family_hypertension ?? 0
      ),
    };

    const measurements = [
      numericData.age,
      numericData.pulse_rate,
      numericData.systolic_bp,
      numericData.diastolic_bp,
      numericData.glucose,
      numericData.height,
      numericData.weight,
    ];

    if (
      measurements.some(
        (value) => !Number.isFinite(value) || value <= 0
      )
    ) {
      toast.error("Vui lòng nhập tất cả chỉ số bằng số dương.");
      return;
    }

    try {
      const response = await predictDiabetes(numericData);
      setResult(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Không thể dự đoán. Vui lòng thử lại."
      );
    }
  };

  const renderField = (key) => (
    <div className="form-group" key={key}>
      <label htmlFor={key}>{labels[key]}</label>

      {key === "gender" || booleanFields.includes(key) ? (
        <select
          id={key}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">
            {key === "gender"
              ? "-- Chọn giới tính --"
              : "-- Chọn câu trả lời --"}
          </option>

          {key === "gender" ? (
            <>
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
            </>
          ) : (
            <>
              <option value="0">Không</option>
              <option value="1">Có</option>
            </>
          )}
        </select>
      ) : (
        <input
          type="text"
          name={key}
          id={key}
          value={formData[key]}
          autoComplete="off"
          onChange={handleChange}
          readOnly={key === "bmi"}
          className={`form-input ${
            key === "bmi" ? "readonly-field" : ""
          } ${key === "bmi" && formData.bmi ? "filled-bmi" : ""}`}
          placeholder={placeholders[key]}
          required
        />
      )}
    </div>
  );

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Navbar />

      <main className="patient-form-container">
        <div className="form-page-heading">

          <p className="form-eyebrow">MEDICAL HEALTH ASSESSMENT</p>

          <h2 className="form-title">
            Dự đoán nguy cơ bệnh tiểu đường
          </h2>

          <p className="form-subtitle">
            Nhập các chỉ số sức khỏe để hệ thống phân tích và đưa ra
            kết quả dự đoán.
          </p>
        </div>

        <div className="form-notice">
          <span className="notice-icon" aria-hidden="true">
            i
          </span>
          <p>
            Vui lòng cung cấp thông tin chính xác. Kết quả dự đoán
            chỉ mang tính tham khảo, không thay thế chẩn đoán y khoa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {fieldGroups.map((group, index) => (
            <section className="form-section" key={group.title}>
              <div className="form-section-heading">
                <span className="form-section-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
              </div>

              <div className="form-section-grid">
                {group.fields.map(renderField)}
              </div>
            </section>
          ))}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
            >
              Nhập lại
            </button>

            <button type="submit" className="submit-button">
              Dự đoán nguy cơ
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>

        {result && (
          <section className="result-box" aria-live="polite">
            <div className="result-heading">
              <div>
                <p className="result-eyebrow">PREDICTION SUMMARY</p>
                <h3>Kết quả dự đoán</h3>
              </div>

              <span className="result-icon" aria-hidden="true">
                ✓
              </span>
            </div>

            <div className="result-details">
              <div className="result-detail-card">
                <span>Mức nguy cơ</span>
                <strong>{result.risk_level}</strong>
              </div>

              <div className="result-detail-card">
                <span>Xác suất mô hình</span>
                <strong>
                  {(result.probability * 100).toFixed(2)}%
                </strong>
              </div>
            </div>

            <p className="result-disclaimer">
              Kết quả do mô hình ước tính dựa trên dữ liệu đã nhập,
              không phải kết luận chẩn đoán lâm sàng.
            </p>

            {!showChart && (
              <button
                type="button"
                onClick={() => setShowChart(true)}
                className="compare-chart-button"
              >
                Xem biểu đồ so sánh
                <span aria-hidden="true">→</span>
              </button>
            )}

            {showChart && (
              <PredictionChart
                formData={formData}
                onClose={() => setShowChart(false)}
              />
            )}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default PatientForm;
