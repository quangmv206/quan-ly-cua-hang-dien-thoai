import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowUpDown, Smartphone, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import ProductCard from "./components/ProductCard";
import Breadcrumb from "./components/Breadcrumb";
import StorefrontFooter from "./components/StorefrontFooter";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import CookieConsentBanner from "./components/CookieConsentBanner";

import { phoneApi } from "../services/phoneApi";
import { catalogApi } from "../services/catalogApi";

function removeAccents(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Cart & Toast
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([phoneApi.getAll(), catalogApi.getBrands()])
      .then(([phoneRes, brandRes]) => {
        if (phoneRes.data && Array.isArray(phoneRes.data)) {
          setProducts(phoneRes.data);
        }
        if (brandRes.data && Array.isArray(brandRes.data)) {
          setBrands(brandRes.data);
        }
      })
      .catch((err) => {
        console.warn("Lỗi khi tải dữ liệu tìm kiếm:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Lọc sản phẩm theo từ khóa (hỗ trợ không dấu và tìm kiếm thông minh)
  const searchResults = useMemo(() => {
    if (!query.trim()) return products;
    const qNorm = removeAccents(query);
    const keywords = qNorm.split(/\s+/).filter(Boolean);

    return products.filter((p) => {
      const nameNorm = removeAccents(p.name || "");
      const brandNorm = removeAccents(p.brand?.name || (typeof p.brand === "string" ? p.brand : ""));
      const cpuNorm = removeAccents(p.cpu || "");
      const descNorm = removeAccents(p.description || "");

      const fullText = `${nameNorm} ${brandNorm} ${cpuNorm} ${descNorm}`;
      return keywords.every((kw) => fullText.includes(kw));
    });
  }, [products, query]);

  // Áp dụng bộ lọc brand và sắp xếp
  const finalResults = useMemo(() => {
    let list = [...searchResults];

    if (selectedBrand !== "all") {
      list = list.filter((p) => {
        const b = (p.brand?.name || p.brand || "").toLowerCase();
        return b.includes(selectedBrand.toLowerCase());
      });
    }

    if (sortOrder === "price_asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "price_desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return list;
  }, [searchResults, selectedBrand, sortOrder]);

  // Reset trang về 1 khi từ khóa, hãng hoặc thứ tự sắp xếp thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedBrand, sortOrder]);

  const totalPages = Math.ceil(finalResults.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = finalResults.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === item.id && i.color === item.color);
      if (exist) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setToastMessage(`Đã thêm ${item.name} vào giỏ hàng.`);
  };

  const hotKeywords = ["iPhone 18 Pro", "Galaxy S24", "Xiaomi 14", "Điện thoại gập", "Pin 5000mAh", "Apple"];

  return (
    <div className="storefront-root" style={{ backgroundColor: "var(--color-studio-mist)", minHeight: "100vh" }}>
      <AnnouncementBar />
      <HomeHeader
        brands={brands}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        products={products}
      />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-5) 60px var(--space-5)" }}>
        {/* Breadcrumb theo Bảng 1 */}
        <Breadcrumb items={[{ label: "Tìm kiếm", link: null }, { label: query ? `"${query}"` : "Tất cả sản phẩm" }]} />

        {/* Tiêu đề & Số lượng kết quả theo Bảng 2 */}
        <div style={{ margin: "20px 0 24px 0", display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 6px 0" }}>
              {query ? `Kết quả tìm kiếm cho: "${query}"` : "Tìm kiếm sản phẩm"}
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--color-slate)" }}>
              Tìm thấy <strong style={{ color: "var(--color-ink)" }}>{finalResults.length}</strong> sản phẩm phù hợp
            </p>
          </div>

          {/* Sắp xếp */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "var(--color-slate)" }}>Sắp xếp:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                height: "36px",
                borderRadius: "9999px",
                padding: "0 14px",
                border: "1px solid var(--color-hairline-silver)",
                backgroundColor: "var(--color-gallery-white)",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--color-ink)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="relevance">Liên quan nhất</option>
              <option value="price_asc">Giá Thấp → Cao</option>
              <option value="price_desc">Giá Cao → Thấp</option>
            </select>
          </div>
        </div>

        {/* Danh sách lọc nhanh theo hãng */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          <button
            type="button"
            onClick={() => setSelectedBrand("all")}
            style={{
              height: "32px",
              padding: "0 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: selectedBrand === "all" ? 600 : 500,
              backgroundColor: selectedBrand === "all" ? "var(--color-pricing-blue)" : "var(--color-gallery-white)",
              color: selectedBrand === "all" ? "#fff" : "var(--color-ink)",
              border: selectedBrand === "all" ? "1px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
              cursor: "pointer",
            }}
          >
            Tất cả hãng
          </button>
          {brands.map((b) => {
            const bName = typeof b === "string" ? b : b.name;
            const isSel = selectedBrand.toLowerCase() === bName.toLowerCase();
            return (
              <button
                key={bName}
                type="button"
                onClick={() => setSelectedBrand(bName)}
                style={{
                  height: "32px",
                  padding: "0 14px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: isSel ? 600 : 500,
                  backgroundColor: isSel ? "var(--color-pricing-blue)" : "var(--color-gallery-white)",
                  color: isSel ? "#fff" : "var(--color-ink)",
                  border: isSel ? "1px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                  cursor: "pointer",
                }}
              >
                {bName}
              </button>
            );
          })}
        </div>

        {/* Lưới sản phẩm hoặc Trạng thái trống (gợi ý khi không có kết quả theo Bảng 2) */}
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--color-slate)" }}>
            Đang tải dữ liệu sản phẩm...
          </div>
        ) : finalResults.length > 0 ? (
          <>
            <div className="product-card-grid">
              {paginatedResults.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  statusLabel="Chính hãng"
                  onSelectProduct={(p) => navigate(`/product/${p.id}`)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Phân trang Apple Clean Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "32px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  style={{
                    height: "38px",
                    padding: "0 14px",
                    borderRadius: "9999px",
                    border: "1px solid var(--color-hairline-silver)",
                    backgroundColor: "var(--color-gallery-white)",
                    color: currentPage === 1 ? "#a1a1a6" : "var(--color-ink)",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    transition: "all 150ms ease",
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Trước</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "9999px",
                        border: isActive ? "1px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                        backgroundColor: isActive ? "var(--color-pricing-blue)" : "var(--color-gallery-white)",
                        color: isActive ? "#ffffff" : "var(--color-ink)",
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 150ms ease",
                      }}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  style={{
                    height: "38px",
                    padding: "0 14px",
                    borderRadius: "9999px",
                    border: "1px solid var(--color-hairline-silver)",
                    backgroundColor: "var(--color-gallery-white)",
                    color: currentPage === totalPages ? "#a1a1a6" : "var(--color-ink)",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    transition: "all 150ms ease",
                  }}
                >
                  <span>Sau</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "24px",
              padding: "48px 24px",
              textAlign: "center",
              border: "1px solid var(--color-hairline-silver)",
              margin: "20px 0",
            }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--color-studio-mist)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", color: "var(--color-slate)" }}>
              <Search size={32} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--color-ink)" }}>
              Không tìm thấy sản phẩm nào khớp với "{query}"
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-slate)", margin: "0 0 24px 0" }}>
              Hãy thử kiểm tra lại lỗi chính tả hoặc tìm theo các gợi ý bên dưới:
            </p>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
              {hotKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(kw)}`)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    backgroundColor: "var(--color-studio-mist)",
                    border: "1px solid var(--color-hairline-silver)",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--color-pricing-blue)",
                    cursor: "pointer",
                  }}
                >
                  🔍 {kw}
                </button>
              ))}
            </div>

            <Link
              to="/dien-thoai"
              className="btn-pricing-blue"
              style={{ textDecoration: "none", display: "inline-block", padding: "10px 24px", borderRadius: "9999px" }}
            >
              Xem tất cả dòng điện thoại
            </Link>
          </div>
        )}
      </main>

      <StorefrontFooter />
      <FloatingSupportWidget />
      <CookieConsentBanner />
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, qty) =>
          setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
        }
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

