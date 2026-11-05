package com.example.demoSpringBoot.config;

import com.example.demoSpringBoot.model.*;
import com.example.demoSpringBoot.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final PhoneRepository phoneRepository;
    private final PhoneVariantRepository variantRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final WarrantyRepository warrantyRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PasswordEncoder passwordEncoder;
    private final SiteSettingRepository siteSettingRepository;

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    public DataInitializer(
            UserRepository userRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            PhoneRepository phoneRepository,
            PhoneVariantRepository variantRepository,
            SupplierRepository supplierRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            WarrantyRepository warrantyRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            PasswordEncoder passwordEncoder,
            SiteSettingRepository siteSettingRepository
    ) {
        this.userRepository = userRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.phoneRepository = phoneRepository;
        this.variantRepository = variantRepository;
        this.supplierRepository = supplierRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.warrantyRepository = warrantyRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.passwordEncoder = passwordEncoder;
        this.siteSettingRepository = siteSettingRepository;
    }

    @Override
    public void run(String... args) {
        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.execute("ALTER TABLE phones MODIFY COLUMN image_url LONGTEXT");
            } catch (Exception ignored) {}
            try {
                jdbcTemplate.execute("ALTER TABLE phone_variants MODIFY COLUMN thumbnail_url LONGTEXT");
            } catch (Exception ignored) {}
        }

        // 1. Khởi tạo tài khoản người dùng
        AppUser adminUser = userRepository.findByUsername("admin").orElseGet(() -> {
            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            admin.setFullName("Quản Trị Viên Hệ Thống");
            admin.setEmail("admin@phonestore.vn");
            admin.setStatus("ACTIVE");
            return userRepository.save(admin);
        });

        AppUser normalUser = userRepository.findByUsername("user").orElseGet(() -> {
            AppUser user = new AppUser();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole("ROLE_USER");
            user.setFullName("Nguyễn Văn Khách Hàng");
            user.setEmail("khachhang@gmail.com");
            user.setStatus("ACTIVE");
            return userRepository.save(user);
        });

        // 2. Khởi tạo Thương hiệu
        Brand apple = brandRepository.findAll().stream().filter(b -> "Apple".equalsIgnoreCase(b.getName())).findFirst()
                .orElseGet(() -> brandRepository.save(new Brand(null, "Apple", "Tập đoàn công nghệ Apple - iPhone, iPad chính hãng")));
        Brand samsung = brandRepository.findAll().stream().filter(b -> "Samsung".equalsIgnoreCase(b.getName())).findFirst()
                .orElseGet(() -> brandRepository.save(new Brand(null, "Samsung", "Điện thoại Samsung Galaxy cao cấp, màn hình gập")));
        Brand xiaomi = brandRepository.findAll().stream().filter(b -> "Xiaomi".equalsIgnoreCase(b.getName())).findFirst()
                .orElseGet(() -> brandRepository.save(new Brand(null, "Xiaomi", "Điện thoại Xiaomi, Redmi hiệu năng cao giá tốt")));
        Brand oppo = brandRepository.findAll().stream().filter(b -> "OPPO".equalsIgnoreCase(b.getName())).findFirst()
                .orElseGet(() -> brandRepository.save(new Brand(null, "OPPO", "Điện thoại OPPO camera chụp ảnh chuyên nghiệp")));

        // 3. Khởi tạo Danh mục
        Category smartphone = categoryRepository.findAll().stream().filter(c -> "Flagship Smartphone".equalsIgnoreCase(c.getName())).findFirst()
                .orElseGet(() -> categoryRepository.save(new Category(null, "Flagship Smartphone", "Điện thoại thông minh phân khúc cao cấp")));
        Category midRange = categoryRepository.findAll().stream().filter(c -> "Tầm Trung & Giá Rẻ".equalsIgnoreCase(c.getName())).findFirst()
                .orElseGet(() -> categoryRepository.save(new Category(null, "Tầm Trung & Giá Rẻ", "Điện thoại phổ thông, cấu hình tốt trong tầm giá")));
        Category tablet = categoryRepository.findAll().stream().filter(c -> "Máy Tính Bảng".equalsIgnoreCase(c.getName())).findFirst()
                .orElseGet(() -> categoryRepository.save(new Category(null, "Máy Tính Bảng", "Máy tính bảng iPad, Galaxy Tab học tập giải trí")));
        Category accessories = categoryRepository.findAll().stream().filter(c -> "Phụ Kiện Chính Hãng".equalsIgnoreCase(c.getName())).findFirst()
                .orElseGet(() -> categoryRepository.save(new Category(null, "Phụ Kiện Chính Hãng", "Cáp sạc nhanh, củ sạc 65W, tai nghe true-wireless")));

        // 4. Khởi tạo Nhà cung cấp
        Supplier synnex = supplierRepository.findAll().stream().filter(s -> s.getName().contains("Synnex")).findFirst()
                .orElseGet(() -> supplierRepository.save(new Supplier(null, "FPT Synnex Distribution", "02473006666", "contact@synnexfpt.com.vn", "Tòa nhà FPT, Cầu Giấy, Hà Nội", "ACTIVE")));
        Supplier dgw = supplierRepository.findAll().stream().filter(s -> s.getName().contains("Digiworld")).findFirst()
                .orElseGet(() -> supplierRepository.save(new Supplier(null, "Digiworld (DGW) Vietnam", "02839290059", "info@dgw.com.vn", "195 Nguyễn Thái Học, Quận 1, TP.HCM", "ACTIVE")));
        Supplier viettel = supplierRepository.findAll().stream().filter(s -> s.getName().contains("Viettel")).findFirst()
                .orElseGet(() -> supplierRepository.save(new Supplier(null, "Viettel Commerce", "18008123", "cskh@viettelstore.vn", "Số 1 Giang Văn Minh, Ba Đình, Hà Nội", "ACTIVE")));

        // 5. Khởi tạo Sản phẩm Điện thoại & Biến thể nếu bảng trống
        if (phoneRepository.count() == 0) {
            // Máy 1: iPhone 16 Pro Max
            Phone ip16 = new Phone(null, "iPhone 16 Pro Max", apple, smartphone, 34990000, 25);
            ip16.setDescription("Chip A18 Pro mạnh mẽ, camera zoom quang học 5x, khung titan sang trọng với nút Action Button và Camera Control.");
            ip16.setScreenSize("6.9 inch");
            ip16.setScreenTech("Super Retina XDR OLED, 120Hz ProMotion");
            ip16.setScreenResolution("2868 x 1320 Pixels");
            ip16.setCpu("Apple A18 Pro 6 nhân");
            ip16.setGpu("Apple GPU 6 nhân");
            ip16.setOs("iOS 18");
            ip16.setRam("8 GB");
            ip16.setStorage("256 GB");
            ip16.setRearCamera("Chính 48 MP & Phụ 48 MP, 12 MP (Zoom 5x, 4K 120fps)");
            ip16.setFrontCamera("12 MP TrueDepth, HDR, 4K60fps");
            ip16.setBattery("4685 mAh");
            ip16.setCharging("Sạc nhanh 45W, MagSafe 25W");
            ip16.setSim("1 Nano SIM & 1 eSIM");
            ip16.setNetwork("5G, Wi-Fi 7, Bluetooth 5.4");
            ip16.setWaterproof("IP68 (độ sâu 6m trong 30 phút)");
            ip16.setWeight("227 g, Khung viền Titan Grade 5");
            ip16.setOrigin("Năm 2024 / Mỹ");
            ip16.setWarrantyPeriod("12 tháng chính hãng");
            ip16 = phoneRepository.save(ip16);

            PhoneVariant v1 = new PhoneVariant(null, ip16, "IP16PM-TITAN-256", "Titan Tự Nhiên", "256GB", "8GB", 34990000, 15, null, "ACTIVE");
            PhoneVariant v2 = new PhoneVariant(null, ip16, "IP16PM-DESERT-512", "Titan Sa Mạc", "512GB", "8GB", 40990000, 10, null, "ACTIVE");
            variantRepository.saveAll(List.of(v1, v2));

            // Máy 2: Samsung Galaxy S24 Ultra
            Phone s24u = new Phone(null, "Samsung Galaxy S24 Ultra", samsung, smartphone, 31990000, 18);
            s24u.setDescription("Galaxy AI quyền năng, bút S-Pen tích hợp, camera 200MP đột phá, màn hình phẳng chống chói Corning Gorilla Armor.");
            s24u.setScreenSize("6.8 inch");
            s24u.setScreenTech("Dynamic AMOLED 2X, 120Hz, 2600 nits");
            s24u.setScreenResolution("Quad HD+ (3120 x 1440 Pixels)");
            s24u.setCpu("Snapdragon 8 Gen 3 for Galaxy 8 nhân");
            s24u.setGpu("Adreno 750");
            s24u.setOs("Android 14 (One UI 6.1)");
            s24u.setRam("12 GB");
            s24u.setStorage("256 GB");
            s24u.setRearCamera("Chính 200 MP & Phụ 50 MP, 12 MP, 10 MP (Zoom quang 100x)");
            s24u.setFrontCamera("12 MP Dual Pixel PDAF");
            s24u.setBattery("5000 mAh");
            s24u.setCharging("Sạc siêu nhanh 45W, Sạc không dây 15W");
            s24u.setSim("2 Nano SIM hoặc 1 Nano SIM + 1 eSIM");
            s24u.setNetwork("5G, Wi-Fi 7");
            s24u.setWaterproof("IP68");
            s24u.setWeight("232 g, Khung viền Titan");
            s24u.setOrigin("Năm 2024 / Hàn Quốc");
            s24u.setWarrantyPeriod("12 tháng chính hãng");
            s24u = phoneRepository.save(s24u);

            PhoneVariant v3 = new PhoneVariant(null, s24u, "S24U-GREY-256", "Xám Titan", "256GB", "12GB", 31990000, 10, null, "ACTIVE");
            PhoneVariant v4 = new PhoneVariant(null, s24u, "S24U-BLACK-512", "Đen Titan", "512GB", "12GB", 36490000, 8, null, "ACTIVE");
            variantRepository.saveAll(List.of(v3, v4));

            // Máy 3: Xiaomi 14 Ultra
            Phone mi14u = new Phone(null, "Xiaomi 14 Ultra 5G", xiaomi, smartphone, 28990000, 10);
            mi14u.setDescription("Hợp tác quang học đỉnh cao cùng Leica, ống kính khẩu độ biến thiên vô cấp f/1.63 - f/4.0.");
            mi14u.setScreenSize("6.73 inch");
            mi14u.setScreenTech("LTPO AMOLED, 120Hz, Dolby Vision");
            mi14u.setScreenResolution("WQHD+ (3200 x 1440 Pixels)");
            mi14u.setCpu("Snapdragon 8 Gen 3 (4 nm)");
            mi14u.setGpu("Adreno 750");
            mi14u.setOs("Xiaomi HyperOS (Android 14)");
            mi14u.setRam("16 GB");
            mi14u.setStorage("512 GB");
            mi14u.setRearCamera("4 camera 50 MP Leica Vario-Summilux");
            mi14u.setFrontCamera("32 MP góc rộng");
            mi14u.setBattery("5000 mAh");
            mi14u.setCharging("Sạc siêu tốc 90W có dây, 80W không dây");
            mi14u.setSim("2 Nano SIM");
            mi14u.setNetwork("5G");
            mi14u.setWaterproof("IP68");
            mi14u.setWeight("224 g, Mặt lưng gốm công nghệ cao");
            mi14u.setOrigin("Năm 2024 / Trung Quốc");
            mi14u.setWarrantyPeriod("18 tháng chính hãng");
            mi14u = phoneRepository.save(mi14u);

            PhoneVariant v5 = new PhoneVariant(null, mi14u, "MI14U-CERAMIC-512", "Trắng Gốm", "512GB", "16GB", 28990000, 10, null, "ACTIVE");
            variantRepository.save(v5);

            // Máy 4: OPPO Find N3 Flip (Cảnh báo hàng sắp hết: 3 máy)
            Phone oppoFlip = new Phone(null, "OPPO Find N3 Flip", oppo, smartphone, 22990000, 3);
            oppoFlip.setDescription("Màn hình gập dọc thời thượng, camera chân dung Hasselblad cao cấp, màn hình ngoài lớn đa năng.");
            oppoFlip.setScreenSize("6.8 inch (Chính) & 3.26 inch (Phụ)");
            oppoFlip.setScreenTech("AMOLED 120Hz gập không nếp gấp");
            oppoFlip.setScreenResolution("FHD+ (2520 x 1080 Pixels)");
            oppoFlip.setCpu("MediaTek Dimensity 9200 5G");
            oppoFlip.setGpu("Immortalis-G715 MC11");
            oppoFlip.setOs("ColorOS 13.2 (Android 13)");
            oppoFlip.setRam("12 GB");
            oppoFlip.setStorage("256 GB");
            oppoFlip.setRearCamera("Chính 50 MP & Tele 32 MP, Góc rộng 48 MP Hasselblad");
            oppoFlip.setFrontCamera("32 MP");
            oppoFlip.setBattery("4300 mAh");
            oppoFlip.setCharging("SUPERVOOC 44W");
            oppoFlip.setSim("2 Nano SIM");
            oppoFlip.setNetwork("5G");
            oppoFlip.setWaterproof("Kháng nước IPX4");
            oppoFlip.setWeight("198 g");
            oppoFlip.setOrigin("Năm 2023 / Trung Quốc");
            oppoFlip.setWarrantyPeriod("12 tháng chính hãng");
            oppoFlip = phoneRepository.save(oppoFlip);

            PhoneVariant v6 = new PhoneVariant(null, oppoFlip, "OPPO-N3-PINK-256", "Hồng Ánh Vàng", "256GB", "12GB", 22990000, 3, null, "ACTIVE");
            variantRepository.save(v6);

            // Máy 5: Redmi Note 13 Pro
            Phone redmi = new Phone(null, "Xiaomi Redmi Note 13 Pro", xiaomi, midRange, 6490000, 40);
            redmi.setDescription("Màn hình AMOLED 120Hz, camera 200MP chống rung OIS, sạc nhanh 67W.");
            redmi.setScreenSize("6.67 inch");
            redmi.setScreenTech("AMOLED, 1.5K, 120Hz, 1800 nits");
            redmi.setScreenResolution("1.5K (2712 x 1220 Pixels)");
            redmi.setCpu("Snapdragon 7s Gen 2");
            redmi.setGpu("Adreno 710");
            redmi.setOs("MIUI 14 (Android 13)");
            redmi.setRam("8 GB");
            redmi.setStorage("128 GB");
            redmi.setRearCamera("Chính 200 MP & Phụ 8 MP, 2 MP (OIS)");
            redmi.setFrontCamera("16 MP");
            redmi.setBattery("5100 mAh");
            redmi.setCharging("Sạc turbo 67W");
            redmi.setSim("2 Nano SIM");
            redmi.setNetwork("5G");
            redmi.setWaterproof("IP54");
            redmi.setWeight("187 g");
            redmi.setOrigin("Năm 2024 / Trung Quốc");
            redmi.setWarrantyPeriod("18 tháng chính hãng");
            redmi = phoneRepository.save(redmi);

            PhoneVariant v7 = new PhoneVariant(null, redmi, "REDMI13P-BLACK-128", "Đen Bán Dạ", "128GB", "8GB", 6490000, 25, null, "ACTIVE");
            PhoneVariant v8 = new PhoneVariant(null, redmi, "REDMI13P-BLUE-256", "Xanh Biển Sâu", "256GB", "8GB", 7190000, 15, null, "ACTIVE");
            variantRepository.saveAll(List.of(v7, v8));

            // Máy 6: iPad Pro M4
            Phone ipad = new Phone(null, "Apple iPad Pro M4 11 inch", apple, tablet, 27990000, 12);
            ipad.setDescription("Màn hình Ultra Retina XDR OLED kép siêu mỏng, chip Apple M4 đỉnh cao.");
            ipad.setScreenSize("11 inch");
            ipad.setScreenTech("Tandem OLED Ultra Retina XDR, 120Hz");
            ipad.setScreenResolution("2420 x 1668 Pixels");
            ipad.setCpu("Apple M4 9 nhân");
            ipad.setGpu("Apple GPU 10 nhân");
            ipad.setOs("iPadOS 18");
            ipad.setRam("8 GB");
            ipad.setStorage("256 GB");
            ipad.setRearCamera("12 MP góc rộng, cảm biến LiDAR");
            ipad.setFrontCamera("12 MP Ultra Wide Center Stage");
            ipad.setBattery("31.29 Wh (~8160 mAh)");
            ipad.setCharging("Sạc nhanh Type-C 30W");
            ipad.setSim("eSIM");
            ipad.setNetwork("Wi-Fi 6E + 5G");
            ipad.setWaterproof("Tiêu chuẩn nhôm nguyên khối");
            ipad.setWeight("444 g, Độ mỏng kỷ lục 5.3 mm");
            ipad.setOrigin("Năm 2024 / Mỹ");
            ipad.setWarrantyPeriod("12 tháng chính hãng");
            phoneRepository.save(ipad);
            System.out.println(">>> [DataInitializer] Đã khởi tạo danh sách sản phẩm và biến thể mẫu đầy đủ thông số kỹ thuật.");
        }

        // 6. Khởi tạo Đơn hàng mẫu (Orders & OrderItems) nếu bảng trống
        if (orderRepository.count() == 0) {
            // Đơn 1: Hoàn tất & Đã thanh toán
            Order order1 = new Order();
            order1.setOrderCode("ORD-20261028-001");
            order1.setUser(normalUser);
            order1.setRecipientName("Trần Văn Hùng");
            order1.setRecipientPhone("0901234567");
            order1.setShippingAddress("120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM");
            order1.setTotalAmount(34990000);
            order1.setShippingFee(0);
            order1.setStatus("COMPLETED");
            order1.setPaymentStatus("PAID");
            order1.setPaymentMethod("VNPAY");
            order1.setNote("Giao giờ hành chính, gọi trước khi đến.");
            order1.setCreatedAt(LocalDateTime.now().minusDays(2));
            order1.setCompletedAt(LocalDateTime.now().minusDays(1));
            order1 = orderRepository.save(order1);

            OrderItem item1 = new OrderItem(null, order1, null, "iPhone 16 Pro Max", "Titan Tự Nhiên - 256GB", "IP16PM-TITAN-256", 1, 34990000, 34990000);
            orderItemRepository.save(item1);

            // Đơn 2: Đang giao hàng
            Order order2 = new Order();
            order2.setOrderCode("ORD-20261029-002");
            order2.setUser(normalUser);
            order2.setRecipientName("Lê Thị Mai");
            order2.setRecipientPhone("0987654321");
            order2.setShippingAddress("Tòa tháp Keangnam, Phạm Hùng, Nam Từ Liêm, Hà Nội");
            order2.setTotalAmount(31990000);
            order2.setShippingFee(0);
            order2.setStatus("SHIPPING");
            order2.setPaymentStatus("UNPAID");
            order2.setPaymentMethod("COD");
            order2.setNote("Kiểm tra hàng trước khi thanh toán tiền mặt");
            order2.setCreatedAt(LocalDateTime.now().minusHours(8));
            order2 = orderRepository.save(order2);

            OrderItem item2 = new OrderItem(null, order2, null, "Samsung Galaxy S24 Ultra", "Xám Titan - 256GB", "S24U-GREY-256", 1, 31990000, 31990000);
            orderItemRepository.save(item2);

            // Đơn 3: Đã xác nhận
            Order order3 = new Order();
            order3.setOrderCode("ORD-20261029-003");
            order3.setUser(normalUser);
            order3.setRecipientName("Phạm Quốc Tuấn");
            order3.setRecipientPhone("0918888999");
            order3.setShippingAddress("88 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng");
            order3.setTotalAmount(6490000);
            order3.setShippingFee(30000);
            order3.setStatus("CONFIRMED");
            order3.setPaymentStatus("PAID");
            order3.setPaymentMethod("BANKING");
            order3.setNote("Đóng gói cẩn thận giúp shop nhé.");
            order3.setCreatedAt(LocalDateTime.now().minusHours(3));
            order3 = orderRepository.save(order3);

            OrderItem item3 = new OrderItem(null, order3, null, "Xiaomi Redmi Note 13 Pro", "Đen Bán Dạ - 128GB", "REDMI13P-BLACK-128", 1, 6490000, 6490000);
            orderItemRepository.save(item3);

            // Đơn 4: Chờ xử lý (PENDING)
            Order order4 = new Order();
            order4.setOrderCode("ORD-20261029-004");
            order4.setUser(normalUser);
            order4.setRecipientName("Nguyễn Hoàng Nam");
            order4.setRecipientPhone("0933445566");
            order4.setShippingAddress("12 Lê Lợi, TP. Huế, Thừa Thiên Huế");
            order4.setTotalAmount(22990000);
            order4.setShippingFee(0);
            order4.setStatus("PENDING");
            order4.setPaymentStatus("UNPAID");
            order4.setPaymentMethod("COD");
            order4.setNote("Khách hàng mới đặt mua qua website");
            order4.setCreatedAt(LocalDateTime.now().minusMinutes(25));
            order4 = orderRepository.save(order4);

            OrderItem item4 = new OrderItem(null, order4, null, "OPPO Find N3 Flip", "Hồng Ánh Vàng - 256GB", "OPPO-N3-PINK-256", 1, 22990000, 22990000);
            orderItemRepository.save(item4);

            // Đơn 5: Đã hủy
            Order order5 = new Order();
            order5.setOrderCode("ORD-20261027-005");
            order5.setUser(normalUser);
            order5.setRecipientName("Đặng Thu Thảo");
            order5.setRecipientPhone("0977112233");
            order5.setShippingAddress("56 Trần Phú, Quận Ninh Kiều, Cần Thơ");
            order5.setTotalAmount(28990000);
            order5.setShippingFee(0);
            order5.setStatus("CANCELLED");
            order5.setPaymentStatus("UNPAID");
            order5.setPaymentMethod("COD");
            order5.setNote("Khách đổi ý muốn lấy màu khác nên yêu cầu hủy đơn");
            order5.setCreatedAt(LocalDateTime.now().minusDays(3));
            orderRepository.save(order5);

            System.out.println(">>> [DataInitializer] Đã khởi tạo danh sách đơn hàng mẫu.");
        }

        // 7. Khởi tạo Bảo hành mẫu (Warranties) nếu bảng trống
        if (warrantyRepository.count() == 0) {
            // Máy còn hạn 364 ngày
            Warranty w1 = new Warranty();
            w1.setImeiNumber("358912345678901");
            w1.setProductName("iPhone 16 Pro Max");
            w1.setVariantName("Titan Tự Nhiên 256GB");
            w1.setCustomerName("Trần Văn Hùng");
            w1.setCustomerPhone("0901234567");
            w1.setOrderCode("ORD-20261028-001");
            w1.setStartDate(LocalDate.now().minusDays(1));
            w1.setEndDate(LocalDate.now().plusMonths(12).minusDays(1));
            w1.setStatus("ACTIVE");
            w1.setNote("Bảo hành 1 đổi 1 trong 30 ngày đầu, bảo hành 12 tháng chính hãng Apple Care.");

            // Máy còn hạn 200 ngày
            Warranty w2 = new Warranty();
            w2.setImeiNumber("359123456789012");
            w2.setProductName("Samsung Galaxy S24 Ultra");
            w2.setVariantName("Xám Titan 256GB");
            w2.setCustomerName("Lê Thị Mai");
            w2.setCustomerPhone("0987654321");
            w2.setOrderCode("ORD-20261029-002");
            w2.setStartDate(LocalDate.now().minusMonths(4));
            w2.setEndDate(LocalDate.now().plusMonths(8));
            w2.setStatus("ACTIVE");
            w2.setNote("Bảo hành rơi vỡ Samsung Care+ kèm theo máy.");

            // Máy đã hết hạn
            Warranty w3 = new Warranty();
            w3.setImeiNumber("352345678901234");
            w3.setProductName("iPhone 13");
            w3.setVariantName("Xanh Midnight 128GB");
            w3.setCustomerName("Hoàng Văn Đức");
            w3.setCustomerPhone("0912233445");
            w3.setOrderCode("ORD-20240110-888");
            w3.setStartDate(LocalDate.now().minusMonths(24));
            w3.setEndDate(LocalDate.now().minusMonths(12));
            w3.setStatus("EXPIRED");
            w3.setNote("Máy đã hết hạn bảo hành tiêu chuẩn 1 năm.");

            warrantyRepository.saveAll(List.of(w1, w2, w3));
            System.out.println(">>> [DataInitializer] Đã khởi tạo danh sách bảo hành mẫu.");
        }

        // 8. Khởi tạo Phiếu nhập kho mẫu nếu bảng trống
        if (purchaseOrderRepository.count() == 0) {
            PurchaseOrder po1 = new PurchaseOrder();
            po1.setPurchaseCode("PO-20261025-001");
            po1.setSupplier(synnex);
            po1.setTotalAmount(315000000);
            po1.setStatus("COMPLETED");
            po1.setCreatedBy(adminUser);
            po1.setNote("Lô hàng iPhone 16 Pro Max đợt 1 về kho chính");
            po1.setCreatedAt(LocalDateTime.now().minusDays(4));
            purchaseOrderRepository.save(po1);

            PurchaseOrder po2 = new PurchaseOrder();
            po2.setPurchaseCode("PO-20261026-002");
            po2.setSupplier(dgw);
            po2.setTotalAmount(180000000);
            po2.setStatus("COMPLETED");
            po2.setCreatedBy(adminUser);
            po2.setNote("Nhập bổ sung Samsung Galaxy S24 Ultra & phụ kiện");
            po2.setCreatedAt(LocalDateTime.now().minusDays(3));
            purchaseOrderRepository.save(po2);

            System.out.println(">>> [DataInitializer] Đã khởi tạo danh sách phiếu nhập kho mẫu.");
        }

        // 9. Khởi tạo Cấu hình Giao diện Storefront CMS nếu bảng trống
        if (siteSettingRepository.count() == 0) {
            String announcementJson = "{\"enabled\":true,\"highlightText\":\"Khuyến mãi Mới\",\"content\":\"Thu cũ đổi mới trợ giá đến 2.000.000 đ • Trả góp 0% lãi suất duyệt trong 5 phút\",\"actionText\":\"Xem chi tiết\",\"actionLink\":\"/dien-thoai\",\"hotline\":\"1800 6868\"}";
            String heroJson = "{\"title\":\"iPhone 16 Pro Max & Galaxy S24 Ultra\",\"headline\":\"Titanium Grade 5 & Galaxy AI. Đỉnh cao hội tụ.\",\"description\":\"Khung viền Titan siêu bền nhẹ, màn hình Dynamic AMOLED & Super Retina XDR đỉnh cao, bảo hành 1 đổi 1 trong 30 ngày và trả góp 0% duyệt trong 5 phút.\",\"buttonText\":\"Khám phá ngay\",\"badgeText\":\"Siêu phẩm Flagship 2025\",\"imageUrl\":\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop&q=80\"}";
            String dualPromoJson = "{\"leftTitle\":\"Bảo hành VIP 1 đổi 1\",\"leftBadge\":\"Đặc quyền Phone Store\",\"leftDesc\":\"Bảo hành 12 - 24 tháng chính hãng • Giao hàng hỏa tốc trong 2 giờ\",\"leftLink\":\"/chinh-sach-bao-hanh\",\"rightTitle\":\"Trả góp 0% lãi suất\",\"rightBadge\":\"Hỗ trợ tài chính\",\"rightDesc\":\"Xét duyệt online qua CCCD gắn chip trong 5 phút, trả trước 0 đồng\",\"rightLink\":\"/huong-dan-thanh-toan\"}";
            String storeInfoJson = "{\"storeName\":\"Phone Store Official\",\"hotline\":\"1800 6868\",\"cskh\":\"1900 6789\",\"email\":\"hotro@phonestore.vn\",\"address\":\"123 Nguyễn Trãi, Thanh Xuân, Hà Nội • 456 Lê Văn Sỹ, Quận 3, TP.HCM\",\"bankName\":\"MB Bank (Ngân hàng Quân Đội)\",\"bankAccount\":\"0988888888\",\"bankAccountName\":\"PHONE STORE VIETNAM\"}";
            String carouselJson = "[{\"id\":\"titanium\",\"badgeLabel\":\"Titanium Grade 5\",\"titleTop\":\"Khung viền Titan và bản lề siêu mỏng.\",\"titleBottom\":\"Bền bỉ, tinh xảo và sang trọng tuyệt đối.\",\"modelName\":\"iPhone 16 Pro & Galaxy Fold Titanium\",\"imageUrl\":\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80\"},{\"id\":\"galaxy-ai\",\"badgeLabel\":\"Galaxy AI & S-Pen\",\"titleTop\":\"Trí tuệ nhân tạo Galaxy AI đột phá.\",\"titleBottom\":\"Tối ưu mọi tác vụ và khoảnh khắc nhiếp ảnh.\",\"modelName\":\"Samsung Galaxy S24 Ultra\",\"imageUrl\":\"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80\"},{\"id\":\"leica-optics\",\"badgeLabel\":\"Leica Summilux\",\"titleTop\":\"Ống kính quang học Leica khẩu độ vô cấp.\",\"titleBottom\":\"Nhiếp ảnh chuẩn điện ảnh trong lòng bàn tay.\",\"modelName\":\"Xiaomi 14 Ultra 5G\",\"imageUrl\":\"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80\"},{\"id\":\"fold-hinge\",\"badgeLabel\":\"Flexion Hinge\",\"titleTop\":\"Bản lề tàng hình không nếp gấp gập mở êm ái.\",\"titleBottom\":\"Mỏng nhẹ hàng đầu với chuẩn độ bền 500.000 lần gập.\",\"modelName\":\"OPPO Find N3 Flip\",\"imageUrl\":\"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&auto=format&fit=crop&q=80\"}]";

            siteSettingRepository.saveAll(List.of(
                    new SiteSetting("announcement_bar", "home", announcementJson, "Thanh thông báo chạy chữ trên cùng website"),
                    new SiteSetting("home_hero", "home", heroJson, "Banner chính tiêu điểm trang chủ"),
                    new SiteSetting("home_feature_carousel", "home", carouselJson, "Banner xoay vòng điểm nhấn công nghệ 4 slide"),
                    new SiteSetting("catalog_dual_banners", "products", dualPromoJson, "2 Banner ưu đãi trên cùng trang Danh mục"),
                    new SiteSetting("store_info", "store", storeInfoJson, "Thông tin hotline, showroom, ngân hàng chuyển khoản")
            ));
            System.out.println(">>> [DataInitializer] Đã khởi tạo cấu hình Storefront CMS mẫu.");
        }

        // 10. Tự động cập nhật đồng bộ toàn bộ link ảnh chính hãng cho Phones và PhoneVariants
        try {
            updateOfficialImages();
        } catch (Exception e) {
            System.err.println(">>> [DataInitializer] Lỗi khi cập nhật link ảnh tự động: " + e.getMessage());
        }
    }

    private void updateOfficialImages() {
        // 1. Galaxy Z Fold6 (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("fold6")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6_2.jpg");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6_2.jpg");
                variantRepository.save(v);
            });
        });

        // 2. OPPO Find N3 Flip (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("find n3 flip")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_flip_-_2.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_flip_-_2.png");
                variantRepository.save(v);
            });
        });

        // 3. ASUS ROG Phone 8 Pro (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("rog phone 8")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-rog-phone-8_1.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-rog-phone-8_1.png");
                variantRepository.save(v);
            });
        });

        // 4. iPhone 16 Pro & 16 Pro Max (Studio CellphoneS & Apple)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("iphone 16 pro")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                String c = v.getColor() != null ? v.getColor().toLowerCase() : "";
                if (c.contains("sa mạc") || c.contains("desert")) {
                    v.setThumbnailUrl("https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344589");
                } else if (c.contains("tự nhiên") || c.contains("natural")) {
                    v.setThumbnailUrl("https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344414");
                } else if (c.contains("trắng") || c.contains("white")) {
                    v.setThumbnailUrl("https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344876");
                } else if (c.contains("đen") || c.contains("black")) {
                    v.setThumbnailUrl("https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344331");
                } else {
                    v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro.png");
                }
                variantRepository.save(v);
            });
        });

        // 5. iPhone 15 Pro Max
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("15 pro max")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                String c = v.getColor() != null ? v.getColor().toLowerCase() : "";
                if (c.contains("xanh") || c.contains("blue")) {
                    v.setThumbnailUrl("https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283745");
                } else if (c.contains("trắng") || c.contains("white")) {
                    v.setThumbnailUrl("https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283777");
                } else if (c.contains("đen") || c.contains("black")) {
                    v.setThumbnailUrl("https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283712");
                } else {
                    v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png");
                }
                variantRepository.save(v);
            });
        });

        // 6. Samsung Galaxy S24 Plus 5G (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("s24 plus")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-plus.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-plus.png");
                variantRepository.save(v);
            });
        });

        // 7. Xiaomi Redmi Note 13 Pro+ 5G (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("note 13 pro+")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-13-pro-plus_9_.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-13-pro-plus_9_.png");
                variantRepository.save(v);
            });
        });

        // 8. OPPO Reno12 Pro 5G (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("reno12")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo_reno12_5g_-_1_1_3_1.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo_reno12_5g_-_1_1_3_1.png");
                variantRepository.save(v);
            });
        });

        // 9. vivo X100 Pro 5G (Ảnh studio ZEISS CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("x100 pro")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-vivo-x100-pro_1_.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-vivo-x100-pro_1_.png");
                variantRepository.save(v);
            });
        });

        // 10. Samsung Galaxy A55 5G (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("a55")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/m/sm-a556_galaxy_a55_awesome_iceblue_ui_2_1.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/m/sm-a556_galaxy_a55_awesome_iceblue_ui_2_1.png");
                variantRepository.save(v);
            });
        });

        // 11. iPhone 16 (Studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().equalsIgnoreCase("iphone 16")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1.png");
                variantRepository.save(v);
            });
        });

        // 12. Samsung Galaxy Z Flip6 (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("flip6")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_166_3.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_166_3.png");
                variantRepository.save(v);
            });
        });

        // 13. Samsung Galaxy S24 Ultra (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("s24 ultra")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222_3_1.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222_3_1.png");
                variantRepository.save(v);
            });
        });

        // 14. Xiaomi 14 Ultra (Ảnh studio CellphoneS)
        phoneRepository.findAll().stream().filter(p -> p.getName() != null && p.getName().toLowerCase().contains("14 ultra")).forEach(p -> {
            p.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1.png");
            phoneRepository.save(p);
            variantRepository.findByPhoneId(p.getId()).forEach(v -> {
                v.setThumbnailUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1.png");
                variantRepository.save(v);
            });
        });

        System.out.println(">>> [DataInitializer] Đã cập nhật toàn bộ link ảnh chính hãng chuẩn cho các dòng máy & biến thể!");
    }
}
