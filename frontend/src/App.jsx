import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./storefront/HomePage";
import ProductDetailPage from "./storefront/ProductDetailPage";
import ProductsPage from "./storefront/ProductsPage";
import SearchResultsPage from "./storefront/SearchResultsPage";
import CheckoutPage from "./storefront/CheckoutPage";
import OrderSuccessPage from "./storefront/OrderSuccessPage";
import AccountPage from "./storefront/AccountPage";
import PolicyPages from "./storefront/PolicyPages";
import NewsPage from "./storefront/NewsPage";
import NotFoundPage from "./storefront/NotFoundPage";
import AdminLayout from "./admin/AdminLayout";

export default function App() {
  return (
    <Routes>
      {/* =========================================================================
          1. ĐƯỜNG DẪN CỬA HÀNG STOREFRONT (Khách hàng)
          ========================================================================= */}
      {/* Trang chủ: http://localhost:5173/ */}
      <Route path="/" element={<HomePage />} />

      {/* Trang danh mục Sản phẩm / Điện thoại: http://localhost:5173/dien-thoai */}
      <Route path="/dien-thoai" element={<ProductsPage />} />
      <Route path="/phones" element={<ProductsPage />} />
      <Route path="/products" element={<ProductsPage />} />

      {/* Trang chi tiết sản phẩm: http://localhost:5173/product/:id */}
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* Trang kết quả tìm kiếm sản phẩm: http://localhost:5173/search?q=... */}
      <Route path="/search" element={<SearchResultsPage />} />

      {/* Giỏ hàng & Thanh toán: http://localhost:5173/cart hoặc /checkout */}
      <Route path="/cart" element={<CheckoutPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Xác nhận đơn hàng thành công: http://localhost:5173/order-success */}
      <Route path="/order-success" element={<OrderSuccessPage />} />

      {/* Tài khoản cá nhân & Đơn hàng của tôi: http://localhost:5173/account */}
      <Route path="/account" element={<AccountPage />} />

      {/* Tin tức & Tạp chí công nghệ: http://localhost:5173/tin-tuc */}
      <Route path="/tin-tuc" element={<NewsPage />} />
      <Route path="/news" element={<NewsPage />} />

      {/* =========================================================================
          2. CÁC TRANG CHÍNH SÁCH & THÔNG TIN DOANH NGHIỆP (Theo Bảng 2)
          ========================================================================= */}
      <Route path="/tra-cuu-bao-hanh" element={<PolicyPages type="warranty" />} />
      <Route path="/bao-hanh" element={<PolicyPages type="warranty" />} />
      <Route path="/chinh-sach-bao-hanh" element={<PolicyPages type="warranty" />} />
      <Route path="/chinh-sach-doi-tra" element={<PolicyPages type="return" />} />
      <Route path="/chinh-sach-giao-hang" element={<PolicyPages type="shipping" />} />
      <Route path="/huong-dan-thanh-toan" element={<PolicyPages type="payment" />} />
      <Route path="/dieu-khoan-bao-mat" element={<PolicyPages type="privacy" />} />
      <Route path="/lien-he" element={<PolicyPages type="contact" />} />
      <Route path="/gioi-thieu" element={<PolicyPages type="about" />} />
      <Route path="/faq" element={<PolicyPages type="faq" />} />

      {/* =========================================================================
          3. ĐƯỜNG DẪN QUẢN TRỊ ADMIN (Hệ thống quản lý bán hàng)
          ========================================================================= */}
      <Route path="/admin/*" element={<AdminLayout />} />

      {/* =========================================================================
          4. TRANG 404 KHÔNG TÌM THẤY (Tránh trang trắng theo Bảng 2)
          ========================================================================= */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
