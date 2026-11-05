import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import HomeHero from "./components/HomeHero";
import BrandCategoryNav from "./components/BrandCategoryNav";
import NewArrivalsSection from "./components/NewArrivalsSection";
import SaleSection from "./components/SaleSection";
import BestSellersSection from "./components/BestSellersSection";
import CommitmentEditorial from "./components/CommitmentEditorial";
import StorefrontFooter from "./components/StorefrontFooter";
import Toast from "./components/Toast";
import CartDrawer from "./components/CartDrawer";
import FeatureBannerCarousel from "./components/FeatureBannerCarousel";
import NewsAndOffersSection from "./components/NewsAndOffersSection";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import CookieConsentBanner from "./components/CookieConsentBanner";

import { phoneApi } from "../services/phoneApi";
import { catalogApi } from "../services/catalogApi";

export default function HomePage() {
  const navigate = useNavigate();

  // Dữ liệu mẫu chuẩn khớp 100% với DataInitializer.java từ backend
  const initialFallbackProducts = [
    {
      id: 1,
      name: "iPhone 16 Pro Max",
      brand: { id: 1, name: "Apple" },
      price: 34990000,
      cpu: "Apple A18 Pro 6 nhân",
      screenTech: "Super Retina XDR OLED, 120Hz ProMotion",
      description: "Khung Titan Grade 5, Camera zoom quang 5x, nút Camera Control thế hệ mới.",
      quantity: 25,
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      brand: { id: 2, name: "Samsung" },
      price: 31990000,
      cpu: "Snapdragon 8 Gen 3 for Galaxy",
      screenTech: "Dynamic AMOLED 2X, 120Hz, 2600 nits",
      description: "Galaxy AI quyền năng, bút S-Pen tích hợp, camera 200MP đột phá.",
      quantity: 18,
    },
    {
      id: 3,
      name: "Xiaomi 14 Ultra 5G",
      brand: { id: 3, name: "Xiaomi" },
      price: 28990000,
      cpu: "Snapdragon 8 Gen 3 (4 nm)",
      screenTech: "LTPO AMOLED, 120Hz, Dolby Vision",
      description: "Hợp tác quang học đỉnh cao cùng Leica, ống kính khẩu độ biến thiên vô cấp.",
      quantity: 10,
    },
    {
      id: 4,
      name: "OPPO Find N3 Flip",
      brand: { id: 4, name: "OPPO" },
      price: 22990000,
      cpu: "MediaTek Dimensity 9200 5G",
      screenTech: "AMOLED 120Hz gập không nếp gấp",
      description: "Màn hình gập dọc thời thượng, camera chân dung Hasselblad cao cấp.",
      quantity: 3,
    },
    {
      id: 5,
      name: "Xiaomi Redmi Note 13 Pro",
      brand: { id: 3, name: "Xiaomi" },
      price: 6490000,
      cpu: "Snapdragon 7s Gen 2",
      screenTech: "AMOLED 1.5K, 120Hz, 1800 nits",
      description: "Camera 200MP chống rung OIS, sạc nhanh 67W, màn hình 1.5K sắc nét.",
      quantity: 40,
    },
    {
      id: 6,
      name: "Apple iPad Pro M4 11 inch",
      brand: { id: 1, name: "Apple" },
      price: 27990000,
      cpu: "Apple M4 9 nhân",
      screenTech: "Tandem OLED Ultra Retina XDR, 120Hz",
      description: "Màn hình OLED kép siêu mỏng 5.3mm, chip Apple M4 đỉnh cao sức mạnh.",
      quantity: 12,
    },
  ];

  const initialFallbackBrands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Xiaomi" },
    { id: 4, name: "OPPO" },
  ];

  const initialFallbackCategories = [
    { id: 1, name: "Flagship Smartphone" },
    { id: 2, name: "Tầm Trung & Giá Rẻ" },
    { id: 3, name: "Máy Tính Bảng" },
  ];

  const [products, setProducts] = useState(initialFallbackProducts);
  const [brands, setBrands] = useState(initialFallbackBrands);
  const [categories, setCategories] = useState(initialFallbackCategories);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Giỏ hàng, Drawer và Toast thông báo
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const normalizePrice = (val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") {
      if (val > 0 && val < 1000) return Math.round(val * 1000000);
      return Math.round(val);
    }
    let str = String(val).trim();
    if (str.includes(".") && str.indexOf(".") !== str.lastIndexOf(".")) {
      str = str.replace(/\./g, "");
    } else if (str.includes(".") && /^\d+\.\d{3}$/.test(str)) {
      str = str.replace(".", "");
    }
    const cleanDigits = str.replace(/[^\d.]/g, "");
    let num = Number(cleanDigits);
    if (isNaN(num)) return 0;
    if (num > 0 && num < 1000) {
      num = Math.round(num * 1000000);
    }
    return Math.round(num);
  };

  // Đọc dữ liệu từ backend Spring Boot API
  useEffect(() => {
    async function loadData() {
      try {
        const phoneRes = await phoneApi.getAll();
        if (phoneRes.data && Array.isArray(phoneRes.data) && phoneRes.data.length > 0) {
          const apiPhones = phoneRes.data.map((p) => ({
            ...p,
            price: normalizePrice(p.price),
          }));
          setProducts(apiPhones);
        }
      } catch (err) {
        // Giữ fallback từ DataInitializer
      }

      try {
        const brandRes = await catalogApi.getBrands();
        if (brandRes.data && Array.isArray(brandRes.data) && brandRes.data.length > 0) {
          setBrands(brandRes.data);
        }
      } catch (err) {
        // Giữ fallback
      }

      try {
        const catRes = await catalogApi.getCategories();
        if (catRes.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
      } catch (err) {
        // Giữ fallback
      }
    }
    loadData();
  }, []);

  // Lọc sản phẩm theo Hãng và Danh mục khi người dùng bấm Anchor Nav
  const filteredProducts = products.filter((p) => {
    if (selectedBrand && p.brand?.name?.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }
    if (selectedCategory && p.category?.name?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Phân chia dải sản phẩm độc lập: Mỗi sản phẩm chỉ xuất hiện ở một dải theo Bảng 2
  const isFiltered = Boolean(selectedBrand || selectedCategory);
  // Khi không lọc, newArrivalsList nhận toàn bộ sản phẩm để người dùng có thể phân trang xem thoải mái
  const newArrivalsList = isFiltered ? filteredProducts : products;
  const saleList = isFiltered
    ? filteredProducts
    : products.slice(Math.ceil(products.length / 3), Math.max(4, Math.ceil((products.length * 2) / 3)));
  const bestSellersList = isFiltered
    ? filteredProducts
    : products.slice(Math.ceil((products.length * 2) / 3));

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.color === product.color
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.color === product.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastMessage(`Đã thêm "${product.name}${product.color ? ` - ${product.color}` : ""}" vào giỏ hàng.`);
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        (item.id === id || item.variantId === id) ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveCartItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id && item.variantId !== id)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleGoToProductDetail = (p) => {
    navigate(`/product/${p.id}`);
  };

  return (
    <div className="storefront-root">
      {/* Thanh thông báo ưu đãi theo Bảng 1 */}
      <AnnouncementBar />

      {/* 1. Header (Global Store Navigation) & 2. Tìm kiếm */}
      <HomeHeader
        brands={brands}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onSelectBrand={(brandName) => {
          setSelectedBrand(brandName);
          const el = document.getElementById("new-arrivals");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onSelectProduct={handleGoToProductDetail}
        products={products}
      />

      <main id="main-content">
        {/* 3. Hero (Hero Product Stage - Thông điệp chính, tiêu đề, mô tả, 1 nút, 1 ảnh) */}
        <HomeHero
          featuredProduct={products[0]}
          onExploreClick={() => {
            const el = document.getElementById("brand-filter-nav");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Điểm nhấn công nghệ phần cứng dạng Banner Carousel (Chuẩn 100% ảnh mẫu thiết kế) */}
        <FeatureBannerCarousel />

        {/* 4. Danh mục / theo hãng (Section Anchor Navigation) */}
        <div id="brand-filter-nav">
          <BrandCategoryNav
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* 5. Hàng mới về (Highlights Stage + Launch Status Label "Mới về") */}
        <NewArrivalsSection
          products={newArrivalsList}
          onSelectProduct={handleGoToProductDetail}
          onAddToCart={handleAddToCart}
        />

        {/* 6. Sản phẩm giảm giá (Highlights Stage: giá gốc, giá mới, mức giảm, thời hạn) */}
        <SaleSection
          products={saleList}
          onSelectProduct={handleGoToProductDetail}
          onAddToCart={handleAddToCart}
        />

        {/* 7. Bán chạy / Hot trend (Highlights Stage: 4-8 thẻ xếp theo doanh số thật) */}
        <BestSellersSection
          products={bestSellersList}
          onSelectProduct={handleGoToProductDetail}
          onAddToCart={handleAddToCart}
        />

        {/* Phần Tin tức & Ưu đãi đặc quyền (Savings, Offers & News Carousel chuẩn 100% ảnh thiết kế) */}
        <NewsAndOffersSection />

        {/* 8. Chính sách và cam kết (Editorial Feature Block: Bảo hành, giao hàng, đổi trả, thanh toán) */}
        <CommitmentEditorial />
      </main>

      {/* 9. Liên hệ và địa chỉ (Showroom thật) & 10. Footer (Nền #f5f5f7 Studio Mist, pháp lý doanh nghiệp) */}
      <StorefrontFooter />

      {/* Cart Drawer trượt ra xem giỏ hàng & thanh toán */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccess={(order) => {
          setToastMessage(`Đặt hàng thành công! Mã đơn: ${order.orderCode}`);
        }}
      />

      {/* Tiện ích hỗ trợ khách hàng nổi & Cookie Consent theo Bảng 1 */}
      <FloatingSupportWidget />
      <CookieConsentBanner />

      {/* Toast thông báo tiếp cận WCAG 2.2 */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
