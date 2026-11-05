import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Eye,
  Flame,
  Newspaper,
  X,
  Share2,
  CheckCircle
} from "lucide-react";
import { siteSettingsApi } from "../../services/siteSettingsApi";
import { DEFAULT_NEWS_ARTICLES } from "../../components/NewsManagementView";

export default function NewsAndOffersSection() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [articles, setArticles] = useState(DEFAULT_NEWS_ARTICLES);
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const res = await siteSettingsApi.getByKey("store_news");
      if (res && res.settingValue) {
        const parsed = JSON.parse(res.settingValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const published = parsed.filter((a) => !a.status || a.status === "PUBLISHED");
          if (published.length > 0) {
            setArticles(published);
          }
        }
      }
    } catch (err) {
      console.warn("Could not load news from settings:", err);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/tin-tuc`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section
      className="news-offers-section"
      style={{
        padding: "60px 0 80px 0",
        backgroundColor: "var(--color-cloud-gray, #f5f5f7)",
        overflow: "hidden",
      }}
      aria-label="Tin tức & Ưu đãi"
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px" }}>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#0071e3", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
              <Sparkles size={15} /> PHONE STORE JOURNAL
            </div>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "var(--color-ink, #1d1d1f)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Tin tức & Ưu đãi.{" "}
              <span style={{ color: "var(--color-slate, #6e6e73)", fontWeight: 500, fontSize: "24px" }}>
                Đặc quyền mua sắm, trợ giá và công nghệ.
              </span>
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              to="/tin-tuc"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0071e3",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                transition: "all 150ms ease"
              }}
            >
              <span>Xem tất cả tin tức</span>
              <ArrowRight size={14} />
            </Link>

            {/* Scroll Navigation Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Cuộn trái"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  border: "1px solid #d2d2d7",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  transition: "background-color 150ms ease",
                }}
              >
                <ChevronLeft size={18} color="#1d1d1f" />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Cuộn phải"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  border: "1px solid #d2d2d7",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  transition: "background-color 150ms ease",
                }}
              >
                <ChevronRight size={18} color="#1d1d1f" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: "16px",
            paddingTop: "6px",
          }}
        >
          {articles.map((item, idx) => {
            const isFeatured = idx === 0;

            return (
              <article
                key={item.id}
                onClick={() => setActiveArticle(item)}
                style={{
                  flex: "0 0 380px",
                  maxWidth: "400px",
                  height: "480px",
                  borderRadius: "26px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  scrollSnapAlign: "start",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 250ms ease, box-shadow 250ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.04)";
                }}
              >
                {/* Visual Banner */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "220px",
                    backgroundColor: "#f8fafc",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 400ms ease",
                    }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop";
                    }}
                  />

                  {/* Kicker Tag Pill */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      backgroundColor: isFeatured ? "#ef4444" : "rgba(15,23,42,0.8)",
                      backdropFilter: "blur(4px)",
                      color: "#ffffff",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.03em",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {isFeatured && <Flame size={12} />}
                    <span>{item.category ? item.category.toUpperCase() : "TIN TỨC"}</span>
                  </div>

                  {item.views && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "12px",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(4px)",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={11} />
                      <span>{item.views.toLocaleString("vi-VN")}</span>
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "12px", marginBottom: "8px" }}>
                      <Calendar size={12} />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.author || "Phone Store"}</span>
                    </div>

                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: "#0f172a",
                        margin: "0 0 8px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        lineHeight: 1.5,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.excerpt}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "14px",
                      borderTop: "1px solid #f1f5f9",
                      marginTop: "12px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                      Đặc quyền chính hãng
                    </span>
                    <span
                      style={{
                        color: "#0071e3",
                        fontSize: "13px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Đọc chi tiết <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Reading Modal */}
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
            animation: "fadeIn 200ms ease",
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "760px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ position: "sticky", top: 0, backgroundColor: "#ffffff", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                  {activeArticle.category}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{activeArticle.date}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleShare}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "#334155" }}
                >
                  {copiedLink ? <CheckCircle size={14} color="#16a34a" /> : <Share2 size={14} />}
                  <span>{copiedLink ? "Đã copy link" : "Chia sẻ"}</span>
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
              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.35, marginBottom: "14px" }}>
                {activeArticle.title}
              </h1>

              <div style={{ width: "100%", maxHeight: "360px", borderRadius: "16px", overflow: "hidden", backgroundColor: "#f1f5f9", marginBottom: "20px" }}>
                <img
                  src={activeArticle.coverUrl}
                  alt={activeArticle.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop";
                  }}
                />
              </div>

              <p style={{ fontSize: "15px", fontWeight: 600, color: "#334155", lineHeight: 1.6, padding: "14px 18px", backgroundColor: "#f8fafc", borderRadius: "12px", borderLeft: "4px solid #0071e3", marginBottom: "20px" }}>
                {activeArticle.excerpt}
              </p>

              <div style={{ fontSize: "15px", color: "#1e293b", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {activeArticle.content || activeArticle.excerpt}
              </div>

              <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Tác giả: <strong>{activeArticle.author || "Phone Store"}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveArticle(null);
                    navigate("/tin-tuc");
                  }}
                  style={{
                    backgroundColor: "#0071e3",
                    color: "#ffffff",
                    padding: "8px 18px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Xem thêm các bài viết khác →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
