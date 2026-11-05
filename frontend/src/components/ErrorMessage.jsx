import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-container error-state">
      <div className="state-icon-circle error-circle">
        <AlertCircle size={36} />
      </div>
      <h3 className="state-title">Đã xảy ra lỗi kết nối</h3>
      <p className="state-desc">{message || "Không thể gọi API từ Spring Boot (:8080). Hãy chắc chắn Backend đang chạy."}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary retry-btn">
          <RefreshCw size={16} /> Thử lại
        </button>
      )}
    </div>
  );
}
