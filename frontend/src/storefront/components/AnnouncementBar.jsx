import React, { useState, useEffect } from "react";
import { X, Sparkles, ChevronRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { siteSettingsApi } from "../../services/siteSettingsApi";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState({
    enabled: true,
    highlightText: "Ưu đãi đặc quyền:",
    content: "Giao hỏa tốc 2 giờ nội thành • Thu cũ đổi mới trợ giá đến 3.000.000đ • Trả góp 0%",
    actionText: "Xem chi tiết",
    actionLink: "/dien-thoai",
    hotline: "1800 6868",
  });

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("phonestore_announcement_dismissed");
    if (isDismissed === "true") {
      setVisible(false);
    }

    siteSettingsApi
      .getByKey("announcement_bar")
      .then((res) => {
        if (res.data && res.data.value) {
          try {
            const parsed = JSON.parse(res.data.value);
            setData(parsed);
            if (parsed.enabled === false) {
              setVisible(false);
            }
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("phonestore_announcement_dismissed", "true");
  };

  if (!visible || !data.enabled) return null;

  return (
    <aside
      aria-label="Thông báo ưu đãi nổi bật"
      style={{
        backgroundColor: "var(--color-ink, #1d1d1f)",
        color: "#ffffff",
        fontSize: "12px",
        lineHeight: "1.4",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 60,
        letterSpacing: "-0.01em",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textAlign: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--color-pricing-blue, #0071e3)", fontWeight: 600 }}>
          <Sparkles size={13} aria-hidden="true" />
          <span>{data.highlightText || "Ưu đãi đặc quyền:"}</span>
        </span>
        <span>{data.content}</span>
        {data.actionText && (
          <Link
            to={data.actionLink || "/dien-thoai"}
            style={{
              color: "var(--color-pricing-blue, #2997ff)",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span>{data.actionText}</span>
            <ChevronRight size={13} aria-hidden="true" />
          </Link>
        )}
        {data.hotline && (
          <span style={{ color: "#a1a1a6", marginLeft: "4px" }}>
            • Hotline: <strong style={{ color: "#ffffff" }}>{data.hotline}</strong>
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Đóng thông báo"
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: "rgba(255, 255, 255, 0.6)",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        }}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </aside>
  );
}
