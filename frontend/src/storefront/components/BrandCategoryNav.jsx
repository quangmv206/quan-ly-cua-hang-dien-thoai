import React from "react";

export default function BrandCategoryNav({
  brands = [],
  selectedBrand,
  onSelectBrand,
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <nav className="section-anchor-nav" aria-label="Bộ lọc thương hiệu và nhóm sản phẩm">
      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 var(--space-5)" }}>
        {/* Hàng 1: Lọc theo Hãng */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-4)", overflowX: "auto", paddingBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Hãng:
          </span>

          <button
            type="button"
            className={`brand-anchor-btn ${selectedBrand === null ? "active" : ""}`}
            onClick={() => onSelectBrand(null)}
          >
            Tất cả hãng
          </button>

          {brands.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`brand-anchor-btn ${selectedBrand === b.name ? "active" : ""}`}
              onClick={() => onSelectBrand(b.name)}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Hàng 2: Lọc theo Nhóm phân khúc */}
        {categories.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)", overflowX: "auto", borderTop: "1px solid var(--color-hairline-silver)", paddingTop: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>Phân khúc:</span>
            <button
              type="button"
              className={`brand-anchor-btn ${selectedCategory === null ? "active" : ""}`}
              style={{ fontSize: "14px" }}
              onClick={() => onSelectCategory(null)}
            >
              Tất cả phân khúc
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`brand-anchor-btn ${selectedCategory === c.name ? "active" : ""}`}
                style={{ fontSize: "14px" }}
                onClick={() => onSelectCategory(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

