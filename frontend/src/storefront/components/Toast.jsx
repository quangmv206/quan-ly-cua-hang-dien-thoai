import React, { useEffect } from "react";
import { Check, X } from "lucide-react";

export default function Toast({ message, onClose }) {
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onCloseRef.current) onCloseRef.current();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className="storefront-toast" role="status" aria-live="polite">
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: "var(--color-ink)",
          color: "var(--color-gallery-white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={16} strokeWidth={2.5} aria-hidden="true" />
      </div>

      <div style={{ flex: 1, fontSize: "13px", color: "var(--color-ink)", lineHeight: 1.4 }}>
        {message}
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--color-slate)",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Đóng thông báo"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

