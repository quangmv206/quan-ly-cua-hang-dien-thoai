package com.example.demoSpringBoot;

import com.example.demoSpringBoot.model.Phone;
import com.example.demoSpringBoot.repository.PhoneRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initData(
			PhoneRepository phoneRepository,
			com.example.demoSpringBoot.repository.BrandRepository brandRepository,
			com.example.demoSpringBoot.repository.CategoryRepository categoryRepository,
			com.example.demoSpringBoot.repository.UserRepository userRepository,
			com.example.demoSpringBoot.repository.PhoneVariantRepository variantRepository,
			com.example.demoSpringBoot.repository.WarrantyRepository warrantyRepository,
			com.example.demoSpringBoot.repository.SupplierRepository supplierRepository,
			com.example.demoSpringBoot.repository.VoucherRepository voucherRepository,
			com.example.demoSpringBoot.repository.ReviewRepository reviewRepository,
			com.example.demoSpringBoot.repository.CustomerQuestionRepository customerQuestionRepository,
			org.springframework.security.crypto.password.PasswordEncoder passwordEncoder
	) {
		return args -> {
			if (userRepository.count() == 0) {
				userRepository.save(new com.example.demoSpringBoot.model.AppUser(
						null,
						"admin",
						passwordEncoder.encode("admin123"),
						"ROLE_ADMIN",
						"Quản Trị Viên",
						"admin@phonestore.vn",
						"0901234567",
						"ACTIVE"
				));
				userRepository.save(new com.example.demoSpringBoot.model.AppUser(
						null,
						"user",
						passwordEncoder.encode("user123"),
						"ROLE_USER",
						"Nguyễn Văn Khách",
						"khachhang@gmail.com",
						"0987654321",
						"ACTIVE"
				));
				System.out.println("====== ĐÃ KHỞI TẠO TÀI KHOẢN ADMIN (admin/admin123) VÀ USER (user/user123) ======");
			}

			if (userRepository.findByEmail("taihuynh240805@gmail.com").isEmpty()) {
				userRepository.save(new com.example.demoSpringBoot.model.AppUser(
						null,
						"taihuynh",
						passwordEncoder.encode("123456"),
						"ROLE_USER",
						"Tài Huỳnh",
						"taihuynh240805@gmail.com",
						"0988888888",
						"ACTIVE"
				));
				System.out.println("====== ĐÃ KHỞI TẠO TÀI KHOẢN TÀI HUỲNH (taihuynh240805@gmail.com) ======");
			}

			if (brandRepository.count() == 0) {
				com.example.demoSpringBoot.model.Brand apple = new com.example.demoSpringBoot.model.Brand(null, "Apple", "Apple Inc.", "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg");
				com.example.demoSpringBoot.model.Brand samsung = new com.example.demoSpringBoot.model.Brand(null, "Samsung", "Samsung Electronics", "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg");
				com.example.demoSpringBoot.model.Brand xiaomi = new com.example.demoSpringBoot.model.Brand(null, "Xiaomi", "Xiaomi Corporation", "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg");
				brandRepository.save(apple);
				brandRepository.save(samsung);
				brandRepository.save(xiaomi);

				com.example.demoSpringBoot.model.Category smartphone = new com.example.demoSpringBoot.model.Category(null, "Smartphone", "Điện thoại thông minh", "https://example.com/smartphone.jpg");
				categoryRepository.save(smartphone);

				if (phoneRepository.count() == 0) {
					Phone iphone = new Phone(null, "iPhone 15 Pro", apple, smartphone, 25000000, 25);
					iphone.setDescription("Điện thoại thông minh cao cấp của Apple với khung viền Titan và chip A17 Pro mạnh mẽ.");
					iphone.setSpecifications("Màn hình: 6.1 inch Super Retina XDR OLED, 120Hz; Chip: Apple A17 Pro; Pin: 3274 mAh; Camera: 48MP + 12MP + 12MP");
					phoneRepository.save(iphone);

					Phone galaxy = new Phone(null, "Galaxy S24 Ultra", samsung, smartphone, 28000000, 20);
					galaxy.setDescription("Flagship đỉnh cao từ Samsung với bút S-Pen tích hợp và Galaxy AI đột phá.");
					galaxy.setSpecifications("Màn hình: 6.8 inch Dynamic AMOLED 2X, 120Hz; Chip: Snapdragon 8 Gen 3 for Galaxy; Pin: 5000 mAh; Camera: 200MP + 50MP + 12MP + 10MP");
					phoneRepository.save(galaxy);

					Phone xiaomiPhone = new Phone(null, "Xiaomi 14", xiaomi, smartphone, 18000000, 15);
					xiaomiPhone.setDescription("Thiết kế nhỏ gọn, ống kính quang học Leica đỉnh cao cùng chip Snapdragon 8 Gen 3.");
					xiaomiPhone.setSpecifications("Màn hình: 6.36 inch OLED 1.5K, 120Hz; Chip: Snapdragon 8 Gen 3; Pin: 4610 mAh; Sạc 90W");
					phoneRepository.save(xiaomiPhone);

					// Seed Phone Variants
					variantRepository.save(new com.example.demoSpringBoot.model.PhoneVariant(
							null, iphone, "IP15P-128-NAT", "Titan Tự Nhiên", "128GB", "8GB", 25000000, 10,
							"https://example.com/ip15-natural.jpg", "ACTIVE"
					));
					variantRepository.save(new com.example.demoSpringBoot.model.PhoneVariant(
							null, iphone, "IP15P-256-BLK", "Titan Đen", "256GB", "8GB", 28000000, 15,
							"https://example.com/ip15-black.jpg", "ACTIVE"
					));

					variantRepository.save(new com.example.demoSpringBoot.model.PhoneVariant(
							null, galaxy, "S24U-256-GRY", "Xám Titan", "256GB", "12GB", 28000000, 10,
							"https://example.com/s24-gray.jpg", "ACTIVE"
					));
					variantRepository.save(new com.example.demoSpringBoot.model.PhoneVariant(
							null, galaxy, "S24U-512-BLK", "Đen Titan", "512GB", "12GB", 32000000, 10,
							"https://example.com/s24-black.jpg", "ACTIVE"
					));

					variantRepository.save(new com.example.demoSpringBoot.model.PhoneVariant(
							null, xiaomiPhone, "MI14-256-WHT", "Trắng", "256GB", "12GB", 18000000, 15,
							"https://example.com/mi14-white.jpg", "ACTIVE"
					));

					System.out.println("====== ĐÃ TỰ ĐỘNG SINH DỮ LIỆU ĐIỆN THOẠI VÀ BIẾN THỂ (VARIANTS) ======");
				}
			}

			if (supplierRepository.count() == 0) {
				supplierRepository.save(new com.example.demoSpringBoot.model.Supplier(
						null, "Công ty Cổ phần Thế Giới Số (Digiworld)", "02839290059", "contact@dgw.com.vn",
						"195 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM", "ACTIVE"
				));
			}

			if (warrantyRepository.count() == 0) {
				com.example.demoSpringBoot.model.Warranty sampleWarranty1 = new com.example.demoSpringBoot.model.Warranty();
				sampleWarranty1.setImeiNumber("358912345678901");
				sampleWarranty1.setProductName("iPhone 15 Pro");
				sampleWarranty1.setVariantName("256GB - Titan Đen");
				sampleWarranty1.setCustomerName("Nguyễn Văn Khách");
				sampleWarranty1.setCustomerPhone("0987654321");
				sampleWarranty1.setOrderCode("DH-20261020-1001");
				sampleWarranty1.setStartDate(java.time.LocalDate.now().minusMonths(2));
				sampleWarranty1.setEndDate(java.time.LocalDate.now().plusMonths(10));
				sampleWarranty1.setStatus("ACTIVE");
				sampleWarranty1.setNote("Máy mua mới 100% chính hãng VNA");
				warrantyRepository.save(sampleWarranty1);

				com.example.demoSpringBoot.model.Warranty sampleWarranty2 = new com.example.demoSpringBoot.model.Warranty();
				sampleWarranty2.setImeiNumber("359876543210123");
				sampleWarranty2.setProductName("Galaxy S24 Ultra");
				sampleWarranty2.setVariantName("512GB - Xám Titan");
				sampleWarranty2.setCustomerName("Huỳnh Tấn Tài");
				sampleWarranty2.setCustomerPhone("0988888888");
				sampleWarranty2.setOrderCode("DH-20261101-2002");
				sampleWarranty2.setStartDate(java.time.LocalDate.now().minusMonths(1));
				sampleWarranty2.setEndDate(java.time.LocalDate.now().plusMonths(11));
				sampleWarranty2.setStatus("ACTIVE");
				sampleWarranty2.setNote("Gói bảo hành toàn diện Samsung Care+ 12 tháng");
				warrantyRepository.save(sampleWarranty2);

				com.example.demoSpringBoot.model.Warranty sampleWarranty3 = new com.example.demoSpringBoot.model.Warranty();
				sampleWarranty3.setImeiNumber("862345678901234");
				sampleWarranty3.setProductName("Xiaomi 14");
				sampleWarranty3.setVariantName("256GB - Trắng");
				sampleWarranty3.setCustomerName("Trần Thị Mai");
				sampleWarranty3.setCustomerPhone("0988776655");
				sampleWarranty3.setOrderCode("DH-20261102-3003");
				sampleWarranty3.setStartDate(java.time.LocalDate.now().minusMonths(6));
				sampleWarranty3.setEndDate(java.time.LocalDate.now().plusMonths(6));
				sampleWarranty3.setStatus("ACTIVE");
				sampleWarranty3.setNote("Bảo hành chính hãng Digiworld phân phối");
				warrantyRepository.save(sampleWarranty3);

				System.out.println("====== ĐÃ KHỞI TẠO DỮ LIỆU BẢO HÀNH MẪU (358912345678901, 359876543210123, 862345678901234) ======");
			}

			if (voucherRepository.count() == 0) {
				voucherRepository.save(new com.example.demoSpringBoot.model.Voucher(
						"GIAM500K", "Giảm 500.000đ cho đơn từ 5 triệu", 500000.0, 5000000.0
				));
				voucherRepository.save(new com.example.demoSpringBoot.model.Voucher(
						"VIP1TR", "Đặc quyền VIP giảm 1.000.000đ cho đơn từ 15 triệu", 1000000.0, 15000000.0
				));
				voucherRepository.save(new com.example.demoSpringBoot.model.Voucher(
						"FREESHIP", "Miễn phí vận chuyển toàn quốc", 30000.0, 0.0
				));
				System.out.println("====== ĐÃ KHỞI TẠO DỮ LIỆU VOUCHER MẪU (GIAM500K, VIP1TR, FREESHIP) ======");
			}
		};
	}
}
