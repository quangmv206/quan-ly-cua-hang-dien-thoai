import React from "react";

export default function EditorialSection({ productName = "[TÊN SẢN PHẨM]", deviceImageUrl = null }) {
  return (
    <section id="story" className="editorial-section" aria-label="Thiết kế và câu chuyện sản phẩm">
      <div className="editorial-container">
        {/* Left-aligned Storytelling Block */}
        <div>
          <span className="editorial-kicker">Chế tác thủ công cơ khí</span>
          <h2 className="editorial-headline">
            Đường nét thanh mảnh. Cấu trúc nguyên khối hoàn mỹ.
          </h2>
          <p className="editorial-body">
            Mỗi đường vát cạnh trên {productName} được xử lý bằng mũi cắt kim cương chính xác đến từng micromet. Viền màn hình thu hẹp tối đa tạo ra không gian thị giác vô cực liền mạch.
          </p>
          <p className="editorial-body">
            Mặt lưng kính nhám tạo hiệu ứng phản xạ ánh sáng êm dịu, chống bám vân tay và chống trầy xước vượt trội trong điều kiện sử dụng hàng ngày.
          </p>

          <div style={{ marginTop: "24px" }}>
            <a href="#configurator" className="link-apple-blue">
              Tìm hiểu thêm về vật liệu chế tác
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ marginLeft: "4px" }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Oversized Hardware Image Entering from Right */}
        <div
          className="editorial-media-wrapper"
          style={{
            height: "360px",
            borderRadius: "28px",
            overflow: "hidden",
            backgroundColor: "#f5f5f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          {deviceImageUrl ? (
            <img
              src={deviceImageUrl}
              alt={productName}
              loading="lazy"
              style={{
                maxHeight: "85%",
                maxWidth: "85%",
                objectFit: "contain",
                filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.12))",
                transition: "transform 500ms ease",
              }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "24px" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-steel)" strokeWidth="1.5" aria-hidden="true" style={{ margin: "0 auto 12px auto" }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" />
                <path d="M3 12h18" />
              </svg>
              <p style={{ fontSize: "14px", color: "var(--color-slate)", margin: 0 }}>
                [Khung ảnh cận cảnh góc cạnh phần cứng - {productName}]
              </p>
              <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block", marginTop: "4px" }}>
                Tỉ lệ khung hình mở rộng 28px radius
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

