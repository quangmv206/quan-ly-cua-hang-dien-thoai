import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import HomeHeader from "./components/HomeHeader";
import StorefrontFooter from "./components/StorefrontFooter";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import {
  Newspaper,
  Calendar,
  Eye,
  User,
  ArrowRight,
  Search,
  Sparkles,
  Flame,
  ChevronRight,
  Share2,
  Bookmark,
  CheckCircle,
  X,
  Tag,
  Clock
} from "lucide-react";
import { siteSettingsApi } from "../services/siteSettingsApi";
import { DEFAULT_NEWS_ARTICLES } from "../components/NewsManagementView";
import "./storefront.css";

const CATEGORIES = [
  "Tất cả",
  "Khuyến mãi",
  "Đánh giá công nghệ",
  "Cẩm nang mua sắm",
  "So sánh sản phẩm",
  "Tư vấn chọn mua"
];

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const res = await siteSettingsApi.getByKey("store_news");
      if (res && res.settingValue) {
        const parsed = JSON.parse(res.settingValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load news from settings, using fallback", err);
    }
    setArticles(DEFAULT_NEWS_ARTICLES);
    setLoading(false);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === "Tất cả") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  // Lọc bài viết
  const publishedArticles = articles.filter(
    (a) => !a.status || a.status === "PUBLISHED"
  );

  const filteredArticles = publishedArticles.filter((item) => {
    const matchCat =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    const matchQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const heroArticle = publishedArticles.length > 0 ? publishedArticles[0] : null;
  const gridArticles = heroArticle
    ? filteredArticles.filter((a) => a.id !== heroArticle.id || selectedCategory !== "Tất cả" || searchQuery)
    : filteredArticles;

  const handleShare = (article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="storefront-page news-page-wrapper" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <HomeHeader />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 20px 80px 20px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
          <Link to="/" style={{ color: "#64748b", textDecoration: "none" }}>Trang chủ</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#0f172a", fontWeight: 600 }}>Tin tức & Công nghệ</span>
        </div>

        {/* Page Title & Search Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", marginBottom: "28px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
              <Sparkles size={14} /> TẠP CHÍ CÔNG NGHỆ CHÍNH HÃNG
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
              Tin tức, Đánh giá & Khuyến mãi HOT
            </h1>
            <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
              Cập nhật liên tục các mẹo công nghệ, so sánh smartphone và chính sách trợ giá hấp dẫn nhất.
            </p>
          </div>

          <div style={{ position: "relative", width: "100%", maxWidth: "340px" }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px 10px 42px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                outline: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
              }}
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "28px" }}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: active ? 700 : 500,
                  backgroundColor: active ? "#0071e3" : "#ffffff",
                  color: active ? "#ffffff" : "#475569",
                  border: active ? "1px solid #0071e3" : "1px solid #e2e8f0",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 150ms ease",
                  boxShadow: active ? "0 4px 12px rgba(0,113,227,0.25)" : "none"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Hero Featured Article (When on "Tất cả" & no search query) */}
        {selectedCategory === "Tất cả" && !searchQuery && heroArticle && (
          <div
            onClick={() => setActiveArticle(heroArticle)}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              cursor: "pointer",
              marginBottom: "36px",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.04)";
            }}
          >
            <div style={{ height: "360px", backgroundColor: "#f1f5f9", overflow: "hidden", position: "relative" }}>
              <img
                src={heroArticle.coverUrl}
                alt={heroArticle.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop";
                }}
              />
              <div style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "#ef4444", color: "#ffffff", padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                <Flame size={14} /> TIÊU ĐIỂM HÔM NAY
              </div>
            </div>

            <div style={{ padding: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                  {heroArticle.category}
                </span>
                <span style={{ fontSize: "13px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={13} /> {heroArticle.date}
                </span>
                <span style={{ fontSize: "13px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Eye size={13} /> {(heroArticle.views || 0).toLocaleString("vi-VN")} lượt xem
                </span>
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.35, marginBottom: "14px" }}>
                {heroArticle.title}
              </h2>

              <p style={{ color: "#475569", fontSize: "15px", lineHeight: 1.6, marginBottom: "20px" }}>
                {heroArticle.excerpt}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#0f172a", fontSize: "12px" }}>
                    PT
                  </div>
                  <span>{heroArticle.author || "Phone Store"}</span>
                </div>

                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#0071e3", fontWeight: 700, fontSize: "14px" }}>
                  Đọc toàn bộ bài viết <ArrowRight size={15} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {gridArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                boxShadow: "0 4px 14px rgba(0,0,0,0.03)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.03)";
              }}
            >
              <div style={{ height: "200px", backgroundColor: "#f8fafc", overflow: "hidden", position: "relative" }}>
                <img
                  src={article.coverUrl}
                  alt={article.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop";
                  }}
                />
                <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)", color: "#ffffff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                  {article.category}
                </div>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#94a3b8", marginBottom: "10px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} /> {article.date}
                  </span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Eye size={12} /> {(article.views || 0).toLocaleString("vi-VN")}
                  </span>
                </div>

                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", lineHeight: 1.4, margin: "0 0 10px 0" }}>
                  {article.title}
                </h3>

                <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px 0", flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {article.excerpt}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #f1f5f9", marginTop: "auto" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                    {article.author || "Admin"}
                  </span>
                  <span style={{ color: "#0071e3", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    Chi tiết <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {gridArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#ffffff", borderRadius: "20px", border: "1px dashed #cbd5e1", marginTop: "20px" }}>
            <Newspaper size={48} style={{ color: "#94a3b8", margin: "0 auto 12px auto" }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#334155" }}>Không tìm thấy bài viết phù hợp</h3>
            <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px", margin: "6px auto 16px auto" }}>
              Hãy thử tìm kiếm từ khóa khác hoặc chuyển sang danh mục tin tức khác.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              style={{ padding: "8px 20px", borderRadius: "10px", backgroundColor: "#0071e3", color: "#ffffff", border: "none", fontWeight: 600, cursor: "pointer" }}
            >
              Xem tất cả bài viết
            </button>
          </div>
        )}
      </main>

      {/* Article Reading Modal */}
      {activeArticle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 200ms ease"
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div style={{ position: "sticky", top: 0, backgroundColor: "#ffffff", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                  {activeArticle.category}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {activeArticle.date}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "#334155" }}
                >
                  {copiedLink ? <CheckCircle size={14} color="#16a34a" /> : <Share2 size={14} />}
                  <span>{copiedLink ? "Đã sao chép link" : "Chia sẻ"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "28px 32px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", lineHeight: 1.35, marginBottom: "16px" }}>
                {activeArticle.title}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#0071e3", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>
                    PT
                  </div>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>{activeArticle.author || "Phone Store Ban Biên Tập"}</strong>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Cập nhật lần cuối: {activeArticle.date}</span>
                  </div>
                </div>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "13px" }}>
                  <Eye size={14} /> {(activeArticle.views || 0).toLocaleString("vi-VN")} lượt xem
                </div>
              </div>

              {/* Cover Banner */}
              <div style={{ width: "100%", maxHeight: "380px", borderRadius: "16px", overflow: "hidden", backgroundColor: "#f1f5f9", marginBottom: "24px" }}>
                <img
                  src={activeArticle.coverUrl}
                  alt={activeArticle.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Lead Excerpt */}
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#334155", lineHeight: 1.6, padding: "16px 20px", backgroundColor: "#f8fafc", borderRadius: "12px", borderLeft: "4px solid #0071e3", marginBottom: "24px" }}>
                {activeArticle.excerpt}
              </p>

              {/* Main Content */}
              <div style={{ fontSize: "15px", color: "#1e293b", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {activeArticle.content || activeArticle.excerpt}
              </div>

              {/* Call to action box */}
              <div style={{ marginTop: "40px", padding: "24px", borderRadius: "18px", background: "linear-gradient(135deg, #0071e3 0%, #0056b3 100%)", color: "#ffffff", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 800 }}>Bạn muốn trải nghiệm siêu phẩm ngay hôm nay?</h4>
                  <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>Đặt mua chính hãng kèm trả góp 0% và trợ giá thu cũ lên tới 5 triệu đồng.</p>
                </div>
                <Link
                  to="/dien-thoai"
                  onClick={() => setActiveArticle(null)}
                  style={{ backgroundColor: "#ffffff", color: "#0071e3", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "13px", textDecoration: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  Xem kho điện thoại →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <StorefrontFooter />
      <FloatingSupportWidget />
    </div>
  );
}

