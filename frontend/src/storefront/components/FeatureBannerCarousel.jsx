import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Sparkles, Cpu, Camera, Layers, ShieldCheck } from "lucide-react";
import { siteSettingsApi } from "../../services/siteSettingsApi";

const defaultSlides = [
  {
    id: "titanium",
    badgeIcon: ShieldCheck,
    badgeLabel: "Titanium Grade 5",
    titleTop: "Khung viền Titan và bản lề siêu mỏng.",
    titleBottom: "Bền bỉ, tinh xảo và sang trọng tuyệt đối.",
    titleEn: "Titanium frame and hinge cover. Beautiful and durable.",
    accentColor: "#9a9790",
    metallicTone: "#d8d5ce",
    modelName: "iPhone 16 Pro & Galaxy Fold Titanium",
    renderType: "titanium-hinge",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "galaxy-ai",
    badgeIcon: Sparkles,
    badgeLabel: "Galaxy AI & S-Pen",
    titleTop: "Trí tuệ nhân tạo Galaxy AI đột phá.",
    titleBottom: "Tối ưu mọi tác vụ và khoảnh khắc nhiếp ảnh.",
    titleEn: "Empowered by Galaxy AI. Intelligence in every touch.",
    accentColor: "#1428a0",
    metallicTone: "#c0c6e8",
    modelName: "Samsung Galaxy S24 Ultra",
    renderType: "galaxy-profile",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "leica-optics",
    badgeIcon: Camera,
    badgeLabel: "Leica Summilux",
    titleTop: "Ống kính quang học Leica khẩu độ vô cấp.",
    titleBottom: "Nhiếp ảnh chuẩn điện ảnh trong lòng bàn tay.",
    titleEn: "Leica quad-camera system. Masterpiece of light and shadow.",
    accentColor: "#ea580c",
    metallicTone: "#ffdfcf",
    modelName: "Xiaomi 14 Ultra 5G",
    renderType: "leica-profile",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "fold-hinge",
    badgeIcon: Layers,
    badgeLabel: "Flexion Hinge",
    titleTop: "Bản lề tàng hình không nếp gấp gập mở êm ái.",
    titleBottom: "Mỏng nhẹ hàng đầu với chuẩn độ bền 500.000 lần gập.",
    titleEn: "Zero-crease seamless hinge. Featherlight foldable design.",
    accentColor: "#059669",
    metallicTone: "#bbf7d0",
    modelName: "OPPO Find N3 Flip",
    renderType: "fold-profile",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&auto=format&fit=crop&q=80",
  },
];

