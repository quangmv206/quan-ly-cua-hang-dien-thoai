import React from "react";
import { LayoutDashboard, Smartphone, ShoppingBag, Users, ShieldCheck, Tag, Building2, PackagePlus, Sparkles, Sliders, MessageSquare, Ticket, Newspaper } from "lucide-react";

export default function Sidebar({ activeTab, onSelectTab }) {
  const menuItems = [
    { id: "storefront", label: "Cửa hàng (DESIGN.md)", icon: Sparkles, badge: "Mới" },
    { id: "dashboard", label: "Tổng quan Admin", icon: LayoutDashboard },
    { id: "news", label: "Tin tức & Ưu đãi", icon: Newspaper, badge: "Mới" },
    { id: "site-settings", label: "Giao diện (Storefront CMS)", icon: Sliders, badge: "HOT" },
    { id: "products", label: "Sản phẩm & Kho", icon: Smartphone, badge: "Chính" },
    { id: "vouchers", label: "Mã giảm giá (Vouchers)", icon: Ticket },
    { id: "questions-reviews", label: "Hỏi đáp & Đánh giá", icon: MessageSquare },
    { id: "purchase-orders", label: "Nhập kho hàng", icon: PackagePlus },
    { id: "suppliers", label: "Nhà cung cấp", icon: Building2 },
    { id: "brands-categories", label: "Hãng & Danh mục", icon: Tag },
    { id: "orders", label: "Quản lý Đơn hàng", icon: ShoppingBag },
    { id: "warranties", label: "Bảo hành chính hãng", icon: ShieldCheck },
    { id: "users", label: "Tài khoản & Phân quyền", icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Menu Quản Trị Admin</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-pill">
          <Sparkles size={14} />
          <span>Spring Boot + ReactJS</span>
        </div>
      </div>
    </aside>
  );
}
