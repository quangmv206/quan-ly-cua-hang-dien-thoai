# Báo cáo Thực hành 4.4 – Phương thức truy vấn - Unitest

**Chủ đề:** Quản lý cửa hàng điện thoại di động
**Họ và tên:** [Điền họ tên của bạn vào đây]
**MSSV:** [Điền MSSV của bạn vào đây]

---

## 1. Yêu cầu nộp bài
### Ảnh chụp màn hình kết quả chạy chương trình cho từng chức năng
*(Vui lòng chạy file DemoApplication.java, dùng Postman hoặc trình duyệt gọi các API CRUD tới `http://localhost:8080/api/phones`, `http://localhost:8080/api/brands`, `http://localhost:8080/api/categories` và dán ảnh chụp màn hình vào đây)*

![Anh_Chay_Chuong_Trinh_Phones]()
![Anh_Chay_Chuong_Trinh_Brands]()
![Anh_Chay_Chuong_Trinh_Categories]()

### Ảnh kiểm thử chức năng (Unit test)
*(Vui lòng chạy file DemoApplicationTests.java, chụp kết quả Passed xanh và dán vào đây)*

![Anh_Unit_Test]()

---

## 2. Đề bài 1: Phân tích folder hướng dẫn 4.4

### a) Chỉ ra chỗ lưu các câu phương thức truy vấn và cho biết chức năng của từng phương thức

*   **Vị trí lưu:** Các phương thức truy vấn được định nghĩa thông qua các interface kế thừa từ `JpaRepository` tại thư mục `src/main/java/com/example/demoSpringBoot/repository/`. Dự án sử dụng 3 Repository:
    1. `PhoneRepository.java`: Truy vấn dữ liệu Điện thoại.
    2. `BrandRepository.java`: Truy vấn dữ liệu Hãng.
    3. `CategoryRepository.java`: Truy vấn dữ liệu Danh mục.

*(Dán ảnh chụp cấu trúc thư mục Repository hoặc code file PhoneRepository.java vào đây)*
![Anh_Repositories]()

*   **Chức năng của các phương thức thao tác Database (được Spring Data JPA tự động sinh):**
    *   `findAll()`: Lấy ra toàn bộ danh sách các bản ghi (điện thoại, hãng, hoặc danh mục) hiện có trong cơ sở dữ liệu.
    *   `findById(int id)`: Tìm kiếm thông tin chi tiết của một bản ghi dựa trên khóa chính là mã ID.
    *   `save(Object entity)`: Thực hiện chức năng lưu dữ liệu. Dùng chung cho thao tác Thêm mới (khi entity chưa có ID) và Cập nhật (khi ID đã tồn tại).
    *   `deleteById(int id)`: Thực hiện chức năng xóa một bản ghi khỏi cơ sở dữ liệu dựa vào mã ID.

### b) Cho biết unitest kiểm tra các chức năng nào?

File Unit Test (`DemoApplicationTests.java`) thực hiện việc kiểm tra tự động các chức năng truy vấn dữ liệu CRUD của lớp `PhoneRepository` kết hợp với `BrandRepository` và `CategoryRepository`. Cụ thể bao gồm các chức năng sau:
1. Lấy danh sách tất cả điện thoại (`testFindAll`)
2. Tìm kiếm điện thoại theo ID (`testFindById`)
3. Thêm mới điện thoại (có liên kết tới Hãng và Danh mục) (`testSave`)
4. Cập nhật thông tin điện thoại (`testUpdate`)
5. Xóa điện thoại (`testDelete`)

### c) Thực hiện và chụp kết quả khi chạy unitest? Cho biết kịch bản của unitest

*(Ảnh kết quả khi chạy Unit Test đã được đính kèm ở mục 1)*

**Kịch bản của Unit Test:**
*   **Hàm `setUp()`**: Trước khi chạy mỗi test, tự động xóa sạch dữ liệu cũ trong 3 bảng. Tiếp theo, tạo mới 1 Hãng (Apple), 1 Danh mục (Smartphone) và 2 mẫu Điện thoại gắn với Hãng và Danh mục vừa tạo.
*   **Kịch bản `testFindAll`**: Gọi phương thức `findAll()` của `PhoneRepository` và kiểm tra bằng `assertEquals` xem kích thước danh sách trả về có đúng bằng 2 sản phẩm điện thoại như đã tạo ban đầu hay không.
*   **Kịch bản `testFindById`**: Lấy ID thực tế của chiếc điện thoại đầu tiên trong Database. Gọi phương thức `findById()` với ID này, sau đó kiểm tra xem đối tượng có tồn tại và tên của nó có khớp với tên sản phẩm đầu tiên không.
*   **Kịch bản `testSave`**: Khởi tạo một đối tượng điện thoại mới (truyền kèm đối tượng Brand và Category đã khởi tạo ở `setUp`). Gọi phương thức `save()` để lưu vào cơ sở dữ liệu. Lấy lại toàn bộ danh sách và kiểm tra xem tổng số lượng điện thoại trong hệ thống có tăng lên thành 3 hay không.
*   **Kịch bản `testUpdate`**: Lấy chiếc điện thoại đầu tiên trong Database ra, thay đổi các thuộc tính như tên (thành iPhone 15 Pro Max) và giá tiền. Gọi phương thức `save()` để lưu cập nhật. Gọi phương thức `findById()` lấy lại sản phẩm đó từ Database để kiểm tra xem thông tin đã được thay đổi thành công chưa.
*   **Kịch bản `testDelete`**: Lấy ID của một chiếc điện thoại trong cơ sở dữ liệu và gọi phương thức `deleteById()`. Cuối cùng kiểm tra xem tổng số lượng sản phẩm đã giảm đi 1, và thử tìm kiếm lại chiếc điện thoại đã bị xóa để đảm bảo kết quả trả về rỗng.
