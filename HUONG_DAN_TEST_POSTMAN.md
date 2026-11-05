# Hướng dẫn Kiểm thử API (Postman / cURL) - Phone Store Management

Hệ thống đã triển khai đầy đủ kiến trúc chuẩn theo code mẫu:
- **Xác thực**: JWT Stateless Token (`/api/auth/login`, `/api/users/register`).
- **Phân quyền**:
  - `ROLE_ADMIN`: Toàn quyền thêm, sửa, xóa Phone, Brand, Category, xem danh sách user.
  - `ROLE_USER` / Khách chưa đăng nhập: Xem danh sách Phone, Brand, Category, tìm kiếm Phone theo tên.
- **Tài khoản mặc định được khởi tạo tự động khi chạy**:
  - Admin: `username`: **admin** | `password`: **admin123**
  - User: `username`: **user** | `password`: **user123**

---

## 1. Xác thực & Quản lý Người dùng

### 1.1 Đăng ký tài khoản mới (`/api/users/register`)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/users/register`
- **Body** (raw JSON):
```json
{
  "username": "user1",
  "password": "123456",
  "role": "USER"
}
```

### 1.2 Đăng nhập lấy Token (`/api/auth/login`)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/login`
- **Body** (raw JSON) - Test với Admin:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Response trả về**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresInSeconds": 86400
}
```
> **Lưu ý**: Copy chuỗi `token` này để dán vào tab **Authorization** -> chọn **Bearer Token** trong Postman cho các request cần quyền Admin.

---

## 2. API Quản lý Điện thoại (Phones)

### 2.1 Lấy danh sách điện thoại (Public)
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/phones`
- **Auth**: None

### 2.2 Tìm kiếm điện thoại theo tên (Public)
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/phones/search?name=iPhone`
- **Auth**: None

### 2.3 Xem chi tiết điện thoại theo ID (Public)
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/phones/1`
- **Auth**: None

### 2.4 Thêm điện thoại mới (Yêu cầu ROLE_ADMIN)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/phones`
- **Headers**: `Authorization: Bearer <token_admin>`
- **Body** (raw JSON):
```json
{
  "name": "iPhone 16 Pro Max",
  "brandId": 1,
  "categoryId": 1,
  "price": 34990000,
  "quantity": 20
}
```

### 2.5 Cập nhật điện thoại (Yêu cầu ROLE_ADMIN)
- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/phones/1`
- **Headers**: `Authorization: Bearer <token_admin>`
- **Body** (raw JSON):
```json
{
  "name": "iPhone 15 Pro Max 256GB",
  "brandId": 1,
  "categoryId": 1,
  "price": 28500000,
  "quantity": 12
}
```

### 2.6 Xóa điện thoại (Yêu cầu ROLE_ADMIN)
- **Method**: `DELETE`
- **URL**: `http://localhost:8080/api/phones/1`
- **Headers**: `Authorization: Bearer <token_admin>`

---

## 3. API Quản lý Thương hiệu (Brands) & Danh mục (Categories)

### 3.1 Thương hiệu (Brand)
- `GET http://localhost:8080/api/brands` (Xem tất cả)
- `GET http://localhost:8080/api/brands/{id}` (Xem chi tiết)
- `POST http://localhost:8080/api/brands` (Thêm - Yêu cầu Admin)
  ```json
  {
    "name": "Sony",
    "description": "Sony Corporation Japan"
  }
  ```
- `PUT http://localhost:8080/api/brands/{id}` (Cập nhật - Yêu cầu Admin)
- `DELETE http://localhost:8080/api/brands/{id}` (Xóa - Yêu cầu Admin)

### 3.2 Danh mục (Category)
- `GET http://localhost:8080/api/categories` (Xem tất cả)
- `GET http://localhost:8080/api/categories/{id}` (Xem chi tiết)
- `POST http://localhost:8080/api/categories` (Thêm - Yêu cầu Admin)
  ```json
  {
    "name": "Tablet",
    "description": "Máy tính bảng"
  }
  ```
- `PUT http://localhost:8080/api/categories/{id}` (Cập nhật - Yêu cầu Admin)
- `DELETE http://localhost:8080/api/categories/{id}` (Xóa - Yêu cầu Admin)

---

## 4. API Biến thể Điện thoại (Phone Variants)

