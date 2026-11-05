# CẨM NANG ĐỐI ĐÁP BẢO VỆ ĐỒ ÁN MÔN HỌC LẬP TRÌNH JAVA
## ĐỀ TÀI: QUẢN LÝ CỬA HÀNG ĐIỆN THOẠI DI ĐỘNG (PHONE STORE)
**Học phần:** Lập trình Java – Khoa Công nghệ Thông tin – Trường CĐ Công Thương TP.HCM  
**Giảng viên hướng dẫn:** Thầy Nguyễn Minh Tuấn  
**Nhóm thực hiện:** Nhóm 10 (Lớp: CCQ2411E)  
**Thành viên:** Võ Minh Quang (Trưởng nhóm) & Huỳnh Tấn Tài (Thành viên)

---

> [!IMPORTANT]
> **HƯỚNG DẪN DÀNH CHO BẠN (NGƯỜI MỚI HỌC / CHỦ YẾU DÙNG AI):**
> * Tài liệu này được biên soạn để bạn mở song song trên màn hình khi đi bảo vệ đồ án.
> * Khi Thầy chỉ vào màn hình hỏi *"Đoạn code này ở đâu, tác dụng gì?"*, bạn chỉ cần lướt nhanh mục tương ứng dưới đây, mở đúng file và đọc đúng câu trả lời mẫu đã được soạn sẵn cực kỳ ngắn gọn, dễ hiểu.

---

