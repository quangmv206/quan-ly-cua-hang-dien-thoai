import React, { useState, useEffect } from "react";
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  RefreshCw,
  Search,
  Tag,
  Calendar,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Save,
  X,
  AlertCircle
} from "lucide-react";
import { siteSettingsApi } from "../services/siteSettingsApi";

export const DEFAULT_NEWS_ARTICLES = [
  {
    id: 1,
    title: "Đại tiệc Thu cũ đổi mới: Trợ giá đến 5.000.000 đ khi lên đời iPhone 16 & Galaxy S24",
    category: "Khuyến mãi",
    author: "Phone Store Team",
    date: "05/11/2026",
    views: 12450,
    coverUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
    excerpt: "Chương trình trợ giá độc quyền từ Phone Store: Định giá máy cũ trong 15 phút, trợ giá thẳng vào giá mua máy mới không cần bù nhiều tiền.",
    content: "Chương trình 'Thu cũ đổi mới - Lên đời siêu phẩm' áp dụng cho toàn bộ các dòng máy iPhone, Samsung, Xiaomi cũ chính hãng. Khách hàng chỉ cần mang máy đến bất kỳ Showroom nào trong hệ thống, nhân viên kỹ thuật sẽ kiểm định 32 bước trong 15 phút và trợ giá trực tiếp lên đến 5.000.000 đ khi mua iPhone 16 Series hoặc Samsung Galaxy S24 Ultra.",
    status: "PUBLISHED",
  },
  {
    id: 2,
    title: "Đánh giá chi tiết camera iPhone 16 Pro Max: Nút Camera Control và Zoom quang 5x",
    category: "Đánh giá công nghệ",
    author: "Tuấn Nam Tech",
    date: "04/11/2026",
    views: 8920,
    coverUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro.png",
    excerpt: "Trải nghiệm thực tế cảm biến 48MP mới, khả năng quay video 4K 120fps chuẩn điện ảnh và độ tiện lợi của nút bấm cảm ứng thế hệ mới.",
    content: "iPhone 16 Pro Max năm nay gây ấn tượng mạnh với nút Camera Control cảm ứng lực mới ở cạnh phải máy. Người dùng có thể trượt ngón tay để zoom mượt mà, chuyển đổi các filter màu Photographic Styles theo thời gian thực và bấm chụp siêu nhanh.",
    status: "PUBLISHED",
  },
  {
    id: 3,
    title: "Hướng dẫn mua trả góp 0% lãi suất bằng CCCD gắn chip chỉ trong 5 phút",
    category: "Cẩm nang mua sắm",
    author: "Ban Tài Chính",
    date: "03/11/2026",
    views: 15300,
    coverUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6_2.jpg",
    excerpt: "Tất tần tật thủ tục xét duyệt online không cần chứng minh thu nhập, nhận máy ngay tại Showroom hoặc giao tận nhà.",
    content: "Giờ đây bạn không cần thẻ tín dụng vẫn có thể sở hữu smartphone flagship mơ ước. Chỉ với CCCD gắn chip (từ 18 đến 60 tuổi), khách hàng đăng ký mua trả góp qua Home Credit, FE Credit hoặc HD SAISON với mức lãi suất 0%, trả trước từ 0đ và nhận kết quả duyệt trong 5 phút.",
    status: "PUBLISHED",
  },
  {
    id: 4,
    title: "So sánh Samsung Galaxy Z Fold6 vs OPPO Find N3: Đâu là vua màn hình gập 2026?",
    category: "So sánh sản phẩm",
    author: "Hoàng Long Review",
    date: "01/11/2026",
    views: 6740,
    coverUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_16gb_512gb.png",
    excerpt: "Đánh giá nếp gấp màn hình, độ mỏng nhẹ, khả năng đa nhiệm và độ bền bản lề thế hệ mới giữa hai đối thủ sừng sỏ.",
    content: "Cả Galaxy Z Fold6 và OPPO Find N3 đều là những đỉnh cao công nghệ gập hiện nay. Z Fold6 nổi trội với bộ tính năng Galaxy AI thông minh và khả năng kháng nước IP48, trong khi Find N3 ghi điểm với tỷ lệ màn hình ngoài chuẩn và camera Hasselblad xuất sắc.",
    status: "PUBLISHED",
  },
  {
    id: 5,
    title: "Top 5 điện thoại pin trâu, màn hình đẹp đáng mua nhất tầm giá 7 – 10 triệu",
    category: "Tư vấn chọn mua",
    author: "Minh Anh",
    date: "30/10/2026",
    views: 9410,
    coverUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-13-pro-plus_9_.png",
    excerpt: "Tổng hợp các mẫu smartphone phân khúc tầm trung có sạc nhanh, camera 200MP và hiệu năng chơi game mượt mà.",
    content: "Phân khúc 7 - 10 triệu đồng hiện đang là chiến trường cạnh tranh khốc liệt nhất với sự góp mặt của Redmi Note 13 Pro 5G, Galaxy A55 5G và OPPO Reno12.",
    status: "PUBLISHED",
  },
];

