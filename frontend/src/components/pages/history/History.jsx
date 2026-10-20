
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../services/apiClient";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import HistoryDetailsModal from "./HistoryDetailsModal";
import HistoryFilters from "./HistoryFilters";
import HistoryTable from "./HistoryTable";
import "../css/Footer.css";
import "../css/History.css";

function History() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const [history, setHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    day: null,
    month: null,
    year: null,
  });

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login", { replace: true });
      return;
    }

    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get(`/history/${userId}`);
        setHistory(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Không thể tải lịch sử. Vui lòng thử lại.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [navigate, token, userId]);

  const availableYears = useMemo(() => {
    const years = new Set();

    history.forEach(({ created_at }) => {
      const year = Number(String(created_at || "").slice(0, 4));

      if (Number.isInteger(year) && year >= 1900) {
        years.add(year);
      }
    });

    return [...years]
      .sort((a, b) => b - a)
      .map((year) => ({
        value: String(year),
        label: String(year),
      }));
  }, [history]);

  const filteredHistory = useMemo(
    () =>
      history.filter((item) => {
        const date = new Date(item.created_at);

        if (Number.isNaN(date.getTime())) return false;

        return (
          (!filters.day || String(date.getDate()) === filters.day.value) &&
          (!filters.month ||
            String(date.getMonth() + 1) === filters.month.value) &&
          (!filters.year || String(date.getFullYear()) === filters.year.value)
        );
      }),
    [filters, history],
  );

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const deleteRecord = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="history-confirm">
          <p>Bạn có muốn xóa dự đoán này?</p>

          <div className="confirm-actions">
            <button
              type="button"
              className="confirm-delete"
              onClick={async () => {
                try {
                  await api.delete(`/history/${id}`);

                  setHistory((records) =>
                    records.filter((item) => item.id !== id),
                  );

                  toast.success("Đã xóa thành công.");
                } catch (requestError) {
                  toast.error(
                    requestError.response?.data?.message || "Xóa thất bại.",
                  );
                } finally {
                  closeToast();
                }
              }}
            >
              Có
            </button>

            <button
              type="button"
              className="confirm-cancel"
              onClick={closeToast}
            >
              Không
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      },
    );
  };

  const content = isLoading ? (
    <div className="history-state" role="status">
      <span className="history-loading-spinner" />
      <strong>Đang tải lịch sử</strong>
      <p>Vui lòng chờ trong giây lát.</p>
    </div>
  ) : error ? (
    <div className="history-state history-state-error" role="alert">
      <strong>Không thể tải lịch sử</strong>
      <p>{error}</p>
    </div>
  ) : filteredHistory.length === 0 ? (
    <div className="history-state">
      <span className="history-empty-icon" aria-hidden="true">
        —
      </span>
      <strong>Chưa có dữ liệu phù hợp</strong>
      <p>Thử thay đổi ngày, tháng hoặc năm để tìm bản ghi dự đoán.</p>
    </div>
  ) : (
    <HistoryTable
      records={filteredHistory}
      onShowDetails={setSelectedRecord}
      onDelete={deleteRecord}
    />
  );

  return (
    <div className="page-shell history-page">
      <Navbar />

      <main className="page-content">
        <section className="history-container">
          <header className="history-page-header">
            <div className="history-page-heading">
              <span className="history-eyebrow">MEDICAL DATA</span>
              <h2>Lịch sử dự đoán</h2>
              <p>
                Theo dõi các lần dự đoán trước đây, lọc bản ghi và xem lại
                thông tin sức khỏe chi tiết.
              </p>
            </div>
          </header>

          <section className="history-panel">
            <div className="history-panel-heading">
              <div>
                <h3>Bộ lọc lịch sử</h3>
                <p>Lọc các bản ghi theo ngày, tháng hoặc năm.</p>
              </div>
            </div>

            <HistoryFilters
              filters={filters}
              onChange={updateFilter}
              years={availableYears}
            />
          </section>

          <section className="history-panel history-records-panel">
            <div className="history-panel-heading history-records-heading">
              <div>
                <h3>Danh sách dự đoán</h3>
                <p>
                  {isLoading
                    ? "Đang lấy dữ liệu từ hệ thống."
                    : `Hiển thị ${filteredHistory.length} / ${history.length} bản ghi.`}
                </p>
              </div>
            </div>

            <div className="history-content">{content}</div>
          </section>
        </section>
      </main>

      <Footer />

      <HistoryDetailsModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default History;
