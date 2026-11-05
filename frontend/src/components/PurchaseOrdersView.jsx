import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Building2,
  AlertCircle,
  RefreshCw,
  Loader2,
  PackagePlus,
  Trash2
} from "lucide-react";
import { purchaseOrderApi } from "../services/purchaseOrderApi";
import { supplierApi } from "../services/supplierApi";
import { phoneApi } from "../services/phoneApi";
import LoadingSpinner from "./LoadingSpinner";

export default function PurchaseOrdersView({ user, onRequireLogin }) {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal Chi tiết
  const [selectedPO, setSelectedPO] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Modal Tạo mới Phiếu nhập
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState([
    { variantId: "", quantity: 10, unitCost: 15000000 },
  ]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [poRes, supRes, phoneRes] = await Promise.all([
        purchaseOrderApi.getAll().catch(() => ({ data: [] })),
        supplierApi.getAll().catch(() => ({ data: [] })),
        phoneApi.getAll().catch(() => ({ data: [] })),
      ]);

      setPurchaseOrders(poRes.data || []);
      setSuppliers(supRes.data || []);
      setPhones(phoneRes.data || []);

      // Lấy danh sách toàn bộ variants của các điện thoại
      const allPhones = phoneRes.data || [];
      const variantPromises = allPhones.map((p) =>
        phoneApi.getVariants(p.id).then((r) =>
          (r.data || []).map((v) => ({
            ...v,
            phoneName: p.name,
          }))
        ).catch(() => [])
      );
      const variantResults = await Promise.all(variantPromises);
      const flatVariants = variantResults.flat();
      setAvailableVariants(flatVariants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

  const handleOpenCreate = () => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setSelectedSupplierId(suppliers.length > 0 ? suppliers[0].id : "");
    setNote("");
    setItems([
      {
        variantId: availableVariants.length > 0 ? availableVariants[0].id : "",
        quantity: 10,
        unitCost: 18000000,
      },
    ]);
    setFormError("");
    setCreateModalOpen(true);
  };

  const handleAddItemRow = () => {
    setItems([
      ...items,
      {
        variantId: availableVariants.length > 0 ? availableVariants[0].id : "",
        quantity: 5,
        unitCost: 15000000,
      },
    ]);
  };

  const handleRemoveItemRow = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };

  const handleSavePurchaseOrder = async (e) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      setFormError("Vui lòng chọn nhà cung cấp");
      return;
    }
    if (items.length === 0 || !items[0].variantId) {
      setFormError("Vui lòng chọn ít nhất 1 biến thể sản phẩm nhập");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = {
        supplierId: Number(selectedSupplierId),
        note: note.trim(),
        status: "COMPLETED",
        items: items.map((it) => ({
          variantId: Number(it.variantId),
          quantity: Number(it.quantity),
          unitCost: Number(it.unitCost),
        })),
      };

      const res = await purchaseOrderApi.create(payload);
      showToast(`Đã tạo phiếu nhập kho ${res.data.purchaseCode} & cộng tồn kho thành công!`);
      setCreateModalOpen(false);
      await fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Lỗi khi tạo phiếu nhập");
    } finally {
      setSaving(false);
    }
  };

  const filtered = purchaseOrders.filter((po) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      po.purchaseCode?.toLowerCase().includes(term) ||
      po.supplierName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="purchase-orders-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-heading">Nhập kho & Nguồn hàng</h1>
          <p className="page-sub">Theo dõi các phiếu nhập hàng từ nhà phân phối và cập nhật tồn kho</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="btn btn-secondary">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <PackagePlus size={18} /> Tạo phiếu nhập kho
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
            placeholder="Tìm theo mã phiếu nhập (PO-...), nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Đang tải danh sách phiếu nhập kho..." />
      ) : filtered.length === 0 ? (
        <div className="card text-center p-8">
          <FileText size={48} className="text-muted mx-auto mb-2" />
          <h3 className="text-lg font-bold">Chưa có phiếu nhập hàng nào</h3>
          <p className="text-muted">Nhấn "Tạo phiếu nhập kho" để ghi nhận lô hàng mới nhập về.</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Phiếu</th>
                <th>Nhà Cung Cấp</th>
                <th>Tổng Tiền Nhập</th>
                <th>Số lượng loại máy</th>
                <th>Trạng Thái</th>
                <th>Thời Gian Nhập</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((po) => (
                <tr key={po.id}>
                  <td className="bold text-primary font-mono">{po.purchaseCode}</td>
                  <td className="bold">{po.supplierName}</td>
                  <td className="bold text-success">{formatPrice(po.totalAmount)}</td>
                  <td>
                    <span className="badge badge-brand">{po.items?.length || 0} sản phẩm</span>
                  </td>
                  <td>
                    <span className="status-badge status-completed">
                      <CheckCircle2 size={13} /> {po.status === "COMPLETED" ? "Đã nhập kho" : po.status}
                    </span>
                  </td>
                  <td className="text-sm text-muted">
                    {po.createdAt ? new Date(po.createdAt).toLocaleString("vi-VN") : "N/A"}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setSelectedPO(po);
                        setDetailModalOpen(true);
                      }}
                      className="btn-action edit"
                      title="Xem chi tiết phiếu nhập"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Chi tiết Phiếu nhập */}
      {detailModalOpen && selectedPO && (
        <div className="modal-overlay" onClick={() => setDetailModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Chi tiết Phiếu Nhập Kho #{selectedPO.purchaseCode}</h3>
                <p className="text-sm text-muted">
                  Đối tác: <strong>{selectedPO.supplierName}</strong> | Ngày nhập:{" "}
                  {selectedPO.createdAt ? new Date(selectedPO.createdAt).toLocaleString("vi-VN") : "N/A"}
                </p>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="btn-icon close-btn">
                ✕
              </button>
            </div>

            <div className="modal-body p-6">
              <div className="table-card mb-4">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Sản phẩm / Phiên bản</th>
                      <th>Mã SKU</th>
                      <th>Số lượng nhập</th>
                      <th>Giá nhập đơn vị</th>
                      <th className="text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPO.items?.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="text-muted">{idx + 1}</td>
                        <td>
                          <div className="font-bold">{it.productName}</div>
                          <div className="text-xs text-muted">{it.variantName}</div>
                        </td>
                        <td className="font-mono text-xs text-muted">{it.sku || "N/A"}</td>
                        <td className="font-bold text-base text-primary">+{it.quantity}</td>
                        <td>{formatPrice(it.unitCost)}</td>
                        <td className="text-right font-bold text-success">{formatPrice(it.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <span className="text-xs text-muted block">Ghi chú:</span>
                  <span className="text-sm italic">{selectedPO.note || "Không có ghi chú"}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted block">Tổng giá trị đơn nhập:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(selectedPO.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setDetailModalOpen(false)} className="btn btn-secondary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo Phiếu Nhập Hàng Mới */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Tạo Phiếu Nhập Hàng Mới</h3>
                <p className="text-sm text-muted">Hệ thống sẽ tự động cộng số lượng nhập vào kho tương ứng</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="btn-icon close-btn">
                ✕
              </button>
            </div>

            {formError && (
              <div className="alert alert-error mx-6 mt-4">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSavePurchaseOrder} className="modal-form p-6">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Chọn Nhà cung cấp <span className="req">*</span></label>
                  <select
                    className="form-input"
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.phone || "N/A"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú lô hàng</label>
                  <input
                    type="text"
                    placeholder="VD: Đợt hàng nhập khẩu tháng này..."
                    className="form-input"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Danh sách các mặt hàng nhập */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label mb-0">Danh sách sản phẩm nhập kho:</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="btn btn-ghost text-xs text-primary flex items-center gap-1"
                  >
                    <Plus size={14} /> Thêm dòng máy
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex-1 min-w-[200px]">
                        <select
                          className="form-input text-sm"
                          value={it.variantId}
                          onChange={(e) => handleItemChange(idx, "variantId", e.target.value)}
                        >
                          <option value="">-- Chọn máy & biến thể --</option>
                          {availableVariants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.phoneName} - {v.color} ({v.storage}) - Tồn hiện tại: {v.stockQuantity}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          placeholder="Số lượng"
                          className="form-input text-sm"
                          value={it.quantity}
                          min="1"
                          onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        />
                      </div>

                      <div className="w-36">
                        <input
                          type="number"
                          placeholder="Giá nhập"
                          className="form-input text-sm"
                          value={it.unitCost}
                          min="0"
                          onChange={(e) => handleItemChange(idx, "unitCost", e.target.value)}
                        />
                      </div>

                      <div className="text-sm font-bold text-success w-32 text-right">
                        {formatPrice(it.quantity * it.unitCost)}
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="btn-action delete ml-auto"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions mt-6">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" /> Đang tạo phiếu...
                    </>
                  ) : (
                    "Xác nhận nhập kho & Lưu"
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

