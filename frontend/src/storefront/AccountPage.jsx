import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Lock,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import Breadcrumb from "./components/Breadcrumb";
import StorefrontFooter from "./components/StorefrontFooter";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import Toast from "./components/Toast";
import LoginModal from "../components/LoginModal";

import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import { orderApi } from "../services/orderApi";

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState(tabParam);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Profile data
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password data
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Orders data
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Guest order lookup
  const [lookupCode, setLookupCode] = useState("");
  const [lookedUpOrder, setLookedUpOrder] = useState(null);
  const [lookupError, setLookupError] = useState("");

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadUserProfile();
      loadUserOrders();
    }
  }, []);

  const loadUserProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await userApi.getProfile();
      if (res.data) {
        setProfile({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.shippingAddress || "",
        });
      }
    } catch {
      // Fallback
      setProfile({
        fullName: "Nguyễn Văn Khách",
        email: "khachhang@phonestore.vn",
        phone: "0987654321",
        address: "120 Cầu Giấy, Hà Nội",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const loadUserOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await userApi.getMyOrders();
      if (res.data && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch {
      // Fallback: check localStorage for last created order
      try {
        const saved = localStorage.getItem("phonestore_last_order");
        if (saved) {
          const parsed = JSON.parse(saved);
          setOrders([
            {
              orderCode: parsed.orderId,
              createdAt: parsed.date,
              recipientName: parsed.customer?.fullName || "Khách hàng",
              recipientPhone: parsed.customer?.phone || "0987654321",
              shippingAddress: parsed.customer?.address || "Hà Nội",
              status: "PENDING",
              paymentMethod: parsed.customer?.paymentMethod || "COD",
              totalAmount: parsed.total,
              items: parsed.items || [],
            },
          ]);
        }
      } catch {}
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateProfile(profile);
      setToastMessage("Cập nhật thông tin thành công!");
    } catch (err) {
      setToastMessage("Cập nhật thông tin thất bại. Vui lòng thử lại!");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToastMessage("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setToastMessage("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      await userApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setToastMessage("Đổi mật khẩu thành công!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ!");
    }
  };

  const handleLookupOrder = async (e) => {
    e.preventDefault();
    setLookupError("");
    setLookedUpOrder(null);
    if (!lookupCode.trim()) {
      setLookupError("Vui lòng nhập mã đơn hàng.");
      return;
    }
    try {
      const res = await orderApi.getByCode(lookupCode.trim());
      if (res.data) {
        setLookedUpOrder(res.data);
      } else {
        setLookupError("Không tìm thấy đơn hàng với mã này.");
      }
    } catch {
      // Check localStorage fallback
      try {
        const saved = localStorage.getItem("phonestore_last_order");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.orderId?.toLowerCase() === lookupCode.trim().toLowerCase()) {
            setLookedUpOrder({
              orderCode: parsed.orderId,
              createdAt: parsed.date,
              recipientName: parsed.customer?.fullName,
              recipientPhone: parsed.customer?.phone,
              shippingAddress: parsed.customer?.address,
              status: "PENDING",
              totalAmount: parsed.total,
              items: parsed.items || [],
            });
            return;
          }
        }
      } catch {}
      setLookupError("Không tìm thấy thông tin đơn hàng trên hệ thống.");
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "COMPLETED" || s === "DELIVERED") {
      return <span style={{ padding: "4px 10px", borderRadius: "9999px", backgroundColor: "rgba(22, 163, 74, 0.12)", color: "#16a34a", fontSize: "11px", fontWeight: 700 }}>Đã giao hàng</span>;
    }
    if (s === "SHIPPING") {
      return <span style={{ padding: "4px 10px", borderRadius: "9999px", backgroundColor: "rgba(2, 132, 199, 0.12)", color: "#0284c7", fontSize: "11px", fontWeight: 700 }}>Đang vận chuyển</span>;
    }
    if (s === "CONFIRMED") {
      return <span style={{ padding: "4px 10px", borderRadius: "9999px", backgroundColor: "rgba(217, 119, 6, 0.12)", color: "#d97706", fontSize: "11px", fontWeight: 700 }}>Đã xác nhận</span>;
    }
    return <span style={{ padding: "4px 10px", borderRadius: "9999px", backgroundColor: "rgba(100, 116, 139, 0.12)", color: "#475569", fontSize: "11px", fontWeight: 700 }}>Đang xử lý</span>;
  };

  return (
    <div className="storefront-root" style={{ backgroundColor: "var(--color-studio-mist)", minHeight: "100vh" }}>
      <AnnouncementBar />
      <HomeHeader cartCount={0} onOpenCart={() => navigate("/checkout")} />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 var(--space-5) 60px var(--space-5)" }}>
        <Breadcrumb items={[{ label: "Tài khoản & Đơn hàng" }]} />

        <div style={{ margin: "20px 0 28px 0" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 6px 0" }}>
            Trung tâm Khách hàng & Đơn hàng
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-slate)" }}>
            Quản lý tài khoản cá nhân, sổ địa chỉ và theo dõi tiến độ vận chuyển đơn hàng
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--color-hairline-silver)", paddingBottom: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "btn-pricing-blue" : "btn-explore-pill"}
            style={{ height: "38px", fontSize: "13px", padding: "0 18px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Package size={15} />
            <span>Đơn hàng của tôi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "btn-pricing-blue" : "btn-explore-pill"}
            style={{ height: "38px", fontSize: "13px", padding: "0 18px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <User size={15} />
            <span>Thông tin cá nhân & Địa chỉ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lookup")}
            className={activeTab === "lookup" ? "btn-pricing-blue" : "btn-explore-pill"}
            style={{ height: "38px", fontSize: "13px", padding: "0 18px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Search size={15} />
            <span>Tra cứu đơn hàng không cần đăng nhập</span>
          </button>
        </div>

        {/* TAB 1: ĐƠN HÀNG CỦA TÔI */}
        {activeTab === "orders" && (
          <div>
            {!currentUser ? (
              <div
                style={{
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "24px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "40px 24px",
                  textAlign: "center",
                }}
              >
                <Package size={48} color="var(--color-slate)" style={{ margin: "0 auto 16px auto", opacity: 0.5 }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0" }}>
                  Đăng nhập để xem lịch sử mua hàng
                </h3>
                <p style={{ fontSize: "14px", color: "var(--color-slate)", maxWidth: "480px", margin: "0 auto 20px auto" }}>
                  Nếu bạn đã mua hàng bằng số điện thoại hoặc tài khoản, hãy đăng nhập để theo dõi trạng thái đơn và bảo hành.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setLoginModalOpen(true)}
                    className="btn-pricing-blue"
                    style={{ height: "40px", padding: "0 24px", borderRadius: "9999px" }}
                  >
                    Đăng nhập / Đăng ký
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("lookup")}
                    className="btn-explore-pill"
                    style={{ height: "40px", padding: "0 20px" }}
                  >
                    Tra cứu bằng mã đơn
                  </button>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div
                style={{
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "24px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <ShoppingBag size={48} color="var(--color-slate)" style={{ margin: "0 auto 16px auto", opacity: 0.5 }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0" }}>Bạn chưa có đơn hàng nào</h3>
                <p style={{ fontSize: "14px", color: "var(--color-slate)", margin: "0 0 20px 0" }}>
                  Khám phá các dòng điện thoại mới nhất với ưu đãi trả góp 0% tại Phone Store.
                </p>
                <Link to="/dien-thoai" className="btn-pricing-blue" style={{ height: "40px", padding: "0 24px", borderRadius: "9999px", display: "inline-flex", alignItems: "center" }}>
                  Khám phá sản phẩm ngay
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {orders.map((ord, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "var(--color-gallery-white)",
                      borderRadius: "20px",
                      border: "1px solid var(--color-hairline-silver)",
                      padding: "24px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--color-hairline-silver)", paddingBottom: "16px", marginBottom: "16px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-ink)" }}>
                            Mã đơn: {ord.orderCode}
                          </span>
                          {getStatusBadge(ord.status)}
                        </div>
                        <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>
                          Đặt ngày: {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                        </span>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "12px", color: "var(--color-slate)", display: "block" }}>Tổng số tiền:</span>
                        <strong style={{ fontSize: "18px", color: "var(--color-pricing-blue)" }}>
                          {formatPrice(ord.totalAmount)}
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", fontSize: "13px" }}>
                      <div>
                        <span style={{ color: "var(--color-slate)", display: "block", marginBottom: "4px" }}>Người nhận hàng:</span>
                        <strong>{ord.recipientName}</strong> - {ord.recipientPhone}
                        <p style={{ margin: "4px 0 0 0", color: "var(--color-slate)" }}>{ord.shippingAddress}</p>
                      </div>

                      <div>
                        <span style={{ color: "var(--color-slate)", display: "block", marginBottom: "4px" }}>Chi tiết máy:</span>
                        {ord.items && ord.items.map((it, iIdx) => (
                          <div key={iIdx} style={{ marginBottom: "4px" }}>
                            <strong>{it.productName || it.name}</strong> {it.variantName ? `(${it.variantName})` : ""} × {it.quantity}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid var(--color-hairline-silver)", paddingTop: "14px", marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#16a34a", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <ShieldCheck size={14} />
                        Bảo hành chính hãng 12 tháng tại các TTBH ủy quyền
                      </span>
                      <Link
                        to={`/order-success?orderId=${ord.orderCode}`}
                        style={{ fontSize: "13px", color: "var(--color-pricing-blue)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        Xem hóa đơn chi tiết <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THÔNG TIN CÁ NHÂN & BẢO MẬT */}
        {activeTab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {/* Sổ địa chỉ & Thông tin */}
            <div
              style={{
                backgroundColor: "var(--color-gallery-white)",
                borderRadius: "20px",
                border: "1px solid var(--color-hairline-silver)",
                padding: "24px",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={18} color="var(--color-pricing-blue)" />
                Thông tin cá nhân & Sổ địa chỉ
              </h3>

              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Họ và tên</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Số điện thoại</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Email nhận hóa đơn VAT</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Địa chỉ giao hàng mặc định</label>
                  <textarea
                    rows={2}
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "8px 12px", fontSize: "13px", fontFamily: "inherit" }}
                  />
                </div>

                <button type="submit" className="btn-pricing-blue" style={{ height: "40px", borderRadius: "8px", marginTop: "6px" }}>
                  Lưu thay đổi
                </button>
              </form>
            </div>

            {/* Đổi mật khẩu */}
            <div
              style={{
                backgroundColor: "var(--color-gallery-white)",
                borderRadius: "20px",
                border: "1px solid var(--color-hairline-silver)",
                padding: "24px",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={18} color="var(--color-pricing-blue)" />
                Đổi mật khẩu tài khoản
              </h3>

              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    placeholder="Nhập mật khẩu đang dùng"
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới"
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                  />
                </div>

                <button type="submit" className="btn-explore-pill" style={{ height: "40px", borderRadius: "8px", marginTop: "6px", fontWeight: 600 }}>
                  Cập nhật mật khẩu
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: TRA CỨU ĐƠN HÀNG NHANH */}
        {activeTab === "lookup" && (
          <div
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "24px",
              border: "1px solid var(--color-hairline-silver)",
              padding: "36px 28px",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0", textAlign: "center" }}>
              Tra cứu tiến độ đơn hàng
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-slate)", textAlign: "center", margin: "0 0 24px 0" }}>
              Nhập mã đơn hàng bạn nhận được khi đặt hàng (Ví dụ: DH-20261020-1001 hoặc PS-892415)
            </p>

            <form onSubmit={handleLookupOrder} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Nhập mã đơn hàng..."
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                style={{ flex: 1, height: "42px", borderRadius: "10px", border: "1px solid var(--color-hairline-silver)", padding: "0 14px", fontSize: "14px", textTransform: "uppercase" }}
              />
              <button type="submit" className="btn-pricing-blue" style={{ height: "42px", padding: "0 22px", borderRadius: "10px" }}>
                Tra cứu
              </button>
            </form>

            {lookupError && (
              <div style={{ padding: "12px 14px", borderRadius: "10px", backgroundColor: "#fef2f2", color: "#d70018", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <AlertCircle size={16} />
                <span>{lookupError}</span>
              </div>
            )}

            {lookedUpOrder && (
              <div style={{ border: "1px solid var(--color-hairline-silver)", borderRadius: "16px", padding: "20px", marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px" }}>Đơn hàng #{lookedUpOrder.orderCode}</strong>
                    <span style={{ fontSize: "12px", color: "var(--color-slate)", display: "block" }}>
                      Người nhận: {lookedUpOrder.recipientName} ({lookedUpOrder.recipientPhone})
                    </span>
                  </div>
                  {getStatusBadge(lookedUpOrder.status)}
                </div>
                <div style={{ fontSize: "13px", color: "var(--color-slate)", borderTop: "1px solid var(--color-hairline-silver)", paddingTop: "10px" }}>
                  <span>Địa chỉ giao hàng: {lookedUpOrder.shippingAddress}</span>
                  <div style={{ marginTop: "6px", fontWeight: 700, color: "var(--color-pricing-blue)", fontSize: "15px" }}>
                    Tổng thanh toán: {formatPrice(lookedUpOrder.totalAmount)}
                  </div>
                </div>
                <div style={{ marginTop: "14px", textAlign: "right" }}>
                  <Link to={`/order-success?orderId=${lookedUpOrder.orderCode}`} className="link-apple-blue" style={{ fontSize: "13px" }}>
                    Xem chi tiết xác nhận đơn hàng →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <StorefrontFooter />
      <FloatingSupportWidget />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          loadUserProfile();
          loadUserOrders();
        }}
      />
    </div>
  );
}

