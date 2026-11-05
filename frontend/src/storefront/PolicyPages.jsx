import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, RotateCcw, Truck, CreditCard, Lock, MapPin, Info, HelpCircle, Phone, Search, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import Breadcrumb from "./components/Breadcrumb";
import StorefrontFooter from "./components/StorefrontFooter";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import { siteSettingsApi } from "../services/siteSettingsApi";

export default function PolicyPages({ type = "warranty" }) {
  const location = useLocation();

  const [policySettings, setPolicySettings] = useState(null);

  useEffect(() => {
    siteSettingsApi
      .getByKey("policy_content")
      .then((res) => {
        if (res.data && res.data.value) {
          try {
            setPolicySettings(JSON.parse(res.data.value));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Xác định loại trang dựa vào path hoặc prop
  let currentType = type;
  if (location.pathname.includes("doi-tra")) currentType = "return";
  else if (location.pathname.includes("giao-hang")) currentType = "shipping";
  else if (location.pathname.includes("thanh-toan")) currentType = "payment";
  else if (location.pathname.includes("dieu-khoan") || location.pathname.includes("bao-mat")) currentType = "privacy";
  else if (location.pathname.includes("lien-he")) currentType = "contact";
  else if (location.pathname.includes("gioi-thieu")) currentType = "about";
  else if (location.pathname.includes("faq")) currentType = "faq";
  else if (location.pathname.includes("bao-hanh")) currentType = "warranty";

  // FAQ state
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const policyMenu = [
    { id: "warranty", label: "Chính sách bảo hành", link: "/chinh-sach-bao-hanh", icon: <ShieldCheck size={16} /> },
    { id: "return", label: "Đổi trả & Hoàn tiền", link: "/chinh-sach-doi-tra", icon: <RotateCcw size={16} /> },
    { id: "shipping", label: "Chính sách giao hàng", link: "/chinh-sach-giao-hang", icon: <Truck size={16} /> },
    { id: "payment", label: "Hướng dẫn thanh toán & Trả góp", link: "/huong-dan-thanh-toan", icon: <CreditCard size={16} /> },
    { id: "privacy", label: "Bảo mật & Điều khoản", link: "/dieu-khoan-bao-mat", icon: <Lock size={16} /> },
    { id: "contact", label: "Liên hệ & Showroom", link: "/lien-he", icon: <MapPin size={16} /> },
    { id: "about", label: "Giới thiệu Phone Store", link: "/gioi-thieu", icon: <Info size={16} /> },
    { id: "faq", label: "Câu hỏi thường gặp FAQ", link: "/faq", icon: <HelpCircle size={16} /> },
  ];

  const currentItem = policyMenu.find((m) => m.id === currentType) || policyMenu[0];

  const faqItems = [
    {
      q: "Phone Store bán điện thoại chính hãng từ những nguồn nào?",
      a: "100% điện thoại bán ra tại Phone Store là hàng phân phối chính hãng dành riêng cho thị trường Việt Nam (mã VN/A cho iPhone, mã SSVN cho Samsung). Máy được nhập khẩu trực tiếp qua các nhà phân phối ủy quyền: Synnex FPT, Digiworld (DGW), Viettel Commerce, Petrosetco (PSD).",
    },
    {
      q: "Quy định 1 đổi 1 trong 30 ngày áp dụng ra sao?",
      a: "Khách hàng được đổi mới 100% ngay tại cửa hàng trong 30 ngày đầu tiên nếu máy phát sinh lỗi phần cứng từ nhà sản xuất (lỗi nguồn, màn hình sọc/điểm chết, loa rè, camera không lấy nét, mainboard...). Thân máy và hộp trùng IMEI, phụ kiện nguyên vẹn.",
    },
    {
      q: "Chương trình trả góp 0% lãi suất hỗ trợ những ngân hàng nào?",
      a: "Phone Store liên kết cùng 26 ngân hàng lớn tại Việt Nam (Vietcombank, Techcombank, MB Bank, VPBank, ACB, BIDV, Sacombank, HSBC, VIB...) với kỳ hạn linh hoạt 3, 6, 9, 12 tháng. Phí chuyển đổi ưu đãi chỉ 0% hoặc tối thiểu theo quy định của ngân hàng.",
    },
    {
      q: "Tôi ở tỉnh xa thì thời gian giao hàng và hình thức thanh toán thế nào?",
      a: "Phone Store giao hàng toàn quốc qua Viettel Post và GHN Express. Khách hàng nhận máy sau 1-3 ngày làm việc, được quyền bóc hộp kiểm tra máy nguyên seal, đúng số IMEI trước khi thanh toán tiền mặt cho nhân viên giao hàng.",
    },
    {
      q: "Quy trình Thu cũ Đổi mới (Trade-in) trợ giá diễn ra như thế nào?",
      a: "Khách hàng chỉ cần mang máy cũ đến Showroom, kỹ thuật viên sẽ thẩm định ngoại quan và chức năng trong 5 phút. Giá trị máy cũ được cấn trừ trực tiếp vào hóa đơn mua máy mới kèm khoản trợ giá độc quyền từ 1.000.000đ đến 3.000.000đ.",
    },
  ];

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="storefront-root" style={{ backgroundColor: "var(--color-studio-mist)", minHeight: "100vh" }}>
      <AnnouncementBar />
      <HomeHeader cartCount={0} onOpenCart={() => {}} />

      <main style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 var(--space-5) 60px var(--space-5)" }}>
        <Breadcrumb items={[{ label: "Hỗ trợ & Chính sách", link: "/faq" }, { label: currentItem.label }]} />

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "28px", marginTop: "20px", alignItems: "start" }}>
          {/* CỘT MENU ĐIỀU HƯỚNG BÊN TRÁI */}
          <aside
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "20px",
              border: "1px solid var(--color-hairline-silver)",
              padding: "16px",
              position: "sticky",
              top: "64px",
            }}
          >
            <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, color: "var(--color-slate)", letterSpacing: "0.05em", padding: "8px 12px 12px 12px" }}>
              Trung tâm chính sách
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {policyMenu.map((m) => {
                const isActive = m.id === currentType;
                return (
                  <Link
                    key={m.id}
                    to={m.link}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 500,
                      textDecoration: "none",
                      color: isActive ? "#ffffff" : "var(--color-ink)",
                      backgroundColor: isActive ? "var(--color-pricing-blue)" : "transparent",
                      transition: "all 150ms ease",
                    }}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* CỘT NỘI DUNG CHÍNH */}
          <article
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "24px",
              border: "1px solid var(--color-hairline-silver)",
              padding: "36px 32px",
              color: "var(--color-ink)",
              lineHeight: 1.6,
            }}
          >
            {/* Thông báo cập nhật chính sách từ Admin CMS */}
            {policySettings && (
              <div style={{ marginBottom: "24px" }}>
                {currentType === "warranty" && policySettings.warranty && (
                  <div style={{ padding: "16px 20px", borderRadius: "12px", backgroundColor: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.2)", fontSize: "14px", lineHeight: 1.6, color: "var(--color-ink)" }}>
                    <strong style={{ color: "var(--color-pricing-blue)" }}>Thông báo cập nhật từ Ban Quản Trị:</strong> {policySettings.warranty}
                  </div>
                )}
                {currentType === "return" && policySettings.returnPolicy && (
                  <div style={{ padding: "16px 20px", borderRadius: "12px", backgroundColor: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.2)", fontSize: "14px", lineHeight: 1.6, color: "var(--color-ink)" }}>
                    <strong style={{ color: "var(--color-pricing-blue)" }}>Thông báo cập nhật từ Ban Quản Trị:</strong> {policySettings.returnPolicy}
                  </div>
                )}
                {currentType === "shipping" && policySettings.shipping && (
                  <div style={{ padding: "16px 20px", borderRadius: "12px", backgroundColor: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.2)", fontSize: "14px", lineHeight: 1.6, color: "var(--color-ink)" }}>
                    <strong style={{ color: "var(--color-pricing-blue)" }}>Thông báo cập nhật từ Ban Quản Trị:</strong> {policySettings.shipping}
                  </div>
                )}
                {currentType === "payment" && policySettings.payment && (
                  <div style={{ padding: "16px 20px", borderRadius: "12px", backgroundColor: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.2)", fontSize: "14px", lineHeight: 1.6, color: "var(--color-ink)" }}>
                    <strong style={{ color: "var(--color-pricing-blue)" }}>Thông báo cập nhật từ Ban Quản Trị:</strong> {policySettings.payment}
                  </div>
                )}
              </div>
            )}

            {/* 1. CHÍNH SÁCH BẢO HÀNH */}
            {currentType === "warranty" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px", color: "var(--color-ink)" }}>
                  Chính sách bảo hành chính hãng tại Phone Store
                </h1>
                <p style={{ color: "var(--color-slate)", fontSize: "14px" }}>
                  Áp dụng cho toàn bộ điện thoại phân phối chính hãng bởi Phone Store trên toàn quốc.
                </p>

                <div style={{ borderTop: "1px solid var(--color-hairline-silver)", margin: "20px 0", paddingTop: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>1. Thời hạn và địa điểm bảo hành</h3>
                  <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#333" }}>
                    <li><strong>Thời hạn:</strong> 12 đến 24 tháng theo đúng tiêu chuẩn nhà sản xuất (Apple Care, Samsung Care, Xiaomi Service).</li>
                    <li><strong>Địa điểm:</strong> Toàn bộ các Trung tâm Bảo hành Ủy quyền (AASP, Samsung Brand Shop) hoặc gửi bảo hành trực tiếp tại các showroom của Phone Store.</li>
                  </ul>

                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>2. Điều kiện bảo hành hợp lệ</h3>
                  <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#333" }}>
                    <li>Máy còn trong thời hạn bảo hành căn cứ vào số IMEI/Serial Number điện tử.</li>
                    <li>Tem niêm phong của nhà sản xuất hoặc Phone Store còn nguyên vẹn, không có dấu hiệu tẩy xóa, sửa chữa.</li>
                    <li>Sản phẩm gặp lỗi phần cứng do nhà sản xuất trong điều kiện sử dụng bình thường.</li>
                  </ul>

                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>3. Các trường hợp từ chối bảo hành</h3>
                  <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#333" }}>
                    <li>Máy bị rơi vỡ, nứt kính, móp méo, biến dạng khung vỏ do tác động ngoại lực.</li>
                    <li>Máy bị vô nước, ẩm mạch, cháy nổ, hoen rỉ do chất lỏng hoặc nguồn điện không ổn định.</li>
                    <li>Máy đã bị can thiệp phần cứng, bẻ khóa bootloader, can thiệp hệ điều hành không chính thống bởi bên thứ ba.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 2. CHÍNH SÁCH ĐỔI TRẢ */}
            {currentType === "return" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
                  Quy định đổi trả và hoàn tiền trong 30 ngày
                </h1>
                <p style={{ color: "var(--color-slate)", fontSize: "14px" }}>
                  Cam kết bảo vệ quyền lợi tối đa cho khách hàng mua sắm tại Phone Store.
                </p>

                <div style={{ borderTop: "1px solid var(--color-hairline-silver)", margin: "20px 0", paddingTop: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>1. Chính sách 1 đổi 1 máy mới</h3>
                  <p style={{ fontSize: "14px" }}>
                    Trong vòng <strong>30 ngày đầu tiên</strong> kể từ ngày kích hoạt hoặc nhận máy, nếu sản phẩm phát sinh lỗi kỹ thuật do nhà sản xuất, khách hàng được đổi ngay 01 máy mới 100% nguyên hộp cùng model và màu sắc.
                  </p>

                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>2. Điều kiện đổi trả</h3>
                  <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#333" }}>
                    <li>Máy còn nguyên hộp đựng, đầy đủ phụ kiện theo máy (cáp sạc, sách hướng dẫn, que chọc sim).</li>
                    <li>Thân máy không bị trầy xước, cấn móp, còn nguyên tem bảo hành.</li>
                    <li>Đã thoát tài khoản iCloud (đối với iPhone) hoặc Google Account / Mi Account (đối với Android).</li>
                  </ul>

                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>3. Quy trình và thời gian hoàn tiền</h3>
                  <p style={{ fontSize: "14px" }}>
                    Trường hợp sản phẩm lỗi mà Phone Store hết hàng cùng loại để đổi, khách hàng sẽ được hoàn lại 100% số tiền đã thanh toán trong vòng 2-24 giờ làm việc qua hình thức chuyển khoản ngân hàng.
                  </p>
                </div>
              </div>
            )}

            {/* 3. CHÍNH SÁCH GIAO HÀNG */}
            {currentType === "shipping" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
                  Chính sách giao hàng hỏa tốc và toàn quốc
                </h1>
                <div style={{ borderTop: "1px solid var(--color-hairline-silver)", margin: "20px 0", paddingTop: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>⚡ Giao hỏa tốc 2 giờ nội thành</h3>
                  <p style={{ fontSize: "14px" }}>
                    Áp dụng tại các quận nội thành Hà Nội, TP. Hồ Chí Minh và Đà Nẵng. Đơn hàng đặt trước 18:00 sẽ được shipper chuyên biệt của Phone Store giao tận nơi trong vòng 120 phút. <strong>Hoàn toàn miễn phí</strong>.
                  </p>

                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>📦 Giao hàng toàn quốc (1-3 ngày)</h3>
                  <p style={{ fontSize: "14px" }}>
                    Phone Store hợp tác cùng Viettel Post và GHN Express để chuyển phát nhanh tới mọi huyện xã trên 63 tỉnh thành. Khách hàng được quyền <strong>đồng kiểm mở gói hàng</strong> và kiểm tra tem niêm phong trước khi thanh toán.
                  </p>
                </div>
              </div>
            )}

            {/* 4. HƯỚNG DẪN THANH TOÁN */}
            {currentType === "payment" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
                  Hướng dẫn thanh toán & Trả góp lãi suất 0%
                </h1>
                <div style={{ borderTop: "1px solid var(--color-hairline-silver)", margin: "20px 0", paddingTop: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Các hình thức thanh toán được hỗ trợ:</h3>
                  <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#333" }}>
                    <li><strong>Thanh toán tiền mặt khi nhận hàng (COD):</strong> Áp dụng cho mọi đơn hàng dưới 50.000.000 VNĐ.</li>
                    <li><strong>Chuyển khoản VietQR:</strong> Quét mã QR tự động xác nhận trong 30 giây qua App mọi ngân hàng.</li>
                    <li><strong>Quẹt thẻ POS:</strong> Hỗ trợ thẻ ATM nội địa, Visa, MasterCard, JCB ngay tại nhà hoặc showroom.</li>
                    <li><strong>Trả góp 0% qua thẻ tín dụng:</strong> Kỳ hạn 3, 6, 9, 12 tháng liên kết với hơn 25 ngân hàng.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 5. BẢO MẬT & ĐIỀU KHOẢN */}
            {currentType === "privacy" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
                  Chính sách bảo mật thông tin & Điều khoản dịch vụ
                </h1>
                <div style={{ borderTop: "1px solid var(--color-hairline-silver)", margin: "20px 0", paddingTop: "20px", fontSize: "14px", color: "#333" }}>
                  <p>
                    Phone Store cam kết bảo vệ tuyệt đối thông tin cá nhân của khách hàng theo Luật An ninh mạng và các quy định pháp luật Việt Nam. Dữ liệu chỉ được sử dụng cho mục đích xử lý đơn hàng, bảo hành điện tử và chăm sóc khách hàng.
                  </p>
                  <p>
                    Website sử dụng mã hóa SSL 256-bit cao cấp nhất để bảo vệ an toàn cho mọi giao dịch thanh toán trực tuyến.
                  </p>
                </div>
              </div>
            )}

            {/* 6. LIÊN HỆ & SHOWROOM */}
            {currentType === "contact" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
                  Hệ thống Showroom & Liên hệ trực tiếp
                </h1>
                <div style={{ borderTop: "1px solid var(--color-hairline-silver)", margin: "20px 0", paddingTop: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                    <div style={{ padding: "16px", borderRadius: "14px", border: "1px solid var(--color-hairline-silver)", backgroundColor: "var(--color-studio-mist)" }}>
                      <strong style={{ display: "block", fontSize: "15px", marginBottom: "6px" }}>📍 Showroom Hà Nội</strong>
                      <p style={{ fontSize: "13px", margin: "0 0 6px 0", color: "#555" }}>Số 120 Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy</p>
                      <span style={{ fontSize: "12px", color: "var(--color-pricing-blue)", fontWeight: 600 }}>Hotline: 024.7300.6868</span>
                    </div>

                    <div style={{ padding: "16px", borderRadius: "14px", border: "1px solid var(--color-hairline-silver)", backgroundColor: "var(--color-studio-mist)" }}>
                      <strong style={{ display: "block", fontSize: "15px", marginBottom: "6px" }}>📍 Flagship Store TP.HCM</strong>
                      <p style={{ fontSize: "13px", margin: "0 0 6px 0", color: "#555" }}>Số 195 Nguyễn Thái Học, P. Phạm Ngũ Lão, Q.1</p>
                      <span style={{ fontSize: "12px", color: "var(--color-pricing-blue)", fontWeight: 600 }}>Hotline: 028.3929.6868</span>
                    </div>

                    <div style={{ padding: "16px", borderRadius: "14px", border: "1px solid var(--color-hairline-silver)", backgroundColor: "var(--color-studio-mist)" }}>
                      <strong style={{ display: "block", fontSize: "15px", marginBottom: "6px" }}>📍 Chi nhánh Đà Nẵng</strong>
                      <p style={{ fontSize: "13px", margin: "0 0 6px 0", color: "#555" }}>Số 68 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu</p>
                      <span style={{ fontSize: "12px", color: "var(--color-pricing-blue)", fontWeight: 600 }}>Hotline: 0236.368.6868</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Gửi phản hồi hoặc liên hệ công tác</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
                    <input type="text" placeholder="Họ và tên của bạn" className="form-input" style={{ height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "14px" }} />
                    <input type="tel" placeholder="Số điện thoại liên hệ" className="form-input" style={{ height: "40px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "14px" }} />
                    <textarea rows={3} placeholder="Nội dung cần hỗ trợ hoặc góp ý..." style={{ borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "8px 12px", fontSize: "13px", fontFamily: "inherit" }} />
                    <button type="button" className="btn-pricing-blue" style={{ height: "40px", borderRadius: "8px", fontWeight: 600, border: "none", cursor: "pointer" }}>
                      Gửi tin nhắn liên hệ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. GIỚI THIỆU */}
            {currentType === "about" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
                  Giới thiệu về Phone Store Việt Nam
                </h1>
                <div style={{ borderTop: "1px solid var(--color-hairline-silver)", margin: "20px 0", paddingTop: "20px", fontSize: "14px", color: "#333", lineHeight: 1.7 }}>
                  <p>
                    Thành lập từ năm 2020, <strong>Phone Store</strong> tự hào là hệ thống bán lẻ smartphone và thiết bị công nghệ chính hãng hàng đầu tại Việt Nam. Với triết lý kinh doanh <em>"Khách hàng là trung tâm"</em>, chúng tôi cam kết mang đến những thiết bị điện thoại đỉnh cao nhất cùng dịch vụ bảo hành 1 đổi 1 số 1 thị trường.
                  </p>
                  <p>
                    Mỗi sản phẩm đến tay người dùng đều trải qua quy trình kiểm định chất lượng nghiêm ngặt, có đầy đủ hóa đơn VAT và bảo hành điện tử chính hãng từ Apple, Samsung, Xiaomi, OPPO.
                  </p>
                </div>
              </div>
            )}

            {/* 8. FAQ - CÂU HỎI THƯỜNG GẶP (Có thanh tìm kiếm theo Bảng 2) */}
            {currentType === "faq" && (
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
                  Trung tâm câu hỏi thường gặp (FAQ)
                </h1>
                <p style={{ color: "var(--color-slate)", fontSize: "14px", marginBottom: "20px" }}>
                  Giải đáp nhanh chóng mọi thắc mắc về mua sắm, bảo hành, vận chuyển và trả góp tại Phone Store.
                </p>

                {/* Thanh tìm kiếm trong FAQ theo Bảng 2 */}
                <div style={{ position: "relative", marginBottom: "24px" }}>
                  <Search size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "var(--color-slate)" }} />
                  <input
                    type="text"
                    placeholder="Tìm câu hỏi bạn thắc mắc (VD: bảo hành, trả góp, giao hàng...)"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    style={{
                      width: "100%",
                      height: "42px",
                      borderRadius: "12px",
                      border: "1px solid var(--color-hairline-silver)",
                      paddingLeft: "42px",
                      paddingRight: "14px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Accordion FAQ */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        style={{
                          borderRadius: "14px",
                          border: "1px solid var(--color-hairline-silver)",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                          style={{
                            width: "100%",
                            padding: "16px 20px",
                            backgroundColor: isOpen ? "rgba(0, 113, 227, 0.04)" : "#fff",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            textAlign: "left",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--color-ink)",
                          }}
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {isOpen && (
                          <div style={{ padding: "16px 20px", backgroundColor: "#fff", fontSize: "14px", color: "var(--color-slate)", lineHeight: 1.6, borderTop: "1px solid var(--color-hairline-silver)" }}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      <StorefrontFooter />
      <FloatingSupportWidget />
    </div>
  );
}

