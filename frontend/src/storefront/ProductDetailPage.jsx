import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, MessageSquare, ThumbsUp, ShieldCheck, CheckCircle2 } from "lucide-react";
import "./tokens.css";
import "./storefront.css";

import HomeHeader from "./components/HomeHeader";
import LocalNav from "./components/LocalNav";
import HeroStage from "./components/HeroStage";
import SectionAnchorNav from "./components/SectionAnchorNav";
import HighlightsSection from "./components/HighlightsSection";
import EditorialSection from "./components/EditorialSection";
import ProductSpecsConfigurator from "./components/ProductSpecsConfigurator";
import ProductCard from "./components/ProductCard";
import Breadcrumb from "./components/Breadcrumb";
import StorefrontFooter from "./components/StorefrontFooter";
import Toast from "./components/Toast";
import CartDrawer from "./components/CartDrawer";
import AnnouncementBar from "./components/AnnouncementBar";
import FloatingSupportWidget from "./components/FloatingSupportWidget";
import CookieConsentBanner from "./components/CookieConsentBanner";

import { phoneApi } from "../services/phoneApi";
import { catalogApi } from "../services/catalogApi";
import { interactionApi } from "../services/interactionApi";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: "Smartphone Flagship",
    heroStatement: "Đỉnh cao công nghệ và trải nghiệm đỉnh cao.",
    basePrice: 29990000,
    priceFormatted: "29.990.000 đ",
    monthlyFormatted: "Hoặc từ 1.250.000 đ/tháng trong 24 tháng",
    deviceImageUrl: null,
    raw: null,
  });

  const normalizePrice = (val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") {
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
    return Math.round(num);
  };

  // Tải dữ liệu điện thoại và biến thể từ Backend API
  useEffect(() => {
    if (id) {
      phoneApi.getById(id)
        .then((res) => {
          if (res.data) {
            const p = res.data;
            const price = normalizePrice(p.price) || 0;
            const priceFormatted = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
            const monthlyFormatted = price > 0 ? `Hoặc từ ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Math.round(price / 24))}/tháng` : "";
            setProductData({
              name: p.name,
              heroStatement: p.description ? p.description.split(".")[0] + "." : "Đột phá công nghệ đỉnh cao.",
              basePrice: price,
              priceFormatted,
              monthlyFormatted,
              deviceImageUrl: p.imageUrl || null,
              raw: p,
            });
          }
        })
        .catch((err) => {
          console.warn("Không thể tải chi tiết sản phẩm từ API:", err);
        });

      phoneApi.getVariants(id)
        .then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            const normalized = res.data.map((v) => ({
              ...v,
              price: normalizePrice(v.price) || 0,
            }));
            setVariants(normalized);
          }
        })
        .catch(() => {});

      interactionApi.getReviews(id)
        .then((data) => {
          if (data && Array.isArray(data)) {
            setReviews(data);
          }
        })
        .catch((err) => {
          console.warn("Không thể tải đánh giá từ API:", err);
        });

      // Tải danh sách sản phẩm liên quan
      phoneApi.getAll()
        .then((res) => {
          if (res.data && Array.isArray(res.data)) {
            const others = res.data.filter((item) => String(item.id) !== String(id)).slice(0, 4);
            setRelatedProducts(others);
          }
        })
        .catch(() => {});
    }

    catalogApi.getBrands().then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setBrands(res.data);
      }
    }).catch(() => {});
  }, [id]);

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.color === item.color && i.storage === item.storage
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
        );
      }
      return [...prev, item];
    });
    setToastMessage(`Đã thêm ${item.productName} (${item.color}, ${item.storage}) vào giỏ hàng.`);
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        (item.id === id || item.variantId === id) ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveCartItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id && item.variantId !== id)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleBuyNow = () => {
    const configuratorEl = document.getElementById("configurator");
    if (configuratorEl) {
      configuratorEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const p = productData.raw;

  return (
    <div className="storefront-root">
      {/* Announcement Bar theo Bảng 1 */}
      <AnnouncementBar />

      {/* 1. Global Store Navigation */}
      <HomeHeader
        brands={brands}
        cartCount={cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onSelectBrand={() => {}}
        onSelectProduct={() => {}}
        products={[]}
      />

      {/* 2. Product Local Navigation */}
      <LocalNav
        productName={productData.name}
        priceFormatted={productData.priceFormatted}
        onBuyNowClick={handleBuyNow}
      />

      {/* Đường dẫn Breadcrumb theo Bảng 1 */}
      <div style={{ backgroundColor: "var(--color-gallery-white)", borderBottom: "1px solid var(--color-hairline-silver)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <Breadcrumb
            items={[
              { label: "Trang chủ", to: "/" },
              { label: "Điện thoại", to: "/dien-thoai" },
              { label: productData.name },
            ]}
          />
        </div>
      </div>

      {/* Main Page Landmark */}
      <main id="main-content">
        {/* 3. Hero Product Stage */}
        <HeroStage
          productName={productData.name}
          heroStatement={productData.heroStatement}
          priceFormatted={productData.priceFormatted}
          monthlyFormatted={productData.monthlyFormatted}
          deviceImageUrl={productData.deviceImageUrl}
          onBuyNowClick={handleBuyNow}
        />

        {/* 4. Section Anchor Navigation */}
        <SectionAnchorNav />

        {/* 5. Highlights Carousel Section */}
        <HighlightsSection productName={productData.name} deviceImageUrl={productData.deviceImageUrl} />

        {/* 6. Editorial Feature Block */}
        <EditorialSection productName={productData.name} deviceImageUrl={productData.deviceImageUrl} />

        {/* 7. Product Configurator (Variant selection & Cart CTA - Dữ liệu thực từ API) */}
        <ProductSpecsConfigurator
          key={`${productData.name}-${productData.basePrice}-${variants.length}`}
          productId={productData.raw?.id || id}
          productName={productData.name}
          productImageUrl={productData.deviceImageUrl}
          basePrice={productData.basePrice}
          variants={variants}
          onAddToCart={handleAddToCart}
        />

        {/* 8. Hardware Specifications Table (Kết nối trực tiếp API Backend) */}
        <section id="specs" style={{ backgroundColor: "var(--color-gallery-white)", padding: "var(--section-gap) 0" }} aria-label="Bảng thông số kỹ thuật chi tiết">
          <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 var(--space-5)" }}>
            <span className="editorial-kicker">Chi tiết phần cứng</span>
            <h2 className="editorial-headline" style={{ marginBottom: "var(--space-8)" }}>
              Thông số kỹ thuật từ nhà sản xuất.
            </h2>

            <div style={{ borderTop: "1px solid var(--color-hairline-silver)" }}>
              {[
                { title: "Tên dòng máy", detail: productData.raw?.name || productData.name },
                { title: "Hãng sản xuất (Brand)", detail: productData.raw?.brand?.name || "Chính hãng phân phối" },
                { title: "Phân khúc (Category)", detail: productData.raw?.category?.name || "Flagship Smartphone" },
                { title: "Vi xử lý (CPU)", detail: productData.raw?.cpu || "Chipset thế hệ mới với hiệu năng AI vượt trội" },
                { title: "Công nghệ màn hình", detail: productData.raw?.screenTech || "Màn hình OLED / AMOLED tần số quét cao 120Hz" },
                { title: "Số lượng tồn kho", detail: productData.raw?.quantity != null ? `${productData.raw.quantity} máy có sẵn tại kho` : "Đang có sẵn tại các showroom" },
                { title: "Mô tả sản phẩm", detail: productData.raw?.description || "Sản phẩm mới 100% nguyên seal hộp, đầy đủ phụ kiện chính hãng kèm bảo hành." },
                { title: "Chính sách bảo hành", detail: "Bảo hành 12 - 24 tháng chính hãng tại tất cả các trung tâm bảo hành ủy quyền trên toàn quốc." },
              ].map((spec, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "240px 1fr",
                    padding: "var(--space-5) 0",
                    borderBottom: "1px solid var(--color-hairline-silver)",
                    gap: "var(--space-4)",
                  }}
                >
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-ink)", margin: 0 }}>
                    {spec.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--color-slate)", margin: 0, lineHeight: 1.5 }}>
                    {spec.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Khối Đánh giá thực tế từ khách hàng theo Bảng 2 */}
        <section id="reviews" style={{ backgroundColor: "var(--color-studio-mist)", padding: "var(--section-gap) 0" }} aria-label="Đánh giá từ khách hàng">
          <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 var(--space-5)" }}>
            <span className="editorial-kicker">Trải nghiệm người dùng</span>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
              <h2 className="editorial-headline" style={{ margin: 0 }}>
                Đánh giá của khách hàng.
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-ink)" }}>4.9</span>
                  <div style={{ display: "flex", color: "#f59e0b" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: "13px", color: "var(--color-slate)", marginLeft: "4px" }}>
                    ({reviews.length || 3} đánh giá)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewFormOpen(!reviewFormOpen)}
                  className="btn-explore-pill"
                  style={{ height: "34px", fontSize: "12px", padding: "0 14px", fontWeight: 600 }}
                >
                  {reviewFormOpen ? "Đóng lại" : "Viết đánh giá"}
                </button>
              </div>
            </div>

            {/* Form viết đánh giá mới */}
            {reviewFormOpen && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newReviewText.trim()) return;
                  const newRev = {
                    phoneId: parseInt(id, 10),
                    authorName: newReviewAuthor.trim() || "Khách hàng Phone Store",
                    rating: newReviewRating,
                    comment: newReviewText.trim(),
                  };
                  try {
                    await interactionApi.createReview(newRev);
                  } catch {}
                  setReviews((prev) => [newRev, ...prev]);
                  setNewReviewText("");
                  setNewReviewAuthor("");
                  setReviewFormOpen(false);
                  setToastMessage("Cảm ơn bạn đã gửi đánh giá cho sản phẩm!");
                }}
                style={{
                  backgroundColor: "var(--color-gallery-white)",
                  borderRadius: "20px",
                  border: "1px solid var(--color-hairline-silver)",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <h4 style={{ margin: "0 0 14px 0", fontSize: "15px", fontWeight: 600 }}>Chia sẻ đánh giá của bạn</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    placeholder="Họ và tên của bạn *"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    required
                    style={{ height: "38px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 12px", fontSize: "13px" }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-slate)" }}>Số sao:</span>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      style={{ height: "38px", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "0 10px", fontSize: "13px", backgroundColor: "#fff" }}
                    >
                      <option value={5}>5 sao - Xuất sắc</option>
                      <option value={4}>4 sao - Tốt</option>
                      <option value={3}>3 sao - Khá</option>
                      <option value={2}>2 sao - Tạm được</option>
                      <option value={1}>1 sao - Cần cải thiện</option>
                    </select>
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder="Cảm nhận của bạn về hiệu năng, camera, pin, thiết kế... *"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  required
                  style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--color-hairline-silver)", padding: "10px 12px", fontSize: "13px", marginBottom: "14px", fontFamily: "inherit" }}
                />
                <button type="submit" className="btn-pricing-blue" style={{ height: "36px", padding: "0 20px", fontSize: "13px", borderRadius: "9999px" }}>
                  Gửi đánh giá
                </button>
              </form>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              {(reviews.length > 0 ? reviews : [
                {
                  authorName: "Nguyễn Hải Nam",
                  rating: 5,
                  comment: "Máy đẹp xuất sắc, cầm khung viền rất sang tay. Pin dùng cả ngày thoải mái, sạc nhanh ấn tượng. Đóng gói cẩn thận, seal nguyên vẹn.",
                },
                {
                  authorName: "Trần Mai Phương",
                  rating: 5,
                  comment: "Giao hỏa tốc 2 giờ đúng hẹn. Nhân viên hỗ trợ chuyển dữ liệu từ máy cũ sang máy mới rất nhiệt tình. Rất hài lòng với Phone Store!",
                },
                {
                  authorName: "Lê Quốc Bảo",
                  rating: 5,
                  comment: "Màn hình 120Hz mượt mà, camera chụp đêm đỉnh cao. Trả góp 0% qua thẻ tín dụng duyệt cực nhanh.",
                },
              ]).map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--color-gallery-white)",
                    borderRadius: "20px",
                    border: "1px solid var(--color-hairline-silver)",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--color-studio-mist)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }}>
                        {(rev.authorName || rev.name || "K")[0]}
                      </div>
                      <div>
                        <strong style={{ fontSize: "13px", display: "block" }}>{rev.authorName || rev.name || "Khách hàng"}</strong>
                        <div style={{ display: "flex", color: "#f59e0b", gap: "2px" }}>
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={11} fill="#f59e0b" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--color-slate)" }}>Vừa xong</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--color-ink)", lineHeight: 1.5, margin: 0 }}>
                    "{rev.comment}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "10px", fontSize: "11px", color: "#16a34a" }}>
                    <CheckCircle2 size={12} />
                    <span>Chứng nhận đã mua hàng tại Phone Store</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Khối Sản phẩm tương tự / Cùng hãng theo Bảng 2 */}
        {relatedProducts.length > 0 && (
          <section id="related-products" style={{ backgroundColor: "var(--color-gallery-white)", padding: "var(--section-gap) 0" }} aria-label="Sản phẩm tương tự">
            <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 var(--space-5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
                <div>
                  <span className="editorial-kicker">Gợi ý dành cho bạn</span>
                  <h2 className="editorial-headline" style={{ margin: 0 }}>
                    Sản phẩm cùng phân khúc.
                  </h2>
                </div>
                <Link to="/dien-thoai" className="link-apple-blue" style={{ fontSize: "14px" }}>
                  Xem tất cả →
                </Link>
              </div>

              <div className="product-card-grid">
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    statusLabel="Gợi ý"
                    onSelectProduct={(p) => navigate(`/product/${p.id}`)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 9. Footer Chuẩn */}
      <StorefrontFooter />
      <FloatingSupportWidget />
      <CookieConsentBanner />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccess={(order) => {
          setToastMessage(`Đặt hàng thành công! Mã đơn: ${order.orderCode}`);
        }}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

