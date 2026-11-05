-- =========================================================================================
-- FILE DỮ LIỆU MẪU ĐẦY ĐỦ VÀ AN TOÀN CHO DATABASE: phonedb (phpMyAdmin)
-- Sử dụng: Trong phpMyAdmin, bấm tab 'SQL' -> Dán toàn bộ nội dung này -> Bấm 'Go' (Thực hiện)
-- Lưu ý: Dùng lệnh REPLACE INTO để tự động cập nhật nếu đã có dữ liệu, không bao giờ bị lỗi khóa ngoại.
-- =========================================================================================

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------------------
-- 1. THƯƠNG HIỆU (BRANDS) - ĐẢM BẢO CÓ ĐỦ 6 HÃNG VỚI ID TỪ 1 ĐẾN 6
-- -----------------------------------------------------------------------------------------
REPLACE INTO `brands` (`id`, `name`, `description`, `logo_url`) VALUES
(1, 'Apple', 'Tập đoàn công nghệ hàng đầu thế giới với hệ sinh thái iPhone, iOS tối ưu.', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'),
(2, 'Samsung', 'Thương hiệu công nghệ hàng đầu Hàn Quốc, tiên phong màn hình Dynamic AMOLED và Galaxy AI.', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'),
(3, 'Xiaomi', 'Thương hiệu đột phá công nghệ, hợp tác quang học Leica đỉnh cao, cấu hình mạnh mẽ.', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg'),
(4, 'OPPO', 'Chuyên gia nhiếp ảnh chân dung Hasselblad và công nghệ smartphone gập thời thượng.', 'https://upload.wikimedia.org/wikipedia/commons/0/05/OPPO_LOGO_2019.svg'),
(5, 'ASUS', 'Dòng smartphone gaming ROG Phone chuyên nghiệp đỉnh cao hiệu năng thế giới.', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg'),
(6, 'vivo', 'Thương hiệu chuyên nhiếp ảnh di động cao cấp hợp tác cùng ống kính quang học ZEISS.', 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png');

-- -----------------------------------------------------------------------------------------
-- 2. DANH MỤC SẢN PHẨM (CATEGORIES) - ĐẢM BẢO CÓ ĐỦ 5 DANH MỤC VỚI ID TỪ 1 ĐẾN 5
-- -----------------------------------------------------------------------------------------
REPLACE INTO `categories` (`id`, `name`, `description`, `image_url`) VALUES
(1, 'Flagship Cao Cấp', 'Các dòng điện thoại đỉnh cao công nghệ, khung viền Titan và camera chuyên nghiệp.', 'https://example.com/cat-flagship.jpg'),
(2, 'Smartphone Màn Hình Gập', 'Thiết kế gập vỏ sò và gập ngang thời thượng, đa nhiệm linh hoạt tương lai.', 'https://example.com/cat-fold.jpg'),
(3, 'Điện Thoại Chuyên Gaming', 'Tần số quét 165Hz, tản nhiệt buồng hơi và chip xử lý ép xung cực đại.', 'https://example.com/cat-gaming.jpg'),
(4, 'Cận Cao Cấp & Camera AI', 'Nhiếp ảnh chân dung sắc nét, sạc nhanh 100W và thiết kế trẻ trung.', 'https://example.com/cat-midrange.jpg'),
(5, 'Phổ Thông Pin Siêu Trâu', 'Dung lượng pin 5000-6000mAh, hoạt động bền bỉ 2-3 ngày, độ bền chuẩn quân đội.', 'https://example.com/cat-budget.jpg');

-- -----------------------------------------------------------------------------------------
-- 3. ĐIỆN THOẠI (PHONES) - 15 DÒNG MÁY HOT NHẤT
-- -----------------------------------------------------------------------------------------
REPLACE INTO `phones` (
  `id`, `name`, `brand_id`, `category_id`, `price`, `quantity`, `description`, `specifications`, `image_url`, `status`,
  `screen_size`, `screen_tech`, `screen_resolution`, `cpu`, `gpu`, `os`, `ram`, `storage`,
  `rear_camera`, `front_camera`, `battery`, `charging`, `sim`, `network`, `waterproof`, `weight`, `origin`, `warranty_period`
) VALUES
(1, 'iPhone 16 Pro Max', 1, 1, 34990000, 45,
 'Khung Titan Grade 5 siêu bền nhẹ, nút Camera Control thế hệ mới, vi xử lý A18 Pro hỗ trợ Apple Intelligence đột phá.',
 'Màn hình 6.9 inch Super Retina XDR OLED 120Hz; Chip Apple A18 Pro 6 nhân; Camera 48MP Zoom 5x; Pin 4685 mAh sạc 45W',
 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-16-pro-max-sa-mac-thumb-600x600.jpg', 'ACTIVE',
 '6.9 inch', 'Super Retina XDR OLED, 120Hz ProMotion', '2868 x 1320 Pixels', 'Apple A18 Pro 6 nhân', 'Apple GPU 6 nhân', 'iOS 18', '8 GB', '256 GB',
 'Chính 48 MP & Phụ 48 MP, 12 MP (Zoom quang 5x)', '12 MP TrueDepth 4K', '4685 mAh', 'Sạc nhanh 45W, MagSafe 25W', '1 Nano SIM & 1 eSIM', '5G, Wi-Fi 7', 'IP68 (6m/30p)', '227 g', 'Mỹ / Phân phối VN/A', '12 tháng chính hãng'),

(2, 'Samsung Galaxy S24 Ultra', 2, 1, 31990000, 38,
 'Quyền năng Galaxy AI đỉnh cao, bút S-Pen tích hợp trong thân máy, camera 200MP bắt trọn chi tiết trong bóng đêm.',
 'Màn hình 6.8 inch Dynamic AMOLED 2X 120Hz; Snapdragon 8 Gen 3 for Galaxy; Camera 200MP Zoom 100x; Pin 5000 mAh',
 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumb-600x600.jpg', 'ACTIVE',
 '6.8 inch', 'Dynamic AMOLED 2X, 120Hz, 2600 nits', 'Quad HD+ (3120 x 1440)', 'Snapdragon 8 Gen 3 for Galaxy', 'Adreno 750', 'Android 14 (One UI 6.1)', '12 GB', '256 GB',
 'Chính 200 MP & Phụ 50 MP, 12 MP, 10 MP (Space Zoom 100x)', '12 MP Dual Pixel', '5000 mAh', 'Sạc nhanh 45W, Sạc không dây 15W', '2 Nano SIM hoặc 1 eSIM', '5G, Wi-Fi 7', 'IP68', '232 g', 'Việt Nam / SSVN', '12 tháng chính hãng'),

(3, 'Xiaomi 14 Ultra 5G', 3, 1, 28990000, 25,
 'Hợp tác đỉnh cao cùng huyền thoại Leica, cảm biến 1 inch khẩu độ biến thiên vô cấp, chip Snapdragon 8 Gen 3 cực đại.',
 'Màn hình 6.73 inch LTPO AMOLED 120Hz; Snapdragon 8 Gen 3; Cụm 4 camera 50MP Leica; Pin 5000 mAh sạc 90W',
 'https://cdn.tgdd.vn/Products/Images/42/322096/xiaomi-14-ultra-trang-thumb-600x600.jpg', 'ACTIVE',
 '6.73 inch', 'LTPO AMOLED, 120Hz, Dolby Vision', '2K+ (3200 x 1440 Pixels)', 'Snapdragon 8 Gen 3', 'Adreno 750', 'Xiaomi HyperOS (Android 14)', '16 GB', '512 GB',
 '4 Camera 50 MP Leica Summilux OIS', '32 MP góc rộng', '5000 mAh', 'Sạc siêu tốc HyperCharge 90W, Không dây 80W', '2 Nano SIM', '5G, Wi-Fi 7', 'IP68', '219 g', 'Chính hãng DGW', '18 tháng chính hãng'),

(4, 'Samsung Galaxy Z Fold6 5G', 2, 2, 41990000, 15,
 'Smartphone màn hình gập mỏng nhẹ nhất lịch sử Galaxy, bản lề rãnh kép không nếp gấp, tính năng phiên dịch viên kép AI.',
 'Màn hình chính 7.6 inch QXGA+ Dynamic AMOLED 2X 120Hz; Phụ 6.3 inch; Snapdragon 8 Gen 3; Pin 4400 mAh',
 'https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-xam-thumb-600x600.jpg', 'ACTIVE',
 '7.6 inch & 6.3 inch', 'Dynamic AMOLED 2X, 120Hz, 2600 nits', 'QXGA+ (2160 x 1856 Pixels)', 'Snapdragon 8 Gen 3 for Galaxy', 'Adreno 750', 'Android 14 (One UI 6.1.1)', '12 GB', '256 GB',
 'Chính 50 MP & Phụ 12 MP, 10 MP', '10 MP & 4 MP ẩn dưới màn hình', '4400 mAh', 'Sạc nhanh 25W, Sạc không dây', '2 Nano SIM & 1 eSIM', '5G, Wi-Fi 6E', 'IP48 Kháng nước', '239 g', 'Việt Nam / SSVN', '12 tháng chính hãng'),

(5, 'OPPO Find N3 Flip', 4, 2, 22990000, 20,
 'Màn hình ngoài trực quan lớn nhất phân khúc gập vỏ sò, bộ 3 camera Hasselblad chuyên chụp chân dung xóa phông.',
 'Màn hình chính 6.8 inch AMOLED 120Hz; Màn hình phụ 3.26 inch; Dimensity 9200 5G; Pin 4300 mAh sạc 44W',
 'https://cdn.tgdd.vn/Products/Images/42/313495/oppo-find-n3-flip-hong-thumb-600x600.jpg', 'ACTIVE',
 '6.8 inch & 3.26 inch', 'AMOLED 120Hz gập không nếp nhăn', 'Full HD+ (2520 x 1080)', 'MediaTek Dimensity 9200 5G', 'Immortalis-G715 MC11', 'ColorOS 13.2', '12 GB', '256 GB',
 'Chính 50 MP & Tele 32 MP, Góc siêu rộng 48 MP Hasselblad', '32 MP chân dung', '4300 mAh', 'Sạc nhanh SUPERVOOC 44W', '2 Nano SIM', '5G, Wi-Fi 7', 'IPX4', '198 g', 'Chính hãng', '12 tháng chính hãng'),

(6, 'ASUS ROG Phone 8 Pro', 5, 3, 29990000, 18,
 'Quái vật gaming đích thực với màn hình phụ AniMe Vision LED độc bản, nút siêu âm AirTrigger và tản nhiệt buồng hơi 360 độ.',
 'Màn hình 6.78 inch AMOLED 165Hz LTPO; Snapdragon 8 Gen 3; RAM 16GB; Pin 5500 mAh sạc 65W',
 'https://cdn.tgdd.vn/Products/Images/42/320875/asus-rog-phone-8-pro-den-thumb-600x600.jpg', 'ACTIVE',
 '6.78 inch', 'Samsung Flexible AMOLED 165Hz, LTPO', 'Full HD+ (2400 x 1080)', 'Snapdragon 8 Gen 3 (4 nm)', 'Adreno 750', 'Android 14 (ROG UI)', '16 GB', '512 GB',
 'Chính 50 MP Sony IMX890 chống rung Gimbal 6 trục & 32 MP, 13 MP', '32 MP RGBW', '5500 mAh', 'Sạc nhanh HyperCharge 65W, Sạc không dây Qi', '2 Nano SIM', '5G, Wi-Fi 7', 'IP68 Kháng nước bụi', '225 g', 'Chính hãng', '12 tháng chính hãng'),

(7, 'iPhone 16 Pro', 1, 1, 28990000, 30,
 'Kích thước 6.3 inch nhỏ gọn vừa tay, khung Titan chuẩn hàng không vũ trụ, camera zoom quang học 5x sắc nét.',
 'Màn hình 6.3 inch Super Retina XDR OLED 120Hz; Apple A18 Pro; Camera 48MP; Pin 3582 mAh',
 'https://cdn.tgdd.vn/Products/Images/42/329143/iphone-16-pro-titan-den-thumb-600x600.jpg', 'ACTIVE',
 '6.3 inch', 'Super Retina XDR OLED, 120Hz', '2622 x 1206 Pixels', 'Apple A18 Pro 6 nhân', 'Apple GPU 6 nhân', 'iOS 18', '8 GB', '128 GB',
 'Chính 48 MP & Phụ 48 MP, 12 MP (Zoom 5x)', '12 MP TrueDepth', '3582 mAh', 'Sạc nhanh 30W, MagSafe 25W', '1 Nano SIM & 1 eSIM', '5G, Wi-Fi 7', 'IP68', '199 g', 'Mỹ / VN/A', '12 tháng chính hãng'),

(8, 'iPhone 15 Pro Max', 1, 1, 29490000, 28,
 'Flagship được yêu thích nhất 2024, khung viền Titan Tự Nhiên sang trọng, chip A17 Pro chơi game đồ họa Ray Tracing.',
 'Màn hình 6.7 inch OLED 120Hz ProMotion; Chip A17 Pro; Camera Tele 5x; Pin 4422 mAh',
 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumb-600x600.jpg', 'ACTIVE',
 '6.7 inch', 'Super Retina XDR OLED, 120Hz', '2796 x 1290 Pixels', 'Apple A17 Pro 6 nhân', 'Apple GPU 6 nhân', 'iOS 17', '8 GB', '256 GB',
 'Chính 48 MP & Phụ 12 MP, 12 MP', '12 MP TrueDepth', '4422 mAh', 'Sạc nhanh 20W, MagSafe 15W', '1 Nano SIM & 1 eSIM', '5G, Wi-Fi 6E', 'IP68', '221 g', 'Mỹ / VN/A', '12 tháng chính hãng'),

(9, 'Samsung Galaxy S24 Plus 5G', 2, 1, 22990000, 22,
 'Màn hình 2K+ sắc nét rực rỡ, tích hợp trọn bộ Galaxy AI Khoanh tròn để tìm kiếm, thiết kế khung viền Armor Aluminum.',
 'Màn hình 6.7 inch Dynamic AMOLED 2X 120Hz; Exynos 2400 10 nhân; Pin 4900 mAh sạc 45W',
 'https://cdn.tgdd.vn/Products/Images/42/319665/samsung-galaxy-s24-plus-tim-thumb-600x600.jpg', 'ACTIVE',
 '6.7 inch', 'Dynamic AMOLED 2X, 120Hz, 2600 nits', 'Quad HD+ (3120 x 1440)', 'Exynos 2400 10 nhân', 'Xclipse 940', 'Android 14', '12 GB', '256 GB',
 'Chính 50 MP & Phụ 12 MP, 10 MP', '12 MP Dual Pixel', '4900 mAh', 'Sạc nhanh 45W', '2 Nano SIM', '5G, Wi-Fi 6E', 'IP68', '196 g', 'Việt Nam / SSVN', '12 tháng chính hãng'),

(10, 'Xiaomi Redmi Note 13 Pro+ 5G', 3, 4, 9490000, 50,
 'Vua phân khúc cận cao cấp: Màn hình cong 1.5K 120Hz, camera siêu nét 200MP chống rung OIS, sạc siêu tốc 120W đầy pin 19 phút.',
 'Màn hình cong 6.67 inch AMOLED 1.5K; Dimensity 7200 Ultra; Camera 200MP; Sạc 120W; Kháng nước IP68',
 'https://cdn.tgdd.vn/Products/Images/42/313886/xiaomi-redmi-note-13-pro-plus-den-thumb-600x600.jpg', 'ACTIVE',
 '6.67 inch', 'Màn hình cong AMOLED 1.5K, 120Hz, 1800 nits', '1.5K (2712 x 1220)', 'MediaTek Dimensity 7200 Ultra 5G', 'Mali-G610 MC4', 'MIUI 14', '8 GB', '256 GB',
 'Chính 200 MP OIS & Phụ 8 MP, 2 MP', '16 MP', '5000 mAh', 'Sạc thần tốc HyperCharge 120W', '2 Nano SIM', '5G, Wi-Fi 6', 'IP68 Chuẩn flagship', '204 g', 'Chính hãng DGW', '18 tháng chính hãng'),

(11, 'OPPO Reno12 Pro 5G', 4, 4, 16990000, 35,
 'Thiết kế hiệu ứng gợn sóng bạc tương lai, trang bị bộ công cụ AI Xóa vật thể 2.0, Chân dung AI Studio và sạc nhanh 80W.',
 'Màn hình cong 4 cạnh 6.7 inch AMOLED 120Hz; Dimensity 7300-Energy; Cụm 3 camera 50MP Sony; Pin 5000 mAh',
 'https://cdn.tgdd.vn/Products/Images/42/325785/oppo-reno12-pro-bac-thumb-600x600.jpg', 'ACTIVE',
 '6.7 inch', 'AMOLED 1.07 tỷ màu, 120Hz', 'Full HD+ (2412 x 1080)', 'MediaTek Dimensity 7300-Energy 5G', 'Mali-G615', 'ColorOS 14.1 (Android 14)', '12 GB', '512 GB',
 'Chính 50 MP Sony LYT-600 & Tele 50 MP, Siêu rộng 8 MP', '50 MP tự động lấy nét AF', '5000 mAh', 'Sạc siêu nhanh SUPERVOOC 80W', '2 Nano SIM', '5G, Wi-Fi 6', 'IP65', '180 g', 'Chính hãng', '12 tháng chính hãng'),

(12, 'vivo X100 Pro 5G', 6, 1, 25990000, 16,
 'Quái kiệt nhiếp ảnh di động, ống kính tiềm vọng ZEISS APO đạt chứng nhận quang học cao cấp nhất thế giới, chip V3 ISP xử lý ảnh đêm.',
 'Màn hình 6.78 inch LTPO AMOLED 120Hz 3000 nits; Dimensity 9300; Cảm biến 1 inch 50MP; Pin 5400 mAh sạc 100W',
 'https://cdn.tgdd.vn/Products/Images/42/318288/vivo-x100-pro-cam-thumb-600x600.jpg', 'ACTIVE',
 '6.78 inch', 'LTPO AMOLED, 120Hz, 3000 nits rực rỡ', '1.5K (2800 x 1260)', 'MediaTek Dimensity 9300 (4 nm)', 'Immortalis-G720 MC12', 'Funtouch OS 14', '16 GB', '512 GB',
 '3 Camera 50 MP ZEISS APO 1-inch Cảm biến Sony IMX989', '32 MP góc rộng', '5400 mAh', 'Sạc FlashCharge 100W, Sạc không dây 50W', '2 Nano SIM', '5G, Wi-Fi 7', 'IP68', '225 g', 'Chính hãng', '12 tháng chính hãng'),

(13, 'Samsung Galaxy A55 5G', 2, 5, 9690000, 60,
 'Thiết kế viền kim loại sang trọng dẫn đầu phân khúc, màn hình Super AMOLED 120Hz mượt mà, bảo mật Knox Vault cấp độ phần cứng.',
 'Màn hình 6.6 inch Super AMOLED 120Hz; Exynos 1480; Camera 50MP OIS; Pin 5000 mAh bền bỉ 2 ngày',
 'https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-xanh-thumb-600x600.jpg', 'ACTIVE',
 '6.6 inch', 'Super AMOLED, 120Hz, 1000 nits', 'Full HD+ (2340 x 1080)', 'Exynos 1480 8 nhân (GPU AMD RDNA)', 'Xclipse 530', 'Android 14 (One UI 6.1)', '8 GB', '128 GB',
 'Chính 50 MP OIS & Phụ 12 MP, 5 MP', '32 MP', '5000 mAh', 'Sạc nhanh 25W', '2 Nano SIM hoặc 1 eSIM', '5G, Wi-Fi 6', 'IP67 Kháng nước bụi', '213 g', 'Việt Nam / SSVN', '12 tháng chính hãng'),

(14, 'iPhone 16', 1, 1, 21990000, 35,
 'Bảng màu sắc trẻ trung tươi mới, chip A18 hỗ trợ công nghệ dò tia Ray Tracing và nút tác vụ Action Button đa năng.',
 'Màn hình 6.1 inch Super Retina XDR OLED; Apple A18 6 nhân; Camera kép Fusion 48MP; Pin 3561 mAh',
 'https://cdn.tgdd.vn/Products/Images/42/329141/iphone-16-hong-thumb-600x600.jpg', 'ACTIVE',
 '6.1 inch', 'Super Retina XDR OLED, 2000 nits', '2556 x 1179 Pixels', 'Apple A18 (3 nm thế hệ 2)', 'Apple GPU 5 nhân', 'iOS 18', '8 GB', '128 GB',
 'Chính 48 MP Fusion 2x & Phụ 12 MP Ultra Wide', '12 MP TrueDepth', '3561 mAh', 'Sạc nhanh 25W, MagSafe', '1 Nano SIM & 1 eSIM', '5G, Wi-Fi 7', 'IP68', '170 g', 'Mỹ / VN/A', '12 tháng chính hãng'),

(15, 'Samsung Galaxy Z Flip6 5G', 2, 2, 26990000, 20,
 'Màn hình gập hộp phấn thời trang, khung viền Armor Aluminum gia cường cùng buồng tản nhiệt hơi Vapor Chamber đầu tiên trên dòng Flip.',
 'Màn hình chính 6.7 inch 120Hz; Màn hình ngoài FlexWindow 3.4 inch; Snapdragon 8 Gen 3 for Galaxy; Pin 4000 mAh',
 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-z-flip6-xanh-thumb-600x600.jpg', 'ACTIVE',
 '6.7 inch & 3.4 inch', 'Dynamic AMOLED 2X 120Hz & Super AMOLED 60Hz', 'Full HD+ (2640 x 1080)', 'Snapdragon 8 Gen 3 for Galaxy', 'Adreno 750', 'Android 14 (One UI 6.1.1)', '12 GB', '256 GB',
 'Chính 50 MP OIS & Góc siêu rộng 12 MP', '10 MP', '4000 mAh', 'Sạc nhanh 25W, Sạc không dây 15W', '1 Nano SIM & 1 eSIM', '5G, Wi-Fi 6E', 'IP48 Kháng nước', '187 g', 'Việt Nam / SSVN', '12 tháng chính hãng');

-- -----------------------------------------------------------------------------------------
-- 4. BIẾN THỂ ĐIỆN THOẠI (PHONE_VARIANTS)
-- -----------------------------------------------------------------------------------------
REPLACE INTO `phone_variants` (`id`, `phone_id`, `sku`, `color`, `storage`, `ram`, `price`, `stock_quantity`, `thumbnail_url`, `status`) VALUES
(1, 1, 'IP16PM-256-DES', 'Titan Sa Mạc', '256GB', '8GB', 34990000, 15, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-16-pro-max-sa-mac-thumb-600x600.jpg', 'ACTIVE'),
(2, 1, 'IP16PM-512-NAT', 'Titan Tự Nhiên', '512GB', '8GB', 40990000, 18, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-16-pro-max-titan-tu-nhien-thumb-600x600.jpg', 'ACTIVE'),
(3, 1, 'IP16PM-1TB-BLK', 'Titan Đen', '1TB', '8GB', 46990000, 12, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-16-pro-max-titan-den-thumb-600x600.jpg', 'ACTIVE'),
(4, 1, 'IP16PM-256-WHT', 'Titan Trắng', '256GB', '8GB', 34990000, 10, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-16-pro-max-titan-trang-thumb-600x600.jpg', 'ACTIVE'),

(5, 2, 'S24U-256-GRY', 'Xám Titan', '256GB', '12GB', 31990000, 15, 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumb-600x600.jpg', 'ACTIVE'),
(6, 2, 'S24U-512-BLK', 'Đen Titan', '512GB', '12GB', 35990000, 12, 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-black-thumb-600x600.jpg', 'ACTIVE'),
(7, 2, 'S24U-256-YEL', 'Vàng Titan', '256GB', '12GB', 31990000, 11, 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-yellow-thumb-600x600.jpg', 'ACTIVE'),
(8, 2, 'S24U-1TB-VIO', 'Tím Titan', '1TB', '12GB', 41990000, 8, 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-violet-thumb-600x600.jpg', 'ACTIVE'),

(9, 3, 'MI14U-512-WHT', 'Trắng Gốm', '512GB', '16GB', 28990000, 15, 'https://cdn.tgdd.vn/Products/Images/42/322096/xiaomi-14-ultra-trang-thumb-600x600.jpg', 'ACTIVE'),
(10, 3, 'MI14U-512-BLK', 'Đen Da Thuần Chay', '512GB', '16GB', 28990000, 10, 'https://cdn.tgdd.vn/Products/Images/42/322096/xiaomi-14-ultra-den-thumb-600x600.jpg', 'ACTIVE'),

(11, 4, 'ZFOLD6-256-SIL', 'Bạc Titan', '256GB', '12GB', 41990000, 8, 'https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-xam-thumb-600x600.jpg', 'ACTIVE'),
(12, 4, 'ZFOLD6-512-BLU', 'Xanh Navy', '512GB', '12GB', 45990000, 7, 'https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-navy-thumb-600x600.jpg', 'ACTIVE'),

(13, 5, 'N3FLIP-256-GLD', 'Vàng Thạch Anh', '256GB', '12GB', 22990000, 10, 'https://cdn.tgdd.vn/Products/Images/42/313495/oppo-find-n3-flip-vang-thumb-600x600.jpg', 'ACTIVE'),
(14, 5, 'N3FLIP-256-PNK', 'Hồng Ánh Ngọc', '256GB', '12GB', 22990000, 10, 'https://cdn.tgdd.vn/Products/Images/42/313495/oppo-find-n3-flip-hong-thumb-600x600.jpg', 'ACTIVE'),

(15, 6, 'ROG8P-512-BLK', 'Đen Huyễn Ảnh', '512GB', '16GB', 29990000, 18, 'https://cdn.tgdd.vn/Products/Images/42/320875/asus-rog-phone-8-pro-den-thumb-600x600.jpg', 'ACTIVE'),

(16, 7, 'IP16P-128-DES', 'Titan Sa Mạc', '128GB', '8GB', 28990000, 15, 'https://cdn.tgdd.vn/Products/Images/42/329143/iphone-16-pro-titan-sa-mac-thumb-600x600.jpg', 'ACTIVE'),
(17, 7, 'IP16P-256-NAT', 'Titan Tự Nhiên', '256GB', '8GB', 31990000, 15, 'https://cdn.tgdd.vn/Products/Images/42/329143/iphone-16-pro-titan-tu-nhien-thumb-600x600.jpg', 'ACTIVE'),

(18, 8, 'IP15PM-256-BLU', 'Titan Xanh', '256GB', '8GB', 29490000, 16, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumb-600x600.jpg', 'ACTIVE'),
(19, 8, 'IP15PM-256-NAT', 'Titan Tự Nhiên', '256GB', '8GB', 29490000, 12, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-titan-tu-nhien-thumb-600x600.jpg', 'ACTIVE'),

(20, 10, 'NOTE13PP-256-BLK', 'Đen Huyền Bí', '256GB', '8GB', 9490000, 25, 'https://cdn.tgdd.vn/Products/Images/42/313886/xiaomi-redmi-note-13-pro-plus-den-thumb-600x600.jpg', 'ACTIVE'),
(21, 10, 'NOTE13PP-256-WHT', 'Trắng Ánh Trăng', '256GB', '8GB', 9490000, 25, 'https://cdn.tgdd.vn/Products/Images/42/313886/xiaomi-redmi-note-13-pro-plus-trang-thumb-600x600.jpg', 'ACTIVE'),

(22, 11, 'RENO12P-512-SLV', 'Bạc Vũ Trụ', '512GB', '12GB', 16990000, 20, 'https://cdn.tgdd.vn/Products/Images/42/325785/oppo-reno12-pro-bac-thumb-600x600.jpg', 'ACTIVE'),
(23, 11, 'RENO12P-512-BRN', 'Nâu Tinh Vân', '512GB', '12GB', 16990000, 15, 'https://cdn.tgdd.vn/Products/Images/42/325785/oppo-reno12-pro-nau-thumb-600x600.jpg', 'ACTIVE'),

(24, 13, 'A55-128-BLU', 'Xanh Iceblue', '128GB', '8GB', 9690000, 30, 'https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-xanh-thumb-600x600.jpg', 'ACTIVE'),
(25, 13, 'A55-128-LIL', 'Tím Lilac', '128GB', '8GB', 9690000, 30, 'https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-tim-thumb-600x600.jpg', 'ACTIVE');

-- -----------------------------------------------------------------------------------------
-- 5. MÃ GIẢM GIÁ (VOUCHERS)
-- -----------------------------------------------------------------------------------------
REPLACE INTO `vouchers` (`id`, `code`, `title`, `description`, `discount_amount`, `discount_percent`, `min_order_amount`, `max_discount_amount`, `expires_at`, `active`) VALUES
(1, 'GIAM500K', 'Ưu đãi đặc biệt giảm 500.000 VNĐ', 'Áp dụng cho mọi đơn hàng điện thoại thông minh từ 5 triệu trở lên.', 500000, NULL, 5000000, NULL, '2027-12-31 23:59:59', 1),
(2, 'VIP1TR', 'Đặc quyền VIP giảm ngay 1.000.000 VNĐ', 'Dành riêng cho khách hàng mua điện thoại cao cấp hoặc đơn hàng từ 15 triệu.', 1000000, NULL, 15000000, NULL, '2027-12-31 23:59:59', 1),
(3, 'FREESHIP', 'Miễn phí giao hàng hỏa tốc toàn quốc', 'Miễn phí giao hàng nội thành 2 giờ và giao toàn quốc không giới hạn giá trị.', 30000, NULL, 0, NULL, '2027-12-31 23:59:59', 1),
(4, 'TET2026', 'Lì xì công nghệ đầu năm 8%', 'Giảm ngay 8% tối đa 1.500.000đ cho tất cả các dòng smartphone chính hãng.', NULL, 8, 3000000, 1500000, '2027-12-31 23:59:59', 1);

-- -----------------------------------------------------------------------------------------
-- 6. ĐÁNH GIÁ SẢN PHẨM (REVIEWS)
-- -----------------------------------------------------------------------------------------
REPLACE INTO `reviews` (`id`, `phone_id`, `author_name`, `author_phone`, `rating`, `comment`, `verified_purchase`, `created_at`) VALUES
(1, 1, 'Nguyễn Hải Nam', '0901234567', 5, 'Máy đẹp xuất sắc, cầm khung Titan Sa Mạc sang chảnh vô cùng. Pin trâu dùng cả ngày xem video thoải mái, giao hàng hỏa tốc trong 2 giờ đúng hẹn!', 1, '2026-11-01 10:15:00'),
(2, 1, 'Trần Mai Phương', '0912345678', 5, 'Nhân viên tư vấn Phone Store hỗ trợ chuyển dữ liệu từ máy cũ qua máy mới rất chu đáo. Trả góp 0% qua thẻ tín dụng duyệt trong 5 phút.', 1, '2026-10-28 14:30:00'),
(3, 2, 'Lê Quốc Bảo', '0988776655', 5, 'Galaxy AI dịch cuộc gọi trực tiếp và bút S-Pen ghi chú quá tiện lợi cho công việc. Màn hình phẳng chống chói ngoài trời cực tốt.', 1, '2026-10-25 09:20:00'),
(4, 3, 'Đỗ Minh Tuấn', '0933445566', 5, 'Ống kính quang học Leica chụp chân dung xóa phông xóa phông mịn màng như máy ảnh cơ chuyên nghiệp. Rất đáng đồng tiền bát gạo.', 1, '2026-10-20 16:45:00');

-- -----------------------------------------------------------------------------------------
-- 7. CÂU HỎI THƯỜNG GẶP & TƯ VẤN (CUSTOMER_QUESTIONS)
-- -----------------------------------------------------------------------------------------
REPLACE INTO `customer_questions` (`id`, `phone_id`, `author_name`, `author_phone`, `question`, `answer`, `answered`, `created_at`) VALUES
(1, 1, 'Chị Thi', '0909888999', 'Cho mình hỏi trước mình mua iPhone 15 Pro Max màu cam 512GB, giờ đổi 16 Pro Max 512GB thì bù trừ thêm bao nhiêu?', 'Dạ Phone Store xin chào Chị Thi! Chương trình Thu cũ Đổi mới trợ giá đến 3.000.000đ. Kỹ thuật viên bên em sẽ gọi điện báo giá định giá máy nhanh cho chị trong 5 phút ạ!', 1, '2026-11-03 08:30:00'),
(2, 1, 'Anh Hoàng Long', '0977112233', 'Mua máy tại Phone Store có được bóc seal kiểm tra tại chỗ trước khi thanh toán không shop?', 'Dạ chào Anh Long, Phone Store cam kết khách hàng được đồng kiểm niêm phong chính hãng, kích hoạt kiểm tra màn hình và tính năng trước khi ký nhận hoặc thanh toán ạ!', 1, '2026-11-02 11:20:00'),
(3, 2, 'Chú Quang Vinh', '0918223344', 'Tôi muốn mua trả góp S24 Ultra kỳ hạn 12 tháng bằng CCCD thì cần đưa trước bao nhiêu?', 'Dạ chào Chú Vinh! Chú có thể tham gia gói trả góp 0% trả trước từ 0đ hoặc 20-30% tùy ý, chỉ cần CCCD gắn chip xét duyệt trực tuyến 15 phút là nhận máy ngay ạ!', 1, '2026-11-01 15:40:00');

-- -----------------------------------------------------------------------------------------
-- 8. NHÀ CUNG CẤP (SUPPLIERS)
-- -----------------------------------------------------------------------------------------
REPLACE INTO `suppliers` (`id`, `name`, `phone`, `email`, `address`, `status`) VALUES
(1, 'Công ty Cổ phần Thế Giới Số (Digiworld - DGW)', '02839290059', 'contact@dgw.com.vn', '195 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. Hồ Chí Minh', 'ACTIVE'),
(2, 'Công ty TNHH Phân Phối Synnex FPT', '02473006666', 'fptdistribution@fpt.com', 'Tòa nhà FPT, Phố Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội', 'ACTIVE'),
(3, 'Công ty Cổ phần Dịch vụ Phân phối Tổng hợp Dầu khí (Petrosetco - PSD)', '02839115577', 'info@psd.com.vn', 'Tầng 6, Tòa nhà PetroVietnam, Số 1-5 Lê Duẩn, Quận 1, TP. Hồ Chí Minh', 'ACTIVE');

-- -----------------------------------------------------------------------------------------
-- 9. BẢO HÀNH ĐIỆN TỬ THEO SỐ IMEI (WARRANTIES)
-- -----------------------------------------------------------------------------------------
REPLACE INTO `warranties` (`id`, `imei_number`, `product_name`, `variant_name`, `customer_name`, `customer_phone`, `order_code`, `start_date`, `end_date`, `status`, `note`, `created_at`) VALUES
(1, '358912345678901', 'iPhone 16 Pro Max', '256GB - Titan Sa Mạc', 'Nguyễn Văn Khách', '0987654321', 'DH-20261105-1001', '2026-11-01', '2027-11-01', 'ACTIVE', 'Máy mới 100% nguyên seal VN/A kích hoạt bảo hành điện tử', '2026-11-01 10:00:00'),
(2, '864234567891234', 'Samsung Galaxy S24 Ultra', '256GB - Xám Titan', 'Trần Thị Mai', '0912345678', 'DH-20261104-1002', '2026-10-25', '2027-10-25', 'ACTIVE', 'Bảo hành chính hãng Samsung Care+ 12 tháng', '2026-10-25 14:00:00'),
(3, '869876543210987', 'Xiaomi 14 Ultra 5G', '512GB - Trắng Gốm', 'Lê Hoàng Long', '0933557799', 'DH-20261020-1003', '2026-10-20', '2028-04-20', 'ACTIVE', 'Gói bảo hành vàng DGW 18 tháng kèm thay màn hình miễn phí 6 tháng đầu', '2026-10-20 16:30:00');

-- -----------------------------------------------------------------------------------------
-- 10. ĐƠN HÀNG MẪU (ORDERS & ORDER_ITEMS)
-- -----------------------------------------------------------------------------------------
REPLACE INTO `orders` (`id`, `order_code`, `user_id`, `recipient_name`, `recipient_phone`, `shipping_address`, `total_amount`, `shipping_fee`, `status`, `payment_status`, `payment_method`, `note`, `created_at`, `completed_at`) VALUES
(1, 'DH-20261105-1001', 2, 'Nguyễn Văn Khách', '0987654321', 'Số 120 đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội', 34990000, 0, 'DELIVERED', 'PAID', 'COD', 'Giao hỏa tốc 2 giờ, khách kiểm hàng thanh toán', '2026-11-01 09:30:00', '2026-11-01 11:15:00'),
(2, 'DH-20261104-1002', 2, 'Trần Thị Mai', '0912345678', '45 Lê Duẩn, Bến Nghé, Quận 1, TP. Hồ Chí Minh', 31990000, 0, 'SHIPPING', 'PAID', 'VNPAY', 'Đã quét QR VNPAY thành công', '2026-11-04 14:00:00', NULL),
(3, 'DH-20261105-1003', NULL, 'Lê Quốc Bảo', '0988776655', 'Số 88 đường Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng', 28990000, 0, 'CONFIRMED', 'UNPAID', 'COD', 'Khách vãng lai đặt mua không cần tài khoản', '2026-11-05 08:20:00', NULL);

REPLACE INTO `order_items` (`id`, `order_id`, `variant_id`, `product_name`, `variant_name`, `sku`, `quantity`, `price`, `line_total`) VALUES
(1, 1, 1, 'iPhone 16 Pro Max', '256GB - Titan Sa Mạc', 'IP16PM-256-DES', 1, 34990000, 34990000),
(2, 2, 5, 'Samsung Galaxy S24 Ultra', '256GB - Xám Titan', 'S24U-256-GRY', 1, 31990000, 31990000),
(3, 3, 16, 'iPhone 16 Pro', '128GB - Titan Sa Mạc', 'IP16P-128-DES', 1, 28990000, 28990000);

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