## MỤC LỤC NHANH
1. [Phân công công việc (Ai làm Backend, Ai làm Frontend)](#1-phân-công-công-việc)
2. [Kịch bản thuyết trình Luồng hoạt động chính của Website](#2-kịch-bản-thuyết-trình-luồng-hoạt-động-chính)
3. [Bộ 8 Câu hỏi "Sát sườn" Thầy hay soi mã nguồn nhất (Có sẵn File & Dòng Code)](#3-bộ-câu-hỏi-soi-code-thực-chiến)
   * [Câu 1: Nút "Mua ngay" bị xám/khóa khi hết hàng](#câu-1-nút-mua-ngay-bị-xámkhóa-khi-hết-hàng-code-ở-đâu)
   * [Câu 2: Đoạn code kiểm tra tồn kho & trừ kho kép trong Backend](#câu-2-đoạn-code-kiểm-tra-tồn-kho--trừ-kho-kép-ở-backend)
   * [Câu 3: Hệ thống có kiểm tra trùng lặp không (IMEI, SKU, Username)?](#câu-3-hệ-thống-có-kiểm-tra-trùng-lặp-không-imei-sku-username)
   * [Câu 4: Thanh toán VietQR PayOS & Xác thực chữ ký số Webhook HMAC-SHA256](#câu-4-cổng-thanh-toán-vietqr-payos--xác-thực-webhook-chống-giả-mạo)
   * [Câu 5: Phân quyền Spring Security & Người dùng thường có sửa/xóa được không?](#câu-5-phân-quyền-spring-security--người-dùng-thường-có-sửa-máy-được-không)
   * [Câu 6: Cách tính số ngày bảo hành còn lại theo IMEI](#câu-6-cách-tính-số-ngày-bảo-hành-còn-lại-theo-imei)
   * [Câu 7: Đổi màu sắc / dung lượng thì giá và ảnh đổi theo thế nào?](#câu-7-đổi-màu-sắc--dung-lượng-thì-giá-và-ảnh-đổi-theo-thế-nào)
   * [Câu 8: Cơ chế xóa mềm (Soft Delete) là gì, code ở đâu?](#câu-8-cơ-chế-xóa-mềm-soft-delete-nằm-ở-đâu)
4. [Bảng tra cứu nhanh File nguồn trong Project](#4-bảng-tra-cứu-nhanh-file-nguồn)
5. [Tuyệt chiêu ứng biến: Bị hỏi dùng AI & Thầy bắt sửa code tại chỗ](#5-tuyệt-chiêu-ứng-biến-khi-thầy-hỏi-xoáy)
6. [Kiểm tra lại Cuốn Báo cáo (Định dạng & Mục lục)](#6-kiểm-tra-lại-cuốn-báo-cáo)

---

## 1. PHÂN CÔNG CÔNG VIỆC
*(Theo đúng Phụ lục A - Bảng 4.6 trong cuốn Báo cáo đồ án)*

Khi Thầy hỏi: **"Nhóm phân công thế nào? Backend ai làm gì, Frontend ai làm gì?"**

Bạn trả lời ngắn gọn, rành mạch:
* **Võ Minh Quang (Trưởng nhóm):**
  * Phân tích thiết kế Cơ sở dữ liệu quan hệ (ERD 13 bảng), viết file seed CSDL `phonedb_seed_data.sql`.
  * **Backend:** Xây dựng tầng Repository và Service quản lý Sản phẩm & Biến thể cấu hình Master-Detail (`PhoneServiceImpl.java`).
  * **Backend:** Xây dựng nghiệp vụ Đặt hàng, tính toán chiết khấu Voucher và trừ tồn kho kép đồng thời bằng `@Transactional` (`OrderServiceImpl.java`).
  * Viết kịch bản kiểm thử tự động Unit Test JUnit 5 (`DemoApplicationTests.java`) và soạn thảo bản báo cáo.
* **Huỳnh Tấn Tài (Thành viên - bạn):**
  * **Backend:** Cấu hình hệ thống bảo mật vô trạng thái (Stateless) với Spring Security 6.x, cấp phát và thẩm định chuỗi JWT Token (`SecurityConfig.java`, `JwtAuthenticationFilter.java`).
  * **Backend:** Xây dựng tầng REST Controller cho toàn bộ hệ thống API (`AuthController`, `PhoneController`, `OrderController`, `PayOSController`, `WarrantyController`).
  * **Backend:** Tích hợp cổng thanh toán trực tuyến VietQR PayOS (sinh link Napas247, xác thực chữ ký số Webhook HMAC-SHA256 trong `PayOSServiceImpl.java`).
  * **Backend:** Xây dựng nghiệp vụ Quản lý & Tra cứu Bảo hành điện tử theo số IMEI (`WarrantyServiceImpl.java`).
  * **Frontend:** Hiện thực hóa toàn bộ giao diện người dùng React 19 SPA (Storefront mua hàng Apple Design System & Admin Dashboard).
  * Xây dựng bộ sưu tập kiểm thử Postman Collection (`PhoneStore_Postman_Collection.json`).

---

## 2. KỊCH BẢN THUYẾT TRÌNH LUỒNG HOẠT ĐỘNG CHÍNH
*(Show giao diện và thuyết minh theo đúng luồng - mất khoảng 2-3 phút)*

```
[Khách xem máy & Chọn màu/ROM] ──> [Đặt hàng & Quét VietQR PayOS] ──> [Webhook xác nhận tự động]
                                                                               │
[Khách tra cứu Bảo hành IMEI]  <── [Admin duyệt đơn & Kích hoạt IMEI] <────────┘
```

### Lời dẫn mẫu khi demo trước hội đồng:
> *"Dạ kính thưa Thầy, đề tài của nhóm em là **Website Bán Điện Thoại Tích Hợp Thanh Toán VietQR Và Bảo Hành Điện Tử Theo IMEI**. Em xin phép demo luồng nghiệp vụ cốt lõi xuyên suốt từ phía khách hàng đến quản trị viên:"*

1. **Bước 1 (Chọn máy & Đổi biến thể):**  
   * Khách vào trang chủ -> Bấm chọn một sản phẩm (VD: iPhone 16 Pro Max).
   * Trên màn hình chi tiết, khách bấm chọn **Màu sắc (Titan Sa Mạc)** và **Dung lượng (256GB)**.
   * *Nhấn mạnh với thầy:* Giao diện tự động cập nhật giá bán chính xác theo biến thể và đổi ảnh thực tế của màu đó. Nếu một phiên bản hết hàng trong kho, nút mua sẽ tự động bị khóa lại.
2. **Bước 2 (Đặt hàng & Áp Voucher):**  
   * Bấm **"MUA NGAY"** chuyển sang trang Thanh toán (`/checkout`).
   * Nhập Họ tên, Số điện thoại, Địa chỉ nhận hàng.
   * Nhập mã giảm giá: `FREESHIP` (giảm 30.000đ tiền ship) hoặc `GIAM500K` (giảm 500.000đ).
   * Chọn phương thức thanh toán: **Chuyển khoản VietQR (PayOS)** -> Bấm **Đặt hàng**.
3. **Bước 3 (Thanh toán số tự động):**  
   * Hệ thống hiển thị mã VietQR Napas247 kèm số tiền chính xác và cú pháp chuyển khoản.
   * Khách dùng App ngân hàng quét mã chuyển tiền.
   * Khi tiền vào tài khoản, cổng PayOS gửi ngay một tín hiệu **Webhook bất đồng bộ** về máy chủ Spring Boot. Backend xác minh chữ ký bảo mật **HMAC-SHA256** và tự động cập nhật đơn hàng thành `PAID` (Đã thanh toán), trạng thái `CONFIRMED` mà Admin không cần xác nhận thủ công.
4. **Bước 4 (Admin Quản trị & Kích hoạt bảo hành):**  
   * Đăng nhập tài khoản Admin (`admin` / `admin123`) -> Vào trang Quản trị (`/admin`).
   * Vào danh sách Đơn hàng xem đơn mới -> Chuyển trạng thái sang `DELIVERED` (Đã giao hàng).
   * Vào mục **Bảo hành (E-Warranty)** -> Bấm "Kích hoạt bảo hành mới" -> Nhập số IMEI (15 số), gắn tên khách và thời hạn bảo hành 12 tháng.
5. **Bước 5 (Khách tra cứu bảo hành công khai):**  
   * Khách hàng quay lại website, không cần đăng nhập, vào trang Tra cứu bảo hành.
   * Nhập số IMEI vừa mua (VD: `358912345678901`) -> Hệ thống hiển thị Thẻ bảo hành điện tử xanh lá `ACTIVE` kèm số ngày bảo hành chính hãng còn lại.

---

## 3. BỘ CÂU HỎI SOI CODE THỰC CHIẾN
*(Thầy chỉ vào giao diện nào hỏi, mở đúng file đó ra và đọc câu trả lời)*

---

### CÂU 1: Nút "MUA NGAY" bị xám/khóa khi hết hàng, code ở đâu?
* **File Frontend:** `frontend/src/storefront/components/ProductSpecsConfigurator.jsx`
* **Vị trí dòng code:**
  * **Dòng 53:**  
    ```javascript
    const inStock = matchedVariant ? (matchedVariant.stockQuantity > 0) : true;
    ```
  * **Dòng 309 và 338:**  
    ```javascript
    <button disabled={!inStock} style={{ cursor: inStock ? "pointer" : "not-allowed" }}>
      MUA NGAY
    </button>
    ```
* **Kịch bản trả lời Thầy:**
  > *"Dạ thưa Thầy, khi khách click chọn Màu sắc và Dung lượng, hàm `.find()` sẽ đối chiếu để lấy ra biến thể `matchedVariant`. Biến `inStock` kiểm tra thuộc tính tồn kho `stockQuantity > 0`. Nếu số lượng tồn kho bằng 0 thì `inStock = false`, nút bấm sẽ nhận thuộc tính HTML `disabled={!inStock}` và con trỏ chuột đổi thành `not-allowed`, ngăn khách không thể bấm đặt mua sản phẩm đã hết hàng ạ."*

---

### CÂU 2: Đoạn code kiểm tra tồn kho & trừ kho kép ở Backend?
* **File Backend:** `src/main/java/com/example/demoSpringBoot/service/impl/OrderServiceImpl.java`
* **Vị trí dòng code (Dòng 124 - 135):**
  ```java
  if (variant.getStockQuantity() < itemReq.getQuantity()) {
      throw new BadRequestException("Sản phẩm " + (variant.getPhone() != null ? variant.getPhone().getName() : "") +
              " không đủ hàng tồn kho.");
  }
  // 1. Trừ tồn kho biến thể con
  variant.setStockQuantity(variant.getStockQuantity() - itemReq.getQuantity());
  variantRepository.save(variant);

  // 2. Đồng bộ trừ tồn kho dòng máy cha
  Phone p = variant.getPhone();
  if (p != null) {
      p.setQuantity(Math.max(0, p.getQuantity() - itemReq.getQuantity()));
      phoneRepository.save(p);
  }
  ```
* **Kịch bản trả lời Thầy:**
  > *"Dạ thưa Thầy, đây là cơ chế **Đồng bộ trừ tồn kho kép**:*
  > * *Hệ thống kiểm tra nếu khách đặt mua vượt quá `stockQuantity` trong kho thì ném `BadRequestException` để chặn lại ngay.*
  > * *Nếu đủ hàng, hệ thống trừ tồn kho của biến thể cấu hình trước, sau đó trừ tiếp tổng tồn kho của dòng máy cha `Phone`.*
  > * *Trên đầu class có khai báo `@Transactional`. Nếu xảy ra bất kỳ lỗi nào giữa chừng, Spring sẽ tự động Rollback toàn bộ giao dịch, đảm bảo CSDL không bao giờ bị lệch kho hoặc sinh ra đơn rác ạ."*

---

### CÂU 3: Hệ thống có kiểm tra trùng lặp không (IMEI, SKU, Username)?
* **1. Kiểm tra trùng số IMEI bảo hành:**
  * **File:** `src/main/java/com/example/demoSpringBoot/service/impl/WarrantyServiceImpl.java` (Dòng 45 - 48):
    ```java
    if (warrantyRepository.findByImeiNumber(request.getImeiNumber().trim()).isPresent()) {
        throw new BadRequestException("Số IMEI này đã được kích hoạt bảo hành trong hệ thống.");
    }
    ```
  * *Ở CSDL:* Cột `imei_number` trong bảng `warranties` có ràng buộc `UNIQUE`.
* **2. Kiểm tra trùng mã SKU biến thể:**
  * **File Entity:** `src/main/java/com/example/demoSpringBoot/model/PhoneVariant.java` -> Cột `sku` có `@Column(unique = true)`. Nếu Admin nhập trùng SKU của biến thể khác, Hibernate và MySQL sẽ chặn lại ngay.
* **3. Kiểm tra trùng Tên đăng nhập:**
  * **File:** `src/main/java/com/example/demoSpringBoot/service/impl/UserServiceImpl.java` -> Dùng `userRepository.findByUsername()` để kiểm tra trước khi tạo tài khoản mới.

---

### CÂU 4: Cổng thanh toán VietQR PayOS & Xác thực Webhook chống giả mạo?
* **File Backend:** `src/main/java/com/example/demoSpringBoot/service/impl/PayOSServiceImpl.java`
* **Vị trí dòng code:**
  * **Tạo link VietQR (Dòng 68 - 75):** Sắp xếp các tham số `amount`, `orderCode`, `returnUrl` theo thứ tự alphabet rồi tạo chữ ký số bằng thuật toán:
    ```java
    String signature = hmacSha256(signatureData, checksumKey);
    ```
  * **Thẩm định Webhook (Dòng 113 - 143):**
    ```java
    public boolean verifyWebhook(Map<String, Object> webhookBody) {
        // Lấy data từ PayOS, sort key từ A-Z, băm lại bằng checksumKey bí mật
        String calculated = hmacSha256(dataString.toString(), checksumKey);
        // So sánh với chữ ký PayOS gửi kèm
        return calculated.equalsIgnoreCase(receivedSignature);
    }
    ```
* **Kịch bản trả lời Thầy:**
  > *"Dạ thưa Thầy, để chống kẻ gian giả mạo gói tin Webhook báo đã chuyển tiền, hệ thống sử dụng cơ chế chữ ký điện tử **HMAC-SHA256**. Khi PayOS gửi Webhook về, hàm `verifyWebhook` gom các trường dữ liệu lại, sắp xếp theo thứ tự bảng chữ cái và dùng mã khóa bí mật `checksumKey` để băm lại. Nếu chuỗi băm tính ra trùng khớp với `signature` của PayOS thì hàm `handleWebhook` mới cập nhật đơn hàng thành `PAID` và `CONFIRMED` ạ."*

---

### CÂU 5: Phân quyền Spring Security & Người dùng thường có sửa máy được không?
* **File Backend:** `src/main/java/com/example/demoSpringBoot/config/SecurityConfig.java`
* **Vị trí dòng code (Dòng 768 - 778):**
  ```java
  .requestMatchers(HttpMethod.GET, "/api/phones/**").permitAll()
  .requestMatchers(HttpMethod.POST, "/api/phones/**", "/api/variants/**").hasRole("ADMIN")
  .requestMatchers(HttpMethod.PUT, "/api/phones/**", "/api/variants/**").hasRole("ADMIN")
  .requestMatchers(HttpMethod.DELETE, "/api/phones/**").hasRole("ADMIN")
  .requestMatchers("/api/cart/**", "/api/orders/my-orders").authenticated()
  ```
* **Kịch bản trả lời Thầy:**
  > *"Dạ, hệ thống áp dụng bảo mật theo vai trò (RBAC):*
  > * *Khách vãng lai chỉ có quyền `GET` để xem danh sách điện thoại.*
  > * *Các hành động can thiệp dữ liệu như thêm (`POST`), sửa (`PUT`), xóa (`DELETE`) sản phẩm đều bắt buộc phải có vai trò `ROLE_ADMIN`.*
  > * *Nếu tài khoản User thường cố gọi API quản trị, bộ lọc `JwtAuthenticationFilter` giải mã token, phát hiện thiếu quyền sẽ trả về ngay mã lỗi **403 Forbidden** ạ."*

---

### CÂU 6: Cách tính số ngày bảo hành còn lại theo IMEI?
* **File Backend:** `src/main/java/com/example/demoSpringBoot/service/impl/WarrantyServiceImpl.java`
* **Vị trí dòng code (Dòng 76 - 86):**
  ```java
  LocalDate today = LocalDate.now();
  if (today.isAfter(warranty.getEndDate())) {
      daysRemaining = 0;
      status = "EXPIRED";
  } else {
      daysRemaining = ChronoUnit.DAYS.between(today, warranty.getEndDate());
  }
  ```
* **Kịch bản trả lời Thầy:**
  > *"Dạ, em so sánh ngày hiện tại `LocalDate.now()` với ngày hết hạn `warranty.getEndDate()`. Nếu đã qua ngày hết hạn thì gán trạng thái `EXPIRED` và số ngày còn lại bằng 0. Nếu còn hạn thì dùng hàm `ChronoUnit.DAYS.between(today, endDate)` để tính chính xác số ngày còn lại gửi về Frontend hiển thị cho khách xem ạ."*

---

### CÂU 7: Đổi Màu sắc / Dung lượng thì giá và ảnh đổi theo thế nào?
* **File Frontend:** `frontend/src/storefront/components/ProductSpecsConfigurator.jsx`
* **Vị trí dòng code:**
  * **Dòng 44 - 52:**  
    ```javascript
    const matchedVariant = variants.find(
        (v) => (v.color || "").trim().toLowerCase() === (selectedColor || "").trim().toLowerCase() &&
               (v.storage || "").trim().toLowerCase() === (selectedStorage || "").trim().toLowerCase()
    );
    const currentPrice = (matchedVariant && matchedVariant.price > 0) ? matchedVariant.price : basePrice;
    ```
  * **Dòng 59 - 61:** Lấy ảnh tương ứng theo màu được chọn:
    ```javascript
    const currentDisplayImage = getSmartColorImage(productName, selectedColor, ...) || productImageUrl;
    ```
* **Kịch bản trả lời Thầy:**
  > *"Dạ thưa Thầy, trong component này có 2 State là `selectedColor` và `selectedStorage`. Khi khách click nút màu hay dung lượng, State cập nhật khiến React re-render. Hàm `.find()` lập tức quét mảng `variants` để lấy ra đối tượng biến thể khớp cả 2 tiêu chí. Sau đó `currentPrice` lấy trực tiếp giá riêng `matchedVariant.price` và ảnh đại diện chuyển sang ảnh của màu đó ạ."*

---

### CÂU 8: Cơ chế xóa mềm (Soft Delete) nằm ở đâu?
* **File Backend:** `src/main/java/com/example/demoSpringBoot/service/impl/PhoneServiceImpl.java`
* **Vị trí dòng code (Dòng 100 - 104):**
  ```java
  Phone existingPhone = getExistingPhone(id);
  // Xóa mềm: Chuyển status = INACTIVE để bảo toàn toàn vẹn dữ liệu đơn hàng và lịch sử nhập kho
  existingPhone.setStatus("INACTIVE");
  phoneRepository.save(existingPhone);
  ```
* **Kịch bản trả lời Thầy:**
  > *"Dạ thưa Thầy, hệ thống không dùng lệnh `DELETE` xóa hẳn khỏi CSDL vì điện thoại đó có thể đã nằm trong các đơn hàng cũ. Thay vào đó, nhóm áp dụng kỹ thuật **Xóa mềm (Soft Delete)** bằng cách chuyển `status = INACTIVE`. Khi lấy danh sách bán ngoài trang chủ, hệ thống chỉ lọc những máy có `status = ACTIVE` để không ảnh hưởng đến dữ liệu lịch sử ạ."*

---

## 4. BẢNG TRA CỨU NHANH FILE NGUỒN

Khi Thầy gọi tên chức năng bất kỳ, hãy mở đúng file theo bảng dưới đây:

| Chức năng / Nghiệp vụ | Tầng xử lý | Tên file cần mở |
|---|:---:|---|
| **Cấu hình chuỗi bảo mật & Phân quyền URL** | Backend Config | `src/main/java/.../config/SecurityConfig.java` |
| **Giải mã Token JWT trên mỗi Request** | Backend Security | `src/main/java/.../security/JwtAuthenticationFilter.java` |
| **Xử lý Đặt hàng, Trừ tồn kho kép & Voucher** | Backend Service | `src/main/java/.../service/impl/OrderServiceImpl.java` |
| **Tạo link VietQR & Thẩm định Webhook HMAC** | Backend Service | `src/main/java/.../service/impl/PayOSServiceImpl.java` |
| **Kích hoạt & Tính ngày bảo hành IMEI** | Backend Service | `src/main/java/.../service/impl/WarrantyServiceImpl.java` |
| **Quản lý danh sách máy & Xóa mềm** | Backend Service | `src/main/java/.../service/impl/PhoneServiceImpl.java` |
| **Bộ kiểm thử tự động Unit Test (JUnit 5)** | Backend Test | `src/test/java/com/example/demo/DemoApplicationTests.java` |
| **Script khởi tạo CSDL 13 bảng** | Database SQL | `phonedb_seed_data.sql` |
| **Giao diện chọn Màu/Dung lượng & Khóa nút mua** | Frontend Component| `frontend/src/storefront/components/ProductSpecsConfigurator.jsx` |
| **Giao diện Giỏ hàng & Thanh toán Checkout** | Frontend Page | `frontend/src/storefront/CheckoutPage.jsx` |
| **Giao diện Trang chủ & Banner** | Frontend Page | `frontend/src/storefront/HomePage.jsx` |
| **Bảng điều khiển Quản trị viên (Admin)** | Frontend Admin | `frontend/src/admin/AdminLayout.jsx` |

---

## 5. TUYỆT CHIÊU ỨNG BIẾN KHI THẦY HỎI XOÁY

### Tình huống 1: Thầy hỏi "Đoạn code này em tự viết hay dùng AI?"
* ❌ **Không nên nói:** *"Dạ em copy hoàn toàn từ AI/ChatGPT ra ạ."*
* ❌ **Không nên chối:** *"Dạ 100% nhóm em tự gõ từng chữ không dùng công cụ nào."* (Thầy hỏi sâu vài câu lý thuyết là bị lộ).
* ✅ **Cách trả lời chuẩn mực:**
  > *"Dạ kính thưa Thầy, cấu trúc kiến trúc phân tầng (Controller - Service - Repository), thiết kế mô hình CSDL và luồng nghiệp vụ là do nhóm em tự phân tích và thảo luận. Trong quá trình lập trình, nhóm có sử dụng AI làm trợ lý để gợi ý cú pháp, tra cứu cú pháp Spring Boot 3.5 và viết mẫu các ca kiểm thử. Mọi đoạn code trong dự án nhóm em đều đã tự tay chạy thử, gỡ lỗi và nắm vững luồng hoạt động của nó ạ."*

### Tình huống 2: Thầy bắt sửa code trực tiếp tại chỗ
Thầy thường hay bắt sửa những thứ nhỏ để xem bạn có biết file nằm ở đâu không:
1. **Thầy bảo: "Đổi phí vận chuyển mặc định từ 30.000đ thành 50.000đ xem nào?"**
   * Mở ngay file: `src/main/java/com/example/demoSpringBoot/service/impl/OrderServiceImpl.java`
   * Tìm dòng **93**: Sửa số `30000.0` thành `50000.0` -> Bấm Lưu (`Ctrl + S`).
2. **Thầy bảo: "Đổi câu thông báo khi hết hàng thành câu khác?"**
   * Mở file: `src/main/java/com/example/demoSpringBoot/service/impl/OrderServiceImpl.java`
   * Tìm dòng **125**: Sửa chuỗi trong `throw new BadRequestException(...)` -> Bấm Lưu.
3. **Thầy bảo: "Đổi màu nút Mua ngay trên giao diện từ màu đỏ sang màu xanh lá?"**
   * Mở file: `frontend/src/storefront/components/ProductSpecsConfigurator.jsx`
   * Tìm dòng **315**: Sửa `backgroundColor: "#d70018"` thành `backgroundColor: "#34c759"`.

---

## 6. KIỂM TRA LẠI CUỐN BÁO CÁO
*(Lưu ý theo lời dặn của các nhóm đi trước: Thầy rất hay soi mục lục và bảng biểu)*

Trước khi in hoặc nộp file báo cáo `BAO_CAO_DO_AN_PHONE_STORE.md`, hãy kiểm tra lại:
1. **Các mục phân cấp đã chuẩn thứ tự:**
   * `Chương 1` -> `1.1` -> `1.2` -> `1.3` -> `1.3.1` -> `1.3.2` -> `1.4`.
   * Tuyệt đối không để xảy ra tình trạng nhảy số như `1` nhảy sang `1.2` mà thiếu `1.1`.
2. **Đã có đầy đủ Danh mục Bảng & Sơ đồ:**
   * Bảng 4.1: Công nghệ sử dụng.
   * Bảng 4.2: Phân rã chức năng theo vai trò.
   * Bảng 4.3: Thiết kế CSDL phonedb.
   * Bảng 4.4: Danh mục REST API.
   * Bảng 4.5: Bảng 40 ca kiểm thử.
   * Bảng 4.6: Bảng phân công nhiệm vụ (Phụ lục A).
3. **Tài khoản test sẵn:** Ghi sẵn tài khoản `admin / admin123` và mã IMEI `358912345678901` ra giấy nháp để nhập nhanh khi thầy yêu cầu demo.

---
*Chúc bạn và nhóm có một buổi bảo vệ đồ án thành công rực rỡ và đạt điểm tối đa!*