export default function NewsManagementView({ user, onRequireLogin }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Khuyến mãi",
    author: "Phone Store Admin",
    coverUrl: "",
    excerpt: "",
    content: "",
    status: "PUBLISHED",
  });

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await siteSettingsApi.getByKey("store_news");
      if (res.data && res.data.value) {
        const parsed = JSON.parse(res.data.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}
    setArticles(DEFAULT_NEWS_ARTICLES);
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const saveArticlesToDatabase = async (newArticles) => {
    try {
      await siteSettingsApi.save("store_news", {
        value: JSON.stringify(newArticles),
        group: "home",
      });
      setArticles(newArticles);
      setSaveSuccess("Đã lưu dữ liệu bài viết thành công!");
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err) {
      alert("Lỗi khi lưu bài viết: " + err.message);
    }
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      category: "Khuyến mãi",
      author: user?.fullName || "Phone Store Admin",
      coverUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
      excerpt: "",
      content: "",
      status: "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setFormData({ ...article });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      const updated = articles.filter((a) => a.id !== id);
      saveArticlesToDatabase(updated);
    }
  };

  const handleToggleStatus = (article) => {
    const updated = articles.map((a) =>
      a.id === article.id
        ? { ...a, status: a.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }
        : a
    );
    saveArticlesToDatabase(updated);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết!");
      return;
    }

    let updated = [];
    if (editingArticle) {
      updated = articles.map((a) =>
        a.id === editingArticle.id ? { ...formData, id: a.id, views: a.views || 0 } : a
      );
    } else {
      const newPost = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString("vi-VN"),
        views: 1,
      };
      updated = [newPost, ...articles];
    }

    saveArticlesToDatabase(updated);
    setIsModalOpen(false);
  };

  // Filter
  const filtered = articles.filter((a) => {
    const matchCat = categoryFilter === "ALL" || a.category === categoryFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      a.title.toLowerCase().includes(term) ||
      a.excerpt.toLowerCase().includes(term) ||
      a.author.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  const categories = ["Khuyến mãi", "Đánh giá công nghệ", "Cẩm nang mua sắm", "So sánh sản phẩm", "Tư vấn chọn mua"];

  return (
    <div className="news-admin-page" style={{ padding: "8px 0" }}>
      {/* Header Page */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Newspaper size={26} color="#0071e3" /> Quản lý Tin tức & Ưu đãi công nghệ
          </h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>
            Đăng tải bài viết đánh giá, cẩm nang và chương trình khuyến mãi hiển thị trực tiếp ra Storefront
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={loadArticles}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#0071e3", color: "#fff" }}
          >
            <Plus size={18} /> Thêm bài viết mới
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="card p-4 mb-4" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", borderRadius: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: "8px", padding: "0 12px", flex: 1, minWidth: "260px" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tác giả, nội dung bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", padding: "10px", width: "100%", fontSize: "13px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Chuyên mục:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
          >
            <option value="ALL">Tất cả chuyên mục ({articles.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({articles.filter((a) => a.category === c).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table danh sách bài viết */}
      <div className="table-card" style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "14px" }}>Ảnh bìa</th>
              <th style={{ padding: "14px" }}>Tiêu đề bài viết</th>
              <th style={{ padding: "14px" }}>Chuyên mục</th>
              <th style={{ padding: "14px" }}>Tác giả & Ngày</th>
              <th style={{ padding: "14px" }}>Lượt xem</th>
              <th style={{ padding: "14px" }}>Trạng thái</th>
              <th style={{ padding: "14px", textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 14px", width: "90px" }}>
                  <img
                    src={a.coverUrl || "https://placehold.co/100x70?text=No+Cover"}
                    alt={a.title}
                    style={{ width: "80px", height: "55px", objectFit: "contain", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                </td>
                <td style={{ padding: "12px 14px", maxWidth: "340px" }}>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", lineHeight: 1.4, marginBottom: "4px" }}>
                    {a.title}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {a.excerpt}
                  </span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: "#eff6ff",
                      color: "#1d4ed8",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    {a.category}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: "12px", color: "#475569" }}>
                  <div style={{ fontWeight: 600 }}>{a.author}</div>
                  <div style={{ color: "#94a3b8" }}>{a.date}</div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                  {a.views ? a.views.toLocaleString() : 1}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(a)}
                    style={{
                      border: "none",
                      background: a.status === "PUBLISHED" ? "#ecfdf5" : "#fef2f2",
                      color: a.status === "PUBLISHED" ? "#059669" : "#dc2626",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    title="Bấm để đổi trạng thái Hiển thị / Ẩn"
                  >
                    {a.status === "PUBLISHED" ? "✓ Hiển thị" : "✕ Đang ẩn"}
                  </button>
                </td>
                <td style={{ padding: "12px 14px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(a)}
                      className="btn-action edit"
                      title="Chỉnh sửa bài viết"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="btn-action delete"
                      title="Xóa bài viết"
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm / Chỉnh Sửa Bài Viết */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                {editingArticle ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đánh giá chi tiết camera iPhone 16 Pro Max..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Chuyên mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Tác giả
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Đường dẫn ảnh bìa (Cover Image URL)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
                {formData.coverUrl && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Xem trước:</span>
                    <img
                      src={formData.coverUrl}
                      alt="Preview"
                      style={{ width: "90px", height: "60px", objectFit: "contain", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Tóm tắt ngắn (Excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt nội dung chính hiển thị trên thẻ bài viết..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Nội dung bài viết chi tiết
                </label>
                <textarea
                  rows={6}
                  placeholder="Nhập toàn bộ nội dung bài viết..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#0071e3", color: "#fff", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Save size={16} /> Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