export default function FeatureBannerCarousel() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);
  const timerRef = useRef(null);

  // Tải cấu hình slide từ Backend CMS API
  useEffect(() => {
    siteSettingsApi.getByKey("home_feature_carousel")
      .then((res) => {
        if (res.data && res.data.value) {
          try {
            const parsed = JSON.parse(res.data.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSlides((prev) =>
                prev.map((s, idx) => {
                  const match = parsed[idx] || parsed.find((p) => p.id === s.id);
                  if (match) {
                    return {
                      ...s,
                      titleTop: match.titleTop || s.titleTop,
                      titleBottom: match.titleBottom || s.titleBottom,
                      badgeLabel: match.badgeLabel || s.badgeLabel,
                      modelName: match.modelName || s.modelName,
                      imageUrl: match.imageUrl !== undefined ? match.imageUrl : s.imageUrl,
                    };
                  }
                  return s;
                })
              );
            }
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Tự động xoay vòng carousel khi đang bật play
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 4200);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, slides.length]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSelectSlide = (idx) => {
    setActiveSlide(idx);
  };

  return (
    <section
      className="feature-banner-carousel-section"
      aria-label="Điểm nhấn công nghệ phần cứng"
      style={{
        backgroundColor: "var(--color-studio-mist)",
        padding: "60px 0 70px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Carousel Viewport với hiệu ứng Peeking Card hai bên */}
        <div
          className="feature-carousel-viewport"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "420px",
          }}
        >
          {slides.map((slide, idx) => {
            const isCurrent = idx === activeSlide;
            const isNext = idx === (activeSlide + 1) % slides.length;
            const isPrev = idx === (activeSlide - 1 + slides.length) % slides.length;

            if (!isCurrent && !isNext && !isPrev) return null;

            let transform = "translateX(100%) scale(0.92)";
            let opacity = 0;
            let zIndex = 1;

            if (isCurrent) {
              transform = "translateX(0) scale(1)";
              opacity = 1;
              zIndex = 10;
            } else if (isNext) {
              transform = "translateX(82%) scale(0.94)";
              opacity = 0.5;
              zIndex = 5;
            } else if (isPrev) {
              transform = "translateX(-82%) scale(0.94)";
              opacity = 0.5;
              zIndex = 5;
            }

            const BadgeIcon = slide.badgeIcon;

            return (
              <article
                key={slide.id}
                className={`feature-banner-card ${isCurrent ? "active-card" : ""}`}
                style={{
                  position: isCurrent ? "relative" : "absolute",
                  width: "100%",
                  maxWidth: "880px",
                  height: "400px",
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "28px",
                  border: "1px solid var(--color-hairline-silver)",
                  boxShadow: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "32px 36px 40px 36px",
                  transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease",
                  transform,
                  opacity,
                  zIndex,
                  cursor: isCurrent ? "default" : "pointer",
                  userSelect: "none",
                }}
                onClick={() => {
                  if (!isCurrent) handleSelectSlide(idx);
                }}
              >
                {/* 1. Top Bar: Badge góc trên bên trái giống hệt ảnh mẫu */}
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "var(--color-ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-gallery-white)",
                    }}
                    title={slide.badgeLabel}
                    aria-label={slide.badgeLabel}
                  >
                    <BadgeIcon size={16} strokeWidth={2} />
                  </div>
                </div>

                {/* 2. Center Hardware Showcase: Profile ngang của điện thoại (SVG siêu sắc nét hoặc ảnh tải lên từ thiết bị) */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    minHeight: "180px",
                    margin: "12px 0",
                    position: "relative",
                  }}
                >
                  {slide.imageUrl ? (
                    <div
                      style={{
                        width: "100%",
                        height: "180px",
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundColor: "#f5f5f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={slide.imageUrl}
                        alt={slide.titleTop}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          transition: "transform 500ms ease",
                        }}
                      />
                    </div>
                  ) : (
                    <svg
                      viewBox="0 0 680 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: "100%",
                        maxWidth: "580px",
                        height: "auto",
                        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.06))",
                      }}
                      aria-hidden="true"
                    >
                      {/* Đường bóng mờ phản chiếu bên dưới */}
                      <ellipse cx="340" cy="98" rx="260" ry="6" fill="#e8e8ed" opacity="0.7" />

                      {/* Khung viền thân máy chính (Horizontal Ultra-Slim Chassis) */}
                      <g id="phone-chassis">
                        {/* Thân máy chính */}
                        <rect
                          x="70"
                          y="46"
                          width="540"
                          height="20"
                          rx="10"
                          fill="#1c1c1e"
                          stroke={slide.metallicTone}
                          strokeWidth="2.5"
                        />

                        {/* Viền kim loại bóng bẩy sáng phản chiếu (Metallic Chamfer Highlight) */}
                        <rect
                          x="72"
                          y="47.5"
                          width="536"
                          height="3"
                          rx="1.5"
                          fill="#ffffff"
                          opacity="0.85"
                        />

                        {/* Dải ăng-ten hairline dọc */}
                        <line x1="180" y1="46" x2="180" y2="66" stroke="#505052" strokeWidth="2.5" />
                        <line x1="280" y1="46" x2="280" y2="66" stroke="#505052" strokeWidth="2.5" />
                        <line x1="430" y1="46" x2="430" y2="66" stroke="#505052" strokeWidth="2.5" />

                        {/* Bản lề cơ học chính giữa (Hinge Cover) */}
                        <rect
                          x="274"
                          y="44"
                          width="12"
                          height="24"
                          rx="3"
                          fill="#2c2c2e"
                          stroke={slide.accentColor}
                          strokeWidth="1.5"
                        />
                        <line x1="280" y1="45" x2="280" y2="67" stroke="#ffffff" strokeWidth="1" opacity="0.7" />

                        {/* Cụm camera lồi bên trái (Camera Module Island Bump) */}
                        <path
                          d="M 85 66 L 95 84 Q 98 88 104 88 L 225 88 Q 230 88 233 84 L 243 66 Z"
                          fill="#f7f7f8"
                          stroke="var(--color-hairline-silver)"
                          strokeWidth="2"
                        />

                        {/* 3 Ống kính camera nhô ra từ bump */}
                        {/* Lens 1 */}
                        <rect x="110" y="88" width="28" height="6" rx="2" fill="#1c1c1e" stroke={slide.accentColor} strokeWidth="1.5" />
                        <ellipse cx="124" cy="94" rx="9" ry="2" fill="#404040" />

                        {/* Lens 2 */}
                        <rect x="155" y="88" width="28" height="6" rx="2" fill="#1c1c1e" stroke={slide.accentColor} strokeWidth="1.5" />
                        <ellipse cx="169" cy="94" rx="9" ry="2" fill="#404040" />

                        {/* Lens 3 */}
                        <rect x="200" y="88" width="28" height="6" rx="2" fill="#1c1c1e" stroke={slide.accentColor} strokeWidth="1.5" />
                        <ellipse cx="214" cy="94" rx="9" ry="2" fill="#404040" />

                        {/* Nút nguồn & nút âm lượng phía trên */}
                        <rect x="115" y="42" width="28" height="4" rx="1.5" fill="#505052" />
                        <rect x="150" y="42" width="28" height="4" rx="1.5" fill="#505052" />
                        <rect x="420" y="42" width="36" height="4" rx="1.5" fill="#505052" />

                        {/* Dải lỗ loa ngoài bên phải (Speaker Grill Holes) */}
                        <circle cx="495" cy="56" r="1.8" fill="#505052" />
                        <circle cx="503" cy="56" r="1.8" fill="#505052" />
                        <circle cx="511" cy="56" r="1.8" fill="#505052" />
                        <circle cx="519" cy="56" r="1.8" fill="#505052" />
                        <circle cx="527" cy="56" r="1.8" fill="#505052" />
                        <circle cx="535" cy="56" r="1.8" fill="#505052" />
                      </g>
                    </svg>
                  )}
                </div>

                {/* 3. Bottom Text: Hai dòng chữ căn giữa thanh lịch y hệt ảnh */}
                <div style={{ textAlign: "center", marginTop: "12px" }}>
                  <h3
                    style={{
                      fontSize: "clamp(16px, 2.2vw, 20px)",
                      fontWeight: 600,
                      lineHeight: 1.35,
                      color: "var(--color-ink)",
                      margin: 0,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {slide.titleTop}
                  </h3>
                  <p
                    style={{
                      fontSize: "clamp(15px, 2vw, 18px)",
                      fontWeight: 500,
                      lineHeight: 1.35,
                      color: "var(--color-ink)",
                      margin: "4px 0 0 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {slide.titleBottom}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* 4. Controls: Capsule chỉ số chấm tiến độ + Nút tròn Pause/Play viền xanh chuẩn 100% ảnh */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "32px",
          }}
        >
          {/* Capsule chứa các chấm tiến độ */}
          <div
            className="banner-dots-capsule"
            role="tablist"
            aria-label="Danh sách slide điểm nhấn công nghệ"
            style={{
              height: "36px",
              backgroundColor: "rgba(215, 215, 220, 0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "9999px",
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {slides.map((_, dotIdx) => {
              const isDotActive = dotIdx === activeSlide;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  role="tab"
                  aria-selected={isDotActive}
                  aria-label={`Chuyển tới slide ${dotIdx + 1}: ${slides[dotIdx].modelName}`}
                  onClick={() => handleSelectSlide(dotIdx)}
                  style={{
                    height: "6px",
                    width: isDotActive ? "26px" : "6px",
                    borderRadius: "9999px",
                    backgroundColor: isDotActive ? "var(--color-ink)" : "rgba(0, 0, 0, 0.35)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              );
            })}
          </div>

          {/* Nút tròn Pause / Play viền xanh (#0071e3) y hệt ảnh người dùng gửi */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Tạm dừng tự động chuyển banner" : "Tiếp tục tự động chuyển banner"}
            title={isPlaying ? "Tạm dừng" : "Tự động chạy"}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--color-gallery-white)",
              border: "2px solid var(--color-pricing-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-ink)",
              cursor: "pointer",
              padding: 0,
              boxShadow: "none",
              transition: "transform 150ms ease, opacity 200ms ease",
            }}
          >
            {isPlaying ? (
              <Pause size={14} strokeWidth={2.5} color="var(--color-ink)" aria-hidden="true" />
            ) : (
              <Play size={14} strokeWidth={2.5} color="var(--color-pricing-blue)" style={{ marginLeft: "2px" }} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

