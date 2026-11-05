import React, { useState } from "react";
import { ShieldCheck, Search, AlertCircle, Calendar, Phone, CheckCircle, Clock, Plus, User, Tag, FileText, Loader2 } from "lucide-react";
import { warrantyApi } from "../services/warrantyApi";

export default function WarrantyView({ user, onRequireLogin }) {
  const [activeTab, setActiveTab] = useState("lookup"); // 'lookup' | 'create' | 'list'
  
  // State tra cứu
  const [searchType, setSearchType] = useState("imei"); // 'imei' | 'phone'
  const [searchValue, setSearchValue] = useState("358912345678901");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [lookupError, setLookupError] = useState(null);

  // State danh sách toàn bộ bảo hành
  const [warrantiesList, setWarrantiesList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const fetchAllWarranties = async () => {
    setListLoading(true);
    try {
      const res = await warrantyApi.getAll();
      setWarrantiesList(res.data || []);
    } catch (err) {
      console.warn("Lỗi tải danh sách bảo hành:", err);
    } finally {
      setListLoading(false);
    }
  };

  // State kích hoạt bảo hành mới
  const [form, setForm] = useState({
    imeiNumber: "",
    productName: "",
    variantName: "",
    customerName: "",
    customerPhone: "",
    orderCode: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    note: "",
  });
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  // Xử lý tra cứu
  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setLookupError(null);
    setResults([]);

    try {
      if (searchType === "imei") {
        const res = await warrantyApi.checkByImei(searchValue.trim());
        setResults(res.data ? [res.data] : []);
      } else {
        const res = await warrantyApi.checkByPhone(searchValue.trim());
        setResults(res.data || []);
      }
    } catch (err) {
      setLookupError(err.response?.data?.message || "Không tìm thấy thông tin bảo hành tương ứng.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tạo bảo hành mới
  const handleCreateWarranty = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }

    if (!form.imeiNumber.trim()) {
      setCreateError("Vui lòng nhập số IMEI máy");
      return;
    }
    if (!form.productName.trim()) {
      setCreateError("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setCreateError("Vui lòng nhập đầy đủ tên và số điện thoại khách hàng");
      return;
    }

    setCreating(true);
    setCreateError("");
    setCreateSuccess("");

    try {
      const res = await warrantyApi.create(form);
      setCreateSuccess(`Kích hoạt thành công bảo hành cho máy IMEI: ${res.data.imeiNumber}!`);
      // Đặt kết quả vào view tra cứu và chuyển về tab lookup
      setResults([res.data]);
      setSearchValue(res.data.imeiNumber);
      setSearchType("imei");
      setActiveTab("lookup");
      setForm({
        imeiNumber: "",
        productName: "",
        variantName: "",
        customerName: "",
        customerPhone: "",
        orderCode: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        note: "",
      });
    } catch (err) {
      setCreateError(err.response?.data?.message || err.message || "Lỗi khi kích hoạt bảo hành");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="warranty-page">
      <div className="page-header">
        <div>
          <h1 className="page-heading">Bảo hành chính hãng</h1>
          <p className="page-sub">Tra cứu thời hạn bảo hành điện tử và kích hoạt máy mới xuất kho</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("lookup")}
            className={`btn ${activeTab === "lookup" ? "btn-primary" : "btn-secondary"}`}
          >
            <Search size={16} /> Tra cứu bảo hành
          </button>
          <button
            onClick={() => {
              setActiveTab("list");
              fetchAllWarranties();
            }}
            className={`btn ${activeTab === "list" ? "btn-primary" : "btn-secondary"}`}
          >
            <FileText size={16} /> Danh sách bảo hành
          </button>
          <button
            onClick={() => {
              if (!user || user.role !== "ROLE_ADMIN") {
                onRequireLogin();
                return;
              }
              setActiveTab("create");
            }}
            className={`btn ${activeTab === "create" ? "btn-primary" : "btn-secondary"}`}
          >
            <Plus size={16} /> Kích hoạt bảo hành (Admin)
          </button>
        </div>
      </div>

      {createSuccess && (
        <div className="alert alert-success mb-4">
          <CheckCircle size={18} />
          <span>{createSuccess}</span>
        </div>
      )}

      {activeTab === "lookup" ? (
        <div className="card warranty-container">
          <div className="card-header">
            <div>
              <h2 className="text-lg font-bold">Tra cứu thông tin bảo hành điện tử</h2>
              <p className="page-sub">Kiểm tra qua số IMEI máy hoặc Số điện thoại người mua</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="radio"
                name="searchType"
                checked={searchType === "imei"}
                onChange={() => setSearchType("imei")}
              />
              Tra cứu theo số IMEI (15 số)
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="radio"
                name="searchType"
                checked={searchType === "phone"}
                onChange={() => setSearchType("phone")}
              />
              Tra cứu theo Số điện thoại
            </label>
          </div>

          <form onSubmit={handleLookup} className="search-bar lookup-bar">
            <div className="search-input-wrapper">
              <ShieldCheck className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchType === "imei"
                    ? "Nhập số IMEI máy (VD: 358912345678901)"
                    : "Nhập số điện thoại khách hàng (VD: 0987654321)"
                }
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang tra cứu..." : "Kiểm tra ngay"}
            </button>
          </form>

          {lookupError && (
            <div className="alert alert-error mt-4">
              <AlertCircle size={20} />
              <span>{lookupError}</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="warranty-results-list mt-6 flex flex-col gap-4">
              {results.map((result) => {
                const isActive = result.status === "ACTIVE";
                return (
                  <div key={result.id || result.imeiNumber} className="warranty-card">
                    <div className="warranty-badge-status">
                      <CheckCircle size={20} className={isActive ? "text-success" : "text-error"} />
                      <span className={`status-label ${isActive ? "text-success font-bold" : "text-error font-bold"}`}>
                        Bảo hành chính hãng: {isActive ? "CÒN HIỆU LỰC" : "HẾT HẠN"}
                      </span>
                    </div>

                    <div className="warranty-grid">
                      <div className="warranty-item">
                        <span className="label">Số IMEI máy:</span>
                        <span className="value bold font-mono">{result.imeiNumber}</span>
                      </div>
                      <div className="warranty-item">
                        <span className="label">Dòng sản phẩm:</span>
                        <span className="value bold text-primary">{result.productName}</span>
                      </div>
                      <div className="warranty-item">
                        <span className="label">Phiên bản:</span>
                        <span className="value">{result.variantName || "Tiêu chuẩn"}</span>
                      </div>
                      <div className="warranty-item">
                        <span className="label">Khách hàng đăng ký:</span>
                        <span className="value font-bold">{result.customerName}</span>
                      </div>
                      <div className="warranty-item">
                        <span className="label">Số điện thoại:</span>
                        <span className="value">{result.customerPhone}</span>
                      </div>
                      <div className="warranty-item">
                        <span className="label">Mã đơn mua:</span>
                        <span className="value">{result.orderCode || "N/A"}</span>
                      </div>
                      <div className="warranty-item">
                        <span className="label">Ngày kích hoạt:</span>
                        <span className="value">{result.startDate}</span>
                      </div>
                      <div className="warranty-item">
                        <span className="label">Hạn bảo hành đến:</span>
                        <span className="value">{result.endDate}</span>
                      </div>
                    </div>

                    <div className="days-box">
                      <Clock size={18} />
                      <span>
                        Thời hạn còn lại: <strong>{result.daysRemaining} ngày</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Tab Kích hoạt bảo hành mới (ADMIN) */
        <div className="card max-w-3xl mx-auto p-6">
          <div className="border-b border-gray-200 pb-3 mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" size={22} /> Form kích hoạt bảo hành điện thoại
            </h2>
            <p className="text-sm text-muted">Nhập thông tin máy xuất kho để lưu trữ bảo hành trên hệ thống</p>
          </div>

          {createError && (
            <div className="alert alert-error mb-4">
              <AlertCircle size={18} />
              <span>{createError}</span>
            </div>
          )}

          <form onSubmit={handleCreateWarranty} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số IMEI máy (15 số) <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="VD: 358912345678901"
                  className="form-input"
                  value={form.imeiNumber}
                  onChange={(e) => setForm({ ...form, imeiNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tên sản phẩm điện thoại <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="VD: iPhone 16 Pro Max"
                  className="form-input"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phiên bản / Màu sắc / Bộ nhớ</label>
                <input
                  type="text"
                  placeholder="VD: Titan Tự Nhiên 256GB"
                  className="form-input"
                  value={form.variantName}
                  onChange={(e) => setForm({ ...form, variantName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mã hóa đơn / Mã đơn hàng</label>
                <input
                  type="text"
                  placeholder="VD: ORD-99214"
                  className="form-input"
                  value={form.orderCode}
                  onChange={(e) => setForm({ ...form, orderCode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Họ tên khách hàng <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  className="form-input"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại khách hàng <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="VD: 0912345678"
                  className="form-input"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ngày bắt đầu bảo hành</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ngày hết hạn bảo hành</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ghi chú (Tùy chọn)</label>
              <textarea
                rows="2"
                placeholder="Ghi chú thêm về gói bảo hành..."
                className="form-input"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("lookup")}
                className="btn btn-secondary"
                disabled={creating}
              >
                Hủy bỏ
              </button>
              <button type="submit" className="btn btn-primary" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" /> Đang kích hoạt...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Kích hoạt bảo hành ngay
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "list" && (
        <div className="card warranty-container">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 className="text-lg font-bold">Danh sách thiết bị đã kích hoạt bảo hành</h2>
              <p className="page-sub">Quản lý toàn bộ thời hạn bảo hành chính hãng của khách hàng</p>
            </div>
            <button onClick={fetchAllWarranties} className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <Clock size={15} /> Làm mới
            </button>
          </div>

          {listLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Loader2 size={24} className="spinner-icon" style={{ margin: "0 auto 10px auto" }} />
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>Đang tải danh sách bảo hành...</p>
            </div>
          ) : warrantiesList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
              Chưa có thông tin bảo hành nào được kích hoạt.
            </div>
          ) : (
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table className="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "12px 14px" }}>Số IMEI</th>
                    <th style={{ padding: "12px 14px" }}>Sản phẩm / Phiên bản</th>
                    <th style={{ padding: "12px 14px" }}>Khách hàng</th>
                    <th style={{ padding: "12px 14px" }}>Số điện thoại</th>
                    <th style={{ padding: "12px 14px" }}>Thời hạn</th>
                    <th style={{ padding: "12px 14px" }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {warrantiesList.map((w) => (
                    <tr key={w.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 600 }}>{w.imeiNumber}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <strong>{w.productName}</strong>
                        {w.variantName && <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{w.variantName}</div>}
                      </td>
                      <td style={{ padding: "12px 14px" }}>{w.customerName}</td>
                      <td style={{ padding: "12px 14px" }}>{w.customerPhone}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div>{w.startDate} → {w.endDate}</div>
                        <div style={{ fontSize: "11px", color: w.status === "ACTIVE" ? "#16a34a" : "#dc2626" }}>
                          {w.status === "ACTIVE" ? `Còn ${w.daysRemaining} ngày` : "Đã hết hạn"}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: w.status === "ACTIVE" ? "#ecfdf5" : "#fef2f2",
                            color: w.status === "ACTIVE" ? "#16a34a" : "#dc2626",
                            border: `1px solid ${w.status === "ACTIVE" ? "#bbf7d0" : "#fecaca"}`
                          }}
                        >
                          {w.status === "ACTIVE" ? "✓ Đang bảo hành" : "✗ Hết hạn"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

