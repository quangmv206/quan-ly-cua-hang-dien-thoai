import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, CreditCard, QrCode, Banknote, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import Breadcrumb from "./components/Breadcrumb";
import StorefrontFooter from "./components/StorefrontFooter";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import Toast from "./components/Toast";

import { orderApi } from "../services/orderApi";
import { voucherApi } from "../services/voucherApi";
import { userApi } from "../services/userApi";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Đọc giỏ hàng từ localStorage nếu có, hoặc tạo dữ liệu mẫu nếu giỏ hàng rỗng
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("phonestore_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Nếu không có trong phonestore_cart, thử lấy từ phonestore_last_order nếu vừa quay lại từ cổng thanh toán
      const lastOrder = localStorage.getItem("phonestore_last_order");
      if (lastOrder) {
        const parsedOrder = JSON.parse(lastOrder);
        if (Array.isArray(parsedOrder.items) && parsedOrder.items.length > 0) {
          return parsedOrder.items;
        }
      }
    } catch {}
    return [
      {
        id: 1,
        name: "iPhone 18 Pro",
        color: "Titan Sa Mạc",
        price: 38699000,
        quantity: 1,
        imageUrl: null,
      },
    ];
  });

  const [formData, setFormData] = useState(() => {
    try {
      const lastOrder = localStorage.getItem("phonestore_last_order");
      if (lastOrder) {
        const parsed = JSON.parse(lastOrder);
        if (parsed.customer) {
          return {
            fullName: parsed.customer.fullName || "",
            phone: parsed.customer.phone || "",
            email: parsed.customer.email || "",
            city: parsed.customer.city || "Hà Nội",
            district: parsed.customer.district || "Quận Cầu Giấy",
            address: parsed.customer.address || "",
            note: parsed.customer.note || "",
            paymentMethod: "qr",
          };
        }
      }
    } catch {}
    return {
      fullName: "",
      phone: "",
      email: "",
      city: "Hà Nội",
      district: "Quận Cầu Giấy",
      address: "",
      note: "",
      paymentMethod: "cod", // 'cod' | 'qr' | 'card' | 'installment'
    };
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Tự động điền thông tin người dùng nếu đã đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userApi
        .getProfile()
        .then((res) => {
          if (res.data) {
            setFormData((prev) => ({
              ...prev,
              fullName: prev.fullName || res.data.fullName || res.data.username || "",
              email: prev.email || res.data.email || "",
              phone: prev.phone || res.data.phone || "",
            }));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Xử lý khi khách quay lại từ cổng thanh toán PayOS do hủy thanh toán
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isCancelled = params.get("cancel") === "true" || params.get("status") === "CANCELLED";
    if (isCancelled) {
      setToastMessage("Bạn đã hủy giao dịch PayOS. Đơn hàng và giỏ hàng của bạn đã được giữ nguyên để bạn có thể tiếp tục thanh toán.");
      // Làm sạch query param trên URL để không hiển thị lại toast khi reload
      navigate("/checkout", { replace: true });
    }
  }, [location.search, navigate]);

  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1), 0);
  const baseShippingFee = 30000; // Phí giao hàng tiêu chuẩn 30.000đ
  const actualShippingFee = Math.max(0, baseShippingFee - shippingDiscount);
  const total = Math.max(0, subtotal - discountAmount + actualShippingFee);

  const handleApplyVoucher = async () => {
    setVoucherError("");
    setVoucherSuccess("");
    const code = voucherCode.trim().toUpperCase();
    if (!code) {
      setVoucherError("Vui lòng nhập mã giảm giá.");
      return;
    }
    try {
      const response = await voucherApi.validate(code, subtotal);
      const res = response.data || response;
      if (res.valid) {
        if (res.isShippingVoucher || code === "FREESHIP") {
          setAppliedVoucher({ code, discountAmount: 0, isShippingVoucher: true, title: res.title });
          setShippingDiscount(30000);
          setDiscountAmount(0);
          setVoucherSuccess(res.message || "Áp dụng thành công mã FREESHIP: Giảm 30.000đ phí giao hàng!");
        } else {
          setAppliedVoucher({ code, discountAmount: res.discountAmount || 0, isShippingVoucher: false, title: res.title });
          setDiscountAmount(res.discountAmount || 0);
          setShippingDiscount(0);
          setVoucherSuccess(res.message || `Áp dụng thành công mã ${code}!`);
        }
      } else {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        setShippingDiscount(0);
        setVoucherError(res.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }
    } catch {
      setAppliedVoucher(null);
      setDiscountAmount(0);
      setShippingDiscount(0);
      setVoucherError("Không thể kiểm tra mã lúc này. Vui lòng thử lại sau.");
    }
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên người nhận.";
    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim())) {
      errors.phone = "Số điện thoại không hợp lệ (10 số).";
    }
    if (!formData.address.trim()) errors.address = "Vui lòng nhập số nhà, tên đường cụ thể.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setToastMessage("Giỏ hàng của bạn đang trống.");
      return;
    }
    if (!validate()) {
      setToastMessage("Vui lòng kiểm tra lại thông tin giao hàng.");
      return;
    }

    setSubmitting(true);
    const fallbackId = `PS-${Math.floor(100000 + Math.random() * 900000)}`;
    let finalOrderCode = fallbackId;

    const orderPayload = {
      recipientName: formData.fullName.trim(),
      recipientEmail: formData.email ? formData.email.trim() : null,
      recipientPhone: formData.phone.trim(),
      shippingAddress: `${formData.address.trim()}, ${formData.district.trim()}, ${formData.city.trim()}`,
      paymentMethod: formData.paymentMethod === "qr" ? "VNPAY" : (formData.paymentMethod === "installment" ? "BANKING" : "COD"),
      note: formData.note ? `${formData.note} (Email: ${formData.email})` : `Email: ${formData.email}`,
      voucherCode: appliedVoucher?.code || null,
      discountAmount: discountAmount || 0,
      shippingFee: actualShippingFee,
      items: cartItems.map((item) => ({
        variantId: item.variantId || null,
        phoneId: item.phoneId || item.id || null,
        productName: item.name,
        variantName: item.color ? `${item.color}${item.storage ? ` - ${item.storage}` : ""}` : "Bản tiêu chuẩn",
        price: item.price,
        quantity: item.quantity || 1,
      })),
    };

    let payosCheckoutUrl = null;
    try {
      const res = await orderApi.create(orderPayload);
      if (res.data && (res.data.orderCode || res.data.id)) {
        finalOrderCode = res.data.orderCode || `DH-${res.data.id}`;
      }

      // Nếu khách chọn thanh toán tự động PayOS (VietQR) và số tiền sau giảm giá > 0đ
      if (formData.paymentMethod === "qr" && total > 0) {
        try {
          const payosRes = await fetch("http://localhost:8080/api/payment/payos/create-payment-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderCode: finalOrderCode,
              returnUrl: `${window.location.origin}/order-success?orderId=${finalOrderCode}`,
              cancelUrl: `${window.location.origin}/checkout`,
            }),
          });
          const payosData = await payosRes.json();
          if (payosData && payosData.checkoutUrl) {
            payosCheckoutUrl = payosData.checkoutUrl;
          }
        } catch (payosErr) {
          console.warn("Lỗi gọi PayOS link thanh toán:", payosErr);
        }
      }
    } catch (err) {
      console.warn("Backend order API fallback sang local order:", err);
    } finally {
      setSubmitting(false);
    }

    const orderData = {
      orderId: finalOrderCode,
      items: cartItems,
      customer: formData,
      subtotal,
      discountAmount,
      total,
      date: new Date().toISOString(),
    };

    localStorage.setItem("phonestore_last_order", JSON.stringify(orderData));

    // Nếu có link thanh toán PayOS VietQR tự động, giữ giỏ hàng và chuyển hướng sang PayOS
    if (payosCheckoutUrl) {
      window.location.href = payosCheckoutUrl;
      return;
    }

    // Nếu đặt hàng COD hoặc các phương thức khác, xóa giỏ hàng và chuyển đến trang thành công
    localStorage.removeItem("phonestore_cart");
    navigate(`/order-success?orderId=${finalOrderCode}`);
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  const cartCount = React.useMemo(() => cartItems.reduce((acc, c) => acc + c.quantity, 0), [cartItems]);
  const handleOpenCart = React.useCallback(() => {}, []);

  return (
    <div className="storefront-root" style={{ backgroundColor: "var(--color-studio-mist)", minHeight: "100vh" }}>
      <AnnouncementBar />
      <HomeHeader cartCount={cartCount} onOpenCart={handleOpenCart} />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 var(--space-5) 60px var(--space-5)" }}>
        <Breadcrumb items={[{ label: "Giỏ hàng & Thanh toán" }]} />

        <div style={{ margin: "20px 0 28px 0" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 6px 0" }}>
            Xác nhận đơn hàng & Thanh toán
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-slate)" }}>
            Kiểm tra thông tin sản phẩm và địa chỉ nhận hàng của bạn
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", alignItems: "start" }}>
          {/* CỘT TRÁI: THÔNG TIN GIAO NHẬN & PHƯƠNG THỨC THANH TOÁN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 1. Thông tin giao hàng */}
            <div
              style={{
                backgroundColor: "var(--color-gallery-white)",
                borderRadius: "20px",
                border: "1px solid var(--color-hairline-silver)",
                padding: "24px",
              }}
            >
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <Truck size={18} color="var(--color-pricing-blue)" />
                Thông tin nhận hàng
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Họ và tên người nhận <span style={{ color: "#d70018" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn A"
                    className="form-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: formErrors.fullName ? "1px solid #d70018" : "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "14px" }}
                  />
                  {formErrors.fullName && <span style={{ color: "#d70018", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.fullName}</span>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                      Số điện thoại <span style={{ color: "#d70018" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="VD: 0988123456"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", height: "40px", borderRadius: "8px", border: formErrors.phone ? "1px solid #d70018" : "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "14px" }}
                    />
                    {formErrors.phone && <span style={{ color: "#d70018", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.phone}</span>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                      Email (nhận hóa đơn điện tử)
                    </label>
                    <input
                      type="email"
                      placeholder="VD: email@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                      Tỉnh / Thành phố
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 10px", fontSize: "13px", backgroundColor: "#fff" }}
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                      Quận / Huyện
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Quận Cầu Giấy"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) <span style={{ color: "#d70018" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Số 120 đường Cầu Giấy, P. Quan Hoa"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: "100%", height: "40px", borderRadius: "8px", border: formErrors.address ? "1px solid #d70018" : "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "14px" }}
                  />
                  {formErrors.address && <span style={{ color: "#d70018", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.address}</span>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Ghi chú đơn hàng (Thời gian nhận, yêu cầu kỹ thuật)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Giao hàng trong giờ hành chính, gọi trước 15 phút..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "8px 12px", fontSize: "13px", fontFamily: "inherit" }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán theo Bảng 2 */}
            <div
              style={{
                backgroundColor: "var(--color-gallery-white)",
                borderRadius: "20px",
                border: "1px solid var(--color-hairline-silver)",
                padding: "24px",
              }}
            >
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={18} color="var(--color-pricing-blue)" />
                Phương thức thanh toán
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: formData.paymentMethod === "cod" ? "2px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                    cursor: "pointer",
                    backgroundColor: formData.paymentMethod === "cod" ? "rgba(0, 113, 227, 0.04)" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <Banknote size={20} color="#16a34a" />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px" }}>Thanh toán khi nhận hàng (COD)</strong>
                    <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>Kiểm tra máy và seal niêm phong trước khi thanh toán tiền mặt</span>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: formData.paymentMethod === "qr" ? "2px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                    cursor: "pointer",
                    backgroundColor: formData.paymentMethod === "qr" ? "rgba(0, 113, 227, 0.04)" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qr"
                    checked={formData.paymentMethod === "qr"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <QrCode size={20} color="var(--color-pricing-blue)" />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px" }}>Thanh toán tự động PayOS (VietQR MBBank)</strong>
                    <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>MB Bank: 0337545537 - HUYNH TAN TAI (Xác nhận tự động 24/7)</span>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: formData.paymentMethod === "installment" ? "2px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                    cursor: "pointer",
                    backgroundColor: formData.paymentMethod === "installment" ? "rgba(0, 113, 227, 0.04)" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="installment"
                    checked={formData.paymentMethod === "installment"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <ShieldCheck size={20} color="#ca8a04" />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px" }}>Trả góp lãi suất 0% qua thẻ tín dụng</strong>
                    <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>Kỳ hạn 3, 6, 9, 12 tháng qua hơn 25 ngân hàng đối tác</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG, VOUCHER & NÚT ĐẶT HÀNG */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                backgroundColor: "var(--color-gallery-white)",
                borderRadius: "20px",
                border: "1px solid var(--color-hairline-silver)",
                padding: "24px",
              }}
            >
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={18} color="var(--color-pricing-blue)" />
                Sản phẩm đã chọn ({cartItems.length})
              </h2>

              {/* Danh sách máy */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid var(--color-hairline-silver)" }}>
                    <div style={{ width: "54px", height: "54px", borderRadius: "10px", backgroundColor: "var(--color-studio-mist)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} style={{ width: "44px", height: "44px", objectFit: "contain", mixBlendMode: "multiply" }} />
                      ) : (
                        <Smartphone size={22} color="var(--color-slate)" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: "13px", color: "var(--color-ink)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {item.name}
                      </strong>
                      <span style={{ fontSize: "11px", color: "var(--color-slate)" }}>
                        Màu: {item.color || "Tiêu chuẩn"} • SL: {item.quantity}
                      </span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", marginTop: "2px" }}>
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    {/* Nút tăng giảm */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        style={{ width: "26px", height: "26px", borderRadius: "50%", border: "1px solid var(--color-hairline-silver)", background: "#fff", cursor: "pointer" }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        style={{ width: "26px", height: "26px", borderRadius: "50%", border: "1px solid var(--color-hairline-silver)", background: "#fff", cursor: "pointer" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ô nhập mã giảm giá theo Bảng 2 */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-ink)", marginBottom: "6px" }}>
                  Mã ưu đãi / Voucher giảm giá
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Mã: GIAM500K hoặc VIP1TR"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    style={{ flex: 1, height: "38px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px", textTransform: "uppercase" }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="btn-explore-pill"
                    style={{ height: "38px", padding: "0 16px", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}
                  >
                    Áp dụng
                  </button>
                </div>
                {voucherError && <span style={{ color: "#d70018", fontSize: "11px", marginTop: "4px", display: "block" }}>{voucherError}</span>}
                {voucherSuccess && <span style={{ color: "#16a34a", fontSize: "11px", marginTop: "4px", display: "block" }}>{voucherSuccess}</span>}
              </div>

              {/* Tóm tắt tiền */}
              <div style={{ borderTop: "1px solid var(--color-hairline-silver)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-slate)" }}>
                  <span>Tạm tính tiền hàng:</span>
                  <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                    <span>Giảm giá Voucher:</span>
                    <span style={{ fontWeight: 600 }}>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-slate)" }}>
                  <span>Phí vận chuyển:</span>
                  {shippingDiscount > 0 || actualShippingFee === 0 ? (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ textDecoration: "line-through", color: "var(--color-slate)", marginRight: "6px", fontSize: "12px" }}>
                        30.000 đ
                      </span>
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>0 đ (Miễn phí)</span>
                    </div>
                  ) : (
                    <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>30.000 đ</span>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 700, color: "var(--color-ink)", borderTop: "1px solid var(--color-hairline-silver)", paddingTop: "10px", marginTop: "4px" }}>
                  <span>Tổng thanh toán:</span>
                  <span style={{ color: "var(--color-pricing-blue)", fontSize: "20px" }}>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Nút Đặt hàng ngay */}
              <button
                type="submit"
                className="btn-pricing-blue"
                style={{
                  width: "100%",
                  height: "46px",
                  fontSize: "15px",
                  fontWeight: 700,
                  borderRadius: "12px",
                  marginTop: "20px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Đặt hàng ngay ({formatPrice(total)})
              </button>

              <div style={{ textAlign: "center", marginTop: "12px", fontSize: "11px", color: "var(--color-slate)", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                <ShieldCheck size={14} color="#16a34a" />
                <span>Bảo mật đơn hàng 100% • Cho phép kiểm hàng trước khi trả tiền</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <StorefrontFooter />
      <FloatingSupportWidget />
      <Toast message={toastMessage} onClose={React.useCallback(() => setToastMessage(null), [])} />
    </div>
  );
}

