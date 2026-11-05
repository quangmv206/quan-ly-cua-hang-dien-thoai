-- =========================================================================================
-- FILE SQL CẬP NHẬT LINK ẢNH SHOWROOM MẶT LƯNG & HAI MẶT (CHUẨN SHOWROOM LỚN: CELLPHONES & APPLE)
-- =========================================================================================
USE `phonedb`;

-- 1. Samsung Galaxy S24 Ultra (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222_3_1.png' WHERE `name` LIKE '%S24 Ultra%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222_3_1.png' WHERE `phone_id` = 2 OR `sku` LIKE 'S24U%';

-- 2. Samsung Galaxy Z Fold6 / Z Fold6 5G (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6_2.jpg' WHERE `name` LIKE '%Fold6%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6_2.jpg' WHERE `phone_id` = 4 OR `sku` LIKE 'ZFOLD6%';

-- 3. Samsung Galaxy Z Flip6 / Z Flip6 5G (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_166_3.png' WHERE `name` LIKE '%Flip6%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_166_3.png' WHERE `phone_id` = 15 OR `sku` LIKE 'ZFLIP6%';

-- 4. Samsung Galaxy A55 5G (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/m/sm-a556_galaxy_a55_awesome_iceblue_ui_2_1.png' WHERE `name` LIKE '%A55%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/m/sm-a556_galaxy_a55_awesome_iceblue_ui_2_1.png' WHERE `phone_id` = 13 OR `sku` LIKE 'A55%';

-- 5. Samsung Galaxy S24 Plus (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-plus.png' WHERE `name` LIKE '%S24 Plus%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-plus.png' WHERE `phone_id` = 9 OR `sku` LIKE 'S24P%';

-- 6. OPPO Find N3 Flip (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_flip_-_2.png' WHERE `name` LIKE '%Find N3 Flip%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_flip_-_2.png' WHERE `phone_id` = 5 OR `sku` LIKE 'N3FLIP%';

-- 7. OPPO Reno12 Pro 5G (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo_reno12_5g_-_1_1_3_1.png' WHERE `name` LIKE '%Reno12%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo_reno12_5g_-_1_1_3_1.png' WHERE `phone_id` = 11 OR `sku` LIKE 'RENO12%';

-- 8. OPPO Find N3 5G
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_16gb_512gb.png' WHERE `name` LIKE '%Find N3 5G%';

-- 9. ASUS ROG Phone 8 Pro (Mặt lưng studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-rog-phone-8_1.png' WHERE `name` LIKE '%ROG Phone 8%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-rog-phone-8_1.png' WHERE `phone_id` = 6 OR `sku` LIKE 'ROG8P%';

-- 10. Xiaomi 14 Ultra 5G (Mặt lưng studio Leica CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1.png' WHERE `name` LIKE '%14 Ultra%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1.png' WHERE `phone_id` = 3 OR `sku` LIKE 'MI14U%';

-- 11. Xiaomi Redmi Note 13 Pro+ 5G
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-13-pro-plus_9_.png' WHERE `name` LIKE '%Note 13 Pro+%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-13-pro-plus_9_.png' WHERE `phone_id` = 10 OR `sku` LIKE 'NOTE13PP%';

-- 12. Xiaomi 14T Pro
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi_14t_pro_12gb_512gb_-_5.png' WHERE `name` LIKE '%14T Pro%';

-- 13. vivo X100 Pro 5G (Mặt lưng ZEISS studio CellphoneS)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-vivo-x100-pro_1_.png' WHERE `name` LIKE '%X100 Pro%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-vivo-x100-pro_1_.png' WHERE `phone_id` = 12 OR `sku` LIKE 'X100P%';

-- 14. iPhone 16 Pro Max & iPhone 16 Pro (Apple Store Studio lưng nghiêng chuẩn)
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro.png' WHERE `name` LIKE '%iPhone 16 Pro%';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344589' WHERE (`sku` LIKE 'IP16P%') AND (`color` LIKE '%Sa Mạc%' OR `color` LIKE '%Desert%');
UPDATE `phone_variants` SET `thumbnail_url` = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344414' WHERE (`sku` LIKE 'IP16P%') AND (`color` LIKE '%Tự Nhiên%' OR `color` LIKE '%Natural%');
UPDATE `phone_variants` SET `thumbnail_url` = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344876' WHERE (`sku` LIKE 'IP16P%') AND (`color` LIKE '%Trắng%' OR `color` LIKE '%White%');
UPDATE `phone_variants` SET `thumbnail_url` = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1722958344331' WHERE (`sku` LIKE 'IP16P%') AND (`color` LIKE '%Đen%' OR `color` LIKE '%Black%');

-- 15. iPhone 15 Pro Max
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png' WHERE `name` LIKE '%15 Pro Max%';

-- 16. iPhone 16
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1.png' WHERE `name` = 'iPhone 16';
UPDATE `phone_variants` SET `thumbnail_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1.png' WHERE `sku` LIKE 'IP16-%';

-- 17. iPhone 16 Plus
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1_1.png' WHERE `name` LIKE '%16 Plus%';

-- 18. iPhone 14
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg' WHERE `name` = 'iPhone 14';

-- 19. iPhone 15
UPDATE `phones` SET `image_url` = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png' WHERE `name` = 'iPhone 15';
