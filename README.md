# Distributed Key-Value Store

Đây là hệ thống lưu trữ Key-Value phân tán với cơ chế đồng bộ dữ liệu (Replication) giữa các node. Hệ thống bao gồm các node server chạy bằng Node.js và một giao diện client trên nền tảng web (HTML/CSS/JS) để tương tác trực tiếp.

## 1. Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/) (phiên bản 14.x hoặc mới hơn)
- Trình duyệt web (Chrome, Firefox, Edge, v.v.)

## 2. Cài đặt (Installation)
Mở terminal/command prompt tại thư mục gốc của dự án (`Distribute_kv`) và chạy lệnh sau để cài đặt các thư viện phụ thuộc (`express`, `axios`):

```bash
npm install
```

## 3. Cách chạy hệ thống (Running the System)

Hệ thống được cấu hình mặc định (trong `config.js`) để chạy 3 node tương ứng với 3 cổng: `5001`, `5002` và `5003`. Cần khởi chạy cả 3 node này.

Mở 3 terminal khác nhau (hoặc chia tab) tại thư mục dự án và chạy lần lượt các lệnh sau:

**Terminal 1 (Node 1):**
```bash
node node/server.js 5001
```

**Terminal 2 (Node 2):**
```bash
node node/server.js 5002
```

**Terminal 3 (Node 3):**
```bash
node node/server.js 5003
```

*(Lưu ý: Phải chạy đúng cổng đã được thiết lập trong `config.js`, nếu không node sẽ báo lỗi "Node not found").*

**Chạy Giao diện Client:**
Sau khi các server đã khởi chạy thành công, chỉ cần mở file `client/index.html` bằng trình duyệt web bằng cách:
- Click đúp chuột vào file `client/index.html` trong thư mục.
- Hoặc sử dụng tiện ích như **Live Server** trên VS Code.

## 4. Cách kiểm thử (Testing the System)

Hệ thống có thể được kiểm thử thông qua giao diện Client cung cấp sẵn hoặc sử dụng Postman/cURL.

### Kiểm thử qua giao diện Web Client (Khuyên dùng)
1. Trên giao diện, sẽ thấy thông tin kết nối và quản lý Key-Value.
2. **Thêm dữ liệu (PUT/POST):** Nhập `Key` và `Value`, sau đó nhấn lưu. Dữ liệu sẽ được gửi tới một trong các node và tự động replicate (sao chép) sang node khác theo hệ số sao chép (`REPLICATION_FACTOR = 2`).
3. **Lấy dữ liệu (GET):** Nhập `Key` và tra cứu để xem giá trị được trả về từ hệ thống.
4. **Kiểm tra Snapshot/Dữ liệu của các node:** Cập nhật để xem dữ liệu hiện có đang phân bố như thế nào trên từng node để đảm bảo cơ chế đồng bộ hoạt động chính xác.

### Kiểm thử bằng Postman
Có thể sử dụng Postman để gọi trực tiếp API tới bất kỳ node nào (ví dụ cổng `5001`).

- **Kiểm tra trạng thái (Ping):**
  - **Method:** `GET`
  - **URL:** `http://localhost:5001/ping`

- **Thêm Key-Value:**
  - **Method:** `POST`
  - **URL:** `http://localhost:5001/put`
  - **Body:** Chọn tab **Body** -> **raw** -> format **JSON** và nhập:
    ```json
    {
      "key": "testKey",
      "value": "testValue"
    }
    ```

- **Lấy Snapshot của toàn bộ cụm:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5001/snapshot`

- **Lấy Dữ liệu local của node:**
  - **Method:** `GET`
  - **URL:** `http://localhost:5001/local-snapshot`

## 5. Cấu trúc dự án
- `config.js`: Chứa cấu hình danh sách các node, địa chỉ URL và hệ số sao chép (Replication Factor).
- `node/`: Chứa mã nguồn của server (Express.js, heartbeat, routes, và lưu trữ).
- `client/`: Chứa mã nguồn giao diện người dùng (HTML, CSS, JS).
- `package.json`: Chứa thông tin project và các dependencies.
