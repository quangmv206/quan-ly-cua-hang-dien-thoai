import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Đang tải dữ liệu từ máy chủ..." }) {
  return (
    <div className="state-container loading-state">
      <Loader2 className="spinner-icon" size={40} />
      <p className="state-title">{message}</p>
      <span className="state-sub">Vui lòng đợi trong giây lát</span>
    </div>
  );
}
