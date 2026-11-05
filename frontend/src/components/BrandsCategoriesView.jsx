import React, { useState, useEffect, useRef } from "react";
import { Tag, FolderPlus, Edit2, Trash2, Plus, CheckCircle, AlertCircle, Loader2, Sparkles, Layers, Upload } from "lucide-react";
import { catalogApi } from "../services/catalogApi";
import LoadingSpinner from "./LoadingSpinner";

export default function BrandsCategoriesView({ user, onRequireLogin }) {
  const [tab, setTab] = useState("brands"); // 'brands' | 'categories'
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal thêm/sửa
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        catalogApi.getBrands().catch(() => ({ data: [] })),
        catalogApi.getCategories().catch(() => ({ data: [] })),
      ]);
      setBrands(bRes.data || []);
      setCategories(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingItem(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingItem(item);
    setName(item.name || "");
    setDescription(item.description || "");
    setImageUrl(item.logoUrl || item.imageUrl || "");
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(`Tên ${tab === "brands" ? "thương hiệu" : "danh mục"} không được để trống`);
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        logoUrl: imageUrl,
        imageUrl: imageUrl,
      };
      if (tab === "brands") {
        if (editingItem) {
          await catalogApi.updateBrand(editingItem.id, payload);
          showToast(`Cập nhật thương hiệu "${name}" thành công!`);
        } else {
          await catalogApi.createBrand(payload);
          showToast(`Thêm thương hiệu "${name}" thành công!`);
        }
      } else {
        if (editingItem) {
          await catalogApi.updateCategory(editingItem.id, payload);
          showToast(`Cập nhật danh mục "${name}" thành công!`);
        } else {
          await catalogApi.createCategory(payload);
          showToast(`Thêm danh mục "${name}" thành công!`);
        }
      }
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    const isBrand = tab === "brands";
    const typeLabel = isBrand ? "thương hiệu" : "danh mục";

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${typeLabel} "${item.name}" không?`)) {
      return;
    }

    try {
      if (isBrand) {
        await catalogApi.deleteBrand(item.id);
      } else {
        await catalogApi.deleteCategory(item.id);
      }
      showToast(`Đã xóa ${typeLabel} "${item.name}" thành công!`);
      await fetchData();
    } catch (err) {
      alert(`Lỗi khi xóa ${typeLabel}: ` + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="brands-categories-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-heading">Thương hiệu & Danh mục</h1>
          <p className="page-sub">Quản lý các hãng điện thoại và phân loại danh mục sản phẩm</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> {tab === "brands" ? "Thêm thương hiệu" : "Thêm danh mục"}
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="sub-tabs mb-6 flex gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setTab("brands")}
          className={`tab-btn ${tab === "brands" ? "active" : ""}`}
        >
          <Tag size={18} /> Thương hiệu điện thoại ({brands.length})
        </button>
        <button
          onClick={() => setTab("categories")}
          className={`tab-btn ${tab === "categories" ? "active" : ""}`}
        >
          <Layers size={18} /> Danh mục sản phẩm ({categories.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Đang tải dữ liệu danh mục..." />
      ) : tab === "brands" ? (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã ID</th>
                <th>Tên thương hiệu</th>
                <th>Mô tả</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id}>
                  <td className="text-muted font-mono">#{b.id}</td>
                  <td>
                    <span className="font-bold text-base text-primary">{b.name}</span>
                  </td>
                  <td className="text-muted text-sm">{b.description || "Chưa có mô tả"}</td>
                  <td className="text-right">
                    <div className="actions-group">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="btn-action edit"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        className="btn-action delete"
                        title="Xóa thương hiệu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã ID</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="text-muted font-mono">#{c.id}</td>
                  <td>
                    <span className="font-bold text-base text-primary">{c.name}</span>
                  </td>
                  <td className="text-muted text-sm">{c.description || "Chưa có mô tả"}</td>
                  <td className="text-right">
                    <div className="actions-group">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="btn-action edit"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="btn-action delete"
                        title="Xóa danh mục"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm / Sửa */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingItem
                  ? `Chỉnh sửa ${tab === "brands" ? "thương hiệu" : "danh mục"}`
                  : `Thêm ${tab === "brands" ? "thương hiệu" : "danh mục"} mới`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="btn-icon close-btn">
                ✕
              </button>
            </div>

            {formError && (
              <div className="alert alert-error mx-6 mt-4">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  Tên {tab === "brands" ? "thương hiệu" : "danh mục"} <span className="req">*</span>
                </label>
                <input
                  type="text"
                  placeholder={tab === "brands" ? "VD: Apple, Samsung, Xiaomi..." : "VD: Smartphone, Tablet..."}
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả thông tin chi tiết..."
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                ></textarea>
              </div>

              {/* Upload logo / ảnh đại diện từ thiết bị */}
              <div className="form-group">
                <label className="form-label">
                  Logo / Ảnh đại diện {tab === "brands" ? "thương hiệu" : "danh mục"} (Tải từ thiết bị)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                          const maxDim = 400;
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
                          setImageUrl(canvas.toDataURL("image/png"));
                        };
                        img.src = event.target.result;
                      };
                      reader.readAsDataURL(file);
                    }
                    e.target.value = "";
                  }}
                  style={{ display: "none" }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
                  {imageUrl && (
                    <div style={{ width: "48px", height: "48px", borderRadius: "8px", border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "4px" }}>
                      <img src={imageUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline"
                    style={{ fontSize: "12px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Upload size={14} />
                    <span>📁 Chọn ảnh từ thiết bị</span>
                  </button>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="btn-icon text-danger"
                      title="Xóa ảnh"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" /> Đang lưu...
                    </>
                  ) : editingItem ? (
                    "Cập nhật"
                  ) : (
                    "Tạo mới"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

