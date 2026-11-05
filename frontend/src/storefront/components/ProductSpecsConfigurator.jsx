import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Shield, Truck, RotateCcw } from "lucide-react";
import { getSmartColorImage, getSmartColorHex } from "../../utils/phoneImages";
import InstallmentModal from "./InstallmentModal";

export default function ProductSpecsConfigurator({
  productId,
  productName = "Smartphone",
  productImageUrl,
  basePrice = 29990000,
  variants = [],
  onAddToCart,
}) {
  const getColorHex = (name) => getSmartColorHex(name);

  // Trích xuất danh sách màu sắc và dung lượng từ biến thể backend
  const availableColors = variants.length > 0
    ? Array.from(new Set(variants.map((v) => v.color).filter(Boolean)))
    : ["Chính hãng"];

  const availableStorages = variants.length > 0
    ? Array.from(new Set(variants.map((v) => v.storage).filter(Boolean)))
    : ["Tiêu chuẩn"];

  const [selectedColor, setSelectedColor] = useState(availableColors[0] || "Mặc định");
  const [selectedStorage, setSelectedStorage] = useState(availableStorages[0] || "Tiêu chuẩn");
  const [quantity, setQuantity] = useState(1);
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [installmentTab, setInstallmentTab] = useState("card");
  const [quickTerm, setQuickTerm] = useState(12);

  // Cập nhật khi variants thay đổi từ API
  useEffect(() => {
    if (availableColors.length > 0 && !availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0]);
    }
    if (availableStorages.length > 0 && !availableStorages.includes(selectedStorage)) {
      setSelectedStorage(availableStorages[0]);
    }
  }, [variants]);

  // Tìm biến thể khớp chính xác theo màu và dung lượng
  const matchedVariant = variants.length > 0
    ? (variants.find(
        (v) => (v.color || "").trim().toLowerCase() === (selectedColor || "").trim().toLowerCase() &&
               (v.storage || "").trim().toLowerCase() === (selectedStorage || "").trim().toLowerCase()
      ) || variants.find((v) => (v.color || "").trim().toLowerCase() === (selectedColor || "").trim().toLowerCase()) || variants[0])
    : null;

  // Nếu điện thoại có biến thể, hiển thị giá theo biến thể; nếu không có hoặc giá biến thể chưa thiết lập, lấy basePrice của sản phẩm chính
  const currentPrice = (matchedVariant && matchedVariant.price > 0) ? matchedVariant.price : basePrice;
  const inStock = matchedVariant ? (matchedVariant.stockQuantity > 0) : true;
  const stockCount = matchedVariant?.stockQuantity ?? 15;
  const validThumb =
    matchedVariant?.thumbnailUrl && !matchedVariant.thumbnailUrl.includes("apple.com")
      ? matchedVariant.thumbnailUrl
      : null;
  const currentDisplayImage =
    getSmartColorImage(productName, selectedColor, validThumb || productImageUrl) ||
    productImageUrl;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id: productId,
        productName,
        color: selectedColor,
        storage: selectedStorage,
        variantId: matchedVariant?.id,
        sku: matchedVariant?.sku,
        imageUrl: currentDisplayImage,
        price: currentPrice,
        quantity,
      });
    }
  };

  return (
    <section id="configurator" className="configurator-section" aria-label="Tùy chọn cấu hình và đặt hàng">
      <div className="configurator-container">
        {/* Left Sticky Gallery Card */}
        <div className="configurator-gallery">
          {/* Breadcrumb */}
          <nav aria-label="Đường dẫn trang" style={{ marginBottom: "16px", textAlign: "left" }}>
            <ol style={{ display: "flex", gap: "6px", listStyle: "none", padding: 0, margin: 0, fontSize: "12px", color: "var(--color-slate)" }}>
              <li><a href="/" className="footer-link">Trang chủ</a></li>
              <li>/</li>
              <li><span className="footer-link">Điện thoại</span></li>
              <li>/</li>
              <li style={{ color: "var(--color-ink)", fontWeight: 500 }}>{productName}</li>
            </ol>
          </nav>

          <div
            className="configurator-main-img"
            style={{
              backgroundColor: "var(--color-gallery-white)",
              borderRadius: "var(--radius-images)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--color-hairline-silver)",
              padding: "var(--space-8)",
              minHeight: "340px",
            }}
          >
            {currentDisplayImage ? (
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  minHeight: "260px",
                  marginBottom: "16px",
                  backgroundColor: "var(--color-gallery-white)",
                }}
              >
                <img
                  key={currentDisplayImage}
                  src={currentDisplayImage}
                  alt={`${productName} - ${selectedColor}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (productImageUrl && e.currentTarget.src !== productImageUrl) {
                      e.currentTarget.src = productImageUrl;
                    }
                  }}
                  style={{
                    maxHeight: "260px",
                    maxWidth: "94%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    objectPosition: "center",
                    mixBlendMode: "multiply",
                    filter: "contrast(1.05) brightness(1.02)",
                    transition: "all 0.3s ease",
                    display: "block",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: getColorHex(selectedColor),
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  marginBottom: "16px",
                  transition: "background-color 0.3s ease",
                }}
              />
            )}
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--color-ink)" }}>
              {productName} – {selectedColor}
            </p>
            <span style={{ fontSize: "13px", color: "var(--color-slate)", marginTop: "4px" }}>
              Phiên bản: {selectedStorage} {matchedVariant?.ram ? `• RAM ${matchedVariant.ram}` : ""}
            </span>
            {matchedVariant?.sku && (
              <span style={{ fontSize: "11px", color: "var(--color-slate)", marginTop: "4px" }}>
                Mã SKU: {matchedVariant.sku}
              </span>
            )}
          </div>

          {/* Value Commitments */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginTop: "20px", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-slate)" }}>
              <Truck size={16} strokeWidth={1.5} color="var(--color-ink)" aria-hidden="true" />
              <span>Giao hàng hỏa tốc 2 giờ hoặc miễn phí toàn quốc</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-slate)" }}>
              <RotateCcw size={16} strokeWidth={1.5} color="var(--color-ink)" aria-hidden="true" />
              <span>Lỗi 1 đổi 1 trong 30 ngày nếu có lỗi do nhà sản xuất</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-slate)" }}>
              <Shield size={16} strokeWidth={1.5} color="var(--color-ink)" aria-hidden="true" />
              <span>Bảo hành chính hãng 12 - 24 tháng tại các trung tâm ủy quyền</span>
            </div>
          </div>
        </div>

        {/* Right Configuration Options */}
        <div className="configurator-options">
          <span className="label-launch-status">Dữ liệu biến thể kết nối trực tiếp API Backend</span>
          <h2 className="configurator-title">{productName}</h2>
          <div className="configurator-price-display">{formatCurrency(currentPrice)}</div>

          {/* 1. Chọn Màu Sắc từ Backend API */}
          <fieldset className="option-group" style={{ border: "none", padding: 0 }}>
            <legend className="option-label">
              1. Màu sắc hoàn thiện: <span style={{ fontWeight: 400 }}>{selectedColor}</span>
            </legend>
            <div className="swatch-group">
              {availableColors.map((colorName) => (
                <button
                  key={colorName}
                  type="button"
                  className={`color-swatch-btn ${selectedColor === colorName ? "selected" : ""}`}
                  onClick={() => setSelectedColor(colorName)}
                  aria-label={`Chọn màu ${colorName}`}
                  aria-pressed={selectedColor === colorName}
                  title={colorName}
                >
                  <span
                    className="color-swatch-inner"
                    style={{ backgroundColor: getColorHex(colorName) }}
                  />
                </button>
              ))}
            </div>
          </fieldset>

          {/* 2. Chọn Dung Lượng từ Backend API */}
          <fieldset className="option-group" style={{ border: "none", padding: 0 }}>
            <legend className="option-label">
              2. Dung lượng bộ nhớ trong: <span style={{ fontWeight: 400 }}>{selectedStorage}</span>
            </legend>
            <div className="storage-group">
              {availableStorages.map((storageLabel) => (
                <button
                  key={storageLabel}
                  type="button"
                  className={`storage-pill-btn ${selectedStorage === storageLabel ? "selected" : ""}`}
                  onClick={() => setSelectedStorage(storageLabel)}
                  aria-pressed={selectedStorage === storageLabel}
                >
                  <span className="storage-size">{storageLabel}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* 3. Chọn Số Lượng */}
          <div className="option-group">
            <label htmlFor="qty-input" className="option-label">
              3. Số lượng:
            </label>
            <div className="quantity-control">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Giảm số lượng 1 sản phẩm"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span id="qty-input" className="qty-display" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Tăng số lượng 1 sản phẩm"
                disabled={!inStock || quantity >= stockCount}
              >
                +
              </button>
            </div>
          </div>

          {/* Tình Trạng Kho Hàng từ API: Bare text, không pill nền màu */}
          <div className="stock-status-notice">
            <span
              className="stock-indicator-dot"
              style={{ backgroundColor: inStock ? "#34c759" : "#ff3b30" }}
              aria-hidden="true"
            />
            <span>
              {inStock
                ? `Còn hàng sẵn tại showroom (Tồn kho: ${stockCount} máy)`
                : "Tạm hết hàng phiên bản này"}
            </span>
          </div>

          {/* Conversion Actions (Theo Bảng 2: Mua ngay và Thêm vào giỏ, khối trả góp, bảo hành) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
            {/* Nút MUA NGAY: Chuyển thẳng sang trang Checkout */}
            <button
              type="button"
              onClick={() => {
                if (inStock) {
                  const cartItem = {
                    id: productId,
                    name: productName,
                    color: selectedColor,
                    storage: selectedStorage,
                    variantId: matchedVariant?.id,
                    price: currentPrice,
                    quantity,
                    imageUrl: currentDisplayImage,
                  };
                  localStorage.setItem("phonestore_cart", JSON.stringify([cartItem]));
                  window.location.href = "/checkout";
                }
              }}
              disabled={!inStock}
              style={{
                width: "100%",
                height: "50px",
                fontSize: "16px",
                fontWeight: 700,
                backgroundColor: "#d70018",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                cursor: inStock ? "pointer" : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 150ms ease",
              }}
            >
              <span>MUA NGAY</span>
              <span style={{ fontSize: "11px", fontWeight: 400, opacity: 0.9 }}>
                (Giao tận nơi 2 giờ hoặc nhận tại Showroom)
              </span>
            </button>

            {/* Nút Thêm vào giỏ hàng */}
            <button
              type="button"
              className="btn-pricing-blue"
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{ width: "100%", height: "46px", fontSize: "14px", fontWeight: 600, borderRadius: "12px" }}
            >
              {inStock
                ? `Thêm vào giỏ hàng • ${formatCurrency(currentPrice * quantity)}`
                : "Tạm hết hàng"}
            </button>

            {/* Hàng 2 nút Trả Góp Chuẩn Showroom: [ TRẢ GÓP 0% (CCCD) ] & [ TRẢ GÓP QUA THẺ ] */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "2px" }}>
              <button
                type="button"
                onClick={() => {
                  setInstallmentTab("cccd");
                  setInstallmentModalOpen(true);
                }}
                disabled={!inStock}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: "#fff7ed",
                  border: "1.5px solid #f97316",
                  color: "#c2410c",
                  cursor: inStock ? "pointer" : "not-allowed",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 8px",
                  transition: "all 150ms ease",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 800 }}>TRẢ GÓP 0%</span>
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#9a3412" }}>
                  Duyệt hồ sơ nhanh qua CCCD
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInstallmentTab("card");
                  setInstallmentModalOpen(true);
                }}
                disabled={!inStock}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: "#f0f7ff",
                  border: "1.5px solid #0071e3",
                  color: "#0071e3",
                  cursor: inStock ? "pointer" : "not-allowed",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 8px",
                  transition: "all 150ms ease",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 800 }}>TRẢ GÓP QUA THẺ</span>
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#1d4ed8" }}>
                  Visa, Mastercard, JCB (0đ)
                </span>
              </button>
            </div>
          </div>

          {/* Khối Widget Ước tính Trả Góp 0% Tương Tác Sống */}
          <div
            style={{
              backgroundColor: "#f0f7ff",
              border: "1.5px solid #bfdbfe",
              borderRadius: "14px",
              padding: "14px 16px",
              marginTop: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    backgroundColor: "#0071e3",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  0% LÃI SUẤT
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a8a" }}>
                  Trả góp siêu tốc linh hoạt
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInstallmentTab("card");
                  setInstallmentModalOpen(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0071e3",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                Bảng tính chi tiết 26 ngân hàng →
              </button>
            </div>

            {/* Chọn nhanh kỳ hạn */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Kỳ hạn:</span>
              {[6, 12, 24].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setQuickTerm(m)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "6px",
                    border: quickTerm === m ? "1.5px solid #0071e3" : "1px solid #cbd5e1",
                    backgroundColor: quickTerm === m ? "#ffffff" : "#e2e8f0",
                    color: quickTerm === m ? "#0071e3" : "#475569",
                    fontSize: "11px",
                    fontWeight: quickTerm === m ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {m} Tháng
                </button>
              ))}
            </div>

            {/* Hiển thị số tiền nhảy số trực tiếp */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                backgroundColor: "#ffffff",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Góp mỗi tháng:</span>
                <strong style={{ fontSize: "15px", color: "#d70018", display: "block" }}>
                  {formatCurrency(Math.round(currentPrice / quickTerm))}/tháng
                </strong>
              </div>
              <div style={{ textAlign: "right", fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>
                <span>✓ Trả trước từ 0đ</span>
                <span style={{ display: "block" }}>✓ Duyệt hồ sơ 5 phút</span>
              </div>
            </div>
          </div>

          {/* Khối Cam kết Bảo hành & Hậu mãi theo Bảng 2 */}
          <div
            style={{
              backgroundColor: "var(--color-studio-mist)",
              borderRadius: "12px",
              border: "1px solid var(--color-hairline-silver)",
              padding: "14px",
              marginTop: "14px",
              fontSize: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield size={16} color="var(--color-pricing-blue)" />
              <span>Bảo hành chính hãng <strong>12 – 24 tháng</strong> tại TTBH ủy quyền</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <RotateCcw size={16} color="#16a34a" />
              <span><strong>1 đổi 1 trong 30 ngày</strong> nếu máy phát sinh lỗi phần cứng</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Truck size={16} color="var(--color-launch-orange)" />
              <span>Miễn phí giao hàng hỏa tốc trong <strong>2 giờ</strong> nội thành</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Bảng tính & Đăng ký Trả Góp 0% chuyên nghiệp */}
      <InstallmentModal
        isOpen={installmentModalOpen}
        onClose={() => setInstallmentModalOpen(false)}
        productName={productName}
        productPrice={currentPrice}
        productImage={currentDisplayImage}
        selectedColor={selectedColor}
        selectedStorage={selectedStorage}
        variantId={matchedVariant?.id}
        productId={productId}
        initialTab={installmentTab}
      />
    </section>
  );
}

