import React, { useState, useEffect } from "react";
import { Play, Pause, ChevronRight } from "lucide-react";

export default function HighlightsSection({ productName = "[TÊN SẢN PHẨM]", deviceImageUrl = null }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      label: "Vật liệu hoàn thiện",
      heading: "Titan cấp hàng không vũ trụ. Bền bỉ và nhẹ hơn bao giờ hết.",
      description: "Khung viền titan chế tác tinh xảo, bề mặt chải mờ sang trọng, mang lại cảm giác cầm nắm đầm tay nhưng nhẹ nhàng.",
      mediaLabel: "Chi tiết khung viền titan",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    },
    {
      label: "Sức mạnh vi xử lý",
      heading: "Chip thế hệ mới. Đột phá hiệu năng đồ họa và trí tuệ nhân tạo.",
      description: "Kiến trúc GPU nâng cấp vượt trội, hỗ trợ Ray Tracing tốc độ cao và xử lý mượt mà mọi tác vụ chuyên sâu.",
      mediaLabel: "Sơ đồ kiến trúc vi xử lý",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    },
    {
      label: "Hệ thống nhiếp ảnh",
      heading: "Camera Pro đa tiêu cự. Bắt trọn từng khung hình điện ảnh.",
      description: "Ống kính tiềm vọng zoom quang học xa nhất từ trước đến nay cùng cảm biến quad-pixel thu sáng ấn tượng.",
      mediaLabel: "Cụm camera chuyên nghiệp",
      imageUrl: deviceImageUrl || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
    },
  ];

  // Auto-advance carousel when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  return (
    <section id="highlights" className="highlights-section" aria-label="Những điểm nổi bật nhất">
      <div className="highlights-container">
        {/* Section Header */}
        <div className="highlights-header">
          <h2 className="highlights-title">Khám phá các điểm nổi bật.</h2>
          {/* Apple Blue text link (#0066cc) */}
          <a href="#configurator" className="link-apple-blue">
            Xem tất cả cấu hình & giá bán
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        </div>

        {/* Feature Media Cards (28px radius, white surface, shadowless) */}
        <div className="highlights-carousel-track" role="region" aria-label="Băng chuyền điểm nổi bật">
          {slides.map((item, idx) => (
            <article
              key={idx}
              className={`feature-media-card ${idx === activeSlide ? "active" : ""}`}
              style={{
                borderColor: idx === activeSlide ? "var(--color-pricing-blue)" : "var(--color-hairline-silver)",
              }}
            >
              <div>
                <p className="feature-card-label">{item.label}</p>
                <h3 className="feature-card-heading">{item.heading}</h3>
                <p style={{ fontSize: "14px", color: "var(--color-slate)", lineHeight: 1.4, margin: 0 }}>
                  {item.description}
                </p>
              </div>

              {/* Media preview container */}
              <div
                className="feature-card-media"
                style={{
                  marginTop: "24px",
                  height: "200px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: "#f5f5f7",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.mediaLabel}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: "transform 500ms ease",
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", padding: "16px" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-steel)" strokeWidth="1.5" aria-hidden="true" style={{ margin: "0 auto 8px auto" }}>
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>
                      [{item.mediaLabel}]
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Carousel Playback Control Pill */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="carousel-control-capsule" role="toolbar" aria-label="Điều khiển băng chuyền">
            <button
              type="button"
              className="carousel-playback-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Tạm dừng tự động chuyển slide" : "Tiếp tục tự động chuyển slide"}
            >
              {isPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            </button>

            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`carousel-indicator-dot ${dotIdx === activeSlide ? "active" : ""}`}
                onClick={() => {
                  setActiveSlide(dotIdx);
                  setIsPlaying(false);
                }}
                aria-label={`Chuyển đến slide ${dotIdx + 1}`}
                aria-current={dotIdx === activeSlide ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

