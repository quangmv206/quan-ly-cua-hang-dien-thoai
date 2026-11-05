import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Tag,
  CheckSquare,
  Square,
  RotateCcw,
  ArrowLeft,
  ListFilter,
  Upload,
  RefreshCw,
  Link as LinkIcon,
  Palette,
  Save
} from "lucide-react";
import { phoneApi } from "../services/phoneApi";

export default function VariantModal({ isOpen, onClose, phone, onVariantsUpdated }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  // VIEW MODE: 'list' (Mặc định) | 'matrix' (Tạo hàng loạt) | 'form' (Thêm hoặc Sửa 1 cái)
  const [viewMode, setViewMode] = useState("list");

  // Thông báo toast / alert
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --- STATE DÀNH CHO FORM SỬA / THÊM LẺ (viewMode === 'form') ---
  const [editingVariant, setEditingVariant] = useState(null);
  const [singleForm, setSingleForm] = useState({
    sku: "",
    color: "",
    storage: "128GB",
    ram: "8GB",
    price: "",
    stockQuantity: "10",
    thumbnailUrl: "",
    status: "ACTIVE",
  });
  const [singleSaving, setSingleSaving] = useState(false);

  // --- STATE DÀNH CHO MA TRẬN HÀNG LOẠT (viewMode === 'matrix') ---
  const [colorsInput, setColorsInput] = useState("Titan Sa Mạc, Titan Tự Nhiên, Đen Titan, Trắng Titan");
  const [selectedStorages, setSelectedStorages] = useState(["128GB", "256GB", "512GB"]);
  const [selectedRam, setSelectedRam] = useState("8GB");
  const [basePrice, setBasePrice] = useState("");
  const [priceStep, setPriceStep] = useState(3000000); // Mỗi bậc dung lượng tăng 3 triệu
  const [defaultStock, setDefaultStock] = useState(15);
  const [generatedMatrix, setGeneratedMatrix] = useState([]);
  const [matrixSaving, setMatrixSaving] = useState(false);

  const quickColorSuggestions = [
    "Titan Sa Mạc",
    "Titan Tự Nhiên",
    "Đen Titan",
    "Trắng Titan",
    "Xanh Dương",
    "Xanh Lá Cây",
    "Vàng Ánh Kim",
    "Bạc",
    "Tím",
    "Hồng",
  ];

  const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];
  const ramOptions = ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"];

  // --- QUẢN LÝ ẢNH THEO MÀU SẮC (COLOR GALLERY) ---
  const [colorImages, setColorImages] = useState({});
  const [colorSavingState, setColorSavingState] = useState({});
  const [allColorsSaving, setAllColorsSaving] = useState(false);

  const getColorHex = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("burgundy") || n.includes("rượu") || n.includes("đỏ đô")) return "#632832";
    if (n.includes("sa mạc") || n.includes("desert")) return "#c4b59d";
    if (n.includes("tự nhiên") || n.includes("natural")) return "#9a9790";
    if (n.includes("đen") || n.includes("black") || n.includes("midnight")) return "#2e2e30";
    if (n.includes("trắng") || n.includes("white") || n.includes("starlight") || n.includes("sứ")) return "#f5f5f7";
    if (n.includes("xanh dương") || n.includes("biển") || n.includes("blue") || n.includes("sapphire")) return "#394a59";
    if (n.includes("xanh lá") || n.includes("green") || n.includes("lục")) return "#415b49";
    if (n.includes("vàng") || n.includes("gold") || n.includes("yellow")) return "#eedcb3";
    if (n.includes("tím") || n.includes("purple") || n.includes("violet") || n.includes("mận")) return "#58536a";
    if (n.includes("hồng") || n.includes("pink")) return "#dfabb5";
    if (n.includes("bạc") || n.includes("silver") || n.includes("xám") || n.includes("gray")) return "#787679";
    return "#86868b";
  };

  const uniqueColors = Array.from(
    new Set(variants.map((v) => (v.color || "").trim()).filter(Boolean))
  );

  // Tải danh sách biến thể của sản phẩm từ Backend
  const fetchVariants = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await phoneApi.getVariants(phone.id);
      const list = res.data || [];
      setVariants(list);

      // Đồng bộ bản đồ ảnh theo từng màu nếu đã có
      const imgMap = {};
      list.forEach((v) => {
        if (v.color && v.thumbnailUrl && !imgMap[v.color]) {
          imgMap[v.color] = v.thumbnailUrl;
        }
      });
      setColorImages((prev) => ({ ...imgMap, ...prev }));
    } catch (err) {
      console.error("Lỗi tải biến thể:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadColorImage = (colorName, file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
        setColorImages((prev) => ({ ...prev, [colorName]: compressed }));
      };
      img.onerror = () => {
        setColorImages((prev) => ({ ...prev, [colorName]: event.target.result }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveColorImage = (colorName) => {
    setColorImages((prev) => {
      const updated = { ...prev };
      delete updated[colorName];
      return updated;
    });
  };

  // Đồng bộ ảnh của 1 màu cho toàn bộ biến thể có màu đó
  const handleApplyColorImage = async (colorName) => {
    const imageUrl = colorImages[colorName] || "";
    const variantsToUpdate = variants.filter(
      (v) => (v.color || "").trim().toLowerCase() === colorName.trim().toLowerCase()
    );
    if (variantsToUpdate.length === 0) return;

    setColorSavingState((prev) => ({ ...prev, [colorName]: "saving" }));
    try {
      await Promise.all(
        variantsToUpdate.map((v) =>
          phoneApi.updateVariant(v.id, {
            ...v,
            thumbnailUrl: imageUrl,
          })
        )
      );
      setColorSavingState((prev) => ({ ...prev, [colorName]: "saved" }));
      setSuccessMessage(
        `Đã gán và đồng bộ ảnh màu "${colorName}" cho tất cả ${variantsToUpdate.length} phiên bản bộ nhớ!`
      );
      await fetchVariants();
      if (onVariantsUpdated) onVariantsUpdated();
      setTimeout(() => {
        setColorSavingState((prev) => ({ ...prev, [colorName]: "idle" }));
      }, 3000);
    } catch (err) {
      alert("Lỗi khi đồng bộ ảnh màu: " + (err.response?.data?.message || err.message));
      setColorSavingState((prev) => ({ ...prev, [colorName]: "idle" }));
    }
  };

  // Lưu và áp dụng ảnh cho toàn bộ các màu
  const handleApplyAllColors = async () => {
    setAllColorsSaving(true);
    try {
      for (const [colorName, imgUrl] of Object.entries(colorImages)) {
        if (!imgUrl) continue;
        const matching = variants.filter(
          (v) => (v.color || "").trim().toLowerCase() === colorName.trim().toLowerCase()
        );
        for (const v of matching) {
          if (v.thumbnailUrl !== imgUrl) {
            await phoneApi.updateVariant(v.id, { ...v, thumbnailUrl: imgUrl });
          }
        }
      }
      setSuccessMessage("Đã lưu và đồng bộ thành công ảnh cho toàn bộ các nhóm màu!");
      await fetchVariants();
      if (onVariantsUpdated) onVariantsUpdated();
    } catch (err) {
      alert("Lỗi khi lưu ảnh các màu: " + (err.response?.data?.message || err.message));
    } finally {
      setAllColorsSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen && phone) {
      fetchVariants();
      setViewMode("list"); // Luôn luôn mở vào màn hình danh sách đầu tiên
      setBasePrice(phone.price || 30000000);
      setGeneratedMatrix([]);
      setSuccessMessage("");
      setErrorMessage("");
      resetSingleForm();
    }
  }, [isOpen, phone]);

  const getNumericPrice = (p) => {
    if (p === "" || p === undefined || p === null) return 0;
    const cleanStr = String(p).replace(/[^\d]/g, "");
    const num = Number(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const formatDisplayPrice = (val) => {
    if (val === "" || val === undefined || val === null) return "";
    let num = Number(val);
    if (isNaN(num)) return "";
    if (num > 0 && num < 1000) {
      num = Math.round(num * 1000000);
    }
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const resetSingleForm = () => {
    setEditingVariant(null);
    setSingleForm({
      sku: "",
      color: "",
      storage: "128GB",
      ram: phone?.ram || "8GB",
      price: phone && phone.price ? formatDisplayPrice(phone.price) : "",
      stockQuantity: "10",
      thumbnailUrl: "",
      status: "ACTIVE",
    });
  };

  // Image file upload state for single variant
  const variantFileInputRef = useRef(null);
  const [variantIsDragging, setVariantIsDragging] = useState(false);
  const [variantShowUrlInput, setVariantShowUrlInput] = useState(false);

  const processVariantImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
        setSingleForm((prev) => ({ ...prev, thumbnailUrl: compressed }));
      };
      img.onerror = () => {
        setSingleForm((prev) => ({ ...prev, thumbnailUrl: event.target.result }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleVariantFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processVariantImageFile(file);
    }
    e.target.value = "";
  };

  const handleVariantDrop = (e) => {
    e.preventDefault();
    setVariantIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processVariantImageFile(file);
    }
  };

  // 1. Mở form Sửa: Chọn trực tiếp biến thể từ danh sách
  const handleOpenEditFromList = (variant) => {
    setEditingVariant(variant);
    setSingleForm({
      sku: variant.sku || "",
      color: variant.color || "",
      storage: variant.storage || "128GB",
      ram: variant.ram || "8GB",
      price: variant.price !== undefined && variant.price !== null ? formatDisplayPrice(variant.price) : "",
      stockQuantity: variant.stockQuantity !== undefined ? variant.stockQuantity : "10",
      thumbnailUrl: variant.thumbnailUrl || "",
      status: variant.status || "ACTIVE",
    });
    setErrorMessage("");
    setViewMode("form"); // Chuyển sang màn hình form sửa
  };

  // 2. Mở form Thêm mới 1 biến thể lẻ
  const handleOpenAddSingle = () => {
    resetSingleForm();
    setErrorMessage("");
    setViewMode("form");
  };

  // 3. Mở màn hình Tạo ma trận hàng loạt
  const handleOpenMatrix = () => {
    setGeneratedMatrix([]);
    setErrorMessage("");
    setBasePrice(phone.price || 30000000);
    setViewMode("matrix");
  };

  // Lưu biến thể lẻ (Thêm hoặc Sửa)
  const handleSaveSingle = async (e) => {
    e.preventDefault();
    if (!singleForm.color.trim()) {
      setErrorMessage("Vui lòng nhập màu sắc sản phẩm");
      return;
    }
    const numPrice = getNumericPrice(singleForm.price);
    if (!singleForm.price || numPrice <= 0) {
      setErrorMessage("Giá biến thể phải lớn hơn 0 VNĐ");
      return;
    }

    setSingleSaving(true);
    setErrorMessage("");
    try {
      const payload = {
        sku:
          singleForm.sku.trim() ||
          `${phone.name?.substring(0, 3).toUpperCase()}-${singleForm.color.toUpperCase()}-${singleForm.storage}`,
        color: singleForm.color.trim(),
        storage: singleForm.storage.trim(),
        ram: singleForm.ram.trim(),
        price: numPrice,
        stockQuantity: Number(singleForm.stockQuantity || 0),
        thumbnailUrl: singleForm.thumbnailUrl.trim(),
        status: singleForm.status || "ACTIVE",
      };

      if (editingVariant) {
        await phoneApi.updateVariant(editingVariant.id, payload);
        setSuccessMessage(`Đã cập nhật biến thể "${payload.color} - ${payload.storage}" thành công!`);
      } else {
        await phoneApi.addVariant(phone.id, payload);
        setSuccessMessage(`Đã thêm mới biến thể "${payload.color} - ${payload.storage}" thành công!`);
      }

      await fetchVariants();
      setViewMode("list"); // Lưu xong lập tức quay về Danh sách để xem
      if (onVariantsUpdated) onVariantsUpdated();
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setErrorMessage(
          "Phiên đăng nhập Admin đã hết hạn hoặc token không hợp lệ (Lỗi 403). Vui lòng Đăng xuất và Đăng nhập lại tài khoản admin / admin123."
        );
      } else {
        setErrorMessage(err.response?.data?.message || err.message || "Lỗi khi lưu biến thể");
      }
    } finally {
      setSingleSaving(false);
    }
  };

  // Xóa biến thể khỏi danh sách
  const handleDeleteVariant = async (v) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa biến thể "${v.color} - ${v.storage}" khỏi sản phẩm?`)) {
      return;
    }
    try {
      await phoneApi.deleteVariant(v.id);
      setSuccessMessage(`Đã xóa biến thể "${v.color} - ${v.storage}"`);
      await fetchVariants();
      if (onVariantsUpdated) onVariantsUpdated();
    } catch (err) {
      alert("Lỗi khi xóa biến thể: " + (err.response?.data?.message || err.message));
    }
  };

  // --- LOGIC MA TRẬN HÀNG LOẠT ---
  const handleToggleStorage = (st) => {
    if (selectedStorages.includes(st)) {
      if (selectedStorages.length > 1) {
        setSelectedStorages(selectedStorages.filter((s) => s !== st));
      }
    } else {
      setSelectedStorages([...selectedStorages, st]);
    }
  };

  const handleAddColorChip = (c) => {
    const list = colorsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (!list.includes(c)) {
      list.push(c);
      setColorsInput(list.join(", "));
    }
  };

  const handleGenerateMatrix = () => {
    const colors = colorsInput
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (colors.length === 0) {
      setErrorMessage("Vui lòng nhập ít nhất 1 màu sắc");
      return;
    }
    if (selectedStorages.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất 1 mức dung lượng bộ nhớ");
      return;
    }

    setErrorMessage("");

    const sortedStorages = [...selectedStorages].sort((a, b) => {
      const getVal = (s) => (s.includes("TB") ? parseInt(s) * 1024 : parseInt(s));
      return getVal(a) - getVal(b);
    });

    const prefix = phone.name
      ? phone.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
      : "PH";

    const rows = [];
    colors.forEach((color) => {
      sortedStorages.forEach((storage, idx) => {
        const tierPrice = Number(basePrice) + idx * Number(priceStep);
        const cleanColor = color
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase();

        rows.push({
          color: color,
          storage: storage,
          ram: selectedRam,
          sku: `${prefix}-${cleanColor.substring(0, 4)}-${storage}`,
          price: tierPrice,
          stockQuantity: Number(defaultStock),
          status: "ACTIVE",
        });
      });
    });

    setGeneratedMatrix(rows);
  };

  const handleMatrixItemChange = (index, field, value) => {
    const updated = [...generatedMatrix];
    updated[index][field] = value;
    setGeneratedMatrix(updated);
  };

  const handleRemoveMatrixRow = (index) => {
    setGeneratedMatrix(generatedMatrix.filter((_, i) => i !== index));
  };

  // Lưu toàn bộ danh sách ma trận vào Database
  const handleSaveAllMatrix = async () => {
    if (generatedMatrix.length === 0) return;

    setMatrixSaving(true);
    setErrorMessage("");

    try {
      const count = generatedMatrix.length;
      await phoneApi.addVariantsBatch(phone.id, generatedMatrix);
      setGeneratedMatrix([]);
      await fetchVariants();
      // LƯU XONG: LẬP TỨC CHUYỂN VỀ MÀN HÌNH DANH SÁCH ĐỂ NGƯỜI DÙNG THẤY HẾT!
      setViewMode("list");
      setSuccessMessage(`🎉 Đã thêm thành công tất cả ${count} biến thể vào danh sách sản phẩm!`);
      if (onVariantsUpdated) onVariantsUpdated();
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setErrorMessage(
          "Phiên đăng nhập Admin đã hết hạn hoặc token không hợp lệ (Lỗi 403). Vui lòng Đăng xuất và Đăng nhập lại tài khoản admin / admin123."
        );
      } else {
        setErrorMessage(
          err.response?.data?.message || err.message || "Lỗi khi lưu tổ hợp biến thể"
        );
      }
    } finally {
      setMatrixSaving(false);
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

  if (!isOpen || !phone) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* HEADER CỐ ĐỊNH */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <Layers className="text-primary" size={24} />
            <div>
              <h3 className="modal-title font-bold text-lg">
                Quản lý Biến thể: {phone.name}
              </h3>
              <p className="text-xs text-muted">
                Hãng: <strong>{phone.brand?.name || "N/A"}</strong> | Giá niêm yết:{" "}
                <span className="text-primary font-bold">{formatPrice(phone.price)}</span> | Hiện có:{" "}
                <strong className="text-primary font-bold">{variants.length}</strong> biến thể (Tổng tồn kho:{" "}
                <strong className="text-success font-bold">
                  {variants.reduce((acc, v) => acc + (v.stockQuantity || 0), 0)}
                </strong>{" "}
                máy)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon close-btn">
            <X size={20} />
          </button>
        </div>

        {/* THÔNG BÁO ALERT (NẾU CÓ) */}
        {successMessage && (
          <div className="alert alert-success mx-6 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={18} />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-xs font-bold opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error mx-6 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-xs font-bold opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* THANH ĐIỀU HƯỚNG TAB CHỨC NĂNG */}
        <div style={{ display: "flex", gap: "8px", padding: "10px 24px", borderBottom: "1px solid #e5e5e7", backgroundColor: "#f8fafc" }}>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: viewMode === "list" ? "#0071e3" : "#e2e8f0",
              backgroundColor: viewMode === "list" ? "#0071e3" : "#ffffff",
              color: viewMode === "list" ? "#ffffff" : "#334155",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <ListFilter size={14} /> Danh sách biến thể ({variants.length})
          </button>

          <button
            type="button"
            onClick={() => setViewMode("color-gallery")}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: viewMode === "color-gallery" ? "#0071e3" : "#e2e8f0",
              backgroundColor: viewMode === "color-gallery" ? "#0071e3" : "#ffffff",
              color: viewMode === "color-gallery" ? "#ffffff" : "#334155",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Palette size={14} /> 🎨 Quản lý ảnh theo màu ({uniqueColors.length} màu)
          </button>

          <button
            type="button"
            onClick={handleOpenMatrix}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: viewMode === "matrix" ? "#0071e3" : "#e2e8f0",
              backgroundColor: viewMode === "matrix" ? "#0071e3" : "#ffffff",
              color: viewMode === "matrix" ? "#ffffff" : "#334155",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Sparkles size={14} /> ⚡ Tạo ma trận hàng loạt
          </button>
        </div>

        {/* NỘI DUNG CUỘN CHÍNH (SCROLLABLE BODY) */}
        <div className="modal-body-scroll">
          {/* ========================================================================= */}
          {/* 1. MÀN HÌNH CHÍNH: DANH SÁCH TẤT CẢ BIẾN THỂ (viewMode === 'list')        */}
          {/* ========================================================================= */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {/* THANH CÔNG CỤ: TẠO HÀNG LOẠT HOẶC THÊM LẺ */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-secondary">
                    Danh sách biến thể ({variants.length} phiên bản):
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("color-gallery")}
                    className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold"
                    style={{ color: "#0066cc", borderColor: "#bfdbfe", backgroundColor: "#eff6ff" }}
                  >
                    <Palette size={15} /> 🎨 Quản lý ảnh theo màu ({uniqueColors.length})
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddSingle}
                    className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold"
                  >
                    <Plus size={15} /> Thêm 1 biến thể lẻ
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMatrix}
                    className="btn btn-primary text-xs flex items-center gap-1.5 font-bold shadow-sm"
                  >
                    <Sparkles size={15} className="text-amber-300" /> ⚡ Tạo ma trận hàng loạt
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-muted">
                  <Loader2 size={26} className="spinner-icon mx-auto mb-2 text-primary" />
                  Đang tải danh sách biến thể...
                </div>
              ) : variants.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-6 space-y-3">
                  <Layers size={44} className="text-muted mx-auto opacity-40" />
                  <h4 className="font-bold text-base text-secondary">
                    Chưa có biến thể nào cho sản phẩm này
                  </h4>
                  <p className="text-xs text-muted max-w-md mx-auto">
                    Một chiếc điện thoại khi về kho thường có nhiều màu (Đen, Titan, Xanh...) và nhiều mức bộ nhớ (128GB, 256GB...). Bạn có thể tạo nhanh toàn bộ chỉ trong 1 click!
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenMatrix}
                      className="btn btn-primary text-sm py-2 px-5 font-bold flex items-center gap-2 shadow-md"
                    >
                      <Sparkles size={16} className="text-amber-300" /> ⚡ Tạo ma trận biến thể tự động ngay
                    </button>
                  </div>
                </div>
              ) : (
                /* BẢNG DANH SÁCH BIẾN THỂ VỚI NÚT SỬA TRỰC TIẾP TỪNG DÒNG */
                <div className="table-card border border-gray-200 shadow-sm max-h-[500px] overflow-y-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "45px" }}>STT</th>
                        <th style={{ width: "65px" }}>Ảnh</th>
                        <th style={{ minWidth: "140px" }}>Màu sắc</th>
                        <th style={{ minWidth: "130px" }}>Dung lượng & RAM</th>
                        <th style={{ minWidth: "160px" }}>Mã SKU</th>
                        <th style={{ minWidth: "140px" }}>Giá bán</th>
                        <th style={{ minWidth: "110px" }}>Tồn kho</th>
                        <th className="text-right" style={{ minWidth: "130px" }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v, idx) => (
                        <tr key={v.id} className="hover:bg-blue-50/30 transition">
                          <td className="text-muted font-mono">{idx + 1}</td>
                          <td>
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                backgroundColor: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                padding: "2px"
                              }}
                            >
                              {v.thumbnailUrl ? (
                                <img
                                  src={v.thumbnailUrl}
                                  alt={v.color}
                                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "50%",
                                    backgroundColor: getColorHex(v.color)
                                  }}
                                  title={`Chưa có ảnh (Màu: ${v.color})`}
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="variant-color-badge font-bold text-sm">
                              {v.color}
                            </span>
                          </td>
                          <td>
                            <span className="font-bold text-sm">{v.storage}</span>{" "}
                            {v.ram ? <span className="text-xs text-muted">/ {v.ram}</span> : ""}
                          </td>
                          <td className="font-mono text-xs font-bold text-secondary">
                            {v.sku || "N/A"}
                          </td>
                          <td className="font-bold text-primary text-sm">
                            {formatPrice(v.price)}
                          </td>
                          <td>
                            <span
                              className={`stock-pill ${
                                v.stockQuantity > 5
                                  ? "in-stock"
                                  : v.stockQuantity > 0
                                  ? "low-stock"
                                  : "out-stock"
                              }`}
                            >
                              {v.stockQuantity} máy
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="actions-group justify-end gap-1.5">
                              {/* NÚT CHỌN BIẾN THỂ TRONG DANH SÁCH ĐỂ SỬA */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditFromList(v)}
                                className="btn-action edit"
                                title="Chỉnh sửa biến thể này"
                              >
                                <Edit2 size={15} /> Sửa
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteVariant(v)}
                                className="btn-action delete"
                                title="Xóa biến thể này"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. MÀN HÌNH: QUẢN LÝ ẢNH THEO MÀU SẮC (viewMode === 'color-gallery')      */}
          {/* ========================================================================= */}
          {viewMode === "color-gallery" && (
            <div className="space-y-5">
              {/* Giới thiệu tính năng */}
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e40af", marginBottom: "3px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Palette size={16} /> Quản lý ảnh theo nhóm màu sắc (Color Gallery)
                  </h4>
                  <p style={{ fontSize: "12px", color: "#2563eb", margin: 0 }}>
                    Chọn ảnh 1 lần cho từng màu — hệ thống sẽ tự động đồng bộ ảnh đó cho tất cả các phiên bản bộ nhớ (128GB, 256GB, 512GB) của màu đó. Khách hàng bấm chọn chấm màu ngoài trang chủ sẽ đổi sang ảnh tương ứng!
                  </p>
                </div>
                {uniqueColors.length > 0 && (
                  <button
                    type="button"
                    onClick={handleApplyAllColors}
                    disabled={allColorsSaving}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      backgroundColor: "#0071e3",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                  >
                    {allColorsSaving ? <Loader2 size={14} className="spinner-icon" /> : <Save size={14} />}
                    Đồng bộ tất cả màu
                  </button>
                )}
              </div>

              {uniqueColors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", border: "2px dashed #cbd5e1", borderRadius: "16px", backgroundColor: "#f8fafc" }}>
                  <Layers size={40} className="text-muted mx-auto mb-2 opacity-50" />
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Chưa có biến thể màu sắc nào cho sản phẩm này
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px", maxWidth: "420px", marginInline: "auto" }}>
                    Bạn hãy tạo các biến thể màu trước (bằng cách tạo ma trận tự động hoặc thêm lẻ), sau đó quay lại đây để chọn ảnh cho từng màu.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenMatrix}
                    className="btn btn-primary text-xs font-bold"
                  >
                    <Sparkles size={14} /> ⚡ Tạo ma trận màu & bộ nhớ ngay
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  {uniqueColors.map((colorName) => {
                    const colorHex = getColorHex(colorName);
                    const matchingVariants = variants.filter(
                      (v) => (v.color || "").trim().toLowerCase() === colorName.trim().toLowerCase()
                    );
                    const currentImg = colorImages[colorName] || "";
                    const savingStatus = colorSavingState[colorName] || "idle";

                    return (
                      <div
                        key={colorName}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "16px",
                          backgroundColor: "#ffffff",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                        }}
                      >
                        {/* Header của thẻ màu */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: colorHex,
                                border: "2px solid #ffffff",
                                boxShadow: "0 0 0 1px #cbd5e1"
                              }}
                            />
                            <div>
                              <h5 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                                {colorName}
                              </h5>
                              <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                                {matchingVariants.length} bản: {matchingVariants.map((v) => v.storage).join(", ")}
                              </p>
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              fontWeight: 600,
                              backgroundColor: currentImg ? "#ecfdf5" : "#fff7ed",
                              color: currentImg ? "#059669" : "#c2410c",
                              border: `1px solid ${currentImg ? "#a7f3d0" : "#fed7aa"}`
                            }}
                          >
                            {currentImg ? "✓ Đã có ảnh" : "Chưa có ảnh"}
                          </span>
                        </div>

                        {/* Khung tải ảnh / Xem trước */}
                        {currentImg ? (
                          <div
                            style={{
                              border: "1px solid #e2e8f0",
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                              padding: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px"
                            }}
                          >
                            <div
                              style={{
                                width: "68px",
                                height: "68px",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
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
                                src={currentImg}
                                alt={colorName}
                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: "11px",
                                  color: "#64748b",
                                  marginBottom: "8px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {currentImg.startsWith("data:") ? "Ảnh tải từ máy (Base64)" : currentImg}
                              </p>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <label
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    color: "#334155"
                                  }}
                                >
                                  <RefreshCw size={12} /> Đổi ảnh
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadColorImage(colorName, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColorImage(colorName)}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    backgroundColor: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    color: "#dc2626",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  <Trash2 size={12} /> Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <label
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleUploadColorImage(colorName, file);
                            }}
                            style={{
                              border: "2px dashed #cbd5e1",
                              borderRadius: "12px",
                              padding: "16px 12px",
                              textAlign: "center",
                              cursor: "pointer",
                              backgroundColor: "#f8fafc",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "4px",
                              transition: "border-color 0.2s"
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "#eff6ff",
                                color: "#0071e3",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "2px"
                              }}
                            >
                              <Upload size={16} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>
                              Tải ảnh cho màu {colorName}
                            </span>
                            <span style={{ fontSize: "11px", color: "#64748b" }}>
                              Bấm chọn file từ máy hoặc kéo thả vào đây
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadColorImage(colorName, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        )}

                        {/* Nút lưu cho từng màu */}
                        <button
                          type="button"
                          onClick={() => handleApplyColorImage(colorName)}
                          disabled={savingStatus === "saving"}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            backgroundColor: savingStatus === "saved" ? "#ecfdf5" : "#0071e3",
                            color: savingStatus === "saved" ? "#059669" : "#ffffff",
                            border: savingStatus === "saved" ? "1px solid #a7f3d0" : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            marginTop: "auto"
                          }}
                        >
                          {savingStatus === "saving" ? (
                            <>
                              <Loader2 size={13} className="spinner-icon" /> Đang lưu ảnh màu...
                            </>
                          ) : savingStatus === "saved" ? (
                            <>
                              <Check size={13} /> ✓ Đã gán cho {matchingVariants.length} bản {colorName}
                            </>
                          ) : (
                            <>
                              <Save size={13} /> Áp dụng ảnh cho {matchingVariants.length} bản {colorName}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MÀN HÌNH TẠO MA TRẬN HÀNG LOẠT (viewMode === 'matrix')                  */}
          {/* ========================================================================= */}
          {viewMode === "matrix" && (
            <div className="space-y-4">
              {/* Nút quay lại danh sách */}
              <div className="flex items-center justify-between pb-2 border-b">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="btn btn-secondary text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} /> ← Quay lại danh sách biến thể ({variants.length})
                </button>
                <span className="text-xs text-muted">
                  Đang tạo tổ hợp hàng loạt cho: <strong>{phone.name}</strong>
                </span>
              </div>

              {/* BẢNG CẤU HÌNH THÔNG SỐ */}
              <div className="card p-4 border border-gray-200 bg-white space-y-4 shadow-sm">
                <div>
                  <label className="form-label font-bold text-xs flex items-center justify-between mb-1">
                    <span>1. Nhập danh sách màu sắc (Cách nhau bằng dấu phẩy)</span>
                    <span className="text-muted font-normal text-[11px]">Bấm gợi ý bên dưới để thêm nhanh</span>
                  </label>
                  <input
                    type="text"
                    className="form-input text-sm"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="VD: Titan Sa Mạc, Đen Titan, Trắng Titan, Xanh Dương..."
                  />

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {quickColorSuggestions.map((col) => (
                      <button
                        type="button"
                        key={col}
                        onClick={() => handleAddColorChip(col)}
                        className="text-[11px] py-1 px-2.5 rounded bg-gray-100 hover:bg-blue-100 hover:text-primary transition font-medium"
                      >
                        + {col}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="form-label font-bold text-xs mb-1.5 block">
                      2. Các mức bộ nhớ (Tích chọn nhiều):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {storageOptions.map((st) => {
                        const checked = selectedStorages.includes(st);
                        return (
                          <button
                            type="button"
                            key={st}
                            onClick={() => handleToggleStorage(st)}
                            className={`py-1.5 px-3 text-xs rounded border font-bold flex items-center gap-1.5 transition ${
                              checked
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-secondary border-gray-300 hover:border-primary"
                            }`}
                          >
                            {checked ? <CheckSquare size={14} /> : <Square size={14} />} {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="form-label font-bold text-xs mb-1.5 block">
                      3. Dung lượng RAM đi kèm:
                    </label>
                    <select
                      className="form-input text-sm"
                      value={selectedRam}
                      onChange={(e) => setSelectedRam(e.target.value)}
                    >
                      {ramOptions.map((r) => (
                        <option key={r} value={r}>
                          {r} RAM
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="form-label text-xs font-bold">Giá bản thấp nhất (VNĐ)</label>
                    <input
                      type="number"
                      className="form-input text-sm"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="VD: 30000000"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs font-bold">Bước tăng giá / bậc bộ nhớ</label>
                    <input
                      type="number"
                      className="form-input text-sm"
                      value={priceStep}
                      onChange={(e) => setPriceStep(e.target.value)}
                      placeholder="VD: 3000000"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs font-bold">Số lượng tồn kho mỗi bản</label>
                    <input
                      type="number"
                      className="form-input text-sm"
                      value={defaultStock}
                      onChange={(e) => setDefaultStock(e.target.value)}
                      placeholder="VD: 15"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateMatrix}
                    className="btn btn-secondary w-full py-2.5 font-bold flex items-center justify-center gap-2 text-sm hover:border-primary"
                  >
                    <Sparkles size={16} className="text-amber-500" /> ⚡ Bấm để tạo ma trận xem trước (
                    {colorsInput.split(",").filter((c) => c.trim()).length} màu ×{" "}
                    {selectedStorages.length} bộ nhớ ={" "}
                    {colorsInput.split(",").filter((c) => c.trim()).length * selectedStorages.length}{" "}
                    phiên bản)
                  </button>
                </div>
              </div>

              {/* BẢNG XEM TRƯỚC VÀ NÚT LƯU TẤT CẢ VÀO HỆ THỐNG */}
              {generatedMatrix.length > 0 && (
                <div className="matrix-preview-card card p-4 border-2 border-primary/40 bg-blue-50/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
                    <div>
                      <h5 className="font-bold text-base text-primary flex items-center gap-1.5">
                        <Check size={18} /> Danh sách {generatedMatrix.length} biến thể sẵn sàng lưu:
                      </h5>
                      <p className="text-xs text-muted">
                        Bạn có thể sửa trực tiếp Mã SKU, Giá bán hoặc Tồn kho của từng bản trong bảng bên dưới trước khi lưu:
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGeneratedMatrix([])}
                        className="btn btn-ghost text-xs text-muted flex items-center gap-1"
                      >
                        <RotateCcw size={13} /> Hủy kết quả
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveAllMatrix}
                        className="btn btn-primary text-sm py-2 px-5 font-bold flex items-center gap-2 shadow-md"
                        disabled={matrixSaving}
                      >
                        {matrixSaving ? (
                          <>
                            <Loader2 size={16} className="spinner-icon" /> Đang lưu...
                          </>
                        ) : (
                          <>
                            <Zap size={16} /> 🚀 Lưu tất cả {generatedMatrix.length} biến thể vào hệ thống
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="matrix-table-scroll max-h-96 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                    <table className="data-table text-xs">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>STT</th>
                          <th style={{ minWidth: "150px" }}>Màu sắc</th>
                          <th style={{ minWidth: "120px" }}>Bộ nhớ & RAM</th>
                          <th style={{ minWidth: "180px" }}>Mã SKU</th>
                          <th style={{ minWidth: "160px" }}>Giá bán (VNĐ)</th>
                          <th style={{ minWidth: "100px" }}>Số lượng tồn</th>
                          <th className="text-center" style={{ width: "60px" }}>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedMatrix.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-muted font-mono">{idx + 1}</td>
                            <td>
                              <span className="variant-color-badge font-bold">{item.color}</span>
                            </td>
                            <td>
                              <span className="font-bold">{item.storage}</span> / {item.ram}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-input text-xs py-1 px-2 font-mono"
                                value={item.sku}
                                onChange={(e) =>
                                  handleMatrixItemChange(idx, "sku", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-xs py-1 px-2 font-bold text-primary"
                                value={item.price}
                                onChange={(e) =>
                                  handleMatrixItemChange(idx, "price", Number(e.target.value))
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-xs py-1 px-2 font-bold text-center"
                                value={item.stockQuantity}
                                onChange={(e) =>
                                  handleMatrixItemChange(
                                    idx,
                                    "stockQuantity",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveMatrixRow(idx)}
                                className="btn-action delete mx-auto"
                                title="Bỏ biến thể này"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted">
                      Tổng số lượng máy nhập thêm dự tính:{" "}
                      <strong>
                        {generatedMatrix.reduce((acc, it) => acc + (Number(it.stockQuantity) || 0), 0)}
                      </strong>{" "}
                      máy
                    </span>

                    <button
                      type="button"
                      onClick={handleSaveAllMatrix}
                      className="btn btn-primary text-sm py-2 px-6 font-bold flex items-center gap-2 shadow-md"
                      disabled={matrixSaving}
                    >
                      {matrixSaving ? (
                        <>
                          <Loader2 size={16} className="spinner-icon" /> Đang lưu vào hệ thống...
                        </>
                      ) : (
                        <>
                          <Zap size={16} /> 🚀 Lưu tất cả {generatedMatrix.length} biến thể vào hệ thống
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MÀN HÌNH FORM CHỈNH SỬA / THÊM MỚI 1 BIẾN THỂ (viewMode === 'form')    */}
          {/* ========================================================================= */}
          {viewMode === "form" && (
            <div className="max-w-2xl mx-auto py-2">
              <div className="flex items-center justify-between pb-3 mb-4 border-b">
                <div>
                  <h4 className="font-bold text-base">
                    {editingVariant
                      ? `Chỉnh sửa biến thể: ${editingVariant.color} - ${editingVariant.storage}`
                      : "Thêm mới 1 biến thể riêng lẻ"}
                  </h4>
                  <p className="text-xs text-muted">
                    {editingVariant
                      ? `Đang chỉnh sửa biến thể có mã SKU: ${editingVariant.sku || "N/A"}`
                      : `Thêm 1 biến thể riêng lẻ cho ${phone.name}`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="btn btn-secondary text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} /> ← Hủy & Quay lại danh sách
                </button>
              </div>

              <form onSubmit={handleSaveSingle} className="modal-form space-y-4">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Màu sắc <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Titan Sa Mạc, Đen, Xanh..."
                      className="form-input"
                      value={singleForm.color}
                      onChange={(e) => setSingleForm({ ...singleForm, color: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bộ nhớ trong</label>
                    <select
                      className="form-input"
                      value={singleForm.storage}
                      onChange={(e) => setSingleForm({ ...singleForm, storage: e.target.value })}
                    >
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Dung lượng RAM</label>
                    <select
                      className="form-input"
                      value={singleForm.ram}
                      onChange={(e) => setSingleForm({ ...singleForm, ram: e.target.value })}
                    >
                      <option value="4GB">4GB</option>
                      <option value="6GB">6GB</option>
                      <option value="8GB">8GB</option>
                      <option value="12GB">12GB</option>
                      <option value="16GB">16GB</option>
                      <option value="24GB">24GB</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mã SKU</label>
                    <input
                      type="text"
                      placeholder="Tự động hoặc tự nhập"
                      className="form-input font-mono"
                      value={singleForm.sku}
                      onChange={(e) => setSingleForm({ ...singleForm, sku: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>
                        Giá bán riêng (VNĐ) <span className="req">*</span>
                      </label>
                      {getNumericPrice(singleForm.price) > 0 && (
                        <span style={{ fontSize: "12px", color: "#0071e3", fontWeight: 700 }}>
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                            getNumericPrice(singleForm.price)
                          )}
                        </span>
                      )}
                    </div>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="VD: 34.990.000"
                        className="form-input font-bold text-primary"
                        style={{ paddingRight: "52px" }}
                        value={singleForm.price}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^\d]/g, "");
                          setSingleForm({
                            ...singleForm,
                            price: raw ? new Intl.NumberFormat("vi-VN").format(Number(raw)) : ""
                          });
                        }}
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
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số lượng tồn kho</label>
                    <input
                      type="number"
                      placeholder="VD: 10"
                      className="form-input"
                      value={singleForm.stockQuantity}
                      onChange={(e) =>
                        setSingleForm({ ...singleForm, stockQuantity: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Ảnh biến thể (Màu sắc / Phiên bản)
                    </label>
                    <button
                      type="button"
                      onClick={() => setVariantShowUrlInput(!variantShowUrlInput)}
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
                      {variantShowUrlInput ? "Chọn tệp từ máy tính" : "Dán link URL nếu cần"}
                    </button>
                  </div>

                  {variantShowUrlInput ? (
                    <div>
                      <input
                        type="text"
                        placeholder="https://..."
                        className="form-input"
                        value={singleForm.thumbnailUrl}
                        onChange={(e) =>
                          setSingleForm({ ...singleForm, thumbnailUrl: e.target.value })
                        }
                      />
                      <span style={{ fontSize: "11px", color: "#86868b", marginTop: "4px", display: "block" }}>
                        Dán đường link ảnh trực tiếp từ internet.
                      </span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={variantFileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleVariantFileSelect}
                        disabled={singleSaving}
                      />

                      {singleForm.thumbnailUrl ? (
                        <div
                          style={{
                            border: "1px solid #e5e5e7",
                            borderRadius: "14px",
                            padding: "10px 14px",
                            backgroundColor: "#fbfbfd",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px"
                          }}
                        >
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "10px",
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
                              src={singleForm.thumbnailUrl}
                              alt="Ảnh biến thể"
                              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/100x100?text=L%E1%BB%97i+%E1%BA%A3nh";
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "2px 6px",
                                  borderRadius: "9999px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  backgroundColor: "#ecfdf5",
                                  color: "#059669",
                                  border: "1px solid #a7f3d0"
                                }}
                              >
                                ✓ Đã có ảnh biến thể
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: "6px"
                              }}
                            >
                              {singleForm.thumbnailUrl.startsWith("data:")
                                ? "Tệp tải từ máy tính (Base64)"
                                : singleForm.thumbnailUrl}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => variantFileInputRef.current?.click()}
                                style={{
                                  padding: "4px 10px",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "6px",
                                  color: "#374151",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                                disabled={singleSaving}
                              >
                                <RefreshCw style={{ width: 12, height: 12 }} />
                                Đổi ảnh
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setSingleForm({ ...singleForm, thumbnailUrl: "" })
                                }
                                style={{
                                  padding: "4px 10px",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  backgroundColor: "#fef2f2",
                                  border: "1px solid #fecaca",
                                  borderRadius: "6px",
                                  color: "#dc2626",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                                disabled={singleSaving}
                              >
                                <Trash2 style={{ width: 12, height: 12 }} />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setVariantIsDragging(true);
                          }}
                          onDragLeave={() => setVariantIsDragging(false)}
                          onDrop={handleVariantDrop}
                          onClick={() => variantFileInputRef.current?.click()}
                          style={{
                            border: variantIsDragging ? "2px dashed #0071e3" : "2px dashed #d1d5db",
                            borderRadius: "14px",
                            padding: "16px 12px",
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: variantIsDragging ? "rgba(0, 113, 227, 0.05)" : "#fbfbfd",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#eff6ff",
                                color: "#0071e3",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "6px"
                              }}
                            >
                              <Upload style={{ width: 18, height: 18 }} />
                            </div>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1d1d1f", marginBottom: "2px" }}>
                              Chọn ảnh màu/biến thể từ máy tính
                            </p>
                            <p style={{ fontSize: "11px", color: "#86868b" }}>
                              hoặc kéo thả ảnh vào đây (JPG, PNG, WEBP)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-actions mt-6 flex gap-2 justify-end pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="btn btn-secondary"
                    disabled={singleSaving}
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn btn-primary font-bold" disabled={singleSaving}>
                    {singleSaving ? (
                      <>
                        <Loader2 size={16} className="spinner-icon" /> Đang lưu...
                      </>
                    ) : editingVariant ? (
                      <>
                        <Check size={16} /> Cập nhật biến thể
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> Thêm biến thể
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
