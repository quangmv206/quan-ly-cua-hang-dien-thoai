import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  X,
  Save,
  RefreshCw,
  Search
} from "lucide-react";
import { voucherApi } from "../services/voucherApi";
import LoadingSpinner from "./LoadingSpinner";

export default function VouchersView({ user, onRequireLogin }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "amount", // 'amount' | 'percent'
    discountAmount: "",
    discountPercent: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    expiresAt: "",
    active: true,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherApi.getAllForAdmin();
      setVouchers(res.data || []);
    } catch (err) {
      console.warn("Lỗi tải vouchers:", err);
      // Fallback nếu chưa có voucher
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleOpenAdd = () => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingVoucher(null);
    setFormData({
      code: "",
      title: "",
      description: "",
      discountType: "amount",
      discountAmount: "",
      discountPercent: "",
      minOrderAmount: "5000000",
      maxDiscountAmount: "",
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setEditingVoucher(v);
    setFormData({
      code: v.code || "",
      title: v.title || "",
      description: v.description || "",
      discountType: v.discountPercent ? "percent" : "amount",
      discountAmount: v.discountAmount || "",
      discountPercent: v.discountPercent || "",
      minOrderAmount: v.minOrderAmount || "",
      maxDiscountAmount: v.maxDiscountAmount || "",
      expiresAt: v.expiresAt ? v.expiresAt.split("T")[0] : "",
      active: v.active !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      await voucherApi.delete(id);
      showToast("Đã xóa mã giảm giá thành công.");
      fetchVouchers();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi xóa mã", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      alert("Vui lòng nhập mã code");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        title: formData.title.trim() || formData.code.trim().toUpperCase(),
        description: formData.description,
        discountAmount: formData.discountType === "amount" ? Number(formData.discountAmount) || 0 : null,
        discountPercent: formData.discountType === "percent" ? Number(formData.discountPercent) || 0 : null,
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscountAmount: formData.discountType === "percent" && formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        expiresAt: formData.expiresAt ? `${formData.expiresAt}T23:59:59` : null,
        active: formData.active,
      };

      if (editingVoucher) {
        await voucherApi.update(editingVoucher.id, payload);
        showToast("Cập nhật mã giảm giá thành công!");
      } else {
        await voucherApi.create(payload);
        showToast("Tạo mã giảm giá mới thành công!");
      }
      setModalOpen(false);
      fetchVouchers();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi lưu mã giảm giá", "error");
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

  const filteredVouchers = vouchers.filter((v) =>
    (v.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vouchers-page" style={{ padding: "24px 32px" }}>
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 100 }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
            Quản Lý Mã Giảm Giá & Voucher
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
            Tạo và quản lý các mã khuyến mãi áp dụng khi khách hàng thanh toán tại giỏ hàng (/checkout).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px" }}
        >
          <Plus size={16} />
          <span>+ Tạo mã Voucher mới</span>
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ position: "relative", width: "320px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-secondary)" }} />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã hoặc tên voucher..."
            style={{ paddingLeft: "36px" }}
          />
        </div>
      </div>

      {/* Bảng danh sách Vouchers */}
      {loading ? (
        <LoadingSpinner message="Đang nạp danh sách voucher..." />
      ) : (
        <div className="card" style={{ padding: 0, borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden" }}>
          <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>Mã Code</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>Tên chương trình</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>Mức giảm</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>Đơn tối thiểu</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>Hạn dùng</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>Trạng thái</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map((v) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(0, 113, 227, 0.1)",
                          color: "var(--color-pricing-blue)",
                          fontWeight: 700,
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {v.code}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 500 }}>{v.title}</td>
                    <td style={{ padding: "14px 16px", color: "#16a34a", fontWeight: 600 }}>
                      {v.discountPercent ? `${v.discountPercent}%` : formatPrice(v.discountAmount)}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "13px" }}>
                      {v.minOrderAmount ? formatPrice(v.minOrderAmount) : "Không giới hạn"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      {v.expiresAt ? v.expiresAt.split("T")[0] : "Vô thời hạn"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: v.active ? "#dcfce7" : "#fee2e2",
                          color: v.active ? "#15803d" : "#b91c1c",
                          fontWeight: 600,
                        }}
                      >
                        {v.active ? "Đang bật" : "Đã tắt"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(v)}
                        className="btn-icon"
                        title="Sửa voucher"
                        style={{ marginRight: "8px" }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id)}
                        className="btn-icon text-danger"
                        title="Xóa voucher"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                    Chưa có mã giảm giá nào. Hãy bấm "+ Tạo mã Voucher mới" ở trên để tạo!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm / Sửa Voucher */}
      {modalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="modal-card" style={{ backgroundColor: "var(--bg-primary)", width: "520px", borderRadius: "16px", padding: "24px", border: "1px solid var(--border)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                {editingVoucher ? "Chỉnh sửa Mã Giảm Giá" : "Tạo Mã Giảm Giá Mới"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "14px" }}>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Mã Voucher (Code) *
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: PHONESTORE2026, GIAM500K..."
                  style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Tiêu đề chương trình
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Giảm ngay 500K cho đơn từ 10 triệu"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Loại giảm giá
                  </label>
                  <select
                    className="form-input"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="amount">Số tiền cố định (đ)</option>
                    <option value="percent">Phần trăm (%)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    {formData.discountType === "amount" ? "Số tiền giảm (VND) *" : "Phần trăm giảm (1 - 100) *"}
                  </label>
                  {formData.discountType === "amount" ? (
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={formData.discountAmount}
                      onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                      placeholder="VD: 500000"
                    />
                  ) : (
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      className="form-input"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                      placeholder="VD: 10"
                    />
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Đơn hàng tối thiểu (VND)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="VD: 5000000"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span>Kích hoạt áp dụng mã này ngay lập tức</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  {saving ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
                  <span>{saving ? "Đang lưu..." : "Lưu mã Voucher"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

