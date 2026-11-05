import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Star,
  Heart,
  Truck,
  Send,
  MessageSquare,
  HelpCircle,
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
  PhoneCall
} from "lucide-react";
import "./cellphones-page.css";
import { phoneApi } from "../services/phoneApi";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

export default function PhoneCategoryPage() {
  const navigate = useNavigate();

  // Dữ liệu sản phẩm mẫu phong phú, chuẩn 100% theo các thẻ trong ảnh chụp CellphoneS
  const samplePhones = [
    {
      id: 101,
      name: "iPhone 18 Pro Max 2TB",
      brand: "Apple",
      price: 80990000,
      originalPrice: 84990000,
      discountPercent: 5,
      imageUrl: "https://cdn.tgdd.vn/products/iphone-16-pro-max.png",
      screenSize: "6.9 inches",
      storage: "2 TB",
      smemberDiscount: "Smember giảm đến 810.000đ",
      promoNote: "Ưu đãi 500K cho Apple Watch Series 10, Ultra 2 khi mua kèm...",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "ai",
    },
    {
      id: 102,
      name: "HONOR 600 5G 8GB 256GB",
      brand: "HONOR",
      price: 16790000,
      originalPrice: 17990000,
      discountPercent: 7,
      imageUrl: "https://cdn.tgdd.vn/products/honor-200.png",
      screenSize: "6.57 inches",
      ram: "8 GB",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 168.000đ",
      promoNote: "Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 12 tháng",
      rating: 4.9,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "pin",
    },
    {
      id: 103,
      name: "iPhone Air 256GB | Chính hãng",
      brand: "Apple",
      price: 23390000,
      originalPrice: 31990000,
      discountPercent: 27,
      imageUrl: "https://cdn.tgdd.vn/products/iphone-16.png",
      screenSize: "6.5 inches",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 233.000đ",
      promoNote: "Nhận Voucher 500K - mua ngay Robot hút bụi lau nhà, Tivi, Tủ lạnh...",
      rating: 4.9,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "ai",
    },
    {
      id: 104,
      name: "iPhone 18 Pro Max 1TB",
      brand: "Apple",
      price: 61490000,
      originalPrice: 62490000,
      discountPercent: 2,
      imageUrl: "https://cdn.tgdd.vn/products/iphone-16-pro.png",
      screenSize: "6.9 inches",
      storage: "1 TB",
      smemberDiscount: "Smember giảm đến 615.000đ",
      promoNote: "Chỉ thêm 20K - nhận Sim/Esim 5G VNSKY, có ngay 3GB/ngày...",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "camera",
    },
    {
      id: 105,
      name: "iPhone 18 Pro 1TB",
      brand: "Apple",
      price: 57990000,
      originalPrice: 58490000,
      discountPercent: 1,
      imageUrl: "https://cdn.tgdd.vn/products/iphone-16-pro.png",
      screenSize: "6.3 inches",
      storage: "1 TB",
      smemberDiscount: "Smember giảm đến 580.000đ",
      promoNote: "Ưu đãi 500K cho Apple Watch Series 10, Ultra 2 khi mua kèm...",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "camera",
    },
    {
      id: 106,
      name: "iPhone 18 Pro 256GB",
      brand: "Apple",
      price: 38690000,
      originalPrice: 39990000,
      discountPercent: 4,
      imageUrl: "https://cdn.tgdd.vn/products/iphone-16-pro.png",
      screenSize: "6.3 inches",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 380.000đ",
      promoNote: "Chỉ thêm 20K - nhận Sim/Esim 5G VNSKY, có ngay 3GB...",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "ai",
    },
    {
      id: 107,
      name: "iPhone 17 Pro 256GB | Chính hãng",
      brand: "Apple",
      price: 31990000,
      originalPrice: 34990000,
      discountPercent: 9,
      imageUrl: "https://cdn.tgdd.vn/products/iphone-15-pro.png",
      screenSize: "6.3 inches",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 320.000đ",
      promoNote: "Chỉ thêm 20K - nhận Sim/Esim 5G VNSKY, có ngay 3GB...",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "ai",
    },
    {
      id: 108,
      name: "iPhone 18 Pro Max 256GB",
      brand: "Apple",
      price: 41990000,
      originalPrice: 42990000,
      discountPercent: 2,
      imageUrl: "https://cdn.tgdd.vn/products/iphone-16-pro-max.png",
      screenSize: "6.9 inches",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 420.000đ",
      promoNote: "Ưu đãi 500K cho Apple Watch Series 10, Ultra 2 khi mua kèm...",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "gaming",
    },
    {
      id: 109,
      name: "Samsung Galaxy S26 Ultra 5G 12GB 256GB",
      brand: "Samsung",
      price: 33990000,
      originalPrice: 40990000,
      discountPercent: 17,
      imageUrl: "https://cdn.tgdd.vn/products/samsung-galaxy-s24-ultra.png",
      screenSize: "6.8 inches",
      ram: "12 GB",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 350.000đ",
      promoNote: "Tặng thêm 12 tháng bảo hành tại CellphoneS và 1 km khác...",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "ai",
    },
    {
      id: 110,
      name: "OPPO Find X10 5G 12GB 256GB",
      brand: "OPPO",
      price: 34990000,
      originalPrice: 36990000,
      discountPercent: 5,
      imageUrl: "https://cdn.tgdd.vn/products/oppo-find-x7.png",
      screenSize: "6.78 inches",
      ram: "12 GB",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 350.000đ",
      promoNote: "Hàng đặt trước - Nhận quà mở bán đặc quyền 2 triệu VNĐ",
      rating: 4.9,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "camera",
    },
    {
      id: 111,
      name: "Xiaomi POCO F9 Ultra 5G 12GB 256GB",
      brand: "Xiaomi",
      price: 25680000,
      originalPrice: 29990000,
      discountPercent: 14,
      imageUrl: "https://cdn.tgdd.vn/products/xiaomi-14-ultra.png",
      screenSize: "6.67 inches",
      ram: "12 GB",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 260.000đ",
      promoNote: "Trả góp 0% - 0đ phụ phí - 0đ trả trước - kỳ hạn đến 12 tháng",
      rating: 5.0,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "gaming",
    },
    {
      id: 112,
      name: "Samsung Galaxy Z Fold8 5G 12GB 256GB",
      brand: "Samsung",
      price: 43990000,
      originalPrice: 47990000,
      discountPercent: 8,
      imageUrl: "https://cdn.tgdd.vn/products/samsung-galaxy-z-fold-6.png",
      screenSize: "7.6 inches",
      ram: "12 GB",
      storage: "256 GB",
      smemberDiscount: "Smember giảm đến 440.000đ",
      promoNote: "Galaxy Z Care 1 năm và gói bảo hiểm rơi vỡ cao cấp...",
      rating: 4.8,
      installment: "Trả góp 0%",
      deliverySpeed: "Giao 2 Giờ",
      need: "gap",
    },
  ];

  // Danh sách thương hiệu chuẩn CellphoneS
  const brandList = [
    "iPhone",
    "SAMSUNG",
    "OPPO",
    "Xiaomi",
    "TECNO",
    "HONOR",
    "nubia",
    "SONY",
    "NOKIA",
    "Infinix",
    "NOTHING",
    "Masstel",
    "realme",
    "itel",
    "HUAWEI",
    "MEIZU",
    "vivo",
    "ONEPLUS",
    "TCL",
    "benco",
    "ASUS",
  ];

  // Danh mục Chọn theo nhu cầu
  const needsList = [
    { id: "gaming", label: "Điện thoại chơi game", icon: <Gamepad2 size={26} color="#ef4444" /> },
    { id: "pin", label: "Điện thoại pin trâu", icon: <BatteryCharging size={26} color="#10b981" /> },
    { id: "5g", label: "Điện thoại 5G", icon: <Wifi size={26} color="#3b82f6" /> },
    { id: "camera", label: "Điện thoại chụp ảnh đẹp", icon: <Camera size={26} color="#8b5cf6" /> },
    { id: "gap", label: "Điện thoại gập", icon: <FoldHorizontal size={26} color="#f59e0b" /> },
    { id: "ai", label: "Điện thoại AI", icon: <Bot size={26} color="#06b6d4" /> },
    { id: "phothong", label: "Điện thoại phổ thông", icon: <PhoneCall size={26} color="#64748b" /> },
  ];

  // Tin tức sản phẩm (Right Column)
  const productNews = [
    {
      id: 1,
      title: "Samsung bắt đầu sản xuất màn hình chống nhìn trộm, Galaxy S27 Pro sắp có nâng cấp cực...",
      thumb: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=160&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "Galaxy S27+ đạt chứng nhận quan trọng, xác nhận công nghệ sạc vượt trội 65W",
      thumb: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=160&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "Redmi Turbo 6 Max lộ cấu hình khủng: Màn hình 2K 185Hz, pin 10000 mAh và chuẩn IP68/IP69",
      thumb: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=160&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      title: "Dòng HONOR 700 lộ diện qua chứng nhận 3C: Pin 9000mAh, sạc 80W và màn hình phụ độc...",
      thumb: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=160&auto=format&fit=crop&q=60",
    },
    {
      id: 5,
      title: "OPPO Reno17 Series lộ cấu hình: Pin đột phá 8,000mAh và nâng cấp camera tiềm vọng...",
      thumb: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=160&auto=format&fit=crop&q=60",
    },
  ];

  // Câu hỏi thường gặp FAQ
  const faqList = [
    {
      q: "Có nên mua điện thoại trả góp không? Lợi ích và rủi ro?",
      a: "Mua điện thoại trả góp tại CellphoneS với lãi suất 0% là giải pháp tối ưu giúp bạn sở hữu ngay siêu phẩm công nghệ mà không cần bỏ ra một số tiền lớn cùng lúc. Bạn chỉ cần trả trước từ 0đ và thanh toán linh hoạt qua thẻ tín dụng hoặc công ty tài chính với thủ tục xét duyệt chỉ trong 15 phút.",
    },
    {
      q: "Nên mua iPhone hay điện thoại Android? Ưu nhược điểm của từng loại?",
      a: "iPhone (iOS) nổi tiếng với sự mượt mà, bảo mật cao, vòng đời hỗ trợ cập nhật lâu dài (5-7 năm) và hệ sinh thái Apple đồng bộ hoàn hảo. Trong khi đó, điện thoại Android (Samsung, Xiaomi, OPPO) có sự đa dạng về thiết kế, công nghệ sạc siêu nhanh, màn hình gập đột phá và mức giá trải dài từ phổ thông đến cao cấp.",
    },
    {
      q: "Điện thoại nào có pin 'trâu' nhất, dùng được lâu nhất?",
      a: "Hiện nay các dòng máy có dung lượng pin từ 5,000mAh đến 6,000mAh kèm chip tối ưu điện năng như iPhone 16 Pro Max, Samsung Galaxy S24 Ultra, Xiaomi 14 Ultra hay HONOR 200 mang lại thời lượng sử dụng onscreen liên tục từ 9 - 12 tiếng, thoải mái đáp ứng từ 1.5 đến 2 ngày làm việc.",
    },
    {
      q: "Điện thoại nào chơi game mượt nhất hiện nay?",
      a: "Để chiến game mượt mà không giật lag ở mức đồ họa cao nhất (Genshin Impact, PUBG Mobile, Liên Quân 120FPS), bạn nên chọn các máy trang bị chip Apple A18 Pro (iPhone 16 Pro / Pro Max) hoặc Qualcomm Snapdragon 8 Gen 3 (Galaxy S24 Ultra, Xiaomi 14 Ultra, ASUS ROG Phone).",
    },
  ];

  // State
  const [products, setProducts] = useState(samplePhones);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedNeed, setSelectedNeed] = useState("all");
  const [activeSort, setActiveSort] = useState("popular");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(10);
  const [tocExpanded, setTocExpanded] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState([0]); // Mở sẵn câu hỏi đầu tiên
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // State Hỏi và đáp
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Chị Thi",
      time: "2 ngày trước",
      text: "cho mình hỏi trước mình mua 14prm màu cam 512gb giờ đổi 18prm 512gb thì bù thêm bao nhiêu?",
    },
    {
      id: 2,
      user: "Anh Hoàng",
      time: "Hôm qua",
      text: "CellphoneS có hỗ trợ trả góp 0% qua thẻ tín dụng Vietcombank không bạn ơi?",
    },
  ]);
  const [newQuestion, setNewQuestion] = useState("");

  // Nạp dữ liệu sản phẩm từ REST API Spring Boot và hợp nhất
  useEffect(() => {
    phoneApi
      .getAll()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Chuẩn hóa dữ liệu API để tương thích hoàn toàn với card CellphoneS
          const apiMapped = res.data.map((p, idx) => {
            const rawPrice = Number(p.price) || 30000000;
            const price = rawPrice < 1000 ? rawPrice * 1000000 : rawPrice;
            const originalPrice = Math.round(price * 1.08);
            const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

            return {
              id: p.id,
              name: p.name,
              brand: p.brand?.name || "Apple",
              price: price,
              originalPrice: originalPrice,
              discountPercent: discountPercent > 0 ? discountPercent : 5,
              imageUrl: p.imageUrl || "https://cdn.tgdd.vn/products/iphone-16-pro-max.png",
              screenSize: p.screenSize || "6.3 inches",
              storage: p.storage || "256 GB",
              ram: p.ram || "8 GB",
              smemberDiscount: `Smember giảm đến ${new Intl.NumberFormat("vi-VN").format(Math.round(price * 0.01))}đ`,
              promoNote: p.description
                ? p.description.slice(0, 75) + "..."
                : "Chỉ thêm 20K - nhận Sim/Esim 5G VNSKY có ngay 3GB...",
              rating: 5.0,
              installment: "Trả góp 0%",
              deliverySpeed: "Giao 2 Giờ",
              need: idx % 2 === 0 ? "ai" : "camera",
            };
          });

          // Hợp nhất sản phẩm thực tế từ Database vào danh sách
          setProducts((prev) => {
            const combined = [...apiMapped];
            prev.forEach((item) => {
              if (!combined.some((c) => c.name.toLowerCase() === item.name.toLowerCase())) {
                combined.push(item);
              }
            });
            return combined;
          });
        }
      })
      .catch((err) => {
        console.warn("Không thể tải API phones, dùng bộ dữ liệu chuẩn CellphoneS:", err);
      });
  }, []);

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Lọc theo Brand
    if (selectedBrand !== "all") {
      list = list.filter((p) => {
        const pBrand = (p.brand || "").toLowerCase();
        const sBrand = selectedBrand.toLowerCase();
        if (sBrand === "iphone" && pBrand.includes("apple")) return true;
        return pBrand.includes(sBrand);
      });
    }

    // Lọc theo Nhu cầu
    if (selectedNeed !== "all") {
      list = list.filter((p) => p.need === selectedNeed || p.name.toLowerCase().includes(selectedNeed));
    }

    // Tìm kiếm từ khóa
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // Sắp xếp
    if (activeSort === "discount") {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (activeSort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedBrand, selectedNeed, searchTerm, activeSort]);

  const displayedList = filteredProducts.slice(0, visibleCount);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setToastMessage("Đã thêm vào danh sách yêu thích!");
      }
      return next;
    });
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastMessage(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const toggleFaq = (index) => {
    setExpandedFaq((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        user: "Bạn (Khách hàng)",
        time: "Vừa xong",
        text: newQuestion.trim(),
      },
      ...prev,
    ]);
    setNewQuestion("");
    setToastMessage("Câu hỏi của bạn đã được gửi thành công!");
  };

  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num || 0);

  return (
    <div className="cps-page">
      {/* 1. CELLPHONES RED HEADER (WCAG 2.2 AA High Contrast) */}
      <header className="cps-header" role="banner">
        <div className="cps-container cps-header-inner">
          {/* Logo */}
          <Link to="/" className="cps-logo" aria-label="CellphoneS - Trang chủ">
            cellphone<span>S</span>
          </Link>

          {/* Danh mục */}
          <button type="button" className="cps-cat-btn" aria-label="Mở danh mục sản phẩm">
            <Layers size={18} aria-hidden="true" />
            <span>Danh mục</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>

          {/* Vị trí */}
          <button type="button" className="cps-location-btn" aria-label="Chọn vị trí xem giá và tồn kho">
            <MapPin size={16} aria-hidden="true" />
            <span>Hồ Chí Minh</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>

          {/* Thanh tìm kiếm */}
          <div className="cps-search-wrap" role="search">
            <input
              type="text"
              className="cps-search-input"
              placeholder="Bạn muốn mua gì hôm nay?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Tìm kiếm sản phẩm điện thoại"
            />
            <Search size={18} className="cps-search-icon" aria-hidden="true" />
          </div>

          {/* Actions: Giỏ hàng & Đăng nhập */}
          <div className="cps-header-actions">
            <button
              type="button"
              className="cps-action-btn"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`Giỏ hàng, có ${cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} sản phẩm`}
            >
              <ShoppingBag size={20} aria-hidden="true" />
              <span>Giỏ hàng</span>
              {cartItems.length > 0 && (
                <span
                  style={{
                    backgroundColor: "#ffffff",
                    color: "var(--cps-red)",
                    borderRadius: "9999px",
                    padding: "1px 6px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  {cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)}
                </span>
              )}
            </button>

            <Link
              to="/admin"
              className="cps-action-btn"
              style={{ backgroundColor: "rgba(0,0,0,0.15)", borderRadius: "8px" }}
              aria-label="Đăng nhập trang quản trị"
            >
              <span>Đăng nhập</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT LANDMARK */}
      <main className="cps-container" id="main-content">
        {/* Breadcrumbs */}
        <nav className="cps-breadcrumbs" aria-label="Đường dẫn">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <span className="active" aria-current="page">Điện thoại</span>
        </nav>

        {/* 3. DUAL TOP PROMOTIONAL BANNERS */}
        <section className="cps-top-banners" aria-label="Chương trình ưu đãi nổi bật">
          <Link to="#products-grid" className="cps-banner-card cps-banner-1">
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, color: "var(--cps-red)", letterSpacing: "0.05em" }}>
                Mở bán đặc quyền
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "4px 0 2px 0", letterSpacing: "-0.01em" }}>
                HONOR 600S 5G
              </h2>
              <p style={{ fontSize: "13px", color: "var(--cps-text-secondary)", margin: 0 }}>
                AI • Bền chất thật, bật chất riêng | Giá chỉ từ <strong>9.490.000đ</strong>
              </p>
            </div>
            <div style={{ backgroundColor: "var(--cps-red)", color: "#fff", padding: "6px 14px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700 }}>
              Mua ngay
            </div>
          </Link>

          <Link to="#products-grid" className="cps-banner-card cps-banner-2">
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.05em" }}>
                Flagship Duo
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "4px 0 2px 0", letterSpacing: "-0.01em" }}>
                Gập được. Đổi dáng được.
              </h2>
              <p style={{ fontSize: "13px", color: "#cbd5e1", margin: 0 }}>
                Trợ giá thu cũ đổi mới lên đến <strong>3.000.000đ</strong>
              </p>
            </div>
            <div style={{ backgroundColor: "#38bdf8", color: "#0f172a", padding: "6px 14px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700 }}>
              Khám phá
            </div>
          </Link>
        </section>

        {/* 4. CHỌN THEO THƯƠNG HIỆU */}
        <section className="cps-brand-section" aria-label="Lọc theo thương hiệu điện thoại">
          <h1 className="cps-section-title">Điện thoại</h1>
          <div className="cps-brand-grid" role="group" aria-label="Danh sách thương hiệu">
            <button
              type="button"
              className={`cps-brand-pill ${selectedBrand === "all" ? "active" : ""}`}
              onClick={() => setSelectedBrand("all")}
              aria-pressed={selectedBrand === "all"}
            >
              Tất cả
            </button>
            {brandList.map((brand) => (
              <button
                key={brand}
                type="button"
                className={`cps-brand-pill ${selectedBrand === brand ? "active" : ""}`}
                onClick={() => setSelectedBrand(selectedBrand === brand ? "all" : brand)}
                aria-pressed={selectedBrand === brand}
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* 5. CHỌN THEO NHU CẦU */}
        <section className="cps-needs-section" aria-label="Chọn điện thoại theo nhu cầu sử dụng">
          <h2 className="cps-section-title">Chọn theo nhu cầu</h2>
          <div className="cps-needs-grid">
            {needsList.map((need) => (
              <button
                key={need.id}
                type="button"
                className={`cps-need-card ${selectedNeed === need.id ? "active" : ""}`}
                onClick={() => setSelectedNeed(selectedNeed === need.id ? "all" : need.id)}
                aria-pressed={selectedNeed === need.id}
              >
                <div className="cps-need-icon">{need.icon}</div>
                <span className="cps-need-label">{need.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 6. CHỌN THEO TIÊU CHÍ */}
        <section className="cps-criteria-section" aria-label="Bộ lọc tiêu chí nâng cao">
          <div style={{ marginBottom: "12px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--cps-text-main)" }}>
              Chọn theo tiêu chí
            </h2>
          </div>
          <div className="cps-criteria-row">
            <button type="button" className="cps-filter-main-btn" aria-label="Mở tất cả bộ lọc nâng cao">
              <SlidersHorizontal size={15} aria-hidden="true" />
              <span>Bộ lọc</span>
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Sẵn hàng</span>
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Hàng mới về</span>
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Xem theo giá</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Nhu cầu sử dụng</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Chip xử lí</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Loại điện thoại</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Dung lượng RAM</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Bộ nhớ trong</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Tính năng camera</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Tần số quét</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button type="button" className="cps-criteria-pill">
              <span>Hỗ trợ mạng 5G</span>
              <ChevronDown size={13} aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* 7. SẮP XẾP THEO */}
        <div className="cps-sort-bar" aria-label="Sắp xếp sản phẩm">
          <h2 className="cps-sort-title">Sắp xếp theo</h2>
          <div className="cps-sort-chips" role="radiogroup" aria-label="Tiêu chí sắp xếp">
            <button
              type="button"
              className={`cps-sort-chip ${activeSort === "popular" ? "active" : ""}`}
              onClick={() => setActiveSort("popular")}
              role="radio"
              aria-checked={activeSort === "popular"}
            >
              <Star size={14} aria-hidden="true" />
              <span>Phổ biến</span>
            </button>
            <button
              type="button"
              className={`cps-sort-chip ${activeSort === "discount" ? "active" : ""}`}
              onClick={() => setActiveSort("discount")}
              role="radio"
              aria-checked={activeSort === "discount"}
            >
              <Flame size={14} aria-hidden="true" />
              <span>Khuyến mãi HOT</span>
            </button>
            <button
              type="button"
              className={`cps-sort-chip ${activeSort === "price_asc" ? "active" : ""}`}
              onClick={() => setActiveSort("price_asc")}
              role="radio"
              aria-checked={activeSort === "price_asc"}
            >
              <ArrowUpDown size={14} aria-hidden="true" />
              <span>Giá Thấp - Cao</span>
            </button>
            <button
              type="button"
              className={`cps-sort-chip ${activeSort === "price_desc" ? "active" : ""}`}
              onClick={() => setActiveSort("price_desc")}
              role="radio"
              aria-checked={activeSort === "price_desc"}
            >
              <ArrowUpDown size={14} aria-hidden="true" />
              <span>Giá Cao - Thấp</span>
            </button>
          </div>
        </div>

        {/* 8. 5-COLUMN CELLPHONES PRODUCT GRID */}
        <section id="products-grid" aria-label="Danh sách sản phẩm điện thoại">
          <div className="cps-product-grid">
            {displayedList.map((product) => {
              const isFavorited = favorites.has(product.id);
              return (
                <article
                  key={product.id}
                  className="cps-product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Xem chi tiết điện thoại ${product.name}, giá ${formatVND(product.price)}`}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product.id}`)}
                >
                  {/* Top Badges */}
                  <div className="cps-card-badges">
                    <span className="cps-badge-discount">
                      Giảm {product.discountPercent}%
                    </span>
                    <span className="cps-badge-installment">
                      {product.installment || "Trả góp 0%"}
                    </span>
                  </div>

                  {/* Product Image: Cleanly contained & blended */}
                  <div className="cps-card-media">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="cps-card-title" title={product.name}>
                    {product.name}
                  </h3>

                  {/* Price row */}
                  <div className="cps-card-prices">
                    <span className="cps-card-price-current">
                      {formatVND(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="cps-card-price-original">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Specs tags */}
                  <div className="cps-card-specs">
                    {product.screenSize && (
                      <span className="cps-spec-tag">{product.screenSize}</span>
                    )}
                    {product.ram && (
                      <span className="cps-spec-tag">{product.ram}</span>
                    )}
                    {product.storage && (
                      <span className="cps-spec-tag">{product.storage}</span>
                    )}
                  </div>

                  {/* Smember promo pill */}
                  <div className="cps-smember-box">
                    {product.smemberDiscount || "Smember giảm thêm đến 1%"}
                  </div>

                  {/* Promo text box */}
                  <div className="cps-card-promo-note">
                    {product.promoNote}
                  </div>

                  {/* Footer row: Fast delivery, Rating, Favorite button */}
                  <div className="cps-card-footer">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="cps-badge-delivery">
                        <Truck size={12} aria-hidden="true" />
                        <span>{product.deliverySpeed || "Giao 2 Giờ"}</span>
                      </span>
                      <span className="cps-card-rating">
                        <Star size={12} fill="#eab308" color="#eab308" aria-hidden="true" />
                        <span>{product.rating || "5.0"}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`cps-card-favorite-btn ${isFavorited ? "favorited" : ""}`}
                      onClick={(e) => toggleFavorite(product.id, e)}
                      aria-label={isFavorited ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
                      title="Yêu thích"
                    >
                      <Heart size={16} fill={isFavorited ? "var(--cps-red)" : "none"} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredProducts.length && (
            <div className="cps-loadmore-wrap">
              <button
                type="button"
                className="cps-loadmore-btn"
                onClick={() => setVisibleCount((prev) => prev + 10)}
                aria-label={`Xem thêm ${filteredProducts.length - visibleCount} sản phẩm điện thoại`}
              >
                <span>Xem thêm {filteredProducts.length - visibleCount} sản phẩm</span>
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </section>

        {/* 9. SEO EDITORIAL + NEWS SIDE-BY-SIDE SECTION */}
        <section className="cps-editorial-news-grid" aria-label="Thông tin bài viết và tin tức sản phẩm">
          {/* Left Column: SEO Article & Collapsible Table of Contents */}
          <article className="cps-seo-box">
            {/* Model Tag Pills */}
            <div className="cps-seo-tags">
              <span className="cps-seo-tag">iPhone 17</span>
              <span className="cps-seo-tag">iPhone 17 Pro Max</span>
              <span className="cps-seo-tag">iPhone 18 Pro Max</span>
              <span className="cps-seo-tag">iPhone 18 Pro</span>
              <span className="cps-seo-tag">iPhone Duo</span>
            </div>

            <p className="cps-seo-intro">
              <strong>Điện thoại thông minh</strong> không chỉ phục vụ việc liên lạc mà còn hỗ trợ người dùng giải trí, làm việc và sáng tạo nội dung hiệu quả. Với hiệu năng mạnh, màn hình sắc nét cùng pin bền bỉ, những chiếc smartphone này luôn giúp người dùng tối ưu hiệu suất sử dụng mỗi ngày. Ngoài ra, máy còn tích hợp nhiều tính năng thông minh để nâng tầm trải nghiệm.
            </p>

            {/* Collapsible Table of Contents */}
            <div className="cps-toc-box">
              <div
                className="cps-toc-header"
                onClick={() => setTocExpanded(!tocExpanded)}
                role="button"
                tabIndex={0}
                aria-expanded={tocExpanded}
                onKeyDown={(e) => e.key === "Enter" && setTocExpanded(!tocExpanded)}
              >
                <span>Nội dung chính</span>
                {tocExpanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
              </div>

              {tocExpanded && (
                <ol className="cps-toc-list">
                  <li><a href="#toc-1">1. Điện thoại di động – thiết bị liên lạc, giải trí tiện lợi</a></li>
                  <li><a href="#toc-2">2. Giá điện thoại bao nhiêu tiền?</a></li>
                  <li><a href="#toc-3">3. Điện thoại smartphone có chức năng gì?</a></li>
                  <li>
                    <a href="#toc-4">4. Phân loại điện thoại theo tính năng</a>
                    <ol style={{ paddingLeft: "20px", listStyle: "circle" }}>
                      <li>4.1. Điện thoại phổ thông (Feature phone)</li>
                      <li>4.2. Điện thoại thông minh (Smartphone)</li>
                    </ol>
                  </li>
                  <li>
                    <a href="#toc-5">5. Phân loại điện thoại theo hệ điều hành</a>
                    <ol style={{ paddingLeft: "20px", listStyle: "circle" }}>
                      <li>5.1. Điện thoại Android</li>
                      <li>5.2. Điện thoại iOS</li>
                    </ol>
                  </li>
                </ol>
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <button
                type="button"
                className="cps-reply-btn"
                style={{ fontSize: "13px", fontWeight: 700 }}
              >
                Xem thêm ⌵
              </button>
            </div>
          </article>

          {/* Right Column: Tin tức sản phẩm */}
          <aside className="cps-news-box" aria-label="Tin tức sản phẩm công nghệ">
            <div className="cps-news-header">
              <h2 className="cps-news-title">Tin tức sản phẩm</h2>
              <Link to="/" className="cps-news-link">Xem tất cả &gt;</Link>
            </div>

            <div className="cps-news-list">
              {productNews.map((item) => (
                <Link to="/" key={item.id} className="cps-news-item">
                  <img
                    src={item.thumb}
                    alt={item.title}
                    className="cps-news-thumb"
                    loading="lazy"
                  />
                  <h3 className="cps-news-caption">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        {/* 10. FAQ ACCORDION SECTION (Câu hỏi thường gặp) */}
        <section className="cps-faq-section" aria-label="Câu hỏi thường gặp khi mua điện thoại">
          <h2 className="cps-section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <HelpCircle size={20} color="var(--cps-red)" aria-hidden="true" />
            <span>Câu hỏi thường gặp</span>
          </h2>

          <div className="cps-faq-list" role="region" aria-label="Danh sách câu hỏi giải đáp">
            {faqList.map((item, index) => {
              const isOpen = expandedFaq.includes(index);
              return (
                <div key={index} className="cps-faq-item">
                  <button
                    type="button"
                    className="cps-faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
                  </button>
                  {isOpen && (
                    <div id={`faq-answer-${index}`} className="cps-faq-answer">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 11. Q&A COMMUNITY SECTION (Hỏi và đáp) */}
        <section className="cps-qa-section" aria-label="Hỏi đáp và bình luận người dùng">
          <h2 className="cps-section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={20} color="var(--cps-red)" aria-hidden="true" />
            <span>Hỏi và đáp</span>
          </h2>

          {/* CellphoneS Friendly Mascot Banner */}
          <div className="cps-qa-banner">
            <div className="cps-mascot" aria-hidden="true">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="70">
                <circle cx="50" cy="50" r="45" fill="#fee2e2" />
                <circle cx="50" cy="46" r="28" fill="#d70018" />
                <circle cx="40" cy="42" r="5" fill="#ffffff" />
                <circle cx="60" cy="42" r="5" fill="#ffffff" />
                <circle cx="41" cy="42" r="2.5" fill="#1e293b" />
                <circle cx="61" cy="42" r="2.5" fill="#1e293b" />
                <path d="M42 56C46 60 54 60 58 56" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="20" cy="35" r="8" fill="#d70018" />
                <circle cx="80" cy="35" r="8" fill="#d70018" />
                <rect x="35" y="72" width="30" height="20" rx="8" fill="#d70018" />
              </svg>
            </div>

            <div className="cps-qa-banner-content">
              <h3 className="cps-qa-banner-title">Hãy đặt câu hỏi cho chúng tôi</h3>
              <p className="cps-qa-banner-desc">
                CellphoneS sẽ phản hồi trong vòng 1 giờ. Nếu Quý khách gửi câu hỏi sau 22h, chúng tôi sẽ trả lời vào sáng hôm sau. Thông tin có thể thay đổi theo thời gian, vui lòng đặt câu hỏi để nhận được cập nhật mới nhất!
              </p>

              {/* Form gửi câu hỏi */}
              <form onSubmit={handleSendQuestion} className="cps-qa-form">
                <input
                  type="text"
                  className="cps-qa-input"
                  placeholder="Viết câu hỏi của bạn tại đây..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  aria-label="Nhập câu hỏi thắc mắc"
                />
                <button type="submit" className="cps-qa-submit-btn" aria-label="Gửi câu hỏi cho tư vấn viên">
                  <span>Gửi câu hỏi</span>
                  <Send size={14} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>

          {/* Danh sách bình luận hỏi đáp */}
          <div className="cps-comments-list" role="feed" aria-label="Danh sách câu hỏi của khách hàng">
            {comments.map((c) => (
              <article key={c.id} className="cps-comment-item">
                <div className="cps-comment-avatar" aria-hidden="true">
                  {c.user.charAt(0).toUpperCase()}
                </div>
                <div className="cps-comment-main">
                  <div className="cps-comment-user">
                    <span>{c.user}</span>
                    <span className="cps-comment-time">• {c.time}</span>
                  </div>
                  <p className="cps-comment-text">{c.text}</p>
                  <button type="button" className="cps-reply-btn" aria-label={`Trả lời bình luận của ${c.user}`}>
                    Trả lời
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
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

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

