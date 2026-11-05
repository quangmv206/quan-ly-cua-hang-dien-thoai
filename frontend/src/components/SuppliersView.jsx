import React, { useState, useEffect } from "react";
import { Truck, Plus, Edit2, Trash2, Search, Phone, Mail, MapPin, CheckCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { supplierApi } from "../services/supplierApi";
import LoadingSpinner from "./LoadingSpinner";

export default function SuppliersView({ user, onRequireLogin }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "ACTIVE",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await supplierApi.getAll();
      setSuppliers(res.data || []);
    } catch (err) {
      console.error(err);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenAdd = () => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingSupplier(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      status: "ACTIVE",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingSupplier(sup);
    setForm({
      name: sup.name || "",
      phone: sup.phone || "",
      email: sup.email || "",
      address: sup.address || "",
      status: sup.status || "ACTIVE",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Vui lòng nhập tên nhà cung cấp");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      if (editingSupplier) {
        await supplierApi.update(editingSupplier.id, form);
        showToast(`Cập nhật nhà cung cấp "${form.name}" thành công!`);
      } else {
        await supplierApi.create(form);
        showToast(`Thêm nhà cung cấp "${form.name}" thành công!`);
      }
      setModalOpen(false);
      await fetchSuppliers();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Lỗi khi lưu nhà cung cấp");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sup) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${sup.name}"?`)) return;

    try {
      await supplierApi.delete(sup.id);
      showToast(`Đã xóa nhà cung cấp "${sup.name}"`);
      await fetchSuppliers();
    } catch (err) {
      alert("Lỗi khi xóa nhà cung cấp: " + (err.response?.data?.message || err.message));
    }
  };

  const filtered = suppliers.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      s.name?.toLowerCase().includes(term) ||
      s.phone?.includes(term) ||
      s.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="suppliers-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-heading">Nhà cung cấp</h1>
          <p className="page-sub">Quản lý đối tác phân phối điện thoại và nguồn hàng nhập kho</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchSuppliers} className="btn btn-secondary">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Thêm nhà cung cấp
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar mb-4">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên đối tác, số điện thoại, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Đang tải danh sách nhà cung cấp..." />
      ) : filtered.length === 0 ? (
        <div className="card text-center p-8">
          <Truck size={48} className="text-muted mx-auto mb-2" />
          <h3 className="text-lg font-bold">Chưa có nhà cung cấp nào</h3>
          <p className="text-muted">Nhấn nút "Thêm nhà cung cấp" để khai báo nguồn nhập hàng.</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Nhà Cung Cấp</th>
                <th>Liên hệ</th>
                <th>Địa chỉ trụ sở</th>
                <th>Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="text-muted font-mono">#{s.id}</td>
                  <td>
                    <span className="font-bold text-base text-primary block">{s.name}</span>
                  </td>
                  <td>
                    <div className="text-sm">
                      {s.phone && (
                        <div className="flex items-center gap-1.5 text-secondary">
                          <Phone size={13} className="text-muted" /> {s.phone}
                        </div>
                      )}
                      {s.email && (
                        <div className="flex items-center gap-1.5 text-muted text-xs mt-0.5">
                          <Mail size={13} /> {s.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-sm text-secondary max-w-xs truncate" title={s.address}>
                    {s.address ? (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-muted shrink-0" /> {s.address}
                      </span>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${s.status === "ACTIVE" ? "status-completed" : "status-pending"}`}>
                      {s.status === "ACTIVE" ? "Đang hợp tác" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="actions-group justify-end">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="btn-action edit"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        className="btn-action delete"
                        title="Xóa nhà cung cấp"
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
                {editingSupplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
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
                <label className="form-label">Tên nhà cung cấp <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="VD: FPT Synnex, DGW Digiworld..."
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    placeholder="VD: 02473006666"
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email đối tác</label>
                  <input
                    type="email"
                    placeholder="contact@synnex.vn"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  placeholder="Địa chỉ văn phòng / kho hàng nhà cung cấp..."
                  className="form-input"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tình trạng hợp tác</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  disabled={saving}
                >
                  <option value="ACTIVE">Đang hợp tác (ACTIVE)</option>
                  <option value="INACTIVE">Tạm ngưng (INACTIVE)</option>
                </select>
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
                  ) : editingSupplier ? (
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

