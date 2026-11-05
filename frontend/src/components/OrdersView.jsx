import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Search,
  Eye,
  Check,
  CreditCard,
  DollarSign,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { orderApi } from "../services/orderApi";
import LoadingSpinner from "./LoadingSpinner";
import OrderDetailModal from "./OrderDetailModal";

export default function OrdersView({ user, onRequireLogin }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL"); // ALL | INSTALLMENT | QR | COD
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getAll();
      setOrders(res.data || []);
    } catch (err) {
      console.warn("Lỗi tải đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng đăng nhập quyền ADMIN.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

  const renderStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return <span className="status-badge status-completed"><CheckCircle2 size={14} /> Hoàn tất</span>;
      case "SHIPPING":
        return <span className="status-badge status-shipping"><Truck size={14} /> Đang giao</span>;
      case "CONFIRMED":
        return <span className="status-badge status-confirmed"><Clock size={14} /> Đã xác nhận</span>;
      case "CANCELLED":
        return <span className="status-badge status-cancelled"><XCircle size={14} /> Đã hủy</span>;
      default:
        return <span className="status-badge status-pending"><Clock size={14} /> Chờ xử lý</span>;
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  // Quick Action: chuyển tiếp trạng thái tiếp theo
  const handleQuickNextStatus = async (order) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }

    let nextStatus = "";
    if (order.status === "PENDING") nextStatus = "CONFIRMED";
    else if (order.status === "CONFIRMED") nextStatus = "SHIPPING";
    else if (order.status === "SHIPPING") nextStatus = "COMPLETED";
    else return;

    try {
      await orderApi.updateStatus(order.id, {
        status: nextStatus,
        paymentStatus: nextStatus === "COMPLETED" ? "PAID" : order.paymentStatus,
      });
      fetchOrders();
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái đơn: " + (err.response?.data?.message || err.message));
    }
  };

  // Lọc danh sách chuẩn đa phương thức (không phân biệt chữ hoa/thường)
  const isInstallment = (o) => {
    const pm = (o.paymentMethod || "").toLowerCase();
    const notes = `${o.notes || ""} ${o.note || ""}`.toLowerCase();
    return (
      pm === "installment" ||
      notes.includes("[đơn trả góp") ||
      notes.includes("trả góp") ||
      notes.includes("tra gop")
    );
  };

  const isDigitalPayment = (o) => {
    if (isInstallment(o)) return false;
    const pm = (o.paymentMethod || "").toUpperCase();
    return ["VNPAY", "PAYOS", "VIETQR", "QR", "BANKING", "CHUYỂN KHOẢN"].includes(pm);
  };

  const isCod = (o) => {
    if (isInstallment(o)) return false;
    const pm = (o.paymentMethod || "").toUpperCase();
    return pm === "COD" || pm === "TIỀN MẶT" || !o.paymentMethod || (!isDigitalPayment(o) && !isInstallment(o));
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;
    
    let matchMethod = true;
    if (methodFilter === "INSTALLMENT") {
      matchMethod = isInstallment(o);
    } else if (methodFilter === "QR") {
      matchMethod = isDigitalPayment(o);
    } else if (methodFilter === "COD") {
      matchMethod = isCod(o);
    }

    const term = searchTerm.toLowerCase().trim();
    const allNotes = `${o.notes || ""} ${o.note || ""}`.toLowerCase();
    const matchSearch =
      !term ||
      (o.orderCode && o.orderCode.toLowerCase().includes(term)) ||
      (o.recipientName && o.recipientName.toLowerCase().includes(term)) ||
      (o.recipientPhone && o.recipientPhone.includes(term)) ||
      allNotes.includes(term);

    return matchStatus && matchPayment && matchMethod && matchSearch;
  });

  // Đếm theo trạng thái & hình thức
  const counts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
    SHIPPING: orders.filter((o) => o.status === "SHIPPING").length,
    COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    INSTALLMENT: orders.filter((o) => isInstallment(o)).length,
    DIGITAL: orders.filter((o) => isDigitalPayment(o)).length,
    COD: orders.filter((o) => isCod(o)).length,
  };

  const hasActiveFilter =
    statusFilter !== "ALL" ||
    methodFilter !== "ALL" ||
    paymentFilter !== "ALL" ||
    searchTerm.trim().length > 0;

  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setMethodFilter("ALL");
    setPaymentFilter("ALL");
    setSearchTerm("");
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-heading">Quản lý Đơn hàng</h1>
          <p className="page-sub">Theo dõi luồng xử lý và cập nhật tiến độ giao dịch bán hàng</p>
        </div>
        <button onClick={fetchOrders} className="btn btn-secondary">
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      {/* Thống kê đơn theo tab trạng thái & Tab Trả góp */}
      <div className="order-status-tabs mb-4 flex flex-wrap gap-2 items-center">
        <button
          onClick={() => {
            setStatusFilter("ALL");
            setMethodFilter("ALL");
          }}
          className={`tab-pill ${statusFilter === "ALL" && methodFilter === "ALL" ? "active" : ""}`}
        >
          Tất cả ({counts.ALL})
        </button>

        {/* Tab chuyên biệt cho Hồ sơ Trả Góp 0% */}
        <button
          onClick={() => {
            if (methodFilter === "INSTALLMENT") {
              setMethodFilter("ALL");
            } else {
              setMethodFilter("INSTALLMENT");
            }
          }}
          className={`tab-pill ${methodFilter === "INSTALLMENT" ? "active" : ""}`}
          style={
            methodFilter === "INSTALLMENT"
              ? {
                  backgroundColor: "#ea580c",
                  color: "#ffffff",
                  border: "1.5px solid #ea580c",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(234, 88, 12, 0.3)",
                }
              : {
                  backgroundColor: "#fff7ed",
                  color: "#c2410c",
                  border: "1px solid #fed7aa",
                  fontWeight: 600,
                }
          }
        >
          💳 Hồ sơ Trả góp 0% ({counts.INSTALLMENT})
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === "PENDING" ? "ALL" : "PENDING")}
          className={`tab-pill ${statusFilter === "PENDING" ? "active" : ""}`}
        >
          🕒 Chờ xử lý ({counts.PENDING})
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "CONFIRMED" ? "ALL" : "CONFIRMED")}
          className={`tab-pill ${statusFilter === "CONFIRMED" ? "active" : ""}`}
        >
          ✔ Đã xác nhận ({counts.CONFIRMED})
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "SHIPPING" ? "ALL" : "SHIPPING")}
          className={`tab-pill ${statusFilter === "SHIPPING" ? "active" : ""}`}
        >
          🚚 Đang giao ({counts.SHIPPING})
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "COMPLETED" ? "ALL" : "COMPLETED")}
          className={`tab-pill ${statusFilter === "COMPLETED" ? "active" : ""}`}
        >
          🎉 Hoàn tất ({counts.COMPLETED})
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "CANCELLED" ? "ALL" : "CANCELLED")}
          className={`tab-pill ${statusFilter === "CANCELLED" ? "active" : ""}`}
        >
          ❌ Đã hủy ({counts.CANCELLED})
        </button>

        {hasActiveFilter && (
          <button
            onClick={handleResetFilters}
            className="tab-pill text-xs ml-auto flex items-center gap-1 text-muted hover:text-error"
            title="Xóa toàn bộ các bộ lọc đang chọn"
            style={{ backgroundColor: "#f1f5f9", border: "1px dashed #cbd5e1" }}
          >
            <RotateCcw size={13} /> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="search-input-wrapper flex-1 min-w-[240px]">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo mã đơn (ORD-..., TG-...), tên khách, SĐT, ngân hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted">Hình thức:</span>
          <select
            className="form-input text-sm py-1.5 px-3"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="ALL">Tất cả hình thức ({orders.length})</option>
            <option value="INSTALLMENT">💳 Trả góp 0% ({counts.INSTALLMENT})</option>
            <option value="QR">📱 Chuyển khoản / PayOS / VietQR ({counts.DIGITAL})</option>
            <option value="COD">💵 Tiền mặt (COD) ({counts.COD})</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted">Thanh toán:</span>
          <select
            className="form-input text-sm py-1.5 px-3"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="ALL">Tất cả ({orders.length})</option>
            <option value="PAID">Đã thanh toán (PAID)</option>
            <option value="UNPAID">Chưa thanh toán (UNPAID)</option>
          </select>
        </div>

        {hasActiveFilter && (
          <button
            onClick={handleResetFilters}
            className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
          >
            <RotateCcw size={13} /> Xóa lọc
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Đang tải danh sách đơn hàng..." />
      ) : error ? (
        <div className="card text-center p-8">
          <AlertCircle size={40} className="text-warning mx-auto mb-2" />
          <h3 className="text-base font-bold text-error">{error}</h3>
          <p className="text-muted text-sm mt-1">Đăng nhập tài khoản Admin để truy cập toàn quyền.</p>
          <button onClick={onRequireLogin} className="btn btn-primary mt-4">
            Đăng nhập quyền Admin
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card text-center p-8">
          <ShoppingBag size={48} className="text-muted mx-auto mb-2" />
          <h3 className="text-lg font-bold">Không tìm thấy đơn hàng nào phù hợp</h3>
          <p className="text-muted text-sm mt-1">
            {hasActiveFilter
              ? "Bộ lọc hiện tại không có kết quả phù hợp. Vui lòng thử đổi tiêu chí hoặc xóa bộ lọc."
              : "Chưa có đơn hàng nào trong hệ thống."}
          </p>
          {hasActiveFilter && (
            <button
              onClick={handleResetFilters}
              className="btn btn-primary mt-4 inline-flex items-center gap-1.5 text-sm"
            >
              <RotateCcw size={15} /> Xóa bộ lọc (Xem lại tất cả {orders.length} đơn)
            </button>
          )}
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Người nhận</th>
                <th>Số điện thoại</th>
                <th>Hình thức</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                const isInstall = isInstallment(o);
                const isDigital = isDigitalPayment(o);
                return (
                  <tr key={o.id} style={{ backgroundColor: isInstall ? "rgba(255, 247, 237, 0.4)" : "transparent" }}>
                    <td>
                      <div className="bold text-primary font-mono">{o.orderCode}</div>
                      {isInstall && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#ea580c",
                            backgroundColor: "#ffedd5",
                            padding: "1px 6px",
                            borderRadius: "4px",
                            marginTop: "2px",
                            display: "inline-block",
                          }}
                        >
                          HỒ SƠ TRẢ GÓP
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="bold">{o.recipientName}</div>
                      <div className="text-xs text-muted truncate max-w-[160px]" title={o.shippingAddress}>
                        {o.shippingAddress}
                      </div>
                    </td>
                    <td>{o.recipientPhone}</td>
                    <td>
                      {isInstall ? (
                        <span
                          style={{
                            backgroundColor: "#fff7ed",
                            color: "#c2410c",
                            border: "1px solid #fed7aa",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          💳 Trả góp 0%
                        </span>
                      ) : isDigital ? (
                        <span
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          📱 Chuyển khoản ({o.paymentMethod || "VietQR"})
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#4b5563",
                            border: "1px solid #e5e7eb",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          💵 Tiền mặt (COD)
                        </span>
                      )}
                    </td>
                    <td className="bold text-success">{formatPrice(o.totalAmount)}</td>
                    <td>{renderStatus(o.status)}</td>
                    <td>
                      <span className={`payment-pill ${o.paymentStatus === "PAID" ? "paid" : "unpaid"}`}>
                        {o.paymentStatus === "PAID" ? "Đã trả" : "Chưa trả"}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="actions-group justify-end">
                        {/* Nút hành động nhanh theo luồng */}
                        {o.status === "PENDING" && (
                          <button
                            onClick={() => handleQuickNextStatus(o)}
                            className="btn-action-pill btn-confirm"
                            title={isInstall ? "Duyệt hồ sơ trả góp" : "Duyệt đơn hàng"}
                            style={isInstall ? { backgroundColor: "#ea580c", borderColor: "#c2410c", color: "#fff" } : {}}
                          >
                            <Check size={14} /> {isInstall ? "Duyệt hồ sơ" : "Duyệt đơn"}
                          </button>
                        )}
                        {o.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleQuickNextStatus(o)}
                            className="btn-action-pill btn-ship"
                            title="Chuyển sang giao hàng"
                          >
                            <Truck size={14} /> Giao hàng
                          </button>
                        )}
                        {o.status === "SHIPPING" && (
                          <button
                            onClick={() => handleQuickNextStatus(o)}
                            className="btn-action-pill btn-complete"
                            title="Xác nhận giao thành công"
                          >
                            <CheckCircle2 size={14} /> Hoàn tất
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenDetail(o)}
                          className="btn-action edit"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Chi tiết đơn hàng */}
      <OrderDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        order={selectedOrder}
        onStatusUpdated={fetchOrders}
      />
    </div>
  );
}
