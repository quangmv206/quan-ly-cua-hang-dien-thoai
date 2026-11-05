import React from "react";
import { PackageOpen, Plus } from "lucide-react";

export default function EmptyState({ message = "Không tìm thấy sản phẩm nào", onAction, actionText = "Thêm sản phẩm" }) {
  return (
    <div className="state-container empty-state">
      <div className="state-icon-circle empty-circle">
        <PackageOpen size={40} />
      </div>
      <h3 className="state-title">{message}</h3>
      <p className="state-desc">Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút thêm sản phẩm mới vào hệ thống.</p>
      {onAction && (
        <button onClick={onAction} className="btn btn-primary">
          <Plus size={16} /> {actionText}
        </button>
      )}
    </div>
  );
}
