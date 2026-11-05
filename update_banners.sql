-- Cập nhật ảnh Banner chính (Hero Stage) và 4 Slide Carousel Điểm Nhấn
USE `phonedb`;

-- 1. Banner chính trang chủ (Home Hero) - iPhone 16 Pro & Galaxy S24 Ultra Flagship
UPDATE `site_settings`
SET `setting_value` = '{\"title\":\"iPhone 16 Pro Max & Galaxy S24 Ultra\",\"headline\":\"Titanium Grade 5 & Galaxy AI. Đỉnh cao hội tụ.\",\"description\":\"Khung viền Titan siêu bền nhẹ, màn hình Dynamic AMOLED & Super Retina XDR đỉnh cao, bảo hành 1 đổi 1 trong 30 ngày và trả góp 0% duyệt trong 5 phút.\",\"buttonText\":\"Khám phá ngay\",\"badgeText\":\"Siêu phẩm Flagship 2025\",\"imageUrl\":\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop&q=80\"}'
WHERE `setting_key` = 'home_hero';

-- 2. Banner xoay vòng 4 Slide điểm nhấn công nghệ (Feature Carousel)
UPDATE `site_settings`
SET `setting_value` = '[{\"id\":\"titanium\",\"badgeLabel\":\"Titanium Grade 5\",\"titleTop\":\"Khung viền Titan và bản lề siêu mỏng.\",\"titleBottom\":\"Bền bỉ, tinh xảo và sang trọng tuyệt đối.\",\"modelName\":\"iPhone 16 Pro & Galaxy Fold Titanium\",\"imageUrl\":\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80\"},{\"id\":\"galaxy-ai\",\"badgeLabel\":\"Galaxy AI & S-Pen\",\"titleTop\":\"Trí tuệ nhân tạo Galaxy AI đột phá.\",\"titleBottom\":\"Tối ưu mọi tác vụ và khoảnh khắc nhiếp ảnh.\",\"modelName\":\"Samsung Galaxy S24 Ultra\",\"imageUrl\":\"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80\"},{\"id\":\"leica-optics\",\"badgeLabel\":\"Leica Summilux\",\"titleTop\":\"Ống kính quang học Leica khẩu độ vô cấp.\",\"titleBottom\":\"Nhiếp ảnh chuẩn điện ảnh trong lòng bàn tay.\",\"modelName\":\"Xiaomi 14 Ultra 5G\",\"imageUrl\":\"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80\"},{\"id\":\"fold-hinge\",\"badgeLabel\":\"Flexion Hinge\",\"titleTop\":\"Bản lề tàng hình không nếp gấp gập mở êm ái.\",\"titleBottom\":\"Mỏng nhẹ hàng đầu với chuẩn độ bền 500.000 lần gập.\",\"modelName\":\"OPPO Find N3 Flip\",\"imageUrl\":\"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&auto=format&fit=crop&q=80\"}]'
WHERE `setting_key` = 'home_feature_carousel';

