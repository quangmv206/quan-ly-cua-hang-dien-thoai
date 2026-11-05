import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Star,
  Flame,
  ArrowUpDown,
  Smartphone,
  Cpu,
  BatteryCharging,
  Wifi,
  Camera,
  Layers,
  Bot,
  Gamepad2,
  FoldHorizontal,
  PhoneCall,
  HelpCircle,
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import ProductCard from "./components/ProductCard";
import StorefrontFooter from "./components/StorefrontFooter";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Breadcrumb from "./components/Breadcrumb";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import CookieConsentBanner from "./components/CookieConsentBanner";

import { phoneApi } from "../services/phoneApi";
import { catalogApi } from "../services/catalogApi";
import { interactionApi } from "../services/interactionApi";
import { siteSettingsApi } from "../services/siteSettingsApi";

export default function ProductsPage() {
  const navigate = useNavigate();

  // Dữ liệu mẫu phong phú tương thích 100% với backend và style Phone Store
  const initialProducts = [
    {
      id: 1,
      name: "iPhone 16 Pro Max",
      brand: { id: 1, name: "Apple" },
      price: 34990000,
      originalPrice: 36990000,
      cpu: "Apple A18 Pro 6 nhân",
      screenSize: "6.9 inch",
      storage: "256GB",
      ram: "8GB",
      screenTech: "Super Retina XDR OLED, 120Hz ProMotion",
      description: "Khung Titan Grade 5, Camera zoom quang 5x, nút Camera Control thế hệ mới.",
      imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro.png",
      quantity: 25,
      need: "ai",
      statusLabel: "Mới ra mắt",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      brand: { id: 2, name: "Samsung" },
      price: 31990000,
      originalPrice: 34990000,
      cpu: "Snapdragon 8 Gen 3 for Galaxy",
      screenSize: "6.8 inch",
      storage: "256GB",
      ram: "12GB",
      screenTech: "Dynamic AMOLED 2X, 120Hz, 2600 nits",
      description: "Galaxy AI quyền năng, bút S-Pen tích hợp, camera 200MP đột phá.",
      imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222_3_1.png",
      quantity: 18,
      need: "ai",
      statusLabel: "Giảm 9%",
    },
    {
      id: 3,
      name: "Xiaomi 14 Ultra 5G",
      brand: { id: 3, name: "Xiaomi" },
      price: 28990000,
      originalPrice: 31990000,
      cpu: "Snapdragon 8 Gen 3",
      screenSize: "6.73 inch",
      storage: "512GB",
      ram: "16GB",
      screenTech: "LTPO AMOLED, 120Hz, Dolby Vision",
      description: "Hợp tác quang học đỉnh cao cùng Leica, ống kính khẩu độ biến thiên vô cấp.",
      imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1.png",
      quantity: 10,
      need: "camera",
      statusLabel: "Giảm 10%",
    },
    {
      id: 4,
      name: "OPPO Find N3 Flip",
      brand: { id: 4, name: "OPPO" },
      price: 22990000,
      originalPrice: 24990000,
      cpu: "Dimensity 9200 5G",
      screenSize: "6.8 inch",
      storage: "256GB",
      ram: "12GB",
      screenTech: "AMOLED 120Hz gập không nếp gấp",
      description: "Màn hình gập dọc thời thượng, camera chân dung Hasselblad cao cấp.",
      imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/i/find_n3_flip_-_2.png",
      quantity: 8,
      need: "gap",
      statusLabel: "Hot Trend",
    },
    {
      id: 5,
      name: "iPhone 15 Pro Max",
      brand: { id: 1, name: "Apple" },
      price: 29990000,
      originalPrice: 34990000,
      cpu: "Apple A17 Pro",
      screenSize: "6.7 inch",
      storage: "256GB",
      ram: "8GB",
      screenTech: "Super Retina XDR OLED, 120Hz",
      description: "Khung viền Titan siêu nhẹ, camera tiềm vọng 5x, Action Button thông minh.",
      imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
      quantity: 15,
      need: "camera",
      statusLabel: "Giảm 14%",
    },
    {
      id: 6,
      name: "Samsung Galaxy Z Fold6 5G",
      brand: { id: 2, name: "Samsung" },
      price: 41990000,
      originalPrice: 43990000,
      cpu: "Snapdragon 8 Gen 3",
      screenSize: "7.6 inch",
      storage: "256GB",
      ram: "12GB",
      screenTech: "Dynamic AMOLED 2X gập đa nhiệm",
      description: "Màn hình gập mở rộng lớn 7.6 inch, thiết kế mỏng nhẹ, tối ưu hóa Galaxy AI.",
      imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6_2.jpg",
      quantity: 12,
      need: "gap",
      statusLabel: "Flagship Gập",
    },
    {
      id: 7,
      name: "Samsung Galaxy A55 5G",
      brand: { id: 2, name: "Samsung" },
      price: 9690000,
      originalPrice: 10490000,
      cpu: "Exynos 1480 8 nhân",
      screenSize: "6.6 inch",
      storage: "128GB",
      ram: "8GB",
      screenTech: "Super AMOLED 120Hz",
      description: "Viền kim loại sang trọng, camera chống rung OIS 50MP, pin 5000mAh.",
      imageUrl: "https://cdn2.cellphones.com.vn/x/media/catalog/product/s/m/sm-a556_galaxy_a55_awesome_iceblue_ui_2_1.png",
      quantity: 30,
      need: "pin",
      statusLabel: "Bán chạy",
    },
    {
      id: 8,
      name: "ASUS ROG Phone 8 Pro",
      brand: { id: 5, name: "ASUS" },
      price: 27990000,
      originalPrice: 29990000,
      cpu: "Snapdragon 8 Gen 3",
      screenSize: "6.78 inch",
      storage: "512GB",
      ram: "16GB",
      screenTech: "AMOLED 165Hz chuyên game",
      description: "Hệ thống tản nhiệt buồng hơi ma trận, AirTrigger siêu nhạy, pin 5500mAh.",
      imageUrl: "https://cdn2.cellphones.com.vn/x/media/catalog/product/a/s/asus-rog-phone-8_1.png",
      quantity: 6,
      need: "gaming",
      statusLabel: "Gaming Pro",
    },
  ];

  // Danh mục Chọn theo nhu cầu (Icons đồng bộ style Phone Store)
  const needsList = [
    { id: "all", label: "Tất cả nhu cầu", icon: <Smartphone size={24} color="var(--color-pricing-blue)" /> },
    { id: "gaming", label: "Chơi game cấu hình cao", icon: <Gamepad2 size={24} color="#ea580c" /> },
    { id: "pin", label: "Pin trâu & Sạc siêu nhanh", icon: <BatteryCharging size={24} color="#16a34a" /> },
    { id: "5g", label: "Kết nối 5G tốc độ cao", icon: <Wifi size={24} color="var(--color-pricing-blue)" /> },
    { id: "camera", label: "Chụp ảnh & Quay phim Pro", icon: <Camera size={24} color="#9333ea" /> },
    { id: "gap", label: "Màn hình gập thời thượng", icon: <FoldHorizontal size={24} color="#ca8a04" /> },
    { id: "ai", label: "Trợ lý AI thông minh", icon: <Bot size={24} color="#0891b2" /> },
  ];

  // Tin tức sản phẩm công nghệ (Cột phải)
  const techNews = [
    {
      id: 1,
      title: "Apple công bố bước tiến lớn về chip xử lý A-Series thế hệ mới tối ưu mô hình ngôn ngữ lớn trên máy.",
      time: "2 giờ trước",
      thumb: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=160&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "Samsung Galaxy AI cập nhật thêm nhiều ngôn ngữ mới, mở rộng khả năng dịch trực tiếp cuộc gọi.",
      time: "5 giờ trước",
      thumb: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=160&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "Công nghệ sạc nhanh 120W và pin thể rắn: Tương lai năng lượng của smartphone phân khúc cao cấp.",
      time: "1 ngày trước",
      thumb: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=160&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      title: "So sánh camera tiềm vọng zoom quang học 5x vs 10x: Đâu là tiêu cự vàng cho ảnh chân dung?",
      time: "2 ngày trước",
      thumb: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=160&auto=format&fit=crop&q=60",
    },
  ];

  // Câu hỏi thường gặp FAQ (Accordion)
  const faqList = [
    {
      q: "Chính sách mua điện thoại trả góp 0% tại Phone Store như thế nào?",
      a: "Phone Store hỗ trợ trả góp lãi suất 0% qua thẻ tín dụng của hơn 25 ngân hàng đối tác hoặc qua công ty tài chính với thủ tục đơn giản (chỉ cần CCCD). Thời gian xét duyệt trực tuyến chỉ trong 10-15 phút, bạn có thể nhận máy ngay tại showroom hoặc giao tận nhà.",
    },
    {
      q: "Điện thoại mua tại Phone Store có phải hàng chính hãng và được bảo hành ra sao?",
      a: "100% điện thoại tại Phone Store đều là hàng phân phối chính hãng, nguyên seal hộp. Máy được áp dụng chế độ 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi phần cứng từ nhà sản xuất, kèm bảo hành tiêu chuẩn 12 đến 24 tháng tại các trung tâm bảo hành ủy quyền toàn quốc.",
    },
    {
      q: "Tôi có thể tham gia chương trình Thu cũ Đổi mới (Trade-in) không?",
      a: "Có! Phone Store triển khai chương trình Thu cũ Đổi mới với quy trình thẩm định máy nhanh trong 5 phút, mức giá thu mua cao hàng đầu thị trường cùng khoản trợ giá trực tiếp lên đến 3.000.000đ khi lên đời máy mới.",
    },
    {
      q: "Thời gian giao hàng hỏa tốc trong nội thành mất bao lâu?",
      a: "Với các đơn hàng trong khu vực nội thành, Phone Store cung cấp dịch vụ giao hàng hỏa tốc trong 2 giờ hoàn toàn miễn phí. Khách hàng được kiểm tra máy, kích hoạt bảo hành tại chỗ trước khi thanh toán.",
    },
  ];

  const normalizePrice = (val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") {
      if (val > 0 && val < 1000) return Math.round(val * 1000000);
      return Math.round(val);
    }
    let str = String(val).trim();
    if (str.includes(".") && str.indexOf(".") !== str.lastIndexOf(".")) {
      str = str.replace(/\./g, "");
    } else if (str.includes(".") && /^\d+\.\d{3}$/.test(str)) {
      str = str.replace(".", "");
    }
    const cleanDigits = str.replace(/[^\d.]/g, "");
    let num = Number(cleanDigits);
    if (isNaN(num)) return 0;
    if (num > 0 && num < 1000) {
      num = Math.round(num * 1000000);
    }
    return Math.round(num);
  };

  const detectNeed = (p) => {
    const text = `${p.name || ""} ${p.description || ""} ${p.cpu || ""} ${p.category?.name || ""}`.toLowerCase();
    if (text.includes("game") || text.includes("snapdragon 8") || text.includes("rog") || text.includes("dimensity 9")) return "gaming";
    if (text.includes("pin") || text.includes("5000") || text.includes("6000") || text.includes("sạc")) return "pin";
    if (text.includes("gập") || text.includes("fold") || text.includes("flip")) return "gap";
    if (text.includes("camera") || text.includes("zoom") || text.includes("quang") || text.includes("chụp") || text.includes("leica")) return "camera";
    if (text.includes("5g")) return "5g";
    if (text.includes("ai") || text.includes("bionic") || text.includes("pro max")) return "ai";
    return "all";
  };

  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedNeed, setSelectedNeed] = useState("all");
  const [activeSort, setActiveSort] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [tocExpanded, setTocExpanded] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState([0]);

  // Giỏ hàng & Toast
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Hỏi & Đáp
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Anh Minh Tuấn",
      time: "2 giờ trước",
      text: "Cho mình hỏi iPhone 18 Pro bản 256GB hiện đang có sẵn hàng tại chi nhánh nào ạ?",
    },
    {
      id: 2,
      user: "Chị Ngọc Lan",
      time: "Hôm qua",
      text: "Mình muốn tham gia trả góp 0% kỳ hạn 12 tháng thì có mất thêm phí chuyển đổi không shop?",
    },
  ]);
  const [newQuestion, setNewQuestion] = useState("");

  // Cấu hình CMS động từ Admin
  const [catalogBanners, setCatalogBanners] = useState({
    leftBadge: "Khám phá thế hệ mới",
    leftTitle: "Flagship AI Series 2025",
    leftDesc: "Hiệu năng đột phá • Khung viền Titan • Thu cũ đổi mới trợ giá 3.000.000 đ",
    leftLink: "#products-grid",
    rightBadge: "Đặc quyền Phone Store",
    rightTitle: "Bảo hành VIP 1 đổi 1",
    rightDesc: "Bảo hành 12 - 24 tháng chính hãng • Giao hàng hỏa tốc trong 2 giờ",
    rightLink: "#faq-section",
  });

  const [seoArticle, setSeoArticle] = useState({
    title: "Điện thoại chính hãng giá rẻ, trả góp 0%, bảo hành 1 đổi 1 tại Phone Store",
    leadText: "Thị trường smartphone thông minh hiện nay đang phát triển vượt bậc với nhiều phân khúc đa dạng.",
    bodyText: "Phone Store tự hào là hệ thống bán lẻ điện thoại hàng đầu tại Việt Nam, mang đến các siêu phẩm flagship đỉnh cao từ Apple, Samsung, Xiaomi, OPPO với đầy đủ chính sách bảo hành chính hãng và hỗ trợ trả góp 0%.",
  });

  // Nạp 100% dữ liệu điện thoại và hãng từ Backend REST API
  useEffect(() => {
    setLoading(true);
    phoneApi
      .getAll()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const apiPhones = res.data.map((p, idx) => {
            const normPrice = normalizePrice(p.price);
            return {
              ...p,
              price: normPrice,
              originalPrice: p.originalPrice ? normalizePrice(p.originalPrice) : Math.round(normPrice * 1.08),
              statusLabel: p.quantity < 5 ? "Sắp hết hàng" : (idx % 2 === 0 ? "Mới về" : "Bán chạy"),
              need: p.need || detectNeed(p),
            };
          });
          setProducts(apiPhones);
        } else {
          setProducts(initialProducts);
        }
      })
      .catch((err) => {
        console.warn("Không thể tải sản phẩm từ API, sử dụng dữ liệu mẫu:", err);
        setProducts(initialProducts);
      })
      .finally(() => {
        setLoading(false);
      });

    catalogApi
      .getBrands()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setBrands(res.data);
        }
      })
      .catch(() => {});

    interactionApi
      .getQuestions()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setComments(
            data.map((q) => ({
              id: q.id,
              user: q.authorName || "Khách hàng",
              time: "Vừa xong",
              text: q.question,
              answer: q.answer,
            }))
          );
        }
      })
      .catch(() => {});

    siteSettingsApi
      .getAll()
      .then((res) => {
        const data = res.data || {};
        if (data.catalog_dual_banners) {
          try { setCatalogBanners(JSON.parse(data.catalog_dual_banners)); } catch {}
        }
        if (data.catalog_seo_article) {
          try { setSeoArticle(JSON.parse(data.catalog_seo_article)); } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Danh sách thương hiệu để render pills (100% từ API và dữ liệu thực tế)
  const brandPillList = useMemo(() => {
    const brandSet = new Set();
    brands.forEach((b) => {
      const name = typeof b === "string" ? b : b.name;
      if (name) brandSet.add(name.trim());
    });
    products.forEach((p) => {
      const name = p.brand?.name || (typeof p.brand === "string" ? p.brand : null);
      if (name) brandSet.add(name.trim());
    });
    return ["Tất cả", ...Array.from(brandSet)];
  }, [brands, products]);

  // Bộ lọc sản phẩm
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedBrand !== "all") {
      list = list.filter((p) => {
        const bName = (p.brand?.name || p.brand || "").toLowerCase();
        return bName.includes(selectedBrand.toLowerCase());
      });
    }

    if (selectedNeed !== "all") {
      list = list.filter((p) => p.need === selectedNeed || (selectedNeed === "5g" && (p.name || "").toLowerCase().includes("5g")));
    }

    if (activeSort === "discount") {
      list.sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price));
    } else if (activeSort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedBrand, selectedNeed, activeSort]);

  // Reset về trang 1 mỗi khi đổi bộ lọc hoặc tiêu chí sắp xếp
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedNeed, activeSort]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedList = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById("products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === item.id && i.color === item.color);
      if (exist) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setToastMessage(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const toggleFaq = (idx) => {
    setExpandedFaq((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const questionText = newQuestion.trim();
    const tempItem = {
      id: Date.now(),
      user: "Quý khách",
      time: "Vừa xong",
      text: questionText,
      answer: "Dạ Phone Store đã tiếp nhận câu hỏi của bạn. Kỹ thuật viên sẽ phản hồi trong giây lát!",
    };
    setComments((prev) => [tempItem, ...prev]);
    setNewQuestion("");
    setToastMessage("Câu hỏi của bạn đã được gửi thành công đến đội ngũ tư vấn viên!");

    try {
      await interactionApi.submitQuestion({
        authorName: "Khách hàng",
        question: questionText,
      });
    } catch {}
  };

  return (
    <div className="storefront-root" style={{ backgroundColor: "var(--color-studio-mist)", minHeight: "100vh" }}>
      {/* 0. THANH THÔNG BÁO ƯU ĐÃI THEO BẢNG 1 */}
      <AnnouncementBar />

      {/* 1. HEADER CHUẨN PHONE STORE */}
      <HomeHeader
        brands={brands}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onSelectBrand={(bName) => setSelectedBrand(bName || "all")}
        onSelectProduct={(p) => navigate(`/product/${p.id}`)}
        products={products}
      />

      <main id="main-content" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-5) 60px var(--space-5)" }}>
        {/* 2. BREADCRUMBS THEO BẢNG 1 */}
        <Breadcrumb items={[{ label: "Danh mục Điện thoại" }]} />

        {/* 3. DUAL PROMOTIONAL BANNERS THEO BỐ CỤC ẢNH MẪU */}
        <section aria-label="Chương trình ưu đãi nổi bật" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "var(--radius-cards)",
              border: "1px solid var(--color-hairline-silver)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "none",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              <span className="label-launch-status" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>
                {catalogBanners.leftBadge || "Khám phá thế hệ mới"}
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--color-ink)", letterSpacing: "-0.01em" }}>
                {catalogBanners.leftTitle || "Flagship AI Series 2025"}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--color-slate)", margin: "0 0 12px 0" }}>
                {catalogBanners.leftDesc || "Hiệu năng đột phá • Khung viền Titan • Thu cũ đổi mới trợ giá 3.000.000 đ"}
              </p>
              <a href={catalogBanners.leftLink || "#products-grid"} className="btn-pricing-blue" style={{ textDecoration: "none", whiteSpace: "nowrap", display: "inline-block" }}>
                Xem ngay
              </a>
            </div>
            {catalogBanners.leftImageUrl && (
              <div style={{ width: "90px", height: "90px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={catalogBanners.leftImageUrl} alt="Left Banner Promo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            )}
          </div>

          <div
            style={{
              backgroundColor: "var(--color-ink)",
              borderRadius: "var(--radius-cards)",
              border: "1px solid var(--color-ink)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#ffffff",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-pricing-blue)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                {catalogBanners.rightBadge || "Đặc quyền Phone Store"}
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px 0", color: "#ffffff", letterSpacing: "-0.01em" }}>
                {catalogBanners.rightTitle || "Bảo hành VIP 1 đổi 1"}
              </h2>
              <p style={{ fontSize: "13px", color: "#a1a1a6", margin: "0 0 12px 0" }}>
                {catalogBanners.rightDesc || "Bảo hành 12 - 24 tháng chính hãng • Giao hàng hỏa tốc trong 2 giờ"}
              </p>
              <a href={catalogBanners.rightLink || "#faq-section"} className="btn-explore-pill" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", textDecoration: "none", whiteSpace: "nowrap", display: "inline-block" }}>
                Chi tiết
              </a>
            </div>
            {catalogBanners.rightImageUrl && (
              <div style={{ width: "90px", height: "90px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={catalogBanners.rightImageUrl} alt="Right Banner Promo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            )}
          </div>
        </section>

        {/* 4. CHỌN THEO THƯƠNG HIỆU */}
        <section aria-label="Lọc theo hãng sản xuất" style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 14px 0", letterSpacing: "-0.01em" }}>
            Hãng sản xuất điện thoại
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {brandPillList.map((brandName) => {
              const isSelected = (selectedBrand === "all" && brandName === "Tất cả") || (selectedBrand.toLowerCase() === brandName.toLowerCase());
              return (
                <button
                  key={brandName}
                  type="button"
                  onClick={() => setSelectedBrand(brandName === "Tất cả" ? "all" : brandName)}
                  style={{
                    height: "38px",
                    padding: "0 18px",
                    borderRadius: "9999px",
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 500,
                    backgroundColor: isSelected ? "var(--color-pricing-blue)" : "var(--color-gallery-white)",
                    color: isSelected ? "var(--color-gallery-white)" : "var(--color-ink)",
                    border: isSelected ? "1px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  {brandName}
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. CHỌN THEO NHU CẦU SỬ DỤNG (Bố cục 7 ô theo ảnh mẫu) */}
        <section aria-label="Lọc theo nhu cầu sử dụng" style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 14px 0", letterSpacing: "-0.01em" }}>
            Chọn theo nhu cầu
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
            {needsList.map((item) => {
              const isSelected = selectedNeed === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedNeed(item.id)}
                  style={{
                    backgroundColor: "var(--color-gallery-white)",
                    border: isSelected ? "2px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                    borderRadius: "var(--radius-images)",
                    padding: "16px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    outline: "none",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: "var(--color-studio-mist)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-ink)", lineHeight: 1.3 }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 6. BỘ LỌC TIÊU CHÍ & SẮP XẾP */}
        <section aria-label="Bộ lọc tiêu chí và sắp xếp" style={{ backgroundColor: "var(--color-gallery-white)", borderRadius: "var(--radius-cards)", padding: "18px 24px", border: "1px solid var(--color-hairline-silver)", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
            {/* Hàng bộ lọc nhanh */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SlidersHorizontal size={15} color="var(--color-pricing-blue)" />
                Bộ lọc tiêu chí:
              </span>
              <button type="button" className="btn-explore-pill" style={{ height: "34px", fontSize: "12px", padding: "0 12px" }}>
                Sẵn hàng tại kho
              </button>
              <button type="button" className="btn-explore-pill" style={{ height: "34px", fontSize: "12px", padding: "0 12px" }}>
                Hàng mới về
              </button>
              <button type="button" className="btn-explore-pill" style={{ height: "34px", fontSize: "12px", padding: "0 12px" }}>
                Dung lượng 256GB trở lên
              </button>
              <button type="button" className="btn-explore-pill" style={{ height: "34px", fontSize: "12px", padding: "0 12px" }}>
                RAM 12GB trở lên
              </button>
            </div>

            {/* Sắp xếp */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--color-slate)", fontWeight: 500 }}>Sắp xếp:</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setActiveSort("popular")}
                  className={activeSort === "popular" ? "btn-pricing-blue" : "btn-explore-pill"}
                  style={{ height: "32px", fontSize: "12px", padding: "0 12px" }}
                >
                  Phổ biến
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSort("discount")}
                  className={activeSort === "discount" ? "btn-pricing-blue" : "btn-explore-pill"}
                  style={{ height: "32px", fontSize: "12px", padding: "0 12px" }}
                >
                  Giảm giá HOT
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSort(activeSort === "price_asc" ? "price_desc" : "price_asc")}
                  className={activeSort.includes("price") ? "btn-pricing-blue" : "btn-explore-pill"}
                  style={{ height: "32px", fontSize: "12px", padding: "0 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <ArrowUpDown size={12} />
                  {activeSort === "price_asc" ? "Giá Thấp - Cao" : "Giá Cao - Thấp"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. LƯỚI SẢN PHẨM SỬ DỤNG CHÍNH PRODUCTCARD (Đồng bộ 100% logic & style) */}
        <section id="products-grid" aria-label="Danh sách sản phẩm điện thoại">
          <div className="product-card-grid" style={{ marginBottom: "28px" }}>
            {displayedList.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                statusLabel={item.statusLabel || "Chính hãng"}
                onSelectProduct={(p) => navigate(`/product/${p.id}`)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Phân trang số trang Apple Style */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginBottom: "40px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{
                  height: "38px",
                  padding: "0 14px",
                  borderRadius: "9999px",
                  border: "1px solid var(--color-hairline-silver)",
                  backgroundColor: "var(--color-gallery-white)",
                  color: currentPage === 1 ? "#a1a1a6" : "var(--color-ink)",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  transition: "all 150ms ease",
                }}
              >
                <ChevronLeft size={16} />
                <span>Trước</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "9999px",
                      border: isActive ? "1px solid var(--color-pricing-blue)" : "1px solid var(--color-hairline-silver)",
                      backgroundColor: isActive ? "var(--color-pricing-blue)" : "var(--color-gallery-white)",
                      color: isActive ? "#ffffff" : "var(--color-ink)",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 150ms ease",
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{
                  height: "38px",
                  padding: "0 14px",
                  borderRadius: "9999px",
                  border: "1px solid var(--color-hairline-silver)",
                  backgroundColor: "var(--color-gallery-white)",
                  color: currentPage === totalPages ? "#a1a1a6" : "var(--color-ink)",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  transition: "all 150ms ease",
                }}
              >
                <span>Sau</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>

        {/* 8. BỐ CỤC 2 CỘT DƯỚI: BÀI VIẾT SEO + MỤC LỤC (TRÁI) & TIN TỨC SẢN PHẨM (PHẢI) */}
        <section aria-label="Thông tin bài viết và tin tức công nghệ" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          {/* Cột trái: Bài viết SEO & Mục lục */}
          <article
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "var(--radius-cards)",
              padding: "28px",
              border: "1px solid var(--color-hairline-silver)",
            }}
          >
            {/* Tag Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {["iPhone 16 Pro Max", "Samsung S24 Ultra", "Xiaomi 14 Ultra", "OPPO Find N3"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "var(--color-studio-mist)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--color-slate)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--color-slate)", margin: "0 0 18px 0" }}>
              {seoArticle.leadText || (
                <>
                  <strong>Điện thoại thông minh (Smartphone)</strong> không chỉ là thiết bị liên lạc thông thường mà còn là trung tâm giải trí, làm việc và sáng tạo nội dung hàng ngày. Với sức mạnh của các dòng vi xử lý mới như Apple A18 Pro hay Snapdragon 8 Gen 3 cùng hệ thống camera cảm biến lớn, điện thoại thông minh mang đến trải nghiệm đột phá cho mọi người dùng.
                </>
              )}
            </p>
            {seoArticle.bodyText && (
              <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--color-slate)", margin: "0 0 18px 0" }}>
                {seoArticle.bodyText}
              </p>
            )}

            {/* Mục lục nội dung chính (Accordion) */}
            <div
              style={{
                backgroundColor: "var(--color-studio-mist)",
                borderRadius: "var(--radius-images)",
                padding: "16px 20px",
                border: "1px solid var(--color-hairline-silver)",
                marginBottom: "16px",
              }}
            >
              <div
                onClick={() => setTocExpanded(!tocExpanded)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontWeight: 700, fontSize: "14px", color: "var(--color-ink)" }}
              >
                <span>Nội dung chính</span>
                {tocExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {tocExpanded && (
                <ol style={{ paddingLeft: "20px", margin: "12px 0 0 0", fontSize: "13px", lineHeight: 1.8, color: "var(--color-pricing-blue)" }}>
                  <li><span style={{ color: "var(--color-ink)" }}>1. Điện thoại di động – Thiết bị liên lạc và giải trí toàn năng</span></li>
                  <li><span style={{ color: "var(--color-ink)" }}>2. Bảng giá điện thoại phân phối chính hãng mới nhất 2025</span></li>
                  <li><span style={{ color: "var(--color-ink)" }}>3. Tiêu chí chọn mua điện thoại phù hợp nhu cầu</span></li>
                  <li><span style={{ color: "var(--color-ink)" }}>4. Phân loại điện thoại theo hệ điều hành (iOS & Android)</span></li>
                  <li><span style={{ color: "var(--color-ink)" }}>5. Chính sách bảo hành và cam kết uy tín tại Phone Store</span></li>
                </ol>
              )}
            </div>
          </article>

          {/* Cột phải: Tin tức sản phẩm */}
          <aside
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "var(--radius-cards)",
              padding: "24px",
              border: "1px solid var(--color-hairline-silver)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--color-ink)" }}>
                Tin tức sản phẩm
              </h3>
              <a href="#main-content" className="link-apple-blue" style={{ fontSize: "12px", fontWeight: 600 }}>
                Xem tất cả &gt;
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {techNews.map((news) => (
                <div key={news.id} style={{ display: "flex", gap: "12px", cursor: "pointer" }}>
                  <img
                    src={news.thumb}
                    alt={news.title}
                    style={{ width: "88px", height: "62px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div>
                    <h4
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        lineHeight: 1.4,
                        color: "var(--color-ink)",
                        margin: "0 0 4px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {news.title}
                    </h4>
                    <span style={{ fontSize: "11px", color: "var(--color-slate)" }}>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* 9. CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
        <section id="faq-section" aria-label="Câu hỏi thường gặp" style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <HelpCircle size={20} color="var(--color-pricing-blue)" />
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-ink)", margin: 0 }}>
              Câu hỏi thường gặp
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {faqList.map((item, idx) => {
              const isOpen = expandedFaq.includes(idx);
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--color-gallery-white)",
                    borderRadius: "var(--radius-images)",
                    border: "1px solid var(--color-hairline-silver)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: "100%",
                      padding: "18px 22px",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      fontSize: "14.5px",
                      fontWeight: 600,
                      color: "var(--color-ink)",
                      cursor: "pointer",
                    }}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={16} color="var(--color-pricing-blue)" /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 22px 18px 22px",
                        fontSize: "13.5px",
                        lineHeight: 1.6,
                        color: "var(--color-slate)",
                        borderTop: "1px solid var(--color-studio-mist)",
                        paddingTop: "12px",
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. HỎI VÀ ĐÁP (Q&A COMMUNITY DISCUSSION) */}
        <section aria-label="Hỏi đáp và bình luận người dùng" style={{ backgroundColor: "var(--color-gallery-white)", borderRadius: "var(--radius-cards)", padding: "28px", border: "1px solid var(--color-hairline-silver)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <MessageSquare size={20} color="var(--color-pricing-blue)" />
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-ink)", margin: 0 }}>
              Hỏi và đáp
            </h2>
          </div>

          {/* Khung hướng dẫn đặt câu hỏi */}
          <div
            style={{
              backgroundColor: "var(--color-studio-mist)",
              borderRadius: "var(--radius-images)",
              padding: "20px 24px",
              marginBottom: "24px",
              border: "1px solid var(--color-hairline-silver)",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", margin: "0 0 6px 0" }}>
              Hãy đặt câu hỏi cho chúng tôi
            </h3>
            <p style={{ fontSize: "13px", color: "var(--color-slate)", margin: "0 0 14px 0", lineHeight: 1.5 }}>
              Chuyên viên tư vấn của Phone Store luôn sẵn sàng giải đáp mọi thắc mắc về cấu hình máy, chính sách bảo hành và chương trình trả góp trong vòng 30 phút.
            </p>

            <form onSubmit={handleSendQuestion} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Viết câu hỏi của bạn tại đây..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                style={{
                  flex: 1,
                  height: "44px",
                  borderRadius: "12px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "0 16px",
                  fontSize: "13.5px",
                  backgroundColor: "var(--color-gallery-white)",
                  outline: "none",
                }}
              />
              <button type="submit" className="btn-pricing-blue" style={{ height: "44px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span>Gửi câu hỏi</span>
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Danh sách bình luận */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {comments.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--color-studio-mist)", paddingBottom: "14px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-pricing-blue)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {item.user.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-ink)" }}>{item.user}</span>
                    <span style={{ fontSize: "11.5px", color: "var(--color-slate)" }}>• {item.time}</span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "var(--color-slate)", margin: "4px 0 6px 0", lineHeight: 1.4 }}>
                    {item.text}
                  </p>
                  <button type="button" className="link-apple-blue" style={{ fontSize: "12px", padding: 0 }}>
                    Trả lời
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER CHUẨN PHONE STORE */}
      <StorefrontFooter />
      <FloatingSupportWidget />
      <CookieConsentBanner />

      {/* GIỎ HÀNG TRƯỢT */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, qty) =>
          setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
        }
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
        onClearCart={() => setCartItems([])}
      />

      {/* TOAST THÔNG BÁO */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

