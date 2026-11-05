import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductListPage from "../pages/ProductListPage";
import DashboardView from "../components/DashboardView";
import BrandsCategoriesView from "../components/BrandsCategoriesView";
import OrdersView from "../components/OrdersView";
import WarrantyView from "../components/WarrantyView";
import UsersView from "../components/UsersView";
import SuppliersView from "../components/SuppliersView";
import PurchaseOrdersView from "../components/PurchaseOrdersView";
import SiteSettingsView from "../components/SiteSettingsView";
import NewsManagementView from "../components/NewsManagementView";
import VouchersView from "../components/VouchersView";
import QuestionsReviewsView from "../components/QuestionsReviewsView";
import LoginModal from "../components/LoginModal";
import { authApi } from "../services/authApi";

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Tự động kiểm tra phiên đăng nhập
    const currentUser = authApi.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    const handleAuthExpired = () => {
      setUser(null);
      setLoginModalOpen(true);
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <div className="app-container">
      {/* 1. Header Navbar với đường dẫn chuyển đổi sang Storefront người dùng */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setLoginModalOpen(true)}
        onViewStorefront={() => navigate("/")}
      />

      {/* 2. Main Layout (Sidebar + Content Area) */}
      <div className="app-body">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === "storefront") {
              navigate("/");
            } else {
              setActiveTab(tab);
            }
          }}
        />

        <main className="main-content">
          {activeTab === "dashboard" && (
            <DashboardView user={user} onNavigateTab={setActiveTab} />
          )}

          {activeTab === "news" && (
            <NewsManagementView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "site-settings" && (
            <SiteSettingsView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "vouchers" && (
            <VouchersView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "questions-reviews" && (
            <QuestionsReviewsView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "products" && (
            <ProductListPage
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "purchase-orders" && (
            <PurchaseOrdersView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "suppliers" && (
            <SuppliersView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "brands-categories" && (
            <BrandsCategoriesView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "orders" && (
            <OrdersView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "warranties" && (
            <WarrantyView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeTab === "users" && (
            <UsersView
              user={user}
              onRequireLogin={() => setLoginModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* 3. Modal Đăng nhập Admin */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

