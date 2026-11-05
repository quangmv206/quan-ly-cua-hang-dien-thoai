import React from "react";

export default function HeroStage({
  productName = "[TÊN SẢN PHẨM]",
  heroStatement = "Khái niệm mới của sự hoàn hảo.",
  priceFormatted = "[GIÁ]",
  monthlyFormatted = "Hoặc trả góp từ [GIÁ]/tháng",
  deviceImageUrl,
  onBuyNowClick,
}) {
  return (
    <section id="hero" className="hero-stage" aria-label="Giới thiệu sản phẩm">
      <div className="hero-content">
        {/* Launch Status Label: #b64400 bare text, no background or border */}
        <span className="label-launch-status">Mới ra mắt</span>

        {/* Product Kicker in 21px/600 */}
        <p className="hero-product-kicker">{productName}</p>

        {/* Display Statement: 80px/600, 84px line-height, -0.015em tracking */}
        <h1 className="hero-display-statement">{heroStatement}</h1>

        <p className="hero-preorder-note">
          Đặt trước ngay hôm nay. Nhận hàng sớm nhất kèm ưu đãi đặc quyền từ Apple Store.
        </p>

        {/* Device Render without a containing card */}
        <div className="hero-device-container">
          {deviceImageUrl ? (
            <img
              src={deviceImageUrl}
              alt={`Hình ảnh sản phẩm ${productName}`}
              className="hero-device-render"
              width="860"
              height="480"
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="hero-device-render"
              style={{
                backgroundColor: "var(--color-studio-mist)",
                borderRadius: "var(--radius-images)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--color-hairline-silver)",
                padding: "var(--space-8)",
                minHeight: "360px",
              }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-steel)" strokeWidth="1.5" aria-hidden="true">
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <path d="M12 18h.01" />
              </svg>
              <p style={{ marginTop: "16px", color: "var(--color-slate)", fontSize: "14px" }}>
                [Khung hiển thị hình ảnh thiết bị - {productName}]
              </p>
            </div>
          )}

          {/* Floating Pricing Callout: 28px radius capsule, white, no drop shadow */}
          <aside className="floating-pricing-capsule" aria-label="Thông tin giá và đặt mua">
            <div className="floating-pricing-info">
              <p className="floating-pricing-amount">Từ {priceFormatted}</p>
              <p className="floating-pricing-sub">{monthlyFormatted}</p>
            </div>

            {/* Pricing Blue Pill inside callout */}
            <button
              type="button"
              className="btn-pricing-blue"
              onClick={onBuyNowClick}
            >
              Đặt mua
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}

