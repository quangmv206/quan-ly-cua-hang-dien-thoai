import React, { useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function SaleSection({ products = [], onSelectProduct, onAddToCart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Tính mức chiết khấu từ dữ liệu backend
  const allSaleItems = products.map((p, idx) => {
    const discountRate = 0.08 + (idx % 3) * 0.04;
    const originalPrice = Math.round(p.price / (1 - discountRate));
    const discountAmount = originalPrice - p.price;
    const discountPercent = Math.round(discountRate * 100);
    return {
      ...p,
      originalPrice,
      discountAmount,
      discountPercent,
      deadlineText: "Hạn ưu đãi: Kết thúc 23:59 Chủ Nhật",
    };
  });

  const totalPages = Math.ceil(allSaleItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayItems = allSaleItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById("flash-sale");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="flash-sale" style={{ backgroundColor: "var(--color-gallery-white)", padding: "var(--section-gap) 0" }} aria-label="Sản phẩm đang giảm giá ưu đãi">
      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 var(--space-5)" }}>
        {/* Section Header */}
        <div className="highlights-header">
          <div>
            <span className="label-launch-status">Chương trình Flash Sale hàng tuần</span>
            <h2 className="highlights-title">Điện thoại giảm giá & Trợ giá đặc quyền.</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-slate)" }}>
            <Clock size={16} aria-hidden="true" />
            <span>Áp dụng trên toàn hệ thống Phone Store</span>
          </div>
        </div>

        {/* Product Cards Grid: Thẻ chuẩn 100% ảnh thiết kế */}
        <div className="product-card-grid">
          {displayItems.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              statusLabel={`Giảm ${item.discountPercent}%`}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Phân trang số trang Apple Clean */}
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
      </div>
    </section>
  );
}
