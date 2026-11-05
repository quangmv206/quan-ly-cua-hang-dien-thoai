import React from "react";

export default function Footer() {
  return (
    <footer className="storefront-footer" role="contentinfo" aria-label="Chân trang Apple Store">
      <div className="footer-container">
        {/* Footnotes & Legal notices */}
        <div className="footer-legal-notes">
          <p style={{ margin: "0 0 8px 0" }}>
            1. Giá niêm yết đã bao gồm thuế giá trị gia tăng (VAT) và phí giao hàng tiêu chuẩn trên toàn lãnh thổ Việt Nam.
          </p>
          <p style={{ margin: "0 0 8px 0" }}>
            2. Chương trình trả góp lãi suất 0% áp dụng cho chủ thẻ tín dụng của các ngân hàng đối tác liên kết đủ điều kiện.
          </p>
          <p style={{ margin: 0 }}>
            3. Tính năng và thông số kỹ thuật của thiết bị có thể thay đổi tùy thuộc vào phiên bản phần mềm và khu vực phân phối.
          </p>
        </div>

        {/* Directory columns */}
        <div className="footer-directory">
          <div>
            <h3 className="footer-col-title">Mua sắm & Tìm hiểu</h3>
            <ul className="footer-link-list">
              <li><a href="#hero" className="footer-link">iPhone</a></li>
              <li><a href="#hero" className="footer-link">Mac</a></li>
              <li><a href="#hero" className="footer-link">iPad</a></li>
              <li><a href="#hero" className="footer-link">Apple Watch</a></li>
              <li><a href="#hero" className="footer-link">Phụ kiện chính hãng</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Tài khoản & Dịch vụ</h3>
            <ul className="footer-link-list">
              <li><a href="#hero" className="footer-link">Quản lý Apple ID</a></li>
              <li><a href="#hero" className="footer-link">Tài khoản Apple Store</a></li>
              <li><a href="#hero" className="footer-link">iCloud.com</a></li>
              <li><a href="#hero" className="footer-link">Apple Care+</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Giá trị cốt lõi</h3>
            <ul className="footer-link-list">
              <li><a href="#hero" className="footer-link">Trợ năng (Accessibility)</a></li>
              <li><a href="#hero" className="footer-link">Môi trường & Tái chế</a></li>
              <li><a href="#hero" className="footer-link">Bảo mật & Quyền riêng tư</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Về Apple</h3>
            <ul className="footer-link-list">
              <li><a href="#hero" className="footer-link">Tin tức mới nhất</a></li>
              <li><a href="#hero" className="footer-link">Cơ hội nghề nghiệp</a></li>
              <li><a href="#hero" className="footer-link">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            Bản quyền © 2026 Apple Inc. Bảo lưu mọi quyền.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#hero" className="footer-link" style={{ fontSize: "11px" }}>Chính sách bảo mật</a>
            <a href="#hero" className="footer-link" style={{ fontSize: "11px" }}>Điều khoản sử dụng</a>
            <a href="#hero" className="footer-link" style={{ fontSize: "11px" }}>Bán hàng & Hoàn tiền</a>
            <a href="#hero" className="footer-link" style={{ fontSize: "11px" }}>Pháp lý</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

