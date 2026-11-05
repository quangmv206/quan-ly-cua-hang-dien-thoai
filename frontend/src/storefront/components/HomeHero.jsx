import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Cpu, Camera, ShieldCheck } from "lucide-react";
import { siteSettingsApi } from "../../services/siteSettingsApi";

export default function HomeHero({ onExploreClick, featuredProduct }) {
  const [heroData, setHeroData] = useState({
    title: "PHONE STORE • SMARTPHONE FLAGSHIP & TẦM TRUNG 2024 - 2025",
    headline: "Đỉnh cao công nghệ. Đa dạng thương hiệu hàng đầu.",
    description: "Hội tụ trọn vẹn những dòng smartphone đột phá từ Apple iPhone, Samsung Galaxy AI, Xiaomi Leica đến OPPO gập. Bảo hành chính hãng 12-24 tháng, hỗ trợ trả góp 0% và thu cũ đổi mới trợ giá cao.",
    buttonText: "Khám phá ngay",
    badgeText: "Hệ thống bán lẻ điện thoại di động chính hãng toàn quốc",
  });

  useEffect(() => {
    siteSettingsApi.getByKey("home_hero")
      .then((res) => {
        if (res.data && res.data.value) {
          try {
            const parsed = JSON.parse(res.data.value);
            setHeroData((prev) => ({
              ...prev,
              title: parsed.title ? `PHONE STORE • ${parsed.title.toUpperCase()}` : prev.title,
              headline: parsed.headline || prev.headline,
              description: parsed.description || prev.description,
              buttonText: parsed.buttonText || prev.buttonText,
              badgeText: parsed.badgeText || prev.badgeText,
              imageUrl: parsed.imageUrl || prev.imageUrl,
            }));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const formatPrice = (val) => {
    if (!val) return "6.490.000 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const startingPrice = featuredProduct?.price ? formatPrice(featuredProduct.price) : "6.490.000 đ";

  return (
    <section id="home-hero" className="hero-stage" aria-label="Thông điệp chính cửa hàng">
      <div className="hero-content">
        {/* Launch Status Label: #b64400 bare text, no background or border */}
        <span className="label-launch-status">
          {heroData.badgeText}
        </span>

        {/* Product Kicker in 21px/600 */}
        <p className="hero-product-kicker">
          {heroData.title}
        </p>

        {/* Display Statement: clamp(38px, 6.5vw, 80px) / weight 600 strictly */}
        <h1 className="hero-display-statement">
          {heroData.headline}
        </h1>

        <p className="hero-preorder-note">
          {heroData.description}
        </p>

        {/* Device Showcase Frame without containing card (Gallery White canvas) */}
        <div className="hero-device-container">
          {heroData.imageUrl && (
            <div
              style={{
                width: "100%",
                maxWidth: "860px",
                margin: "0 auto 20px auto",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid var(--color-hairline-silver)",
                backgroundColor: "var(--color-gallery-white)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <img
                src={heroData.imageUrl}
                alt={heroData.headline}
                style={{
                  maxWidth: "100%",
                  maxHeight: "380px",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          )}

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
              padding: "var(--space-8) var(--space-6)",
              minHeight: "380px",
              boxShadow: "none",
            }}
          >
            {/* Visual Multi-brand Phone Showcase: Apple, Samsung, Xiaomi, OPPO */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                width: "100%",
                maxWidth: "820px",
                marginBottom: "20px",
              }}
            >
              {/* Card 1: Apple iPhone */}
              <div
                style={{
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "20px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "62px", height: "112px", border: "2.5px solid #1d1d1f", borderRadius: "16px", backgroundColor: "#fcfcfd", margin: "0 auto 10px auto", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
                  <div style={{ width: "20px", height: "5px", backgroundColor: "#1d1d1f", borderRadius: "3px" }} />
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#1d1d1f", letterSpacing: "0.02em" }}>A18 Pro</span>
                  <div style={{ width: "24px", height: "2px", backgroundColor: "#1d1d1f", borderRadius: "1px" }} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block" }}>Apple Flagship</span>
                  <strong style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)", display: "block" }}>iPhone 16 Pro Max</strong>
                  <span style={{ fontSize: "12px", color: "var(--color-pricing-blue)", fontWeight: 600, marginTop: "4px", display: "block" }}>Từ 34.990.000 đ</span>
                </div>
              </div>

              {/* Card 2: Samsung Galaxy */}
              <div
                style={{
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "20px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "64px", height: "116px", border: "2.5px solid #1428a0", borderRadius: "10px", backgroundColor: "#f9faff", margin: "0 auto 10px auto", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
                  <div style={{ width: "5px", height: "5px", backgroundColor: "#1428a0", borderRadius: "50%" }} />
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#1428a0", letterSpacing: "0.02em" }}>Galaxy AI</span>
                  <div style={{ width: "18px", height: "2px", backgroundColor: "#1428a0", borderRadius: "1px" }} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block" }}>Samsung AI</span>
                  <strong style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)", display: "block" }}>Galaxy S24 Ultra</strong>
                  <span style={{ fontSize: "12px", color: "var(--color-pricing-blue)", fontWeight: 600, marginTop: "4px", display: "block" }}>Từ 31.990.000 đ</span>
                </div>
              </div>

              {/* Card 3: Xiaomi Leica */}
              <div
                style={{
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "20px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "62px", height: "112px", border: "2.5px solid #ea580c", borderRadius: "14px", backgroundColor: "#fffaf7", margin: "0 auto 10px auto", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
                  <div style={{ width: "5px", height: "5px", backgroundColor: "#ea580c", borderRadius: "50%" }} />
                  <span style={{ fontSize: "8px", fontWeight: 700, color: "#ea580c" }}>LEICA OPTICS</span>
                  <div style={{ width: "18px", height: "2px", backgroundColor: "#ea580c", borderRadius: "1px" }} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block" }}>Xiaomi Leica</span>
                  <strong style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)", display: "block" }}>Xiaomi 14 Ultra</strong>
                  <span style={{ fontSize: "12px", color: "var(--color-pricing-blue)", fontWeight: 600, marginTop: "4px", display: "block" }}>Từ 28.990.000 đ</span>
                </div>
              </div>

              {/* Card 4: OPPO Fold */}
              <div
                style={{
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "20px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "58px", height: "106px", border: "2.5px solid #059669", borderRadius: "14px", backgroundColor: "#f0fdf4", margin: "0 auto 10px auto", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
                  <div style={{ width: "14px", height: "4px", backgroundColor: "#059669", borderRadius: "2px" }} />
                  <span style={{ fontSize: "8px", fontWeight: 700, color: "#059669" }}>FOLD / FLIP</span>
                  <div style={{ width: "14px", height: "2px", backgroundColor: "#059669", borderRadius: "1px" }} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block" }}>OPPO Foldable</span>
                  <strong style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-ink)", display: "block" }}>OPPO Find N3 Flip</strong>
                  <span style={{ fontSize: "12px", color: "var(--color-pricing-blue)", fontWeight: 600, marginTop: "4px", display: "block" }}>Từ 22.990.000 đ</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-slate)" }}>
                <ShieldCheck size={14} style={{ color: "var(--color-ink)" }} /> Máy mới 100% nguyên seal
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-slate)" }}>
                <Cpu size={14} style={{ color: "var(--color-ink)" }} /> Chipset xử lý cao cấp nhất
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-slate)" }}>
                <Camera size={14} style={{ color: "var(--color-ink)" }} /> Hệ thống camera đỉnh cao
              </span>
            </div>
          </div>

          {/* Floating Pricing Callout Capsule (28px radius, white fill, no cast shadows) */}
          <aside className="floating-pricing-capsule" aria-label="Khám phá ngay danh mục điện thoại">
            <div className="floating-pricing-info">
              <p className="floating-pricing-amount">Giá khởi điểm toàn hệ thống từ {startingPrice}</p>
              <p className="floating-pricing-sub">Trả góp 0% lãi suất • Đổi trả trong 30 ngày • Giao nhanh 2h miễn phí</p>
            </div>

            {/* Exactly One CTA Button as required by table */}
            <button
              type="button"
              className="btn-pricing-blue"
              onClick={onExploreClick}
              aria-label="Khám phá ngay tất cả các dòng điện thoại"
            >
              <span>Xem tất cả dòng máy</span>
              <ArrowRight size={15} style={{ marginLeft: "4px" }} aria-hidden="true" />
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
