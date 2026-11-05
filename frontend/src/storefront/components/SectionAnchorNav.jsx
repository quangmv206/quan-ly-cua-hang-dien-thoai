import React from "react";

export default function SectionAnchorNav() {
  const anchors = [
    { label: "Điểm nổi bật", href: "#highlights" },
    { label: "Thiết kế & Khung viền", href: "#design" },
    { label: "Hiệu năng chip xử lý", href: "#performance" },
    { label: "Hệ thống Camera", href: "#camera" },
    { label: "Thời lượng pin", href: "#battery" },
    { label: "Chọn phiên bản", href: "#configurator" },
  ];

  return (
    <nav className="section-anchor-nav" aria-label="Điều hướng các mục trên trang">
      <ul className="anchor-nav-list">
        {anchors.map((item, idx) => (
          <li key={idx}>
            <a href={item.href} className="anchor-nav-item">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

