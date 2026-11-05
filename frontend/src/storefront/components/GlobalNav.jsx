import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, X, Shield } from "lucide-react";

export default function GlobalNav({ cartCount = 0, onOpenCart, onReturnAdmin }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="global-nav" role="banner">
      <div className="global-nav-container">
        {/* Apple Glyph / Brand Name linking to home / */}
        <Link to="/" className="global-nav-brand" aria-label="Apple Store - Trang chủ (/)">
          <svg
            width="16"
            height="16"
            viewBox="0 0 170 170"
            fill="currentColor"
            aria-hidden="true"
            style={{ marginRight: "8px" }}
          >
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.66-8.5-10.23-18.42-13.72-29.74-3.48-11.33-5.22-22.18-5.22-32.55 0-14.15 3.49-25.98 10.46-35.48 6.97-9.5 15.93-14.34 26.89-14.52 4.13 0 8.91 1.05 14.34 3.17 5.43 2.12 9.02 3.24 10.78 3.35 1.52-.11 5.33-1.29 11.43-3.53 6.1-2.24 10.99-3.24 14.68-3.01 12.39.65 22.39 5.33 30.01 14.04-10.87 6.64-16.2 15.66-16 27.08.22 9.03 3.69 16.53 10.42 22.51 6.74 5.98 14.68 9.3 23.82 9.97-2.17 6.63-4.99 13.26-8.47 19.89zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.88 5.22-6.53 11.63-10.55 19.24-12.07.22 1.3.33 2.5.33 3.59 0 7.29-2.83 14.46-8.48 21.53-5.65 7.07-12.28 11.2-19.89 12.39-.32-1.52-.5-3.04-.5-4.56z" />
          </svg>
          <span>Store</span>
        </Link>

        {/* Global Navigation Links (Compact 12px SF Pro Text / Inter) */}
        <nav aria-label="Điều hướng chính cửa hàng">
          <ul className="global-nav-links">
            <li><a href="#hero" className="global-nav-link">iPhone</a></li>
            <li><a href="#highlights" className="global-nav-link">Điểm nổi bật</a></li>
            <li><a href="#story" className="global-nav-link">Thiết kế & Công nghệ</a></li>
            <li><a href="#configurator" className="global-nav-link">Cấu hình & Mua</a></li>
            <li><a href="#specs" className="global-nav-link">Thông số kỹ thuật</a></li>
          </ul>
        </nav>

        {/* Utility Actions (Search, Cart, Admin toggle) */}
        <div className="global-nav-actions">
          {searchOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label htmlFor="global-search-input" className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                Tìm kiếm sản phẩm
              </label>
              <input
                id="global-search-input"
                type="text"
                className="rounded-search-input"
                placeholder="Tìm kiếm tại Apple Store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{ width: "220px", height: "32px", fontSize: "12px" }}
              />
              <button
                type="button"
                className="nav-action-btn"
                onClick={() => setSearchOpen(false)}
                aria-label="Đóng thanh tìm kiếm"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="nav-action-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm sản phẩm trên cửa hàng"
            >
              <Search size={16} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            className="nav-action-btn"
            onClick={onOpenCart}
            aria-label={`Giỏ hàng của bạn, hiện có ${cartCount} sản phẩm`}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            {cartCount > 0 && <span className="nav-badge-count">{cartCount}</span>}
          </button>

          {/* Link sang hệ thống quản trị (/admin) */}
          <Link
            to="/admin"
            className="btn-explore-pill"
            style={{
              fontSize: "12px",
              padding: "4px 12px",
              minHeight: "34px",
              marginLeft: "6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
            }}
            title="Đến trang quản trị (/admin)"
          >
            <Shield size={13} aria-hidden="true" />
            <span>Kênh Quản Trị</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

