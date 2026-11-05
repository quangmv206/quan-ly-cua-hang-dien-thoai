import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sliders,
  Tv,
  FileText,
  ShieldCheck,
  Building2,
  Phone,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight,
  Info,
  Upload,
  Trash2,
  Link as LinkIcon
} from "lucide-react";
import { siteSettingsApi } from "../services/siteSettingsApi";
import LoadingSpinner from "./LoadingSpinner";

export default function SiteSettingsView({ user, onRequireLogin }) {
  const [activeSubTab, setActiveSubTab] = useState("home"); // 'home' | 'catalog' | 'policy' | 'store'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // States cho từng nhóm cấu hình
  const [announcement, setAnnouncement] = useState({
    enabled: true,
    highlightText: "Khuyến mãi Mới",
    content: "Thu cũ đổi mới trợ giá đến 2.000.000 đ • Trả góp 0% lãi suất duyệt trong 5 phút",
    actionText: "Xem chi tiết",
    actionLink: "/dien-thoai",
    hotline: "1800 6868",
  });

  const [hero, setHero] = useState({
    title: "iPhone 16 Pro Max",
    headline: "Titan Sa Mạc. Đỉnh cao hội tụ.",
    description: "Khung Titan Grade 5 siêu bền nhẹ, nút Camera Control thế hệ mới, vi xử lý A18 Pro hỗ trợ Apple Intelligence đột phá.",
    buttonText: "Khám phá ngay",
    badgeText: "Mới ra mắt",
    imageUrl: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-16-pro-max-sa-mac-thumb-600x600.jpg",
  });

  const [featureCarousel, setFeatureCarousel] = useState([
    {
      id: "titanium",
      badgeLabel: "Titanium Grade 5",
      titleTop: "Khung viền Titan và bản lề siêu mỏng.",
      titleBottom: "Bền bỉ, tinh xảo và sang trọng tuyệt đối.",
      modelName: "iPhone 16 Pro & Galaxy Fold Titanium",
      imageUrl: "",
    },
    {
      id: "galaxy-ai",
      badgeLabel: "Galaxy AI & S-Pen",
      titleTop: "Trí tuệ nhân tạo Galaxy AI đột phá.",
      titleBottom: "Tối ưu mọi tác vụ và khoảnh khắc nhiếp ảnh.",
      modelName: "Samsung Galaxy S24 Ultra",
      imageUrl: "",
    },
    {
      id: "leica-optics",
      badgeLabel: "Leica Summilux",
      titleTop: "Ống kính quang học Leica khẩu độ vô cấp.",
      titleBottom: "Nhiếp ảnh chuẩn điện ảnh trong lòng bàn tay.",
      modelName: "Xiaomi 14 Ultra 5G",
      imageUrl: "",
    },
    {
      id: "fold-hinge",
      badgeLabel: "Flexion Hinge",
      titleTop: "Bản lề tàng hình không nếp gấp gập mở êm ái.",
      titleBottom: "Mỏng nhẹ hàng đầu với chuẩn độ bền 500.000 lần gập.",
      modelName: "OPPO Find N3 Flip",
      imageUrl: "",
    },
  ]);

  const [catalogBanners, setCatalogBanners] = useState({
    leftBadge: "Đặc quyền Phone Store",
    leftTitle: "Bảo hành VIP 1 đổi 1",
    leftDesc: "Bảo hành 12 - 24 tháng chính hãng • Giao hàng hỏa tốc trong 2 giờ",
    leftLink: "/chinh-sach-bao-hanh",
    leftImageUrl: "",
    rightBadge: "Hỗ trợ tài chính",
    rightTitle: "Trả góp 0% lãi suất",
    rightDesc: "Xét duyệt online qua CCCD gắn chip trong 5 phút, trả trước 0 đồng",
    rightLink: "/huong-dan-thanh-toan",
    rightImageUrl: "",
  });

  const [seoArticle, setSeoArticle] = useState({
    title: "Điện thoại chính hãng giá rẻ, trả góp 0%, bảo hành 1 đổi 1 tại Phone Store",
    leadText: "Thị trường smartphone thông minh hiện nay đang phát triển vượt bậc với nhiều phân khúc đa dạng.",
    bodyText: "Phone Store tự hào là hệ thống bán lẻ điện thoại hàng đầu tại Việt Nam, mang đến các siêu phẩm flagship đỉnh cao từ Apple, Samsung, Xiaomi, OPPO với đầy đủ chính sách bảo hành chính hãng và hỗ trợ trả góp 0%.",
  });

  const [storeInfo, setStoreInfo] = useState({
    storeName: "Phone Store Official",
    hotline: "1800 6868",
    cskh: "1900 6789",
    email: "hotro@phonestore.vn",
    address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội • 456 Lê Văn Sỹ, Quận 3, TP.HCM",
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    bankAccount: "0988888888",
    bankAccountName: "PHONE STORE VIETNAM",
    qrCodeUrl: "",
    storeLogoUrl: "",
  });

  const [policyContent, setPolicyContent] = useState({
    warranty: "100% điện thoại bán ra tại Phone Store đều được bảo hành chính hãng 12 - 24 tháng. Lỗi 1 đổi 1 trong 30 ngày đầu tiên nếu có lỗi từ nhà sản xuất.",
    returnPolicy: "Khách hàng được quyền đổi trả sản phẩm hoàn toàn miễn phí trong vòng 30 ngày nếu phát sinh lỗi kỹ thuật phần cứng.",
    shipping: "Giao hàng hỏa tốc trong 2 giờ tại nội thành Hà Nội và TP.HCM. Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng điện thoại.",
    payment: "Hỗ trợ thanh toán tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng qua mã VietQR tự động, thanh toán thẻ tín dụng và trả góp 0% lãi suất.",
  });

  // Quản lý upload ảnh từ thiết bị
  const heroFileInputRef = useRef(null);
  const catalogLeftFileRef = useRef(null);
  const catalogRightFileRef = useRef(null);
  const storeLogoFileRef = useRef(null);
  const [showHeroUrlInput, setShowHeroUrlInput] = useState(false);
  const [heroDragging, setHeroDragging] = useState(false);

  const compressImage = (file, callback) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.85);
        callback(compressed);
      };
      img.onerror = () => {
        callback(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleHeroFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        setHero((prev) => ({ ...prev, imageUrl: dataUrl }));
        showToast("Đã tải ảnh banner từ máy tính thành công!");
      });
    }
    e.target.value = "";
  };

  const handleHeroDrop = (e) => {
    e.preventDefault();
    setHeroDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        setHero((prev) => ({ ...prev, imageUrl: dataUrl }));
        showToast("Đã tải ảnh banner từ máy tính thành công!");
      });
    }
  };

  const handleSlideChange = (index, field, value) => {
    setFeatureCarousel((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSlideFileSelect = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        setFeatureCarousel((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], imageUrl: dataUrl };
          return next;
        });
        showToast(`Đã tải ảnh cho Slide ${index + 1} thành công!`);
      });
    }
    e.target.value = "";
  };

  const handleRemoveSlideImage = (index) => {
    setFeatureCarousel((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], imageUrl: "" };
      return next;
    });
    showToast(`Đã xóa ảnh Slide ${index + 1}, quay về hình vẽ mặc định!`);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Nạp cấu hình từ Backend API
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await siteSettingsApi.getAll();
      const data = res.data || {};

      if (data.announcement_bar) {
        try { setAnnouncement(JSON.parse(data.announcement_bar)); } catch {}
      }
      if (data.home_hero) {
        try { setHero(JSON.parse(data.home_hero)); } catch {}
      }
      if (data.home_feature_carousel) {
        try {
          const parsed = JSON.parse(data.home_feature_carousel);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFeatureCarousel(parsed);
          }
        } catch {}
      }
      if (data.catalog_dual_banners) {
        try { setCatalogBanners(JSON.parse(data.catalog_dual_banners)); } catch {}
      }
      if (data.catalog_seo_article) {
        try { setSeoArticle(JSON.parse(data.catalog_seo_article)); } catch {}
      }
      if (data.store_info) {
        try { setStoreInfo(JSON.parse(data.store_info)); } catch {}
      }
      if (data.policy_content) {
        try { setPolicyContent(JSON.parse(data.policy_content)); } catch {}
      }
    } catch (err) {
      console.warn("Không thể tải cấu hình từ server, sử dụng mặc định:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveAll = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }

    setSaving(true);
    try {
      const batchPayload = {
        announcement_bar: {
          value: JSON.stringify(announcement),
          pageGroup: "home",
          description: "Thanh thông báo chạy chữ trên cùng",
        },
        home_hero: {
          value: JSON.stringify(hero),
          pageGroup: "home",
          description: "Banner tiêu điểm Hero trang chủ",
        },
        home_feature_carousel: {
          value: JSON.stringify(featureCarousel),
          pageGroup: "home",
          description: "Banner xoay vòng 4 slide điểm nhấn công nghệ",
        },
        catalog_dual_banners: {
          value: JSON.stringify(catalogBanners),
          pageGroup: "products",
          description: "2 Banner ưu đãi trên cùng trang danh mục",
        },
        catalog_seo_article: {
          value: JSON.stringify(seoArticle),
          pageGroup: "products",
          description: "Bài viết chuẩn SEO dưới chân trang danh mục",
        },
        store_info: {
          value: JSON.stringify(storeInfo),
          pageGroup: "store",
          description: "Thông tin liên hệ, hotline, showroom, tài khoản chuyển khoản",
        },
        policy_content: {
          value: JSON.stringify(policyContent),
          pageGroup: "policy",
          description: "Nội dung tóm tắt các trang chính sách",
        },
      };

      await siteSettingsApi.saveBatch(batchPayload);
      showToast("Đã lưu toàn bộ cấu hình trang người dùng thành công!");
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        showToast("Phiên đăng nhập Admin đã hết hạn hoặc không có quyền. Vui lòng đăng nhập lại!", "error");
        onRequireLogin();
      } else {
        showToast(err.response?.data?.message || "Lỗi lưu cấu hình", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải dữ liệu cấu hình giao diện..." />;
  }

  return (
    <div className="site-settings-page" style={{ padding: "24px 32px" }}>
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 100 }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
            Quản Trị Giao Diện & Nội Dung (Storefront CMS)
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
            Chỉnh sửa trực tiếp từng thành phần trên Trang chủ, Trang danh mục, Chi tiết và Chính sách phía người dùng.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="btn btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 600,
            borderRadius: "8px",
          }}
        >
          {saving ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
          <span>{saving ? "Đang lưu..." : "Lưu tất cả thay đổi"}</span>
        </button>
      </div>

      {/* Thanh chuyển tab phân hệ */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "24px",
          paddingBottom: "8px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveSubTab("home")}
          className={`btn ${activeSubTab === "home" ? "btn-primary" : "btn-outline"}`}
          style={{ fontSize: "13px", padding: "8px 16px" }}
        >
          <Tv size={15} style={{ marginRight: "6px" }} />
          1. Trang Chủ & Banner
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("catalog")}
          className={`btn ${activeSubTab === "catalog" ? "btn-primary" : "btn-outline"}`}
          style={{ fontSize: "13px", padding: "8px 16px" }}
        >
          <Sliders size={15} style={{ marginRight: "6px" }} />
          2. Trang Danh Mục & SEO
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("policy")}
          className={`btn ${activeSubTab === "policy" ? "btn-primary" : "btn-outline"}`}
          style={{ fontSize: "13px", padding: "8px 16px" }}
        >
          <FileText size={15} style={{ marginRight: "6px" }} />
          3. Nội Dung Chính Sách
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("store")}
          className={`btn ${activeSubTab === "store" ? "btn-primary" : "btn-outline"}`}
          style={{ fontSize: "13px", padding: "8px 16px" }}
        >
          <Building2 size={15} style={{ marginRight: "6px" }} />
          4. Showroom & Chuyển Khoản
        </button>
      </div>

      <form onSubmit={handleSaveAll}>
        {/* =========================================================================
            TAB 1: TRANG CHỦ & BANNER
            ========================================================================= */}
        {activeSubTab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* 1. Thanh thông báo chạy chữ trên cùng */}
            <div className="card" style={{ padding: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
                    Thanh thông báo ưu đãi trên cùng (Announcement Bar)
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                    Dòng chữ thông báo nổi bật nằm trên thanh Header trên mọi trang.
                  </p>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={announcement.enabled}
                    onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
                  />
                  <span>Bật hiển thị</span>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                    Nhãn nổi bật (Badge)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcement.highlightText}
                    onChange={(e) => setAnnouncement({ ...announcement, highlightText: e.target.value })}
                    placeholder="VD: Khuyến mãi Mới"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                    Nội dung thông điệp
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcement.content}
                    onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                    placeholder="VD: Thu cũ đổi mới trợ giá đến 2.000.000 đ..."
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                    Chữ nút bấm (Link text)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcement.actionText}
                    onChange={(e) => setAnnouncement({ ...announcement, actionText: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                    Đường dẫn liên kết
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcement.actionLink}
                    onChange={(e) => setAnnouncement({ ...announcement, actionLink: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                    Hotline đặt hàng
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcement.hotline}
                    onChange={(e) => setAnnouncement({ ...announcement, hotline: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. Hero Stage Tiêu điểm trang chủ */}
            <div className="card" style={{ padding: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
                Banner chính tiêu điểm (Home Hero Stage)
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                Sản phẩm và thông điệp lớn nhất đập vào mắt người dùng khi vào trang chủ.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                    Tên sản phẩm tiêu điểm
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    placeholder="VD: iPhone 16 Pro Max"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                    Nhãn trạng thái (Badge)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={hero.badgeText}
                    onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                    placeholder="VD: Mới ra mắt"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Khẩu hiệu / Headline chính
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={hero.headline}
                  onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                  placeholder="VD: Titan Sa Mạc. Đỉnh cao hội tụ."
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Đoạn mô tả công nghệ
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={hero.description}
                  onChange={(e) => setHero({ ...hero, description: e.target.value })}
                  placeholder="Mô tả công nghệ đột phá..."
                />
              </div>

              {/* ẢNH ĐẠI DIỆN BANNER VỚI TÍNH NĂNG CHỌN TỪ THIẾT BỊ / MÁY TÍNH */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>
                    Ảnh đại diện Banner lớn (Home Hero Banner)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHeroUrlInput(!showHeroUrlInput)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-pricing-blue)",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0,
                    }}
                  >
                    <LinkIcon size={13} />
                    <span>{showHeroUrlInput ? "Ẩn nhập link URL" : "Dán link URL nếu có"}</span>
                  </button>
                </div>

                {/* Input File ẩn để kích hoạt chọn từ thiết bị */}
                <input
                  type="file"
                  ref={heroFileInputRef}
                  accept="image/*"
                  onChange={handleHeroFileSelect}
                  style={{ display: "none" }}
                />

                {/* Khung tải ảnh / Xem trước ảnh */}
                {hero.imageUrl ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <div
                      style={{
                        width: "160px",
                        height: "110px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#ffffff",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={hero.imageUrl}
                        alt="Hero Banner Preview"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", color: "#16a34a", fontSize: "13px", fontWeight: 600 }}>
                        <CheckCircle size={15} />
                        <span>Ảnh banner đã được tải lên thành công</span>
                      </div>
                      <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                        Ảnh sẽ tự động co giãn và hiển thị đẹp mắt tại khu vực Hero trang chủ.
                      </p>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="btn btn-outline"
                          style={{ fontSize: "12px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Upload size={14} />
                          <span>📁 Đổi ảnh khác từ máy tính</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHero({ ...hero, imageUrl: "" })}
                          className="btn-icon text-danger"
                          title="Xóa ảnh"
                          style={{ padding: "6px 10px" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setHeroDragging(true); }}
                    onDragLeave={() => setHeroDragging(false)}
                    onDrop={handleHeroDrop}
                    onClick={() => heroFileInputRef.current?.click()}
                    style={{
                      border: heroDragging ? "2px dashed var(--color-pricing-blue)" : "2px dashed var(--border)",
                      backgroundColor: heroDragging ? "rgba(0,113,227,0.05)" : "var(--bg-secondary)",
                      borderRadius: "12px",
                      padding: "32px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0,113,227,0.1)",
                        color: "var(--color-pricing-blue)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px auto",
                      }}
                    >
                      <Upload size={22} />
                    </div>
                    <strong style={{ fontSize: "14px", color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                      Bấm vào đây để chọn ảnh từ thiết bị của bạn
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "14px" }}>
                      Hoặc kéo và thả tệp ảnh (PNG, JPG, WEBP, GIF) vào khung này
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ fontSize: "13px", padding: "8px 20px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <Upload size={15} />
                      <span>📁 Tải ảnh từ thiết bị</span>
                    </button>
                  </div>
                )}

                {/* Nhập URL nếu cần */}
                {showHeroUrlInput && (
                  <div style={{ marginTop: "12px" }}>
                    <input
                      type="text"
                      className="form-input"
                      value={hero.imageUrl}
                      onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>
                      Bạn có thể dán đường dẫn ảnh trực tiếp từ internet hoặc CDN.
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Chữ trên nút bấm CTA
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={hero.buttonText}
                  onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
                  placeholder="Khám phá ngay"
                />
              </div>
            </div>

            {/* 3. Banner Xoay Vòng Điểm Nhấn Công Nghệ (Feature Banner Carousel - 4 Slide) */}
            <div className="card" style={{ padding: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
                    Banner Xoay Vòng Điểm Nhấn Công Nghệ (Feature Banner Carousel)
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                    Khu vực xoay vòng gồm 4 slide (Titanium, Galaxy AI, Leica Summilux, Flexion Hinge) ngay dưới Hero trang chủ.
                  </p>
                </div>
                <span className="badge" style={{ backgroundColor: "rgba(0,113,227,0.1)", color: "var(--color-pricing-blue)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500 }}>
                  4 Slide Xoay Vòng
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                {featureCarousel.map((slide, index) => (
                  <div
                    key={slide.id || index}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "16px 20px",
                      backgroundColor: "var(--bg-secondary)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <strong style={{ fontSize: "14px", color: "var(--color-pricing-blue)" }}>
                        Slide {index + 1}: {slide.badgeLabel || `Slide ${index + 1}`}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Thiết bị: <strong>{slide.modelName}</strong>
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>
                          Tiêu đề dòng trên (Title Top)
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={slide.titleTop}
                          onChange={(e) => handleSlideChange(index, "titleTop", e.target.value)}
                          placeholder="VD: Khung viền Titan và bản lề siêu mỏng."
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>
                          Tiêu đề dòng dưới (Title Bottom)
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={slide.titleBottom}
                          onChange={(e) => handleSlideChange(index, "titleBottom", e.target.value)}
                          placeholder="VD: Bền bỉ, tinh xảo và sang trọng tuyệt đối."
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>
                          Nhãn huy hiệu góc (Badge Label)
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={slide.badgeLabel}
                          onChange={(e) => handleSlideChange(index, "badgeLabel", e.target.value)}
                          placeholder="VD: Titanium Grade 5"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>
                          Tên dòng máy đại diện (Model Name)
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={slide.modelName}
                          onChange={(e) => handleSlideChange(index, "modelName", e.target.value)}
                          placeholder="VD: iPhone 16 Pro & Galaxy Fold"
                        />
                      </div>
                    </div>

                    {/* Chọn ảnh từ thiết bị cho slide */}
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                        Hình ảnh minh họa slide (Tùy chọn tải ảnh từ máy tính hoặc để trống dùng hình vẽ SVG mặc định)
                      </label>
                      <input
                        type="file"
                        id={`slide-file-${index}`}
                        accept="image/*"
                        onChange={(e) => handleSlideFileSelect(index, e)}
                        style={{ display: "none" }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                        {slide.imageUrl ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "90px", height: "60px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <img src={slide.imageUrl} alt={slide.titleTop} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                            </div>
                            <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 500 }}>
                              ✓ Đã có ảnh tải lên
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                            Đang dùng hình vẽ khung sườn điện thoại nguyên bản
                          </span>
                        )}

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => document.getElementById(`slide-file-${index}`)?.click()}
                            className="btn btn-outline"
                            style={{ fontSize: "12px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                          >
                            <Upload size={13} />
                            <span>📁 {slide.imageUrl ? "Đổi ảnh từ máy tính" : "Tải ảnh từ máy tính"}</span>
                          </button>
                          {slide.imageUrl && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSlideImage(index)}
                              className="btn-icon text-danger"
                              title="Xóa ảnh tùy chỉnh (quay về hình vẽ mặc định)"
                              style={{ padding: "6px 10px" }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: TRANG DANH MỤC & SEO
            ========================================================================= */}
        {activeSubTab === "catalog" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Dual Promo Banners */}
            <div className="card" style={{ padding: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
                2 Banner ưu đãi trên cùng trang Danh mục (/dien-thoai)
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                Banner Đôi nằm ngay dưới thanh Breadcrumb giới thiệu ưu đãi Bảo hành VIP và Trả góp.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Banner Trái */}
                <div style={{ padding: "16px", borderRadius: "8px", border: "1px dashed var(--border)" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "var(--color-pricing-blue)" }}>
                    Banner Trái (Bảo hành)
                  </h4>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Nhãn trên</label>
                    <input
                      type="text"
                      className="form-input"
                      value={catalogBanners.leftBadge}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, leftBadge: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Tiêu đề</label>
                    <input
                      type="text"
                      className="form-input"
                      value={catalogBanners.leftTitle}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, leftTitle: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Mô tả ngắn</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={catalogBanners.leftDesc}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, leftDesc: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Link chi tiết</label>
                    <input
                      type="text"
                      className="form-input"
                      value={catalogBanners.leftLink}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, leftLink: e.target.value })}
                    />
                  </div>

                  {/* Ảnh minh họa Banner Trái */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>
                      Ảnh minh họa Banner Trái (Tùy chọn từ thiết bị)
                    </label>
                    <input
                      type="file"
                      ref={catalogLeftFileRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file, (dataUrl) => {
                            setCatalogBanners((prev) => ({ ...prev, leftImageUrl: dataUrl }));
                            showToast("Đã tải ảnh banner trái từ thiết bị thành công!");
                          });
                        }
                        e.target.value = "";
                      }}
                      style={{ display: "none" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {catalogBanners.leftImageUrl && (
                        <div style={{ width: "50px", height: "40px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={catalogBanners.leftImageUrl} alt="Left Banner" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => catalogLeftFileRef.current?.click()}
                        className="btn btn-outline"
                        style={{ fontSize: "12px", padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Upload size={13} />
                        <span>📁 Chọn ảnh từ thiết bị</span>
                      </button>
                      {catalogBanners.leftImageUrl && (
                        <button
                          type="button"
                          onClick={() => setCatalogBanners({ ...catalogBanners, leftImageUrl: "" })}
                          className="btn-icon text-danger"
                          title="Xóa ảnh"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Banner Phải */}
                <div style={{ padding: "16px", borderRadius: "8px", border: "1px dashed var(--border)" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "var(--color-pricing-blue)" }}>
                    Banner Phải (Trả góp)
                  </h4>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Nhãn trên</label>
                    <input
                      type="text"
                      className="form-input"
                      value={catalogBanners.rightBadge}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, rightBadge: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Tiêu đề</label>
                    <input
                      type="text"
                      className="form-input"
                      value={catalogBanners.rightTitle}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, rightTitle: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Mô tả ngắn</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={catalogBanners.rightDesc}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, rightDesc: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>Link chi tiết</label>
                    <input
                      type="text"
                      className="form-input"
                      value={catalogBanners.rightLink}
                      onChange={(e) => setCatalogBanners({ ...catalogBanners, rightLink: e.target.value })}
                    />
                  </div>

                  {/* Ảnh minh họa Banner Phải */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "4px" }}>
                      Ảnh minh họa Banner Phải (Tùy chọn từ thiết bị)
                    </label>
                    <input
                      type="file"
                      ref={catalogRightFileRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file, (dataUrl) => {
                            setCatalogBanners((prev) => ({ ...prev, rightImageUrl: dataUrl }));
                            showToast("Đã tải ảnh banner phải từ thiết bị thành công!");
                          });
                        }
                        e.target.value = "";
                      }}
                      style={{ display: "none" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {catalogBanners.rightImageUrl && (
                        <div style={{ width: "50px", height: "40px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={catalogBanners.rightImageUrl} alt="Right Banner" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => catalogRightFileRef.current?.click()}
                        className="btn btn-outline"
                        style={{ fontSize: "12px", padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Upload size={13} />
                        <span>📁 Chọn ảnh từ thiết bị</span>
                      </button>
                      {catalogBanners.rightImageUrl && (
                        <button
                          type="button"
                          onClick={() => setCatalogBanners({ ...catalogBanners, rightImageUrl: "" })}
                          className="btn-icon text-danger"
                          title="Xóa ảnh"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bài viết SEO dưới chân trang */}
            <div className="card" style={{ padding: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
                Bài viết chuẩn SEO & Giới thiệu thị trường (Dưới chân trang danh mục)
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                Giúp nâng cao thứ hạng từ khóa trên Google Search và hỗ trợ người dùng chọn máy.
              </p>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Tiêu đề bài viết SEO
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={seoArticle.title}
                  onChange={(e) => setSeoArticle({ ...seoArticle, title: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Đoạn giới thiệu mở đầu (Lead text)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={seoArticle.leadText}
                  onChange={(e) => setSeoArticle({ ...seoArticle, leadText: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Nội dung chi tiết bài viết
                </label>
                <textarea
                  className="form-input"
                  rows={5}
                  value={seoArticle.bodyText}
                  onChange={(e) => setSeoArticle({ ...seoArticle, bodyText: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: NỘI DUNG CHÍNH SÁCH
            ========================================================================= */}
        {activeSubTab === "policy" && (
          <div className="card" style={{ padding: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
              Nội dung các trang chính sách mua hàng
            </h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
              Sửa đổi các cam kết bảo hành, đổi trả, giao hàng và thanh toán hiển thị cho khách hàng.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  1. Chính sách bảo hành chính hãng (/chinh-sach-bao-hanh)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={policyContent.warranty}
                  onChange={(e) => setPolicyContent({ ...policyContent, warranty: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  2. Chính sách đổi trả & hoàn tiền (/chinh-sach-doi-tra)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={policyContent.returnPolicy}
                  onChange={(e) => setPolicyContent({ ...policyContent, returnPolicy: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  3. Chính sách giao hàng hỏa tốc (/chinh-sach-giao-hang)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={policyContent.shipping}
                  onChange={(e) => setPolicyContent({ ...policyContent, shipping: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  4. Hướng dẫn thanh toán & trả góp (/huong-dan-thanh-toan)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={policyContent.payment}
                  onChange={(e) => setPolicyContent({ ...policyContent, payment: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SHOWROOM & CHUYỂN KHOẢN
            ========================================================================= */}
        {activeSubTab === "store" && (
          <div className="card" style={{ padding: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
              Thông tin Showroom, Hotline & Tài khoản nhận chuyển khoản
            </h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
              Dữ liệu hiển thị ở Chân trang Footer và tạo mã QR Chuyển khoản VietQR khi khách thanh toán.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Tên thương hiệu cửa hàng
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={storeInfo.storeName}
                  onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Hotline tư vấn mua hàng
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={storeInfo.hotline}
                  onChange={(e) => setStoreInfo({ ...storeInfo, hotline: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Tổng đài CSKH & Bảo hành
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={storeInfo.cskh}
                  onChange={(e) => setStoreInfo({ ...storeInfo, cskh: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Email hỗ trợ khách hàng
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={storeInfo.email}
                  onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                Địa chỉ các chi nhánh Showroom
              </label>
              <textarea
                className="form-input"
                rows={2}
                value={storeInfo.address}
                onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
              />
            </div>

            <hr style={{ border: "none", borderTop: "1px dashed var(--border)", margin: "20px 0" }} />

            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 600, color: "var(--color-pricing-blue)" }}>
              Cấu hình Tài khoản Ngân hàng nhận thanh toán (VietQR)
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Tên Ngân Hàng
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={storeInfo.bankName}
                  onChange={(e) => setStoreInfo({ ...storeInfo, bankName: e.target.value })}
                  placeholder="MB Bank, Techcombank, VCB..."
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Số tài khoản nhận tiền
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={storeInfo.bankAccount}
                  onChange={(e) => setStoreInfo({ ...storeInfo, bankAccount: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
                  Tên chủ tài khoản
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={storeInfo.bankAccountName}
                  onChange={(e) => setStoreInfo({ ...storeInfo, bankAccountName: e.target.value })}
                />
              </div>
            </div>

            {/* Upload ảnh mã QR Chuyển khoản từ thiết bị */}
            <div style={{ marginTop: "20px" }}>
              <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Ảnh mã QR Chuyển khoản (VietQR tải từ thiết bị)
              </label>
              <input
                type="file"
                id="qrFileInput"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    compressImage(file, (dataUrl) => {
                      setStoreInfo((prev) => ({ ...prev, qrCodeUrl: dataUrl }));
                      showToast("Đã tải ảnh mã QR từ thiết bị thành công!");
                    });
                  }
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                {storeInfo.qrCodeUrl && (
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                    }}
                  >
                    <img src={storeInfo.qrCodeUrl} alt="QR Code Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => document.getElementById("qrFileInput")?.click()}
                  className="btn btn-outline"
                  style={{ fontSize: "13px", padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Upload size={15} />
                  <span>📁 Chọn ảnh QR từ thiết bị</span>
                </button>
                {storeInfo.qrCodeUrl && (
                  <button
                    type="button"
                    onClick={() => setStoreInfo({ ...storeInfo, qrCodeUrl: "" })}
                    className="btn-icon text-danger"
                    title="Xóa ảnh QR"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Upload Logo thương hiệu từ thiết bị */}
            <div style={{ marginTop: "20px" }}>
              <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Logo Thương hiệu Cửa hàng (Tùy chọn tải từ thiết bị)
              </label>
              <input
                type="file"
                ref={storeLogoFileRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    compressImage(file, (dataUrl) => {
                      setStoreInfo((prev) => ({ ...prev, storeLogoUrl: dataUrl }));
                      showToast("Đã tải Logo cửa hàng từ thiết bị thành công!");
                    });
                  }
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                {storeInfo.storeLogoUrl && (
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                    }}
                  >
                    <img src={storeInfo.storeLogoUrl} alt="Store Logo Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => storeLogoFileRef.current?.click()}
                  className="btn btn-outline"
                  style={{ fontSize: "13px", padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Upload size={15} />
                  <span>📁 Chọn ảnh Logo từ thiết bị</span>
                </button>
                {storeInfo.storeLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setStoreInfo({ ...storeInfo, storeLogoUrl: "" })}
                    className="btn-icon text-danger"
                    title="Xóa ảnh Logo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nút lưu cuối form */}
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
            }}
          >
            {saving ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
            <span>{saving ? "Đang lưu..." : "Lưu tất cả thay đổi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

