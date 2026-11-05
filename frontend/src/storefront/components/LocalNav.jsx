import React from "react";

export default function LocalNav({ productName = "[TÊN SẢN PHẨM]", priceFormatted = "[GIÁ]", onBuyNowClick }) {
  return (
    <nav className="local-nav-wrapper" aria-label={`Điều hướng sản phẩm ${productName}`}>
      <div className="local-nav-container">
        {/* Product Name in 19px/600 */}
        <h2 className="local-nav-title">{productName}</h2>

        {/* Right-aligned pill controls */}
        <div className="local-nav-controls">
          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-ink)", marginRight: "8px" }}>
            {priceFormatted}
          </span>

          {/* Outlined Explore Pill: Secondary control, transparent fill, 1px #86868b outline */}
          <a href="#highlights" className="btn-explore-pill">
            Khám phá
          </a>

          {/* Pricing Blue Pill: Filled conversion control, #0071e3 */}
          <button type="button" className="btn-pricing-blue" onClick={onBuyNowClick}>
            Mua ngay
          </button>
        </div>
      </div>
    </nav>
  );
}

