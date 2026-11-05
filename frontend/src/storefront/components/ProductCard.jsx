import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { phoneApi } from "../../services/phoneApi";
import { getSmartColorImage, detectSmartBrand, getSmartColorHex } from "../../utils/phoneImages";

export default function ProductCard({
  product,
  statusLabel = "Mới",
  onSelectProduct,
  onAddToCart,
}) {
  // State lưu biến thể thực tế từ Database
  const [realVariants, setRealVariants] = useState(product?.variants || []);

  // Tải danh sách biến thể thực tế từ API nếu sản phẩm chưa có
  useEffect(() => {
    let isMounted = true;
    if (product?.variants && product.variants.length > 0) {
      setRealVariants(product.variants);
    } else if (product?.id) {
      phoneApi
        .getVariants(product.id)
        .then((res) => {
          if (isMounted && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setRealVariants(res.data);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [product?.id, product?.variants]);

  // Trích xuất danh sách màu sắc ĐÍCH THỰC từ biến thể được tải
  const activeVariants =
    realVariants && realVariants.length > 0
      ? realVariants
      : product?.variants || [];

  const distinctColorNames =
    activeVariants.length > 0
      ? Array.from(new Set(activeVariants.map((v) => (v.color || "").trim()).filter(Boolean)))
      : [];

  const colorOptions =
    distinctColorNames.length > 0
      ? distinctColorNames.map((cName) => {
          const foundWithImg = activeVariants.find(
            (v) => (v.color || "").trim().toLowerCase() === cName.toLowerCase() && v.thumbnailUrl
          );
          const foundAny = activeVariants.find(
            (v) => (v.color || "").trim().toLowerCase() === cName.toLowerCase()
          );

          // Bỏ qua link Apple Store CDN bị chặn 403
          const validVariantThumb =
            foundWithImg?.thumbnailUrl && !foundWithImg.thumbnailUrl.includes("apple.com")
              ? foundWithImg.thumbnailUrl
              : null;

          const smartImg = getSmartColorImage(
            product.name,
            cName,
            validVariantThumb || product.imageUrl
          );

          return {
            id: cName.toLowerCase().replace(/\s+/g, "-"),
            variantId: foundWithImg?.id || foundAny?.id || null,
            name: cName,
            hex: getSmartColorHex(cName),
            imageUrl: smartImg || product.imageUrl,
            price: foundAny?.price || product.price,
            storage: foundAny?.storage || null,
          };
        })
      : [
          {
            id: "default",
            name: "Chính hãng",
            hex: getSmartColorHex(product.name || "titan"),
            imageUrl: getSmartColorImage(product.name, "", product.imageUrl) || product.imageUrl,
            price: product.price,
          },
        ];

  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [imgError, setImgError] = useState(false);
  const [isHoveredColor, setIsHoveredColor] = useState(null);

  // Đồng bộ lại selectedColor khi danh sách biến thể cập nhật từ API
  useEffect(() => {
    if (colorOptions.length > 0) {
      setSelectedColor((prev) => {
        if (!prev) return colorOptions[0];
        const match = colorOptions.find((c) => c.id === prev.id);
        return match || colorOptions[0];
      });
    }
  }, [realVariants]);

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

  const formatPrice = (val) => {
    const num = normalizePrice(val);
    if (!num) return "[GIÁ]";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  // Lấy ảnh tương ứng màu đang chọn hoặc màu đang hover (Ưu tiên ảnh màu -> fallback ảnh database -> fallback ảnh hãng)
  const activeColorItem = isHoveredColor || selectedColor || colorOptions[0];
  const currentImageUrl =
    activeColorItem?.imageUrl ||
    product.imageUrl ||
    getSmartColorImage(product.name, activeColorItem?.name, product.imageUrl);
  const currentPrice = selectedColor?.price || product.price;

  useEffect(() => {
    setImgError(false);
  }, [currentImageUrl]);

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        ...product,
        phoneId: product.id,
        variantId: selectedColor?.variantId || null,
        price: normalizePrice(currentPrice),
        color: selectedColor?.name || "Tiêu chuẩn",
        storage: selectedColor?.storage || product.storage || "256 GB",
        imageUrl: currentImageUrl || product.imageUrl,
      });
    }
  };

  // Trích xuất thông tin Specs tag
  const screenDisplay = product.screenSize || "6.3 inch";
  const storageDisplay = product.storage || selectedColor?.storage || "256 GB";
  const brandDisplay = detectSmartBrand(product.name, product.brand);

  const normCurrentPrice = normalizePrice(currentPrice);
  const oldPrice = product.originalPrice
    ? normalizePrice(product.originalPrice)
    : normCurrentPrice > 0
    ? Math.round(normCurrentPrice * 1.08)
    : 0;

  const isBestseller =
    statusLabel?.toLowerCase().includes("bán chạy") || (product.id && product.id % 2 === 0);
  const badgeLabel = isBestseller ? "Bán chạy" : (statusLabel || "Mới về");
  const promoText =
    product.promotion || "Thu cũ đổi mới trợ giá 2 triệu • Giảm 500K mua kèm Watch";

  return (
    <article
      className="apple-product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Xem chi tiết ${product.name}`}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "28px",
        border: "1px solid #e5e7eb",
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        transition: "transform 250ms ease, box-shadow 250ms ease",
        outline: "none",
        userSelect: "none",
      }}
    >
      {/* 1. Header Badges: [Mới về / Bán chạy] & [Trả góp 0%] */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "10px",
            backgroundColor: isBestseller ? "#fff7ed" : "#fff7ed",
            color: isBestseller ? "#c2410c" : "#ea580c",
          }}
        >
          {badgeLabel}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "10px",
            backgroundColor: "#f0f7ff",
            color: "#0071e3",
          }}
        >
          Trả góp 0%
        </span>
      </div>

      {/* 2. Phần ảnh sản phẩm thực tế: Hộp bo góc nền xám nhạt #f3f4f6 */}
      <div
        className="product-card-image-box"
        style={{
          width: "100%",
          height: "190px",
          borderRadius: "20px",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginBottom: "12px",
          overflow: "hidden",
        }}
      >
        {currentImageUrl && !imgError ? (
          <img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={`${product.name} - ${activeColorItem?.name || ""}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const currentSrc = e.currentTarget.src;
              // 1. Thử fallback về product.imageUrl từ database nếu khác với ảnh đang thử
              if (product.imageUrl && currentSrc !== product.imageUrl) {
                e.currentTarget.src = product.imageUrl;
                return;
              }
              // 2. Thử fallback về ảnh studio mặc định của dòng máy
              const fallback = getSmartColorImage(product.name, "", null);
              if (fallback && currentSrc !== fallback) {
                e.currentTarget.src = fallback;
                return;
              }
              // 3. Nếu mọi nguồn đều không tải được
              setImgError(true);
            }}
            style={{
              maxHeight: "170px",
              maxWidth: "88%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              objectPosition: "center",
              mixBlendMode: "multiply",
              display: "block",
              margin: "0 auto",
              transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease",
            }}
          />
        ) : (
          <div
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Chưa có ảnh
          </div>
        )}
      </div>

      {/* 3. Hàng chấm tròn chọn màu thực tế - Bấm đổi ngay ảnh */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "12px",
          gap: "4px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="product-card-swatches"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            minHeight: "20px",
          }}
        >
          {colorOptions.map((c) => {
            const isSelected = selectedColor?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                className={`product-color-dot ${isSelected ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c);
                  setImgError(false);
                }}
                onMouseEnter={() => setIsHoveredColor(c)}
                onMouseLeave={() => setIsHoveredColor(null)}
                aria-label={`Chọn màu ${c.name}`}
                title={c.name}
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: c.hex,
                  border: c.hex === "#f8fafc" || c.hex === "#f5f5f7" ? "1px solid #d1d5db" : "none",
                  padding: 0,
                  cursor: "pointer",
                  outline: isSelected ? "2.5px solid #0071e3" : "none",
                  outlineOffset: "2px",
                  transform: isSelected ? "scale(1.25)" : "scale(1)",
                  transition: "transform 180ms ease, outline 180ms ease",
                }}
              />
            );
          })}
        </div>

        {/* Nhãn tên màu đang xem */}
        {activeColorItem?.name && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "#6b7280",
              height: "16px",
              lineHeight: "16px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "180px",
              textAlign: "center",
            }}
          >
            {activeColorItem.name}
          </span>
        )}
      </div>

      {/* 4. Tên sản phẩm */}
      <h3
        className="product-card-title"
        style={{
          fontSize: "17px",
          fontWeight: 700,
          lineHeight: 1.3,
          color: "#1d1d1f",
          margin: "0 0 6px 0",
          letterSpacing: "-0.01em",
        }}
      >
        {product.name}
      </h3>

      {/* 5. Hàng giá bán & Giá gốc gạch ngang */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            fontSize: "19px",
            fontWeight: 800,
            color: "#1d1d1f",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatPrice(currentPrice)}
        </span>
        {oldPrice > normCurrentPrice && (
          <span
            style={{
              fontSize: "13px",
              color: "#9ca3af",
              textDecoration: "line-through",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatPrice(oldPrice)}
          </span>
        )}
      </div>

      {/* 6. Hàng Specs pills: [6.3 inch] [256 GB] [Hãng chuẩn] */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        {screenDisplay && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#4b5563",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "2px 7px",
            }}
          >
            {screenDisplay}
          </span>
        )}
        {storageDisplay && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#4b5563",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "2px 7px",
            }}
          >
            {storageDisplay}
          </span>
        )}
        {brandDisplay && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#4b5563",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "2px 7px",
            }}
          >
            {brandDisplay}
          </span>
        )}
      </div>

      {/* 7. Khung ưu đãi nét đứt viền xanh nhạt */}
      <div
        style={{
          border: "1px dashed #93c5fd",
          backgroundColor: "#f0f7ff",
          borderRadius: "10px",
          padding: "8px 12px",
          fontSize: "12px",
          color: "#1e40af",
          lineHeight: 1.4,
          marginBottom: "14px",
        }}
      >
        {promoText}
      </div>

      {/* 8. Hàng tiện ích dưới cùng: ⚡ Giao 2 Giờ • ⭐ 5.0 • [ 🛍️ Thêm ] */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "2px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              color: "#0284c7",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <span style={{ color: "#f97316" }}>⚡</span> Giao 2 Giờ
          </span>
          <span
            style={{
              color: "#4b5563",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <span style={{ color: "#eab308" }}>⭐</span> 5.0
          </span>
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          style={{
            backgroundColor: "#0071e3",
            color: "#ffffff",
            border: "none",
            borderRadius: "9999px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "background-color 150ms ease, transform 150ms ease",
          }}
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
        >
          <ShoppingBag size={14} aria-hidden="true" />
          <span>Thêm</span>
        </button>
      </div>
    </article>
  );
}
