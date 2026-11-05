import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  AlertCircle,
  Loader2,
  Smartphone,
  Tv,
  Cpu,
  Camera,
  BatteryCharging,
  Layers,
  Upload,
  Trash2,
  RefreshCw,
  Link as LinkIcon
} from "lucide-react";

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  brands,
  categories,
}) {
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'screen' | 'performance' | 'camera' | 'other'

  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
    categoryId: "",
    price: "",
    quantity: "",
    imageUrl: "",
    description: "",

    // Màn hình
    screenSize: "",
    screenTech: "",
    screenResolution: "",

    // Cấu hình & Bộ nhớ
    cpu: "",
    gpu: "",
    os: "",
    ram: "",
    storage: "",

    // Camera
    rearCamera: "",
    frontCamera: "",

    // Pin & Sạc & Khác
    battery: "",
    charging: "",
    sim: "",
    network: "",
    waterproof: "",
    weight: "",
    origin: "",
    warrantyPeriod: "12 tháng chính hãng",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // File upload state for image
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Tự động tối ưu và nén kích thước ảnh (tối đa 800px, JPEG 0.8) để Base64 chỉ còn ~30-70KB
        const maxDim = 800;
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
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        handleChange("imageUrl", compressed);
      };
      img.onerror = () => {
        handleChange("imageUrl", event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Trợ lý định dạng giá tiền VNĐ
  const getNumericPrice = (p) => {
    if (p === "" || p === undefined || p === null) return 0;
    if (typeof p === "number") {
      if (p > 0 && p < 1000) return Math.round(p * 1000000);
      return Math.round(p);
    }
    let str = String(p).trim();
    if (str.includes(".") && str.indexOf(".") !== str.lastIndexOf(".")) {
      str = str.replace(/\./g, "");
    } else if (str.includes(".") && /^\d+\.\d{3}$/.test(str)) {
      str = str.replace(".", "");
    }
    const cleanStr = str.replace(/[^\d]/g, "");
    let num = Number(cleanStr);
    if (isNaN(num)) return 0;
    if (num > 0 && num < 1000) {
      num = Math.round(num * 1000000);
    }
    return Math.round(num);
  };

  const formatDisplayPrice = (val) => {
    if (val === "" || val === undefined || val === null) return "";
    let num = Number(val);
    if (isNaN(num)) return "";
    // Nếu giá nhỏ hơn 1000 (ví dụ 38.699 do nhập nhầm dấu chấm thập phân), tự động quy đổi về hàng triệu
    if (num > 0 && num < 1000) {
      num = Math.round(num * 1000000);
    }
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const handlePriceChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/[^\d]/g, "");
    if (!digitsOnly) {
      handleChange("price", "");
      return;
    }
    const formatted = new Intl.NumberFormat("vi-VN").format(Number(digitsOnly));
    handleChange("price", formatted);
  };

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        brandId: editingProduct.brand?.id || (brands.length > 0 ? brands[0].id : ""),
        categoryId: editingProduct.category?.id || (categories.length > 0 ? categories[0].id : ""),
        price:
          editingProduct.price !== undefined && editingProduct.price !== null
            ? formatDisplayPrice(editingProduct.price)
            : "",
        quantity: editingProduct.quantity !== undefined ? editingProduct.quantity : "",
        imageUrl: editingProduct.imageUrl || "",
        description: editingProduct.description || "",

        screenSize: editingProduct.screenSize || "",
        screenTech: editingProduct.screenTech || "",
        screenResolution: editingProduct.screenResolution || "",

        cpu: editingProduct.cpu || "",
        gpu: editingProduct.gpu || "",
        os: editingProduct.os || "",
        ram: editingProduct.ram || "",
        storage: editingProduct.storage || "",

        rearCamera: editingProduct.rearCamera || "",
        frontCamera: editingProduct.frontCamera || "",

        battery: editingProduct.battery || "",
        charging: editingProduct.charging || "",
        sim: editingProduct.sim || "",
        network: editingProduct.network || "",
        waterproof: editingProduct.waterproof || "",
        weight: editingProduct.weight || "",
        origin: editingProduct.origin || "",
        warrantyPeriod: editingProduct.warrantyPeriod || "12 tháng chính hãng",
      });
    } else {
      setFormData({
        name: "",
        brandId: brands.length > 0 ? brands[0].id : "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        price: "",
        quantity: "",
        imageUrl: "",
        description: "",

        screenSize: "6.7 inch",
        screenTech: "OLED, 120Hz",
        screenResolution: "FHD+ (2400 x 1080 Pixels)",

        cpu: "",
        gpu: "",
        os: "Android 14",
        ram: "8 GB",
        storage: "256 GB",

        rearCamera: "Chính 50 MP & Phụ 12 MP",
        frontCamera: "12 MP",

        battery: "5000 mAh",
        charging: "Sạc nhanh 45W",
        sim: "2 Nano SIM hoặc 1 eSIM",
        network: "5G",
        waterproof: "IP68",
        weight: "195 g",
        origin: "Năm 2024",
        warrantyPeriod: "12 tháng chính hãng",
      });
    }
    setErrors({});
    setActiveTab("general");
  }, [editingProduct, brands, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
      setActiveTab("general");
    }
    const numPrice = getNumericPrice(formData.price);
    if (!formData.price || numPrice <= 0) {
      newErrors.price = "Giá sản phẩm phải lớn hơn 0 VNĐ";
      setActiveTab("general");
    }
    if (formData.quantity === "" || Number(formData.quantity) < 0) {
      newErrors.quantity = "Số lượng tồn kho phải lớn hơn hoặc bằng 0";
      setActiveTab("general");
    }
    if (!formData.brandId) {
      newErrors.brandId = "Vui lòng chọn thương hiệu";
      setActiveTab("general");
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
      setActiveTab("general");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        brandId: Number(formData.brandId),
        categoryId: Number(formData.categoryId),
        price: getNumericPrice(formData.price),
        quantity: Number(formData.quantity),
      });
      onClose();
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || err.message || "Lỗi khi lưu sản phẩm";
      setErrors((prev) => ({ ...prev, server: serverMessage }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {editingProduct
                ? `Chỉnh sửa thông số điện thoại: ${editingProduct.name}`
                : "Thêm điện thoại mới với thông số chi tiết"}
            </h3>
            <p className="text-sm text-muted">
              Điền đầy đủ các thông số phần cứng, camera, màn hình và pin của máy
            </p>
          </div>
          <button onClick={onClose} className="btn-icon close-btn">
            <X size={20} />
          </button>
        </div>

        {errors.server && (
          <div className="alert alert-error mx-6 mt-4">
            <AlertCircle size={18} />
            <span>{errors.server}</span>
          </div>
        )}

        {/* Tab chuyển đổi các nhóm thuộc tính */}
        <div className="sub-tabs px-6 pt-3 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
          >
            <Smartphone size={16} /> 1. Cơ bản & Giá
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("screen")}
            className={`tab-btn ${activeTab === "screen" ? "active" : ""}`}
          >
            <Tv size={16} /> 2. Màn hình
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("performance")}
            className={`tab-btn ${activeTab === "performance" ? "active" : ""}`}
          >
            <Cpu size={16} /> 3. Vi xử lý & RAM
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className={`tab-btn ${activeTab === "camera" ? "active" : ""}`}
          >
            <Camera size={16} /> 4. Camera
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("other")}
            className={`tab-btn ${activeTab === "other" ? "active" : ""}`}
          >
            <BatteryCharging size={16} /> 5. Pin & Tiện ích
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form p-6">
          {/* TAB 1: THÔNG TIN CƠ BẢN */}
          {activeTab === "general" && (
            <div className="tab-pane-content space-y-4">
              <div className="form-group">
                <label className="form-label">
                  Tên dòng điện thoại <span className="req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: iPhone 16 Pro Max 256GB"
                  className={`form-input ${errors.name ? "input-error" : ""}`}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={submitting}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Hãng sản xuất <span className="req">*</span>
                  </label>
                  <select
                    className={`form-input ${errors.brandId ? "input-error" : ""}`}
                    value={formData.brandId}
                    onChange={(e) => handleChange("brandId", e.target.value)}
                    disabled={submitting}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {errors.brandId && <span className="error-text">{errors.brandId}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phân loại danh mục <span className="req">*</span>
                  </label>
                  <select
                    className={`form-input ${errors.categoryId ? "input-error" : ""}`}
                    value={formData.categoryId}
                    onChange={(e) => handleChange("categoryId", e.target.value)}
                    disabled={submitting}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Giá niêm yết (VNĐ) <span className="req">*</span>
                    </label>
                    {getNumericPrice(formData.price) > 0 && (
                      <span style={{ fontSize: "12px", color: "#0071e3", fontWeight: 700 }}>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                          getNumericPrice(formData.price)
                        )}
                      </span>
                    )}
                  </div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="VD: 38.699.000"
                      className={`form-input ${errors.price ? "input-error" : ""}`}
                      style={{ paddingRight: "52px", fontWeight: 600, color: "#1d1d1f" }}
                      value={formData.price}
                      onChange={handlePriceChange}
                      disabled={submitting}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "12px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#0071e3",
                        backgroundColor: "#eff6ff",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        pointerEvents: "none"
                      }}
                    >
                      VNĐ
                    </span>
                  </div>
                  {errors.price ? (
                    <span className="error-text">{errors.price}</span>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#86868b", marginTop: "4px", display: "block" }}>
                      Tự động định dạng dấu chấm phân cách hàng nghìn (VD: 38.699.000 VNĐ)
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Số lượng tồn kho <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 25"
                    className={`form-input ${errors.quantity ? "input-error" : ""}`}
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    disabled={submitting}
                  />
                  {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Ảnh đại diện sản phẩm
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0066cc",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0
                    }}
                  >
                    <LinkIcon style={{ width: 13, height: 13 }} />
                    {showUrlInput ? "Chọn tệp từ máy tính" : "Dán link URL nếu cần"}
                  </button>
                </div>

                {showUrlInput ? (
                  <div>
                    <input
                      type="text"
                      placeholder="https://cdn.tgdd.vn/products/iphone-16-pro-max.png"
                      className="form-input"
                      value={formData.imageUrl}
                      onChange={(e) => handleChange("imageUrl", e.target.value)}
                      disabled={submitting}
                    />
                    <span style={{ fontSize: "11px", color: "#86868b", marginTop: "4px", display: "block" }}>
                      Dán đường link ảnh trực tiếp từ internet nếu không muốn tải tệp từ máy tính.
                    </span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileSelect}
                      disabled={submitting}
                    />

                    {formData.imageUrl ? (
                      <div
                        style={{
                          border: "1px solid #e5e5e7",
                          borderRadius: "16px",
                          padding: "12px 16px",
                          backgroundColor: "#fbfbfd",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px"
                        }}
                      >
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "12px",
                            border: "1px solid #e5e5e7",
                            backgroundColor: "#ffffff",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            padding: "4px"
                          }}
                        >
                          <img
                            src={formData.imageUrl}
                            alt="Ảnh sản phẩm"
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/120x120?text=L%E1%BB%97i+%E1%BA%A3nh";
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                fontSize: "11px",
                                fontWeight: 600,
                                backgroundColor: "#ecfdf5",
                                color: "#059669",
                                border: "1px solid #a7f3d0"
                              }}
                            >
                              ✓ Đã có ảnh sản phẩm
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginBottom: "10px"
                            }}
                          >
                            {formData.imageUrl.startsWith("data:")
                              ? "Ảnh đã chọn từ tệp máy tính (Định dạng Base64 tối ưu hóa)"
                              : formData.imageUrl}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: 500,
                                backgroundColor: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                color: "#374151",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                              disabled={submitting}
                            >
                              <RefreshCw style={{ width: 13, height: 13 }} />
                              Đổi ảnh từ máy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChange("imageUrl", "")}
                              style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: 500,
                                backgroundColor: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: "8px",
                                color: "#dc2626",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                              disabled={submitting}
                            >
                              <Trash2 style={{ width: 13, height: 13 }} />
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: isDragging ? "2px dashed #0071e3" : "2px dashed #d1d5db",
                          borderRadius: "16px",
                          padding: "24px 16px",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: isDragging ? "rgba(0, 113, 227, 0.05)" : "#fbfbfd",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "50%",
                              backgroundColor: "#eff6ff",
                              color: "#0071e3",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "10px"
                            }}
                          >
                            <Upload style={{ width: 22, height: 22 }} />
                          </div>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1d1d1f", marginBottom: "4px" }}>
                            Nhấn để chọn ảnh từ máy tính
                          </p>
                          <p style={{ fontSize: "12px", color: "#86868b", marginBottom: "10px" }}>
                            hoặc kéo thả tệp hình ảnh vào khung này
                          </p>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 12px",
                              borderRadius: "9999px",
                              fontSize: "11px",
                              fontWeight: 500,
                              backgroundColor: "#f5f5f7",
                              color: "#6b7280"
                            }}
                          >
                            Hỗ trợ JPG, PNG, WEBP, GIF (Tự động nén tối ưu)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả tổng quan sản phẩm</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả nổi bật về thiết kế, tính năng AI, trải nghiệm cao cấp..."
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 2: MÀN HÌNH */}
          {activeTab === "screen" && (
            <div className="tab-pane-content space-y-4">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kích thước màn hình</label>
                  <input
                    type="text"
                    placeholder="VD: 6.9 inch hoặc 6.8 inch"
                    className="form-input"
                    value={formData.screenSize}
                    onChange={(e) => handleChange("screenSize", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Độ phân giải hiển thị</label>
                  <input
                    type="text"
                    placeholder="VD: 2868 x 1320 Pixels (Super Retina XDR)"
                    className="form-input"
                    value={formData.screenResolution}
                    onChange={(e) => handleChange("screenResolution", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Công nghệ màn hình & Tần số quét</label>
                <input
                  type="text"
                  placeholder="VD: Dynamic AMOLED 2X, 120Hz, độ sáng tối đa 2600 nits, kính Corning Gorilla Armor"
                  className="form-input"
                  value={formData.screenTech}
                  onChange={(e) => handleChange("screenTech", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: HIỆU NĂNG & BỘ NHỚ */}
          {activeTab === "performance" && (
            <div className="tab-pane-content space-y-4">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vi xử lý / Chipset (CPU)</label>
                  <input
                    type="text"
                    placeholder="VD: Apple A18 Pro 6 nhân hoặc Snapdragon 8 Gen 3"
                    className="form-input"
                    value={formData.cpu}
                    onChange={(e) => handleChange("cpu", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chip đồ họa (GPU)</label>
                  <input
                    type="text"
                    placeholder="VD: Apple GPU 6 nhân hoặc Adreno 750"
                    className="form-input"
                    value={formData.gpu}
                    onChange={(e) => handleChange("gpu", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hệ điều hành</label>
                  <input
                    type="text"
                    placeholder="VD: iOS 18 hoặc Android 14 (One UI 6.1)"
                    className="form-input"
                    value={formData.os}
                    onChange={(e) => handleChange("os", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dung lượng RAM</label>
                  <input
                    type="text"
                    placeholder="VD: 8 GB, 12 GB hoặc 16 GB"
                    className="form-input"
                    value={formData.ram}
                    onChange={(e) => handleChange("ram", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bộ nhớ trong (ROM)</label>
                <input
                  type="text"
                  placeholder="VD: 256 GB, 512 GB hoặc 1 TB"
                  className="form-input"
                  value={formData.storage}
                  onChange={(e) => handleChange("storage", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 4: CAMERA */}
          {activeTab === "camera" && (
            <div className="tab-pane-content space-y-4">
              <div className="form-group">
                <label className="form-label">Cụm Camera sau (Thông số & Tính năng)</label>
                <textarea
                  rows="3"
                  placeholder="VD: Chính 48 MP & Phụ 48 MP, 12 MP (Zoom quang học 5x, Chống rung cảm biến OIS, Quay 4K 120fps)"
                  className="form-input"
                  value={formData.rearCamera}
                  onChange={(e) => handleChange("rearCamera", e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Camera trước (Selfie)</label>
                <input
                  type="text"
                  placeholder="VD: 12 MP TrueDepth, HDR, Tự động lấy nét, Quay 4K 60fps"
                  className="form-input"
                  value={formData.frontCamera}
                  onChange={(e) => handleChange("frontCamera", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 5: PIN & KẾT NỐI */}
          {activeTab === "other" && (
            <div className="tab-pane-content space-y-4">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Dung lượng Pin</label>
                  <input
                    type="text"
                    placeholder="VD: 4685 mAh hoặc 5000 mAh Li-Ion"
                    className="form-input"
                    value={formData.battery}
                    onChange={(e) => handleChange("battery", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Công nghệ sạc</label>
                  <input
                    type="text"
                    placeholder="VD: Sạc nhanh 45W có dây, MagSafe 25W"
                    className="form-input"
                    value={formData.charging}
                    onChange={(e) => handleChange("charging", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hỗ trợ SIM</label>
                  <input
                    type="text"
                    placeholder="VD: 1 Nano SIM & 1 eSIM hoặc 2 eSIM"
                    className="form-input"
                    value={formData.sim}
                    onChange={(e) => handleChange("sim", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chuẩn kết nối mạng</label>
                  <input
                    type="text"
                    placeholder="VD: 5G, Wi-Fi 7, Bluetooth 5.4, NFC"
                    className="form-input"
                    value={formData.network}
                    onChange={(e) => handleChange("network", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kháng nước & Kháng bụi</label>
                  <input
                    type="text"
                    placeholder="VD: IP68 (Độ sâu 6m trong 30 phút)"
                    className="form-input"
                    value={formData.waterproof}
                    onChange={(e) => handleChange("waterproof", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Trọng lượng & Chất liệu</label>
                  <input
                    type="text"
                    placeholder="VD: 227 g, Khung viền Titan Grade 5"
                    className="form-input"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Năm ra mắt / Xuất xứ</label>
                  <input
                    type="text"
                    placeholder="VD: Năm 2024 / Mỹ"
                    className="form-input"
                    value={formData.origin}
                    onChange={(e) => handleChange("origin", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thời hạn bảo hành</label>
                  <input
                    type="text"
                    placeholder="VD: 12 tháng chính hãng"
                    className="form-input"
                    value={formData.warrantyPeriod}
                    onChange={(e) => handleChange("warrantyPeriod", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions mt-6 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="spinner-icon" size={16} /> Đang lưu...
                </>
              ) : (
                <>
                  <Save size={16} /> {editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