### 4.1 Lấy danh sách biến thể của 1 dòng máy (Public)
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/phones/1/variants`
- **Auth**: None
- **Mô tả**: Xem các phiên bản màu sắc, RAM, bộ nhớ, giá bán và số lượng tồn kho của máy ID = 1 (iPhone 15 Pro).

### 4.2 Thêm biến thể mới cho điện thoại (Yêu cầu ROLE_ADMIN)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/phones/1/variants`
- **Headers**: `Authorization: Bearer <token_admin>`
- **Body** (raw JSON):
```json
{
  "sku": "IP15P-512-BLU",
  "color": "Titan Xanh",
  "storage": "512GB",
  "ram": "8GB",
  "price": 31990000,
  "stockQuantity": 8,
  "thumbnailUrl": "https://example.com/ip15-blue.jpg"
}
```

---

## 5. API Giỏ hàng (Cart)

> Tất cả API giỏ hàng yêu cầu Header: `Authorization: Bearer <token_user>` (hoặc admin)

### 5.1 Xem giỏ hàng của tôi
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/cart`

### 5.2 Thêm sản phẩm vào giỏ hàng
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/cart/items`
- **Body** (raw JSON):
```json
{
  "variantId": 1,
  "quantity": 2
}
```

### 5.3 Cập nhật số lượng món hàng trong giỏ
- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/cart/items/1?quantity=3`

### 5.4 Xóa món hàng khỏi giỏ
- **Method**: `DELETE`
- **URL**: `http://localhost:8080/api/cart/items/1`

---

## 6. API Đặt hàng & Quản lý Hóa đơn (Orders)

### 6.1 Tạo đơn hàng / Thanh toán (Checkout)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/orders`
- **Headers**: `Authorization: Bearer <token_user>`
- **Body** (raw JSON - Mua trực tiếp hoặc nếu để `items: []` sẽ checkout toàn bộ từ giỏ hàng):
```json
{
  "recipientName": "Nguyễn Văn Khách",
  "recipientPhone": "0987654321",
  "shippingAddress": "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
  "paymentMethod": "COD",
  "note": "Giao hàng trong giờ hành chính",
  "items": [
    {
      "variantId": 1,
      "quantity": 1
    }
  ]
}
```

### 6.2 Xem lịch sử đơn hàng của tôi
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/orders/my-orders`
- **Headers**: `Authorization: Bearer <token_user>`

### 6.3 Xem danh sách toàn bộ đơn hàng (Yêu cầu ROLE_ADMIN)
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/orders`
- **Headers**: `Authorization: Bearer <token_admin>`

### 6.4 Quản trị viên cập nhật trạng thái đơn hàng (Yêu cầu ROLE_ADMIN)
- **Method**: `PUT`
- **URL**: `http://localhost:8080/api/orders/1/status`
- **Headers**: `Authorization: Bearer <token_admin>`
- **Body** (raw JSON):
```json
{
  "status": "SHIPPING",
  "paymentStatus": "PAID"
}
```
*(Các trạng thái: `PENDING`, `CONFIRMED`, `SHIPPING`, `COMPLETED`, `CANCELLED`)*

---

## 7. API Tra cứu & Kích hoạt Bảo hành (Warranties)

### 7.1 Tra cứu bảo hành bằng số IMEI (Public - Ai cũng tra được)
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/warranties/check?imei=358912345678901`
- **Auth**: None
- **Response**: Trả về tên máy, ngày mua, hạn bảo hành và số ngày bảo hành còn lại.

### 7.2 Tra cứu bảo hành bằng số điện thoại khách hàng (Public)
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/warranties/phone?phone=0987654321`
- **Auth**: None

### 7.3 Kích hoạt bảo hành khi xuất máy (Yêu cầu ROLE_ADMIN)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/warranties`
- **Headers**: `Authorization: Bearer <token_admin>`
- **Body** (raw JSON):
```json
{
  "imeiNumber": "358912345678999",
  "productName": "Galaxy S24 Ultra",
  "variantName": "256GB - Xám Titan",
  "customerName": "Trần Thị Lan",
  "customerPhone": "0912345678",
  "orderCode": "DH-20261020-002",
  "note": "Máy phân phối chính hãng Samsung Việt Nam"
}
```

---

## 8. Cách chạy ứng dụng
Chạy lệnh trực tiếp trong thư mục dự án:
```powershell
.\mvnw.cmd spring-boot:run
```
Cơ sở dữ liệu MySQL `phonedb` sẽ được Hibernate tự động cập nhật cấu trúc toàn bộ 13 bảng và tự động sinh dữ liệu mẫu ban đầu (sản phẩm, biến thể, tài khoản, nhà cung cấp, bảo hành).
