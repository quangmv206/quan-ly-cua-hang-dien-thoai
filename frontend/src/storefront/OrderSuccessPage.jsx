import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, PackageCheck, PhoneCall, ArrowRight, ShieldCheck, Clock, MapPin } from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import Breadcrumb from "./components/Breadcrumb";
import StorefrontFooter from "./components/StorefrontFooter";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import { orderApi } from "../services/orderApi";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "PS-892415";
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Ưu tiên đọc từ Backend API theo mã đơn
    if (orderId) {
      orderApi
        .getByCode(orderId)
        .then((res) => {
          if (res.data) {
            const apiOrder = res.data;
            setOrder({
              orderId: apiOrder.orderCode,
              items: apiOrder.items || [],
              customer: {
                fullName: apiOrder.recipientName,
                phone: apiOrder.recipientPhone,
                address: apiOrder.shippingAddress,
                paymentMethod: apiOrder.paymentMethod,
              },
              total: apiOrder.totalAmount,
              date: apiOrder.createdAt,
              status: apiOrder.status,
            });
          }
        })
        .catch(() => {
          // Fallback sang localStorage nếu API không tìm thấy hoặc offline
          try {
            const saved = localStorage.getItem("phonestore_last_order");
            if (saved) {
              setOrder(JSON.parse(saved));
            }
          } catch {}
        });
    } else {
      try {
        const saved = localStorage.getItem("phonestore_last_order");
        if (saved) {
          setOrder(JSON.parse(saved));
        }
      } catch {}
    }
    // Xóa giỏ hàng khi đơn hàng đã đặt/thanh toán thành công
    localStorage.removeItem("phonestore_cart");
  }, [orderId]);

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p || 0);

  return (
    <div className="storefront-root" style={{ backgroundColor: "var(--color-studio-mist)", minHeight: "100vh" }}>
      <AnnouncementBar />
      <HomeHeader cartCount={0} onOpenCart={() => {}} />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "0 var(--space-5) 60px var(--space-5)" }}>
        <Breadcrumb items={[{ label: "Thanh toán", link: "/checkout" }, { label: "Đặt hàng thành công" }]} />

        <div
          style={{
            backgroundColor: "var(--color-gallery-white)",
            borderRadius: "28px",
            border: "1px solid var(--color-hairline-silver)",
            padding: "48px 32px",
            textAlign: "center",
            marginTop: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "rgba(22, 163, 74, 0.1)",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 8px 0" }}>
            Đặt hàng thành công!
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-slate)", margin: "0 0 16px 0", lineHeight: 1.5 }}>
            Cảm ơn bạn đã tin tưởng mua sắm tại <strong>Phone Store</strong>. Đơn hàng của bạn đã được tiếp nhận và một email xác nhận chi tiết đơn hàng đã được gửi đến hòm thư của bạn.
          </p>

          <div
            style={{
              display: "inline-block",
              backgroundColor: "var(--color-studio-mist)",
              borderRadius: "12px",
              padding: "10px 20px",
              marginBottom: "28px",
            }}
          >
            <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>Mã đơn hàng:</span>
            <strong style={{ fontSize: "16px", color: "var(--color-pricing-blue)", marginLeft: "8px", letterSpacing: "0.05em" }}>
              #{orderId}
            </strong>
          </div>

          {/* Chi tiết đơn vừa đặt theo Bảng 2 */}
          {order && (
            <div
              style={{
                textAlign: "left",
                backgroundColor: "var(--color-studio-mist)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "28px",
                border: "1px solid var(--color-hairline-silver)",
              }}
            >
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 12px 0", color: "var(--color-ink)" }}>
                Thông tin giao nhận & Người mua
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
                <div>
                  <span style={{ color: "var(--color-slate)" }}>Người nhận:</span>{" "}
                  <strong>{order.customer?.fullName || "Quý khách"}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--color-slate)" }}>Số điện thoại:</span>{" "}
                  <strong>{order.customer?.phone || "0988.xxx.xxx"}</strong>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "var(--color-slate)" }}>Địa chỉ nhận:</span>{" "}
                  <strong>{order.customer?.address}, {order.customer?.district}, {order.customer?.city}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--color-slate)" }}>Hình thức:</span>{" "}
                  <strong>{order.customer?.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản / Trả góp"}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--color-slate)" }}>Tổng thanh toán:</span>{" "}
                  <strong style={{ color: "var(--color-pricing-blue)" }}>{formatPrice(order.total)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Các bước tiếp theo theo Bảng 2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              textAlign: "left",
              marginBottom: "24px",
            }}
          >
            <div style={{ padding: "16px", borderRadius: "14px", border: "1px solid var(--color-hairline-silver)", backgroundColor: "#fff" }}>
              <Clock size={20} color="var(--color-pricing-blue)" style={{ marginBottom: "8px" }} />
              <strong style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>1. Xác nhận cuộc gọi</strong>
              <span style={{ fontSize: "12px", color: "var(--color-slate)", lineHeight: 1.4, display: "block" }}>
                Nhân viên CSKH sẽ gọi điện xác nhận trong 5-10 phút.
              </span>
            </div>

            <div style={{ padding: "16px", borderRadius: "14px", border: "1px solid var(--color-hairline-silver)", backgroundColor: "#fff" }}>
              <PackageCheck size={20} color="#16a34a" style={{ marginBottom: "8px" }} />
              <strong style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>2. Đóng gói & Giao hỏa tốc</strong>
              <span style={{ fontSize: "12px", color: "var(--color-slate)", lineHeight: 1.4, display: "block" }}>
                Máy mới 100% nguyên seal được giao trong 2 giờ tại nội thành.
              </span>
            </div>

            <div style={{ padding: "16px", borderRadius: "14px", border: "1px solid var(--color-hairline-silver)", backgroundColor: "#fff" }}>
              <ShieldCheck size={20} color="#ca8a04" style={{ marginBottom: "8px" }} />
              <strong style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>3. Kiểm hàng & Kích hoạt</strong>
              <span style={{ fontSize: "12px", color: "var(--color-slate)", lineHeight: 1.4, display: "block" }}>
                Bạn được bóc seal, kiểm tra máy và kích hoạt bảo hành chính hãng.
              </span>
            </div>
          </div>

          {/* Thông tin Bảo hành điện tử tự động kích hoạt */}
          <div
            style={{
              backgroundColor: "rgba(22, 163, 74, 0.06)",
              border: "1.5px solid #86efac",
              borderRadius: "18px",
              padding: "20px 24px",
              textAlign: "left",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", maxWidth: "480px" }}>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <div>
                <strong style={{ fontSize: "15px", color: "#166534", display: "block", marginBottom: "4px" }}>
                  Bảo hành điện tử chính hãng 12 tháng đã được kích hoạt
                </strong>
                <p style={{ margin: 0, fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                  Thiết bị của bạn được bảo vệ bởi chính sách 1 đổi 1 trong 30 ngày và bảo hành tại các TTBH ủy quyền.
                  Bạn có thể tra cứu hạn bảo hành bất kỳ lúc nào bằng <strong>Số điện thoại ({order?.customer?.phone || "người mua"})</strong> hoặc mã đơn <strong>#{orderId}</strong>.
                </p>
              </div>
            </div>

            <Link
              to={`/tra-cuu-bao-hanh?orderCode=${orderId}&phone=${order?.customer?.phone || ""}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
              }}
            >
              <ShieldCheck size={16} /> Xem thẻ bảo hành điện tử
            </Link>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/"
              className="btn-explore-pill"
              style={{
                height: "42px",
                padding: "0 24px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Về trang chủ
            </Link>

            <Link
              to="/dien-thoai"
              className="btn-pricing-blue"
              style={{
                height: "42px",
                padding: "0 28px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Tiếp tục mua sắm
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>

      <StorefrontFooter />
      <FloatingSupportWidget />
    </div>
  );
}

