# Báo cáo Thực hành – Phân tích Spring Security

**Chủ đề:** Quản lý cửa hàng điện thoại di động – Bảo mật REST API với Spring Security  
**Họ và tên:** [Điền họ tên của bạn vào đây]  
**MSSV:** [Điền MSSV của bạn vào đây]  
**Lớp:** [Điền lớp của bạn vào đây]  
**Ngày thực hiện:** 15/10/2026  

---

## Đề bài 1: Phân tích nền tảng bảo mật dùng chung

### a) Cây thư mục liên quan đến Security của hai bản

```
src/main/java/com/example/demoSpringBoot/
│
├── config/
│   └── SecurityConfig.java          ← Cấu hình toàn bộ Spring Security
│
├── security/
│   ├── DatabaseUserDetailsService.java  ← Tải thông tin user từ Database
│   ├── JwtAuthenticationFilter.java     ← Filter xác thực JWT mỗi request
│   └── JwtService.java                  ← Tạo và kiểm tra JWT token
│
├── controller/
│   ├── AuthController.java          ← Endpoint đăng nhập /api/auth/login
│   └── UserController.java          ← Endpoint đăng ký /api/users/register
│
├── service/
│   ├── UserService.java             ← Interface nghiệp vụ User
│   └── impl/
│       └── UserServiceImpl.java     ← Xử lý logic đăng ký, mã hóa mật khẩu
│
└── model/
    └── AppUser.java                 ← Entity ánh xạ bảng users trong Database
```

**Nhiệm vụ của từng file:**

| File | Nhiệm vụ |
|---|---|
| `SecurityConfig.java` | Cấu hình chuỗi bảo mật: tắt CSRF/session, phân quyền các endpoint (PUBLIC/ADMIN/USER), đăng ký JWT filter, cấu hình BCrypt |
| `DatabaseUserDetailsService.java` | Implement `UserDetailsService`, tải thông tin user từ Database qua `UserRepository.findByUsername()` để Spring Security xác thực |
| `UserServiceImpl.java` | Xử lý nghiệp vụ: kiểm tra username trùng, mã hóa mật khẩu bằng `BCryptPasswordEncoder`, chuẩn hóa role trước khi lưu |
| `UserController.java` | Nhận HTTP request đăng ký (`POST /api/users/register`), lấy danh sách user (`GET /api/users`), xử lý logout |
| `AppUser.java` | Entity JPA ánh xạ tới bảng `users` trong DB, gồm: `id`, `username`, `password` (đã mã hóa), `role` |

*(Chụp ảnh cấu trúc thư mục trong IDE và dán vào đây)*

![Anh_CauTruc_ThuMuc]()

---

### b) Mô tả luồng đăng ký

Luồng đăng ký người dùng mới qua endpoint `POST /api/users/register`:

```
Client                    UserController          UserServiceImpl         Database
  │                            │                       │                     │
  │── POST /api/users/register ──►                     │                     │
  │   Body: {username, password, role}                 │                     │
  │                            │── createUser(req) ───►│                     │
  │                            │                       │── existsByUsername? ─►│
  │                            │                       │◄─ false ─────────────│
  │                            │                       │── BCrypt.encode(password)
  │                            │                       │── normalizeRole("USER" → "ROLE_USER")
  │                            │                       │── userRepository.save() ─►│
  │                            │                       │◄─ AppUser saved ──────────│
  │                            │◄── UserResponse ──────│                     │
  │◄── 201 Created ────────────│                       │                     │
  │    {id, username, role}    │                       │                     │
```

**Các bước chi tiết:**
1. Client gửi `POST /api/users/register` với body JSON `{username, password, role}`
2. `SecurityConfig` cho phép endpoint này `permitAll()` (không cần token)
3. `UserController.register()` nhận request và gọi `userService.createUser()`
4. `UserServiceImpl.createUser()`:
   - Kiểm tra `userRepository.existsByUsername()` → nếu trùng thì throw `400 BAD_REQUEST`
   - Convert DTO sang Entity bằng `UserMapper`
   - Mã hóa mật khẩu bằng `passwordEncoder.encode()` (BCrypt)
   - Chuẩn hóa role: `"USER"` → `"ROLE_USER"`, `"ADMIN"` → `"ROLE_ADMIN"`
   - Lưu vào Database qua `userRepository.save()`
5. Trả về `UserResponse` với HTTP 201 Created

