import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingBag,
  ShieldCheck,
  DollarSign,
  Activity,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Smartphone
} from "lucide-react";
import { phoneApi } from "../services/phoneApi";
import { orderApi } from "../services/orderApi";
import { catalogApi } from "../services/catalogApi";
import { userApi } from "../services/userApi";
import LoadingSpinner from "./LoadingSpinner";

export default function DashboardView({ user, onNavigateTab }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    phones: [],
    orders: [],
    brands: [],
    categories: [],
    users: [],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [phonesRes, ordersRes, brandsRes, catRes, usersRes] = await Promise.all([
        phoneApi.getAll().catch(() => ({ data: [] })),
        orderApi.getAll().catch(() => ({ data: [] })),
        catalogApi.getBrands().catch(() => ({ data: [] })),
        catalogApi.getCategories().catch(() => ({ data: [] })),
        userApi.getAll().catch(() => ({ data: [] })),
      ]);

      setData({
        phones: phonesRes.data || [],
        orders: ordersRes.data || [],
        brands: brandsRes.data || [],
        categories: catRes.data || [],
        users: usersRes.data || [],
      });
    } catch (err) {
      console.error("Lỗi tải dữ liệu Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPrice = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

  const totalStock = data.phones.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalRevenue = data.orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = data.orders.filter((o) => o.status === "PENDING").length;
  const shippingOrders = data.orders.filter((o) => o.status === "SHIPPING").length;
  const completedOrders = data.orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledOrders = data.orders.filter((o) => o.status === "CANCELLED").length;

  const lowStockPhones = data.phones.filter((p) => p.quantity <= 5);

  const renderStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return <span className="status-badge status-completed"><CheckCircle2 size={12} /> Hoàn tất</span>;
      case "SHIPPING":
        return <span className="status-badge status-shipping"><Truck size={12} /> Đang giao</span>;
      case "CONFIRMED":
        return <span className="status-badge status-confirmed"><Clock size={12} /> Đã xác nhận</span>;
      case "CANCELLED":
        return <span className="status-badge status-cancelled"><XCircle size={12} /> Đã hủy</span>;
      default:
        return <span className="status-badge status-pending"><Clock size={12} /> Chờ xử lý</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải dữ liệu báo cáo thống kê..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-heading">Bảng Điều Khiển Quản Trị</h1>
          <p className="page-sub">
            Tổng quan số liệu kinh doanh, kho hàng và tiến độ xử lý đơn hàng thời gian thực
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="btn btn-secondary text-sm">
            Cập nhật dữ liệu
          </button>
        </div>
      </div>

      {/* 4 Thẻ chỉ số chính */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Package size={26} />
          </div>
          <div className="stat-data">
            <span className="stat-title">Dòng sản phẩm</span>
            <span className="stat-value">{data.phones.length}</span>
            <span className="stat-hint">{totalStock} máy trong kho</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <TrendingUp size={26} />
          </div>
          <div className="stat-data">
            <span className="stat-title">Doanh thu bán hàng</span>
            <span className="stat-value text-success">{formatPrice(totalRevenue)}</span>
            <span className="stat-hint">Từ {data.orders.length} đơn hàng</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <ShoppingBag size={26} />
          </div>
          <div className="stat-data">
            <span className="stat-title">Đơn hàng cần xử lý</span>
            <span className="stat-value text-warning">{pendingOrders}</span>
            <span className="stat-hint">{shippingOrders} đơn đang giao</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Users size={26} />
          </div>
          <div className="stat-data">
            <span className="stat-title">Tài khoản thành viên</span>
            <span className="stat-value">{data.users.length}</span>
            <span className="stat-hint">
              {data.users.filter((u) => u.role === "ROLE_ADMIN").length} Quản trị viên
            </span>
          </div>
        </div>
      </div>

      {/* Tiến độ đơn hàng mini */}
      <div className="card p-5 mb-6">
        <h3 className="card-title text-base mb-3 flex items-center gap-2">
          <Activity size={18} className="text-primary" /> Tiến độ đơn hàng hệ thống
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{pendingOrders}</div>
            <div className="text-xs text-muted font-medium mt-1">🕒 Chờ xác nhận</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="text-2xl font-bold text-amber-600">{shippingOrders}</div>
            <div className="text-xs text-muted font-medium mt-1">🚚 Đang giao hàng</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">{completedOrders}</div>
            <div className="text-xs text-muted font-medium mt-1">🎉 Giao thành công</div>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
            <div className="text-2xl font-bold text-rose-600">{cancelledOrders}</div>
            <div className="text-xs text-muted font-medium mt-1">❌ Đơn đã hủy</div>
          </div>
        </div>
      </div>

      {/* Grid 2 Cột: Đơn hàng mới nhất & Cảnh báo tồn kho */}
      <div className="dashboard-two-col mb-6">
        {/* Cột trái: Đơn hàng mới nhất */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-base flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" /> Đơn hàng mới nhất
            </h3>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("orders")}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                Xem tất cả <ArrowRight size={14} />
              </button>
            )}
          </div>

          {data.orders.length === 0 ? (
            <p className="text-muted text-sm text-center py-6">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="space-y-3">
              {data.orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-primary">{o.orderCode}</span>
                      {renderStatus(o.status)}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {o.recipientName} • {o.recipientPhone}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-success">{formatPrice(o.totalAmount)}</div>
                    <div className="text-xs text-muted">
                      {o.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải: Cảnh báo hàng tồn kho thấp */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-base flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" /> Cảnh báo tồn kho thấp (≤ 5)
            </h3>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("products")}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                Quản lý kho <ArrowRight size={14} />
              </button>
            )}
          </div>

          {lowStockPhones.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 size={36} className="text-success mx-auto mb-2" />
              <p className="text-sm font-medium">Kho hàng dồi dào, không có máy sắp hết!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockPhones.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border border-amber-200 text-amber-600">
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{p.name}</div>
                      <div className="text-xs text-muted">{p.brand?.name || "Hãng"} • {formatPrice(p.price)}</div>
                    </div>
                  </div>
                  <span className={`stock-pill ${p.quantity === 0 ? "out-stock" : "low-stock"}`}>
                    {p.quantity === 0 ? "Hết hàng" : `Còn ${p.quantity} máy`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thông tin hệ thống backend Spring Boot */}
      <div className="card tech-card p-5">
        <h3 className="card-title text-base mb-2">Thông tin máy chủ & Kết nối RESTful API</h3>
        <p className="card-desc text-sm text-secondary">
          Hệ thống chạy trên nền tảng <strong>Spring Boot 3 + MySQL</strong> kết hợp với Frontend{" "}
          <strong>React 19 + Vite</strong>. Tất cả thao tác Quản lý Sản phẩm, Biến thể, Đơn hàng, Bảo hành và Phân quyền người dùng đều được bảo mật qua JWT Stateless Authentication và phân quyền chặt chẽ theo <code>ROLE_ADMIN</code>.
        </p>
      </div>
    </div>
  );
}
