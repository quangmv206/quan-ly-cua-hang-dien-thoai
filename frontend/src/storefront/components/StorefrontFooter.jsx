import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, ShieldCheck } from "lucide-react";
import { siteSettingsApi } from "../../services/siteSettingsApi";

export default function StorefrontFooter() {
  const [storeInfo, setStoreInfo] = useState({
    storeName: "Phone Store Official",
    hotline: "1800 6868",
    cskh: "1800 6869",
    email: "hotro@phonestore.vn",
  });

  useEffect(() => {
    siteSettingsApi.getByKey("store_info")
      .then((res) => {
        if (res.data && res.data.value) {
          try {
            setStoreInfo((prev) => ({ ...prev, ...JSON.parse(res.data.value) }));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);
  const showrooms = [
    {
      city: "Hà Nội — Showroom Trung Tâm",
      address: "Số 120 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
      phone: "024.7300.6868",
      hours: "08:00 – 21:30 (Mở cửa tất cả các ngày trong tuần)",
    },
    {
      city: "TP. Hồ Chí Minh — Flagship Store",
      address: "Số 195 Nguyễn Thái Học, Phường Phạm Ngũ Lão, Quận 1, TP.HCM",
      phone: "028.3929.6868",
      hours: "08:00 – 22:00 (Mở cửa tất cả các ngày trong tuần)",
    },
    {
      city: "Đà Nẵng — Chi Nhánh Miền Trung",
      address: "Số 68 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng",
      phone: "0236.368.6868",
      hours: "08:00 – 21:30 (Mở cửa tất cả các ngày trong tuần)",
    },
  ];

  return (
    <footer className="storefront-footer" role="contentinfo" aria-label="Chân trang hệ thống Phone Store">
      <div className="footer-container">
        {/* Component 9: Liên hệ và địa chỉ showroom thực tế (Chứng minh cửa hàng thật theo Bảng 1 & 2) */}
        <section className="showroom-section-footer" aria-label="Hệ thống Showroom và địa chỉ liên hệ">
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-ink)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={16} color="var(--color-launch-orange)" aria-hidden="true" />
            Hệ thống Showroom & Điểm trải nghiệm điện thoại thực tế
          </h3>

          <div className="showroom-grid">
            {showrooms.map((sr, idx) => (
              <div key={idx} className="showroom-item">
                <div className="showroom-city">{sr.city}</div>
                <p style={{ margin: "0 0 4px 0" }}>{sr.address}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-ink)", fontWeight: 500 }}>
                  <Phone size={12} aria-hidden="true" />
                  <span>Điện thoại: {sr.phone}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-slate)", marginTop: "2px" }}>
                  <Clock size={12} aria-hidden="true" />
                  <span>Giờ mở cửa: {sr.hours}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal & Policy Footnotes */}
        <div className="footer-legal-notes">
          <p style={{ margin: "0 0 6px 0" }}>
            * Toàn bộ giá bán smartphone đã bao gồm thuế Giá Trị Gia Tăng (VAT). Giá niêm yết và chương trình khuyến mãi có hiệu lực tại thời điểm truy cập.
          </p>
          <p style={{ margin: 0 }}>
            * Sản phẩm phân phối chính hãng có tem kiểm định và bảo hành điện tử chính hãng bởi Synnex FPT, Digiworld (DGW), Viettel Commerce.
          </p>
        </div>

        {/* Component 10: Footer — Danh mục điều hướng phụ & Pháp lý doanh nghiệp */}
        <div className="footer-directory">
          <div>
            <h4 className="footer-col-title">Điện thoại theo hãng</h4>
            <ul className="footer-link-list">
              <li><Link to="/dien-thoai" className="footer-link">Toàn bộ điện thoại</Link></li>
              <li><Link to="/dien-thoai" className="footer-link">Apple iPhone chính hãng</Link></li>
              <li><Link to="/dien-thoai" className="footer-link">Samsung Galaxy & Galaxy AI</Link></li>
              <li><Link to="/dien-thoai" className="footer-link">Xiaomi & Redmi Series</Link></li>
              <li><Link to="/dien-thoai" className="footer-link">OPPO Find & Reno Series</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Chính sách & Hỗ trợ</h4>
            <ul className="footer-link-list">
              <li><Link to="/chinh-sach-bao-hanh" className="footer-link">Chính sách bảo hành 1 đổi 1</Link></li>
              <li><Link to="/chinh-sach-giao-hang" className="footer-link">Chính sách giao hàng hỏa tốc</Link></li>
              <li><Link to="/huong-dan-thanh-toan" className="footer-link">Hướng dẫn thanh toán & Trả góp 0%</Link></li>
              <li><Link to="/dieu-khoan-bao-mat" className="footer-link">Chính sách bảo mật thông tin</Link></li>
              <li><Link to="/chinh-sach-doi-tra" className="footer-link">Quy định đổi trả hàng 30 ngày</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Tổng đài hỗ trợ (Miễn phí)</h4>
            <ul className="footer-link-list">
              <li style={{ fontSize: "12px", color: "var(--color-slate)" }}>
                Gọi mua hàng: <a href={`tel:${storeInfo.hotline.replace(/\s+/g, "")}`} style={{ color: "var(--color-ink)", fontWeight: 700, textDecoration: "none" }}>{storeInfo.hotline}</a> (8:00 - 21:30)
              </li>
              <li style={{ fontSize: "12px", color: "var(--color-slate)" }}>
                Kỹ thuật & Bảo hành: <a href={`tel:${storeInfo.cskh.replace(/\s+/g, "")}`} style={{ color: "var(--color-ink)", fontWeight: 700, textDecoration: "none" }}>{storeInfo.cskh}</a> (8:00 - 21:00)
              </li>
              <li style={{ fontSize: "12px", color: "var(--color-slate)" }}>
                Email CSKH: <a href={`mailto:${storeInfo.email}`} style={{ color: "var(--color-ink)", textDecoration: "none" }}>{storeInfo.email}</a>
              </li>
              <li><Link to="/faq" className="footer-link" style={{ fontWeight: 600, color: "var(--color-pricing-blue)" }}>Trung tâm hỏi đáp FAQ →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Thông tin doanh nghiệp</h4>
            <p style={{ fontSize: "12px", color: "var(--color-slate)", margin: "0 0 6px 0", lineHeight: 1.5 }}>
              CÔNG TY CỔ PHẦN THƯƠNG MẠI & BÁN LẺ PHONE STORE VIỆT NAM
            </p>
            <p style={{ fontSize: "11px", color: "var(--color-slate)", margin: "0 0 4px 0" }}>
              GPĐKKD số 0108968686 do Sở KH&ĐT cấp ngày 15/01/2020.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
              <ShieldCheck size={16} color="var(--color-pricing-blue)" aria-hidden="true" />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-ink)" }}>Đã đăng ký Website TMĐT với Bộ Công Thương</span>
            </div>
            <div style={{ marginTop: "10px" }}>
              <Link to="/gioi-thieu" className="footer-link" style={{ fontSize: "11px", color: "var(--color-slate)" }}>
                Về chúng tôi & Giấy phép kinh doanh →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            Bản quyền © 2026 Phone Store. Bảo lưu mọi quyền theo quy định pháp luật.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/dieu-khoan-bao-mat" className="footer-link" style={{ fontSize: "11px" }}>Điều khoản giao dịch</Link>
            <Link to="/dieu-khoan-bao-mat" className="footer-link" style={{ fontSize: "11px" }}>Chính sách dữ liệu</Link>
            <Link to="/lien-he" className="footer-link" style={{ fontSize: "11px" }}>Showroom & Bản đồ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
