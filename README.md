# 🩺 Ứng dụng Phân tích Dữ liệu Y tế và Dự đoán Nguy cơ Bệnh Tiểu đường

Ứng dụng web phân tích dữ liệu y tế và dự đoán nguy cơ mắc bệnh tiểu đường bằng Machine Learning. Hệ thống cung cấp chức năng quản lý tài khoản, tiếp nhận dữ liệu sức khỏe, dự đoán nguy cơ, hiển thị kết quả và lưu trữ lịch sử dự đoán.

## 📌 Giới thiệu

Dự án được xây dựng nhằm ứng dụng Python, Machine Learning và công nghệ phát triển web vào việc phân tích các chỉ số sức khỏe, hỗ trợ dự đoán nguy cơ mắc bệnh tiểu đường.

Hệ thống gồm ba thành phần chính:

- **Backend:** Xây dựng API, xử lý nghiệp vụ, xác thực dữ liệu và kết nối PostgreSQL.
- **Machine Learning:** Tiền xử lý dữ liệu, huấn luyện mô hình và dự đoán nguy cơ mắc bệnh tiểu đường.
- **Frontend:** Cung cấp giao diện để người dùng nhập thông tin sức khỏe, xem kết quả và quản lý lịch sử dự đoán.

> **Lưu ý y tế:** Kết quả dự đoán chỉ mang tính chất tham khảo, không thay thế cho việc chẩn đoán hoặc tư vấn của nhân viên y tế.

## ✨ Chức năng chính

### 1. Quản lý tài khoản

- Đăng ký tài khoản bằng email.
- Xác minh email thông qua mã OTP.
- Đăng nhập và đăng xuất.
- Gửi mã xác minh để đặt lại mật khẩu.
- Xác minh mã đặt lại mật khẩu và thiết lập mật khẩu mới.

### 2. Dự đoán nguy cơ mắc bệnh tiểu đường

- Tiếp nhận các chỉ số sức khỏe do người dùng cung cấp.
- Kiểm tra và xác thực dữ liệu đầu vào.
- Tiền xử lý dữ liệu trước khi đưa vào mô hình Machine Learning.
- Phân tích dữ liệu bằng mô hình đã huấn luyện.
- Trả về kết quả dự đoán, xác suất và mức độ nguy cơ theo logic của hệ thống.

### 3. Phân tích và hiển thị kết quả

- Hiển thị kết quả dự đoán trên giao diện web.
- Trình bày xác suất dự đoán và thông tin liên quan.
- Hỗ trợ người dùng theo dõi kết quả phân tích sức khỏe.

### 4. Quản lý lịch sử dự đoán

- Lưu kết quả dự đoán vào PostgreSQL.
- Truy xuất lịch sử dự đoán theo người dùng.
- Xem lại những lần dự đoán trước đó.
- Xóa bản ghi lịch sử theo quyền được phép.

## 🛠️ Công nghệ sử dụng

### Backend

- **Python** — ngôn ngữ lập trình chính.
- **FastAPI** — xây dựng REST API.
- **SQLAlchemy** — làm việc với dữ liệu và ORM.
- **PostgreSQL** — hệ quản trị cơ sở dữ liệu quan hệ.
- **Alembic** — quản lý migration và thay đổi cấu trúc database.
- **Pydantic** — xác thực và kiểm tra dữ liệu.
- **Pytest** — kiểm thử tự động.

### Machine Learning và xử lý dữ liệu

- **Pandas** — xử lý và phân tích dữ liệu.
- **NumPy** — tính toán số học.
- **Scikit-learn** — xây dựng và đánh giá mô hình Machine Learning.
- **XGBoost** — thuật toán tăng cường gradient nếu được sử dụng trong quy trình huấn luyện.
- **Joblib/Pickle** — lưu và nạp mô hình đã huấn luyện cùng bộ chuẩn hóa dữ liệu.

### Frontend

- **React** — xây dựng giao diện người dùng.
- **Vite** — công cụ phát triển và đóng gói ứng dụng.
- **React Router DOM** — điều hướng trang.
- **Axios** — gửi yêu cầu đến backend.
- **Recharts** — trực quan hóa dữ liệu nếu được sử dụng trong giao diện.

