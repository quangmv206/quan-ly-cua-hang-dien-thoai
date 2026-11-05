import React from "react";
import {
  X,
  Smartphone,
  Tv,
  Cpu,
  Camera,
  BatteryCharging,
  Shield,
  Wifi,
  Weight,
  Calendar,
  CheckCircle2,
  Clock,
  Layers
} from "lucide-react";

export default function ProductDetailModal({ isOpen, onClose, phone, onEdit, onManageVariants }) {
  if (!isOpen || !phone) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="text-primary" size={22} />
              <h3 className="modal-title">{phone.name}</h3>
            </div>
            <p className="text-sm text-muted">
              Mã sản phẩm: #{phone.id} | Hãng: <strong>{phone.brand?.name || "N/A"}</strong> | Danh mục:{" "}
              <strong>{phone.category?.name || "N/A"}</strong>
            </p>
          </div>
          <button onClick={onClose} className="btn-icon close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body p-6 space-y-6">
          {/* Header Card với Giá, Tồn kho & Ảnh */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-muted uppercase font-bold tracking-wider">Giá niêm yết chính hãng</div>
              <div className="text-2xl font-bold text-primary mt-0.5">{formatPrice(phone.price)}</div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`stock-pill text-sm py-1.5 px-3 ${
                  phone.quantity > 5 ? "in-stock" : phone.quantity > 0 ? "low-stock" : "out-stock"
                }`}
              >
                Kho: <strong>{phone.quantity} máy</strong>
              </span>
              {onManageVariants && (
                <button
                  onClick={() => {
                    onClose();
                    onManageVariants(phone);
                  }}
                  className="btn btn-secondary text-sm flex items-center gap-1.5"
                >
                  <Layers size={15} /> Quản lý biến thể ({phone.variants?.length || 0})
                </button>
              )}
            </div>
          </div>

          {phone.description && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xs font-bold text-muted uppercase mb-1">Mô tả sản phẩm</h4>
              <p className="text-sm text-secondary leading-relaxed">{phone.description}</p>
            </div>
          )}

          {/* Bảng thông số kỹ thuật chi tiết */}
          <div>
            <h4 className="font-bold text-base mb-3 flex items-center gap-2 text-primary">
              <Cpu size={18} /> Bảng Thông Số Kỹ Thuật Chi Tiết (Full Specifications)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cột 1: Màn hình & Hiệu năng */}
              <div className="space-y-4">
                {/* Màn hình */}
                <div className="info-card">
                  <div className="info-card-title flex items-center gap-2">
                    <Tv size={16} className="text-primary" /> Màn hình & Hiển thị
                  </div>
                  <div className="info-row">
                    <span className="info-label">Kích thước:</span>
                    <span className="font-bold">{phone.screenSize || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Công nghệ:</span>
                    <span className="text-right">{phone.screenTech || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Độ phân giải:</span>
                    <span className="text-right">{phone.screenResolution || "Đang cập nhật"}</span>
                  </div>
                </div>

                {/* Vi xử lý & Bộ nhớ */}
                <div className="info-card">
                  <div className="info-card-title flex items-center gap-2">
                    <Cpu size={16} className="text-primary" /> Vi xử lý & Bộ nhớ
                  </div>
                  <div className="info-row">
                    <span className="info-label">Chipset (CPU):</span>
                    <span className="font-bold text-primary">{phone.cpu || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Chip đồ họa (GPU):</span>
                    <span>{phone.gpu || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Hệ điều hành:</span>
                    <span>{phone.os || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Dung lượng RAM:</span>
                    <span className="font-bold">{phone.ram || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Bộ nhớ trong:</span>
                    <span className="font-bold">{phone.storage || "Đang cập nhật"}</span>
                  </div>
                </div>
              </div>

              {/* Cột 2: Camera & Pin & Tiện ích */}
              <div className="space-y-4">
                {/* Camera */}
                <div className="info-card">
                  <div className="info-card-title flex items-center gap-2">
                    <Camera size={16} className="text-primary" /> Hệ thống Camera
                  </div>
                  <div className="info-row">
                    <span className="info-label">Camera sau:</span>
                    <span className="text-right font-medium max-w-[65%]">{phone.rearCamera || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Camera trước:</span>
                    <span className="text-right font-medium">{phone.frontCamera || "Đang cập nhật"}</span>
                  </div>
                </div>

                {/* Pin & Sạc & Kết nối */}
                <div className="info-card">
                  <div className="info-card-title flex items-center gap-2">
                    <BatteryCharging size={16} className="text-primary" /> Pin & Tiện ích
                  </div>
                  <div className="info-row">
                    <span className="info-label">Dung lượng Pin:</span>
                    <span className="font-bold">{phone.battery || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Công nghệ sạc:</span>
                    <span className="text-right">{phone.charging || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">SIM hỗ trợ:</span>
                    <span>{phone.sim || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mạng di động:</span>
                    <span>{phone.network || "5G"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Kháng nước/bụi:</span>
                    <span>{phone.waterproof || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Trọng lượng:</span>
                    <span>{phone.weight || "Đang cập nhật"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Bảo hành:</span>
                    <span className="font-bold text-success">{phone.warrantyPeriod || "12 tháng"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(phone);
              }}
              className="btn btn-primary"
            >
              Chỉnh sửa thông số
            </button>
          )}
          <button onClick={onClose} className="btn btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

