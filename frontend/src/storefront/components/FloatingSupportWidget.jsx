import React, { useState } from "react";
import { PhoneCall, MessageCircle, Headphones, X, ChevronUp } from "lucide-react";

export default function FloatingSupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="floating-support-container"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
        fontFamily: "var(--font-family-sans)",
      }}
      aria-label="Tiện ích hỗ trợ khách hàng"
    >
      {/* Menu các kênh liên hệ khi mở ra */}
      {open && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "18px",
            border: "1px solid var(--color-hairline-silver, #d6d6d6)",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minWidth: "200px",
            animation: "fadeInUp 200ms ease-out",
          }}
        >
          <div style={{ padding: "4px 8px 8px 8px", borderBottom: "1px solid var(--color-hairline-silver)", fontSize: "12px", fontWeight: 600, color: "var(--color-ink)" }}>
            Hỗ trợ khách hàng 24/7
          </div>

          <a
            href="tel:18006868"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              borderRadius: "10px",
              textDecoration: "none",
              color: "var(--color-ink)",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "rgba(0, 113, 227, 0.06)",
              transition: "background-color 150ms ease",
            }}
          >
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--color-pricing-blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhoneCall size={14} />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--color-slate)" }}>Tổng đài miễn phí</div>
              <strong style={{ fontSize: "13px" }}>1800 6868</strong>
            </div>
          </a>

          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              borderRadius: "10px",
              textDecoration: "none",
              color: "var(--color-ink)",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "rgba(0, 136, 255, 0.06)",
              transition: "background-color 150ms ease",
            }}
          >
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#0068ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "11px" }}>
              Zalo
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--color-slate)" }}>Chat qua Zalo</div>
              <span style={{ fontSize: "13px" }}>Phone Store Official</span>
            </div>
          </a>

          <a
            href="/faq"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              borderRadius: "10px",
              textDecoration: "none",
              color: "var(--color-ink)",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "var(--color-studio-mist, #f5f5f7)",
              transition: "background-color 150ms ease",
            }}
          >
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--color-slate)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Headphones size={14} />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--color-slate)" }}>Hỏi đáp & Bảo hành</div>
              <span style={{ fontSize: "13px" }}>Trung tâm hỗ trợ</span>
            </div>
          </a>
        </div>
      )}

      {/* Nút tròn nổi chính */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Đóng menu hỗ trợ" : "Mở kênh hỗ trợ tư vấn"}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: open ? "var(--color-ink, #1d1d1f)" : "var(--color-pricing-blue, #0071e3)",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 6px 20px rgba(0, 113, 227, 0.35)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 200ms ease, background-color 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? <X size={20} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}

