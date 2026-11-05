import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "./ProductCard";

export default function NewArrivalsSection({ products = [], onSelectProduct, onAddToCart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayItems = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById("new-arrivals");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="new-arrivals" className="highlights-section" aria-label="Danh sách điện thoại mới về">
      <div className="highlights-container">
        {/* Section Header */}
        <div className="highlights-header">
          <div>
            {/* Launch Status Label: #b64400 bare text, no background or border */}
            <span className="label-launch-status">Cập nhật lô hàng mới nhất</span>
            <h2 className="highlights-title">Hàng mới về tại Phone Store.</h2>
          </div>

          <a href="/dien-thoai" className="link-apple-blue">
            Xem toàn bộ điện thoại mới về
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        </div>

        {/* Product Cards Grid: Thẻ chuẩn 100% ảnh mẫu thiết kế */}
        <div className="product-card-grid">
          {displayItems.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              statusLabel="Mới về"
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
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
      </div>
    </section>
  );
}
