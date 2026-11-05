import React, { useState } from "react";
import { X, Package, CheckCircle2, Clock, Truck, XCircle, CreditCard, User, MapPin, Phone, Calendar, Loader2 } from "lucide-react";
import { orderApi } from "../services/orderApi";

export default function OrderDetailModal({ isOpen, onClose, order, onStatusUpdated }) {
  if (!isOpen || !order) return null;

  const [status, setStatus] = useState(order.status || "PENDING");
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || "UNPAID");
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  const formatPrice = (val) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

  const handleUpdate = async () => {
    setUpdating(true);
    setUpdateMsg("");
    try {
      await orderApi.updateStatus(order.id, { status, paymentStatus });
      setUpdateMsg("Cập nhật trạng thái thành công!");
      if (onStatusUpdated) {
        onStatusUpdated();
      }
      setTimeout(() => setUpdateMsg(""), 2500);
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="flex items-center gap-2">
              <Package className="text-primary" size={22} />
              <h3 className="modal-title">Chi tiết đơn hàng #{order.orderCode}</h3>
            </div>
            <p className="text-sm text-muted">ID đơn: {order.id} | Ngày tạo: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "N/A"}</p>
          </div>
          <button onClick={onClose} className="btn-icon close-btn">
            <X size={20} />
          </button>
        </div>

        {updateMsg && (
          <div className="alert alert-success mx-6 mt-4">
            <CheckCircle2 size={18} />
            <span>{updateMsg}</span>
          </div>
        )}

        <div className="modal-body">
          {/* Thông tin khách hàng & vận chuyển */}
          <div className="order-details-grid">
            <div className="info-card">
              <h4 className="info-card-title flex items-center gap-2">
                <User size={16} className="text-primary" /> Khách hàng & Người nhận
              </h4>
              <p className="info-row">
                <span className="info-label">Họ tên:</span>
                <span className="font-bold">{order.recipientName}</span>
              </p>
              <p className="info-row">
                <span className="info-label"><Phone size={14} className="inline mr-1" /> SĐT:</span>
                <span>{order.recipientPhone}</span>
              </p>
              <p className="info-row">
                <span className="info-label"><MapPin size={14} className="inline mr-1" /> Địa chỉ:</span>
                <span>{order.shippingAddress}</span>
              </p>
              {order.note && (
                <p className="info-row">
                  <span className="info-label">Ghi chú:</span>
                  <span className="italic text-muted">{order.note}</span>
                </p>
              )}
            </div>

            <div className="info-card">
              <h4 className="info-card-title flex items-center gap-2">
                <CreditCard size={16} className="text-primary" /> Thanh toán & Vận chuyển
              </h4>
              <p className="info-row">
                <span className="info-label">Hình thức:</span>
                <span className="font-bold">{order.paymentMethod || "COD (Nhận hàng thanh toán)"}</span>
              </p>
              <p className="info-row">
                <span className="info-label">Tiền hàng:</span>
                <span>{formatPrice(order.totalAmount - (order.shippingFee || 0))}</span>
              </p>
              <p className="info-row">
                <span className="info-label">Phí ship:</span>
                <span>{formatPrice(order.shippingFee || 0)}</span>
              </p>
              <p className="info-row border-t pt-2">
                <span className="info-label font-bold text-base">Tổng đơn:</span>
                <span className="font-bold text-lg text-primary">{formatPrice(order.totalAmount)}</span>
              </p>
            </div>
          </div>

          {/* Khối chi tiết Hồ Sơ Trả Góp 0% nếu là đơn trả góp */}
          {(order.paymentMethod === "installment" ||
            (order.notes && order.notes.includes("[ĐƠN TRẢ GÓP")) ||
            (order.note && order.note.includes("[ĐƠN TRẢ GÓP"))) && (
            <div
              style={{
                backgroundColor: "#fff7ed",
                border: "1.5px solid #fdba74",
                borderRadius: "14px",
                padding: "16px 18px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      backgroundColor: "#ea580c",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    HỒ SƠ TRẢ GÓP 0%
                  </span>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#9a3412" }}>
                    Chi tiết gói tài chính & Thủ tục xét duyệt
                  </h4>
                </div>
                <span style={{ fontSize: "12px", color: "#c2410c", fontWeight: 600 }}>
                  ⚡ Ưu tiên liên hệ khách trong 5 phút
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  border: "1px solid #fed7aa",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#1f2937",
                }}
              >
                {order.notes || order.note || "Khách hàng đăng ký mua trả góp 0% lãi suất."}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#7c2d12",
                }}
              >
                <span>✓ Kiểm tra CCCD / Thẻ tín dụng</span>
                <span>✓ Xác nhận số tiền trả trước</span>
                <span>✓ Hướng dẫn ký hợp đồng & Bàn giao máy</span>
              </div>
            </div>
          )}

          {/* Danh sách mặt hàng mua */}
          <div className="mt-6">
            <h4 className="font-bold text-base mb-2">Sản phẩm trong đơn ({order.items?.length || 0})</h4>
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên máy / Phiên bản</th>
                    <th>Mã SKU</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th className="text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="text-muted">{idx + 1}</td>
                        <td>
                          <div className="font-bold">{it.productName}</div>
                          {it.variantName && <div className="text-xs text-muted">{it.variantName}</div>}
                        </td>
                        <td className="text-xs text-muted">{it.sku || "N/A"}</td>
                        <td>{formatPrice(it.price)}</td>
                        <td className="font-bold">x{it.quantity}</td>
                        <td className="text-right font-bold text-primary">{formatPrice(it.lineTotal || it.price * it.quantity)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        Chi tiết sản phẩm đã được thanh toán tổng đơn {formatPrice(order.totalAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cập nhật trạng thái đơn (Phần Admin) */}
          <div className="admin-status-control card mt-6">
            <h4 className="font-bold text-base mb-3 flex items-center gap-2">
              <Clock size={18} className="text-warning" /> Quản lý trạng thái xử lý đơn hàng (ADMIN)
            </h4>
            <div className="status-form-row flex flex-wrap gap-4 items-center">
              <div className="form-group mb-0 flex-1 min-w-[200px]">
                <label className="form-label">Trạng thái đơn hàng</label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">🕒 Chờ xử lý (PENDING)</option>
                  <option value="CONFIRMED">✔ Đã xác nhận (CONFIRMED)</option>
                  <option value="SHIPPING">🚚 Đang vận chuyển (SHIPPING)</option>
                  <option value="COMPLETED">🎉 Hoàn tất giao dịch (COMPLETED)</option>
                  <option value="CANCELLED">❌ Đã hủy đơn (CANCELLED)</option>
                </select>
              </div>

              <div className="form-group mb-0 flex-1 min-w-[200px]">
                <label className="form-label">Tình trạng thanh toán</label>
                <select
                  className="form-input"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="UNPAID">Chưa thanh toán (UNPAID)</option>
                  <option value="PAID">Đã thanh toán (PAID)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" /> Đang lưu...
                    </>
                  ) : (
                    "Cập nhật trạng thái"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

