import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Smartphone, ArrowRight } from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import StorefrontFooter from "./components/StorefrontFooter";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";

export default function NotFoundPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="storefront-root" style={{ backgroundColor: "var(--color-studio-mist)", minHeight: "100vh" }}>
      <AnnouncementBar />
      <HomeHeader cartCount={0} onOpenCart={() => {}} />

      <main style={{ maxWidth: "720px", margin: "60px auto 80px auto", padding: "0 20px", textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "var(--color-gallery-white)",
            borderRadius: "28px",
            border: "1px solid var(--color-hairline-silver)",
            padding: "54px 32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <span style={{ fontSize: "72px", fontWeight: 800, color: "var(--color-pricing-blue)", lineHeight: 1, display: "block", marginBottom: "12px", letterSpacing: "-0.04em" }}>
            404
          </span>

          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 10px 0" }}>
            Trang bạn tìm kiếm không tồn tại
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-slate)", margin: "0 0 28px 0", lineHeight: 1.5 }}>
            Đường dẫn có thể đã bị thay đổi hoặc sản phẩm đã ngừng kinh doanh. Hãy thử tìm kiếm sản phẩm khác bằng ô bên dưới:
          </p>

          {/* Ô tìm kiếm theo Bảng 2 */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", maxWidth: "440px", margin: "0 auto 32px auto" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "11px", color: "var(--color-slate)" }} />
              <input
                type="text"
                placeholder="Tìm iPhone, Galaxy, Xiaomi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "9999px",
                  border: "1px solid var(--color-hairline-silver)",
                  paddingLeft: "38px",
                  paddingRight: "14px",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-pricing-blue"
              style={{
                height: "40px",
                padding: "0 20px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Tìm kiếm
            </button>
          </form>

          {/* Liên kết về trang chủ và danh mục theo Bảng 2 */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/"
              className="btn-explore-pill"
              style={{
                height: "42px",
                padding: "0 22px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Home size={15} />
              Về Trang chủ
            </Link>

            <Link
              to="/dien-thoai"
              className="btn-pricing-blue"
              style={{
                height: "42px",
                padding: "0 24px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Smartphone size={15} />
              Danh mục Điện thoại
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <StorefrontFooter />
      <FloatingSupportWidget />
    </div>
  );
}

