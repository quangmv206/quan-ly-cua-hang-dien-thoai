import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("phonestore_cookie_consent");
    if (!consent) {
      // Hiện sau 1 giây để không giật màn hình
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (accepted) => {
    localStorage.setItem("phonestore_cookie_consent", accepted ? "accepted" : "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Thông báo quyền riêng tư và Cookie"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        maxWidth: "520px",
        margin: "0 auto",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "20px",
        border: "1px solid var(--color-hairline-silver, #d6d6d6)",
        boxShadow: "0 14px 40px rgba(0, 0, 0, 0.12)",
        padding: "18px 22px",
        zIndex: 100,
        fontFamily: "var(--font-family-sans)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ color: "var(--color-pricing-blue)", marginTop: "2px" }}>
          <Shield size={20} />
        </div>
        <div>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 600, color: "var(--color-ink)" }}>
            Bảo mật & Trải nghiệm Cookie
          </h4>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--color-slate)", lineHeight: 1.45 }}>
            Phone Store sử dụng cookie cần thiết nhằm đảm bảo tính năng giỏ hàng, ghi nhớ phiên đăng nhập và tối ưu hóa tốc độ tải trang theo tiêu chuẩn quyền riêng tư.
          </p>
        </div>
      </div>

      {/* 2 nút ngang hàng bình đẳng: Chấp nhận / Từ chối (Không chọn sẵn đồng ý theo chuẩn WCAG/GDPR) */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => handleChoice(false)}
          className="btn-explore-pill"
          style={{
            height: "36px",
            padding: "0 18px",
            fontSize: "12px",
            fontWeight: 500,
            backgroundColor: "transparent",
            color: "var(--color-ink)",
            border: "1px solid var(--color-hairline-silver)",
            borderRadius: "9999px",
            cursor: "pointer",
          }}
        >
          Từ chối
        </button>

        <button
          type="button"
          onClick={() => handleChoice(true)}
          className="btn-pricing-blue"
          style={{
            height: "36px",
            padding: "0 22px",
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Chấp nhận
        </button>
      </div>
    </div>
  );
}