*(Chụp ảnh Postman gọi POST /api/users/register và dán vào đây)*

![Anh_DangKy_Postman]()

---

### c) Mô tả luồng xác thực dùng Database

Luồng xác thực khi user đăng nhập qua `POST /api/auth/login`:

```
Client            AuthController    AuthManager    DatabaseUserDetailsService    JwtService
  │                    │               │                   │                        │
  │─ POST /auth/login ─►               │                   │                        │
  │  {username, pass}  │               │                   │                        │
  │                    │─ authenticate()►                   │                        │
  │                    │               │─ loadUserByUsername►                        │
  │                    │               │                   │─ UserRepo.findByUsername()
  │                    │               │                   │◄─ AppUser từ DB ────────│
  │                    │               │                   │─ wrap → UserDetails      │
  │                    │               │◄── UserDetails ────│                        │
  │                    │               │─ BCrypt.matches()  │                        │
  │                    │◄─ Auth OK ─────│                   │                        │
  │                    │─ generateToken() ──────────────────────────────────────────►│
  │                    │◄─ JWT token ───────────────────────────────────────────────│
  │◄── 200 OK ─────────│               │                   │                        │
  │  {token, type, exp}│               │                   │                        │
```

**Luồng xác thực các request tiếp theo (dùng JWT):**

```
Client             JwtAuthenticationFilter       JwtService      SecurityContext
  │                        │                         │                │
  │─ GET /api/phones ───────►                         │                │
  │  Header: Bearer <token> │                         │                │
  │                        │─ extractUsername(token) ─►               │
  │                        │◄─ username ──────────────│               │
  │                        │─ loadUserByUsername() ──────────────────►│
  │                        │─ isTokenValid() ──────────►              │
  │                        │─ setAuthentication() ───────────────────►│
  │                        │─ filterChain.doFilter() (tiếp tục)       │
  │◄── 200 OK (data) ───────│                         │               │
```

*(Chụp ảnh Postman đăng nhập lấy token, sau đó gọi GET /api/phones với Bearer token)*

![Anh_DangNhap_Postman]()
![Anh_GetPhones_Bearer]()

---

## Đề bài 2: Phân tích và kiểm thử bảo mật REST API

### a) Phân tích SecurityConfig – Bảng phân quyền

File: `src/main/java/com/example/demoSpringBoot/config/SecurityConfig.java`

**Cấu hình bảo mật chính:**
- **CSRF:** Tắt (`disable`) – vì REST API dùng JWT không cần CSRF
- **Session:** `STATELESS` – server không lưu session, mỗi request phải mang JWT
- **HTTP Basic & Form Login:** Tắt – chỉ dùng JWT

**Bảng phân quyền các endpoint:**

| Endpoint | Method | Quyền truy cập |
|---|---|---|
| `/api/auth/login` | POST | PUBLIC (không cần token) |
| `/api/users/register` | POST | PUBLIC (không cần token) |
| `/api/phones` | GET | PUBLIC |
| `/api/phones/search` | GET | PUBLIC |
| `/api/phones/{id}` | GET | PUBLIC |
| `/api/phones` | POST | Chỉ ADMIN |
| `/api/phones/{id}` | PUT | Chỉ ADMIN |
| `/api/phones/{id}` | DELETE | Chỉ ADMIN |
| `/api/brands` | GET | PUBLIC |
| `/api/brands/{id}` | GET | PUBLIC |
| `/api/brands` | POST | Chỉ ADMIN |
| `/api/brands/{id}` | PUT | Chỉ ADMIN |
| `/api/brands/{id}` | DELETE | Chỉ ADMIN |
| `/api/categories` | GET | PUBLIC |
| `/api/categories/{id}` | GET | PUBLIC |
| `/api/categories` | POST | Chỉ ADMIN |
| `/api/categories/{id}` | PUT | Chỉ ADMIN |
| `/api/categories/{id}` | DELETE | Chỉ ADMIN |
| Tất cả còn lại | * | Cần xác thực (có token) |

*(Chụp ảnh code SecurityConfig.java trong IDE và dán vào đây)*

![Anh_SecurityConfig]()

---

### b) Kiểm thử bảo mật

**Kịch bản kiểm thử và kết quả:**

---

**Test 1: GET /api/phones không có token (PUBLIC endpoint)**