### Công cụ phát triển

- Visual Studio Code.
- Git và GitHub.
- PostgreSQL và công cụ quản trị cơ sở dữ liệu.
- Python và Node.js.

## 📁 Cấu trúc thư mục dự án

```text
python-medical/
├── backend/
│   ├── .env
│   │
│   ├── app/
│   │   ├── app.py
│   │   └── __init__.py
│   │
│   ├── database/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── __init__.py
│   │
│   ├── database_models/
│   │   ├── models_prediction.py
│   │   ├── models_user.py
│   │   └── __init__.py
│   │
│   ├── migrations/
│   │   ├── alembic.ini
│   │   ├── env.py
│   │   ├── README
│   │   ├── script.py.mako
│   │   └── versions/
│   │       └── 1eaf2fc81fd7_initial_migration.py
│   │
│   ├── data/
│   │   ├── diabetes_final_data_cleaned_v3.csv
│   │   ├── diabetes_final_data_v2.csv
│   │   └── diabetes_prediction_dataset.csv.zip
│   │
│   ├── ml/
│   │   ├── model.pkl
│   │   ├── prediction.py
│   │   ├── preprocessing.py
│   │   ├── scaler.pkl
│   │   └── train_model.py
│   │
│   ├── models/
│   │   ├── scaler.pkl
│   │   ├── trained_model.pkl
│   │   └── trained_model_xgb.pkl
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── history.py
│   │   └── predict.py
│   │
│   ├── schemas/
│   │   ├── schemas_prediction.py
│   │   └── schemas_user.py
│   │
│   ├── services/
│   │   └── prediction_service.py
│   │
│   └── tests/
│       ├── conftest.py
│       ├── test_api_validation.py
│       ├── test_auth_routes.py
│       ├── test_history_routes.py
│       ├── test_prediction_helpers.py
│       ├── test_predict_routes.py
│       └── test_schemas_user.py
│
└── frontend/
    ├── src/
    ├── vite.config.js
    └── .env.example
```

*Lưu ý:* Cấu trúc frontend ở trên được rút gọn để dễ đọc; cần bổ sung các file và thư mục frontend còn lại từ repository thực tế nếu muốn thể hiện cây thư mục đầy đủ.

### Vai trò các thư mục Backend

| Thư mục | Chức năng |
|---|---|
| `app/` | Khởi tạo ứng dụng và cấu hình API |
| `database/` | Cấu hình và kết nối PostgreSQL |
| `database_models/` | Định nghĩa ORM models |
| `migrations/` | Quản lý các phiên bản thay đổi database bằng Alembic |
| `data/` | Lưu trữ các bộ dữ liệu dùng trong quá trình xử lý và huấn luyện |
| `ml/` | Tiền xử lý dữ liệu, huấn luyện và thực hiện dự đoán |
| `models/` | Lưu các mô hình Machine Learning và scaler đã huấn luyện |
| `routers/` | Khai báo các API endpoints |
| `schemas/` | Định nghĩa và xác thực dữ liệu đầu vào/đầu ra |
| `services/` | Xử lý nghiệp vụ như dự đoán và gửi email |
| `tests/` | Chứa các bài kiểm thử tự động |

### Các bộ dữ liệu

Thư mục `backend/data/` chứa các tệp dữ liệu phục vụ cho quá trình phân tích và huấn luyện mô hình:

| Tệp | Mô tả |
|---|---|
| `diabetes_final_data_cleaned_v3.csv` | Bộ dữ liệu đã qua bước làm sạch theo phiên bản v3 |
| `diabetes_final_data_v2.csv` | Bộ dữ liệu phiên bản v2 |
| `diabetes_prediction_dataset.csv.zip` | Tệp ZIP chứa bộ dữ liệu dự đoán tiểu đường |

Trước khi huấn luyện, cần kiểm tra tên cột, kiểu dữ liệu, giá trị thiếu và định dạng tệp để bảo đảm tương thích với pipeline tiền xử lý.

