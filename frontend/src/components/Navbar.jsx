import React from "react";
import { Smartphone, LogIn, LogOut, ShieldCheck, User as UserIcon, ExternalLink } from "lucide-react";

export default function Navbar({ user, onLogout, onOpenLogin, onViewStorefront }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Smartphone className="brand-icon" size={24} />
          <span className="brand-name">Phone Store Admin</span>
        </div>
        <span className="api-badge">
          <span className="pulse-dot"></span>
          Spring Boot API (:8080)
        </span>
      </div>

      <div className="navbar-right">
        {onViewStorefront && (
          <button
            type="button"
            onClick={onViewStorefront}
            className="btn btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
            }}
            title="Mở giao diện người dùng mua sắm (/)"
          >
            <ExternalLink size={14} />
            <span>Xem Website Cửa Hàng</span>
          </button>
        )}

        {user ? (
          <div className="user-profile">
            <div className="user-avatar">
              <UserIcon size={18} />
            </div>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="user-role">
                <ShieldCheck size={12} /> {user.role === "ROLE_ADMIN" ? "Quản Trị Viên" : "Khách hàng"}
              </span>
            </div>
            <button onClick={onLogout} className="btn-icon logout-btn" title="Đăng xuất">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={onOpenLogin} className="btn btn-primary login-btn">
            <LogIn size={16} /> Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
