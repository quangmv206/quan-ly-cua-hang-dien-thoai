import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  PhoneCall,
  X,
  Smartphone,
  ShieldCheck,
  Menu,
  User,
  LogOut,
  Truck,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Shield,
  HelpCircle,
  Clock,
  Flame,
  LayoutGrid,
  ArrowRight,
  CreditCard,
  MapPin,
  Tag,
  Zap,
  Newspaper,
} from "lucide-react";
import LoginModal from "../../components/LoginModal";
import { authApi } from "../../services/authApi";
import { siteSettingsApi } from "../../services/siteSettingsApi";

// Hàm tiện ích loại bỏ dấu tiếng Việt để tìm kiếm thông minh
function removeAccents(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export default function HomeHeader({
  brands = [],
  cartCount = 0,
  onOpenCart,
  onSelectBrand,
  onSelectProduct,
  products = [],
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const megaMenuRef = useRef(null);

  const [storeInfo, setStoreInfo] = useState({
    storeName: "Phone Store",
    storeLogoUrl: "",
  });

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (user) setCurrentUser(user);

    siteSettingsApi
      .getByKey("store_info")
      .then((res) => {
        if (res.data && res.data.value) {
          try {
            const parsed = JSON.parse(res.data.value);
            setStoreInfo((prev) => ({
              ...prev,
              storeName: parsed.storeName || prev.storeName,
              storeLogoUrl: parsed.storeLogoUrl || prev.storeLogoUrl,
            }));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Danh sách thương hiệu chuẩn
  const defaultBrandList = ["Apple", "Samsung", "Xiaomi", "OPPO", "ASUS", "vivo"];
  const displayBrands = Array.from(
    new Set([
      ...defaultBrandList,
      ...brands.map((b) => (typeof b === "string" ? b : b.name)).filter(Boolean),
    ])
  );

  // Từ khóa tìm kiếm gợi ý xu hướng
  const trendingSearches = [
    "iPhone 16 Pro Max",
    "Galaxy S24 Ultra",
    "Z Fold6",
    "Xiaomi 14 Ultra",
    "Find N3",
  ];

  // Live autosuggest
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const qNorm = removeAccents(searchTerm);
      const matched = (products || [])
        .filter((p) => {
          const nameNorm = removeAccents(p.name || "");
          const brandNorm = removeAccents(p.brand?.name || (typeof p.brand === "string" ? p.brand : ""));
          return nameNorm.includes(qNorm) || brandNorm.includes(qNorm);
        })
        .slice(0, 6);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  // Click ra ngoài để đóng các dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountDropdownOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchFocused(false);
      setSuggestions([]);
    }
  };

  const handleQuickTagClick = (tag) => {
    setSearchTerm(tag);
    navigate(`/search?q=${encodeURIComponent(tag)}`);
    setIsSearchFocused(false);
    setSuggestions([]);
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

  return (
    <>
      <header className="site-header-root" role="banner">
        {/* =========================================================================
            TẦNG 1: MAIN HEADER BAR (Logo - Search Box - Action Pills)
            ========================================================================= */}
        <div className="main-header-bar">
          <div className="header-container main-header-content">
            {/* Nút Hamburger cho Mobile */}
            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Mở danh mục menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo Thương Hiệu Bên Trái */}
            <Link to="/" className="brand-logo-container" aria-label={`${storeInfo.storeName} - Trang chủ`}>
              <div className="brand-logo-icon">
                <Smartphone size={22} />
              </div>
              <div className="brand-logo-text">
                <span className="brand-name">
                  Phone<span style={{ color: "#2563eb" }}>Store</span>
                </span>
                <span className="brand-tagline">Hệ Thống Chính Hãng VNA</span>
              </div>
            </Link>

            {/* Thanh Tìm Kiếm Đẳng Cấp Ở Giữa */}
            <div className="header-search-container" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
                <Search size={18} className="search-icon-inside" />
                <input
                  type="text"
                  className="header-search-input"
                  placeholder="Bạn tìm điện thoại gì? (iPhone 16, S24 Ultra, Xiaomi...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSuggestions([]);
                    }}
                    className="search-clear-btn"
                    title="Xóa tìm kiếm"
                  >
                    <X size={15} />
                  </button>
                )}
                <button type="submit" className="search-submit-btn">
                  Tìm kiếm
                </button>
              </form>

              {/* Suggestions / Trending Searches Dropdown khi Focus */}
              {isSearchFocused && (
                <div className="search-suggestions-card" role="listbox">
                  {suggestions.length > 0 ? (
                    <div>
                      <div className="sugg-header">Sản phẩm gợi ý chính hãng</div>
                      {suggestions.map((item) => (
                        <div
                          key={item.id}
                          className="search-suggestion-row"
                          role="option"
                          tabIndex={0}
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(item);
                            } else {
                              navigate(`/product/${item.id}`);
                            }
                            setIsSearchFocused(false);
                            setSearchTerm("");
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                style={{ width: "36px", height: "36px", objectFit: "contain" }}
                              />
                            )}
                            <div>
                              <span className="sugg-name">{item.name}</span>
                              <span className="sugg-brand">{item.brand?.name || "Smartphone"}</span>
                            </div>
                          </div>
                          <span className="sugg-price">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                      <div className="sugg-footer" onClick={handleSearchSubmit}>
                        Xem tất cả kết quả cho "{searchTerm}" →
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "10px" }}>
                        <Flame size={14} color="#ea580c" />
                        <span>TÌM KIẾM PHỔ BIẾN HÔM NAY:</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {trendingSearches.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleQuickTagClick(tag)}
                            style={{
                              backgroundColor: "#f1f5f9",
                              color: "#334155",
                              border: "1px solid #e2e8f0",
                              borderRadius: "9999px",
                              padding: "5px 12px",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 150ms ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#eff6ff";
                              e.currentTarget.style.color = "#2563eb";
                              e.currentTarget.style.borderColor = "#bfdbfe";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#f1f5f9";
                              e.currentTarget.style.color = "#334155";
                              e.currentTarget.style.borderColor = "#e2e8f0";
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nhóm Nút Tiện Ích Đẳng Cấp Bên Phải */}
            <div className="header-actions-group">
              {/* 1. Hotline Tư Vấn */}
              <a href="tel:18006868" className="action-pill hotline-pill" title="Tổng đài tư vấn miễn phí">
                <div className="action-icon-circle phone-icon-circle">
                  <PhoneCall size={16} />
                </div>
                <div className="action-text-col">
                  <span className="action-subtext">Hotline tư vấn</span>
                  <span className="action-maintext">1800 6868</span>
                </div>
              </a>

              {/* 2. Tra Cứu Đơn Hàng */}
              <Link to="/account?tab=orders" className="action-pill lookup-pill" title="Theo dõi trạng thái đơn hàng">
                <div className="action-icon-circle">
                  <Truck size={16} />
                </div>
                <div className="action-text-col">
                  <span className="action-subtext">Tra cứu</span>
                  <span className="action-maintext">Đơn hàng</span>
                </div>
              </Link>

              {/* 2b. Tra Cứu Bảo Hành Điện Tử */}
              <Link to="/tra-cuu-bao-hanh" className="action-pill warranty-pill" title="Tra cứu bảo hành điện tử và số IMEI">
                <div className="action-icon-circle" style={{ backgroundColor: "rgba(22, 163, 74, 0.12)", color: "#16a34a" }}>
                  <ShieldCheck size={16} />
                </div>
                <div className="action-text-col">
                  <span className="action-subtext">Tra cứu</span>
                  <span className="action-maintext">Bảo hành</span>
                </div>
              </Link>

              {/* 3. Tài Khoản Khách Hàng */}
              <div style={{ position: "relative" }} ref={accountRef}>
                <button
                  type="button"
                  className="action-pill account-pill"
                  onClick={() => {
                    if (currentUser) {
                      setAccountDropdownOpen(!accountDropdownOpen);
                    } else {
                      setLoginModalOpen(true);
                    }
                  }}
                  title={currentUser ? `Tài khoản: ${currentUser.username}` : "Đăng nhập / Đăng ký"}
                >
                  <div className="action-icon-circle">
                    <User size={16} />
                    {currentUser && <span className="online-status-dot" />}
                  </div>
                  <div className="action-text-col">
                    <span className="action-subtext">{currentUser ? "Xin chào," : "Tài khoản"}</span>
                    <span className="action-maintext">
                      {currentUser
                        ? currentUser.username.length > 8
                          ? currentUser.username.slice(0, 8) + "..."
                          : currentUser.username
                        : "Đăng nhập"}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu Tài Khoản */}
                {accountDropdownOpen && currentUser && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      boxShadow: "0 14px 35px rgba(0,0,0,0.12)",
                      border: "1px solid #e2e8f0",
                      padding: "10px",
                      width: "220px",
                      zIndex: 150,
                      animation: "fadeIn 150ms ease",
                    }}
                  >
                    <div style={{ padding: "6px 8px 10px 8px", borderBottom: "1px solid #f1f5f9", marginBottom: "6px" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>{currentUser.username}</strong>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        {currentUser.role === "ROLE_ADMIN" ? "Quản trị viên (Admin)" : "Khách hàng thân thiết"}
                      </span>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", fontSize: "13px", color: "#334155", textDecoration: "none", borderRadius: "8px" }}
                    >
                      <User size={15} /> Tài khoản của tôi
                    </Link>
                    <Link
                      to="/account?tab=orders"
                      onClick={() => setAccountDropdownOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", fontSize: "13px", color: "#334155", textDecoration: "none", borderRadius: "8px" }}
                    >
                      <Truck size={15} /> Đơn hàng đã mua
                    </Link>
                    {currentUser.role === "ROLE_ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", fontSize: "13px", color: "#2563eb", fontWeight: 700, textDecoration: "none", borderRadius: "8px" }}
                      >
                        <ShieldCheck size={15} /> Trang Quản Trị Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        authApi.logout();
                        setCurrentUser(null);
                        setAccountDropdownOpen(false);
                      }}
                      style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", fontSize: "13px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", borderRadius: "8px", marginTop: "4px", borderTop: "1px solid #f1f5f9" }}
                    >
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Giỏ Hàng Nổi Bật */}
              <button
                type="button"
                className="action-pill cart-pill"
                onClick={onOpenCart}
                aria-label={`Giỏ hàng của bạn, hiện có ${cartCount} sản phẩm`}
                title="Xem giỏ hàng"
              >
                <div className="action-icon-circle cart-icon-circle">
                  <ShoppingBag size={17} />
                  {cartCount > 0 && <span className="cart-badge-number">{cartCount}</span>}
                </div>
                <div className="action-text-col">
                  <span className="action-subtext">Giỏ hàng</span>
                  <span className="action-maintext">{cartCount} sản phẩm</span>
                </div>
              </button>

              {/* 5. Phím Tắt Admin */}
              <Link to="/admin" className="admin-shortcut-btn" title="Chuyển đến trang Quản Trị Hệ Thống">
                <ShieldCheck size={15} />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TẦNG 2: SUB NAVBAR (Danh Mục Mega Menu & Thương Hiệu & Tiện Ích VIP)
            ========================================================================= */}
        <nav className="sub-navbar-bar" aria-label="Danh mục thương hiệu điện thoại">
          <div className="header-container sub-nav-flex">
            {/* 1. Nút Mega Menu Danh Mục Điện Thoại (Độc lập, không bị overflow-x cắt) */}
            <div className="mega-menu-wrapper" ref={megaMenuRef}>
              <button
                type="button"
                className={`all-brand-pill ${megaMenuOpen ? "active" : ""}`}
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                aria-expanded={megaMenuOpen}
              >
                <LayoutGrid size={15} />
                <span>Danh mục điện thoại</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: megaMenuOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 180ms ease",
                  }}
                />
              </button>

              {/* Mega Menu Dropdown Đa Cấp Chuẩn Showroom */}
              {megaMenuOpen && (
                <div className="mega-menu-dropdown-box">
                  <div className="mega-menu-grid">
                    {/* Cột 1: Thương hiệu hàng đầu */}
                    <div className="mega-col">
                      <h4 className="mega-col-title">Thương hiệu hàng đầu</h4>
                      <div className="mega-links-list">
                        {displayBrands.map((b) => (
                          <button
                            key={b}
                            type="button"
                            className="mega-item-link"
                            onClick={() => {
                              onSelectBrand && onSelectBrand(b);
                              setMegaMenuOpen(false);
                            }}
                          >
                            <span className="mega-bullet">•</span>
                            <span>Điện thoại {b}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cột 2: Dòng máy Flagship HOT */}
                    <div className="mega-col">
                      <h4 className="mega-col-title">Dòng Flagship HOT</h4>
                      <div className="mega-links-list">
                        <Link to="/search?q=iPhone 16" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">🔥</span>
                          <span>iPhone 16 Series</span>
                        </Link>
                        <Link to="/search?q=Galaxy S24" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">🔥</span>
                          <span>Galaxy S24 Ultra</span>
                        </Link>
                        <Link to="/search?q=Z Fold6" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">🔥</span>
                          <span>Galaxy Z Fold6 / Flip6</span>
                        </Link>
                        <Link to="/search?q=Xiaomi 14" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">🔥</span>
                          <span>Xiaomi 14 Ultra / 14T Pro</span>
                        </Link>
                        <Link to="/search?q=Find N3" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">🔥</span>
                          <span>OPPO Find N3 5G</span>
                        </Link>
                      </div>
                    </div>

                    {/* Cột 3: Mức giá phổ biến */}
                    <div className="mega-col">
                      <h4 className="mega-col-title">Chọn theo mức giá</h4>
                      <div className="mega-links-list">
                        <Link to="/dien-thoai?maxPrice=5000000" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">💰</span>
                          <span>Dưới 5 triệu (Phổ thông)</span>
                        </Link>
                        <Link to="/dien-thoai?minPrice=5000000&maxPrice=10000000" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">💰</span>
                          <span>Từ 5 – 10 triệu</span>
                        </Link>
                        <Link to="/dien-thoai?minPrice=10000000&maxPrice=20000000" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">💰</span>
                          <span>Từ 10 – 20 triệu (Cận cao cấp)</span>
                        </Link>
                        <Link to="/dien-thoai?minPrice=20000000" className="mega-item-link" onClick={() => setMegaMenuOpen(false)}>
                          <span className="mega-bullet">💎</span>
                          <span>Trên 20 triệu (Flagship đỉnh cao)</span>
                        </Link>
                      </div>
                    </div>

                    {/* Cột 4: Đặc quyền mua sắm */}
                    <div className="mega-col mega-banner-col">
                      <div className="mega-special-card">
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#dc2626", fontWeight: 700, fontSize: "12px", marginBottom: "6px" }}>
                          <Flame size={15} /> ƯU ĐÃI THÁNG NÀY
                        </div>
                        <h5 style={{ fontSize: "14px", fontWeight: 800, margin: "0 0 6px 0", color: "#0f172a" }}>
                          Trả góp 0% Lãi suất
                        </h5>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px 0", lineHeight: 1.4 }}>
                          Duyệt hồ sơ nhanh 5 phút qua CCCD hoặc thẻ tín dụng 26 ngân hàng.
                        </p>
                        <Link
                          to="/dien-thoai"
                          onClick={() => setMegaMenuOpen(false)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            backgroundColor: "#0071e3",
                            color: "#ffffff",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          Khám phá ngay <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Dải cuộn thương hiệu phẳng sang trọng */}
            <div className="brand-pills-scroll">
              {displayBrands.map((brandName) => (
                <button
                  key={brandName}
                  type="button"
                  className="brand-flat-tab"
                  onClick={() => onSelectBrand && onSelectBrand(brandName)}
                >
                  {brandName.toLowerCase() === "apple" && <span className="brand-apple-symbol"></span>}
                  <span>{brandName}</span>
                </button>
              ))}

              <Link to="/dien-thoai" className="view-all-products-link">
                Kho máy <ArrowRight size={13} />
              </Link>
            </div>

            {/* Phía phải: Các liên kết tiện ích VIP */}
            <div className="quick-info-links">
              <Link to="/tin-tuc" className="quick-link-item">
                <Newspaper size={14} /> Tin tức
              </Link>
              <Link to="/dien-thoai" className="quick-link-item hot-promo-badge">
                <Flame size={14} /> Khuyến mãi HOT
              </Link>
              <Link to="/huong-dan-thanh-toan" className="quick-link-item installment-badge">
                <CreditCard size={14} /> Trả góp 0%
              </Link>
              <Link to="/tra-cuu-bao-hanh" className="quick-link-item">
                <ShieldCheck size={14} /> Bảo hành VIP
              </Link>
              <Link to="/lien-he" className="quick-link-item">
                <MapPin size={14} /> Showroom
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer (Ngăn kéo điều hướng khi xem trên điện thoại) */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
            display: "flex",
          }}
        >
          <div
            className="mobile-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "300px",
              backgroundColor: "#ffffff",
              height: "100%",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
              overflowY: "auto",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "17px", color: "#0f172a" }}>
                  <Smartphone size={20} color="#2563eb" />
                  <span>{storeInfo.storeName || "Phone Store"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Thương hiệu chính hãng
                </span>
                {displayBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      onSelectBrand && onSelectBrand(b);
                      setMobileDrawerOpen(false);
                    }}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#f8fafc",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#334155",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{b}</span>
                    <ChevronRight size={16} color="#94a3b8" />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
              <Link
                to="/tra-cuu-bao-hanh"
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#16a34a",
                  textDecoration: "none",
                  marginBottom: "12px",
                }}
              >
                <ShieldCheck size={18} /> Tra cứu bảo hành điện tử (IMEI)
              </Link>
              <Link
                to="/tin-tuc"
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0071e3",
                  textDecoration: "none",
                  marginBottom: "12px",
                }}
              >
                <Newspaper size={18} /> Tin tức & Tạp chí công nghệ
              </Link>
              <a
                href="tel:18006868"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#16a34a",
                  textDecoration: "none",
                  marginBottom: "12px",
                }}
              >
                <PhoneCall size={18} /> Hotline: 1800 6868 (Miễn phí)
              </a>
              <Link
                to="/admin"
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <ShieldCheck size={16} /> Vào trang Quản trị Admin
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Đăng nhập / Đăng ký */}
      {loginModalOpen && (
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setLoginModalOpen(false);
          }}
        />
      )}
    </>
  );
}