## ⚙️ Yêu cầu hệ thống

Cài đặt các phần mềm sau trước khi chạy dự án:

- Python phiên bản tương thích với các thư viện backend.
- Node.js và npm để chạy frontend.
- PostgreSQL.
- Git để tải mã nguồn.

Phiên bản cụ thể của các thư viện Python nên được xác định theo danh sách dependency thực tế của dự án.

## 🚀 Cài đặt và chạy dự án

### Bước 1: Tải mã nguồn

Mở terminal và chạy:

```bash
git clone https://github.com/danghaonguyen/python-medical-app.git
cd python-medical-app
```

Nếu repository được lưu ở một địa chỉ khác, thay URL bằng địa chỉ GitHub thực tế.

### Bước 2: Cấu hình PostgreSQL

1. Khởi động PostgreSQL trên máy tính.
2. Tạo database có tên `medical_app` hoặc tên khác theo cấu hình của dự án.
3. Kiểm tra thông tin kết nối trong `backend/database/config.py` và `backend/database/database.py`.
4. Cấu hình biến môi trường trong `backend/.env`.

Ví dụ minh họa:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diabetes_app
DB_USER=postgres
DB_PASSWORD=your_database_password
```

Các tên biến môi trường trên chỉ là ví dụ. Hãy sử dụng đúng tên mà mã nguồn hiện tại đọc từ `.env`.

Nếu database chưa có bảng, hãy kiểm tra cấu hình Alembic và migration trước khi thực hiện lệnh migration.

### Bước 3: Cài đặt Backend

Mở terminal tại thư mục gốc của repository, sau đó chạy:

```bash
cd backend
```

Tạo môi trường ảo:

```bash
python -m venv .venv
```

Kích hoạt môi trường ảo trên Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Cài đặt các thư viện backend từ file dependency của dự án. Nếu repository có `requirements.txt`, chạy:

```bash
pip install -r requirements.txt
```

Nếu chưa có file dependency, cần tạo danh sách thư viện dựa trên các import thực tế của project trước khi cài đặt.

### Bước 4: Khởi tạo cấu trúc database

Kiểm tra `backend/migrations/env.py`, `backend/migrations/alembic.ini` và cấu hình kết nối database.

Nếu Alembic đã được cấu hình đúng và môi trường đã cài đặt đầy đủ, có thể chạy:

```bash
alembic upgrade head
```

Lệnh này áp dụng các migration đã có vào database được cấu hình. Không chạy nếu chưa xác nhận Alembic đang trỏ đến đúng database.

### Bước 5: Khởi chạy Backend

Từ thư mục `backend`, chạy ứng dụng theo cấu hình hiện tại:

```bash
uvicorn app.app:app --reload
```

Lệnh trên áp dụng khi `app/app.py` có khai báo đối tượng ASGI tên `app`. Nếu tên đối tượng hoặc cách khởi tạo ứng dụng khác, cần điều chỉnh theo mã nguồn thực tế.

Khi backend chạy thành công, kiểm tra địa chỉ được hiển thị trong terminal. Với cấu hình mặc định của Uvicorn, tài liệu API thường có tại:

```text
http://127.0.0.1:8000/docs
```

### Bước 6: Khởi chạy Frontend

Mở một terminal mới tại thư mục frontend:

```bash
cd frontend
```

Cài đặt các package:

```bash
npm install
```

Khởi chạy môi trường phát triển:

```bash
npm run dev
```

Mở địa chỉ được Vite hiển thị trong terminal. Kiểm tra `frontend/vite.config.js` để bảo đảm cấu hình proxy trỏ đến đúng địa chỉ backend.

## 🔌 API Endpoints

Các API được tổ chức theo module trong `backend/routers/`.

| Nhóm | Chức năng |
|---|---|
| `auth.py` | Đăng ký, đăng nhập, đăng xuất, xác minh email và đặt lại mật khẩu |
| `predict.py` | Nhận dữ liệu sức khỏe và trả về kết quả dự đoán |
| `history.py` | Truy xuất và xóa lịch sử dự đoán |

Đường dẫn HTTP cụ thể phụ thuộc vào các decorator trong từng router và cách chúng được đăng ký trong `app/app.py`. Có thể xem danh sách endpoint thực tế tại tài liệu API `/docs` sau khi khởi chạy backend.

## 🤖 Quy trình Machine Learning

Quy trình Machine Learning được tổ chức trong thư mục `backend/ml/`.

1. **Chuẩn bị dữ liệu:** Đọc dữ liệu từ các tệp trong thư mục `backend/data/`.
2. **Tiền xử lý:** Làm sạch dữ liệu, xử lý giá trị thiếu, mã hóa biến phân loại và chuẩn bị đặc trưng theo pipeline của mô hình.
3. **Huấn luyện:** Sử dụng script `train_model.py` để huấn luyện mô hình.
4. **Đánh giá:** Đánh giá mô hình bằng các chỉ số phù hợp với bài toán phân loại.
5. **Lưu mô hình:** Lưu mô hình và scaler để sử dụng khi dự đoán.
6. **Dự đoán:** Các module `prediction.py` và `prediction_service.py` phối hợp xử lý dữ liệu đầu vào và trả kết quả cho API.

Tên tệp mô hình đang được lưu trong cả `ml/` và `models/`. Cần xác nhận tệp nào được pipeline hiện tại sử dụng để tránh nhầm lẫn giữa các phiên bản mô hình.

## 🧪 Kiểm thử

Dự án sử dụng Pytest để kiểm thử các thành phần backend.

Các bài kiểm thử hiện có bao gồm:

- `test_api_validation.py`: kiểm tra xác thực dữ liệu API.
- `test_auth_routes.py`: kiểm thử các endpoint xác thực.
- `test_history_routes.py`: kiểm thử chức năng lịch sử.
- `test_prediction_helpers.py`: kiểm thử các hàm hỗ trợ dự đoán.
- `test_predict_routes.py`: kiểm thử API dự đoán.
- `test_schemas_user.py`: kiểm thử schema người dùng.

Để chạy kiểm thử, mở terminal tại thư mục `backend` và chạy:

```bash
python -m pytest
```

Lệnh này thực thi các bài kiểm thử được Pytest phát hiện trong project. Một số bài kiểm thử có thể yêu cầu database hoặc biến môi trường đã được cấu hình.

## 🔐 Bảo mật

- Không công khai thông tin bí mật trong file `.env`.
- Đưa `.env` vào `.gitignore`.
- Sử dụng cơ chế băm mật khẩu an toàn.
- Bảo vệ các endpoint yêu cầu xác thực.
- Kiểm tra quyền sở hữu bản ghi trước khi cho phép xóa lịch sử dự đoán.
- Không đưa thông tin cá nhân hoặc dữ liệu y tế nhạy cảm lên repository công khai khi chưa được phép.

## 📌 Định hướng phát triển

- Hoàn thiện quy trình quản lý và xác thực người dùng.
- Chuẩn hóa pipeline tiền xử lý và huấn luyện Machine Learning.
- Bổ sung đánh giá mô hình bằng các chỉ số phù hợp với dữ liệu y tế.
- Cải thiện khả năng theo dõi và quản lý lịch sử dự đoán.
- Tăng độ bao phủ của kiểm thử tự động.
- Hoàn thiện tài liệu API và hướng dẫn cài đặt.

## ⚠️ Giới hạn

Kết quả dự đoán phụ thuộc vào chất lượng dữ liệu, đặc trưng đầu vào và hiệu năng mô hình đã huấn luyện. Hệ thống chỉ hỗ trợ phân tích mang tính tham khảo, không được xem là công cụ chẩn đoán y khoa độc lập.

## 📄 Giấy phép

Dự án được phát triển phục vụ mục đích học tập và nghiên cứu cá nhân. Khi sử dụng hoặc phân phối lại mã nguồn và dữ liệu, cần tuân thủ giấy phép tương ứng của từng thư viện và bộ dữ liệu.