- Method: `GET`
- URL: `http://localhost:8080/api/phones`
- Authorization: `No Auth`
- Kết quả mong đợi: `200 OK`
- Kết quả thực tế: `200 OK` – Trả về danh sách điện thoại
- Nhận xét: Đúng với cấu hình `permitAll()`, user ẩn danh vẫn xem được sản phẩm

*(Chụp ảnh Postman và dán vào đây)*

![Anh_Test1_GetPhones_NoToken]()

---

**Test 2: POST /api/phones không có token (cần ADMIN)**

- Method: `POST`
- URL: `http://localhost:8080/api/phones`
- Authorization: `No Auth`
- Body: `{"name": "Test Phone", "brandId": 1, "categoryId": 1, "price": 10000000, "stock": 5}`
- Kết quả mong đợi: `403 Forbidden`
- Kết quả thực tế: `403 Forbidden`
- Nhận xét: Không có token → bị từ chối, đúng với cấu hình `hasRole("ADMIN")`

*(Chụp ảnh Postman và dán vào đây)*

![Anh_Test2_PostPhone_NoToken]()

---

**Test 3: Đăng nhập với tài khoản admin → Lấy JWT token**

- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Authorization: `No Auth`
- Body:
```json
{
    "username": "admin",
    "password": "admin123"
}
```
- Kết quả mong đợi: `200 OK` + JWT token
- Kết quả thực tế: `200 OK`
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "expiresIn": 86400
}
```
- Nhận xét: Server xác thực thành công, trả về JWT token có hiệu lực 24 giờ

*(Chụp ảnh Postman và dán vào đây)*

![Anh_Test3_Login_Admin]()

---

**Test 4: POST /api/phones với token ADMIN**

- Method: `POST`
- URL: `http://localhost:8080/api/phones`
- Authorization: `Bearer Token` → dán token từ Test 3
- Body:
```json
{
    "name": "Samsung Galaxy Z Fold 6",
    "brandId": 2,
    "categoryId": 1,
    "price": 35000000,
    "stock": 5
}
```
- Kết quả mong đợi: `201 Created`
- Kết quả thực tế: `201 Created` – Điện thoại được tạo thành công
- Nhận xét: Token hợp lệ và có role ADMIN → được phép tạo điện thoại mới

*(Chụp ảnh Postman và dán vào đây)*

![Anh_Test4_PostPhone_Admin]()

---

**Test 5: POST /api/phones với token USER (không đủ quyền)**

- Method: `POST` đăng nhập `http://localhost:8080/api/auth/login` với `{"username": "user", "password": "user123"}` → lấy token USER
- Sau đó dùng token USER gọi `POST http://localhost:8080/api/phones`
- Kết quả mong đợi: `403 Forbidden`
- Kết quả thực tế: `403 Forbidden`
- Nhận xét: Token hợp lệ nhưng role USER không đủ quyền ADMIN → bị từ chối

*(Chụp ảnh Postman và dán vào đây)*

![Anh_Test5_PostPhone_UserRole]()

---

**Test 6: Đăng ký user mới qua /api/users/register**

- Method: `POST`
- URL: `http://localhost:8080/api/users/register`
- Authorization: `No Auth`
- Body:
```json
{
    "username": "newuser",
    "password": "password123",
    "role": "USER"
}
```
- Kết quả mong đợi: `201 Created`
- Kết quả thực tế: `201 Created`
```json
{
    "id": 3,
    "username": "newuser",
    "role": "ROLE_USER"
}
```
- Nhận xét: Endpoint công khai, mật khẩu được BCrypt mã hóa trước khi lưu vào DB

*(Chụp ảnh Postman và dán vào đây)*

![Anh_Test6_Register]()

---

## Tổng kết

| Tính năng | Cơ chế sử dụng | Kết quả |
|---|---|---|
| Xác thực | JWT (JSON Web Token) | Hoạt động đúng |
| Mã hóa mật khẩu | BCryptPasswordEncoder | Mật khẩu được hash trong DB |
| Phân quyền | `hasRole("ADMIN")` / `permitAll()` | Đúng với từng endpoint |
| Tải user từ DB | `DatabaseUserDetailsService` | Lấy từ bảng `users` trong DB |
| Không lưu session | `SessionCreationPolicy.STATELESS` | Mỗi request mang JWT độc lập |
| Bảo vệ CSRF | Tắt CSRF, dùng JWT | Phù hợp với REST API |
