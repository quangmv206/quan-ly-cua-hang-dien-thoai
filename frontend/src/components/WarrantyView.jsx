import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  AlertCircle,
  Calendar,
  Phone,
  CheckCircle,
  Clock,
  Plus,
  User,
  Tag,
  FileText,
  Loader2,
  Copy,
  Check,
  Package,
  HelpCircle,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { warrantyApi } from "../services/warrantyApi";

export default function WarrantyView({ user, onRequireLogin }) {
  const [activeTab, setActiveTab] = useState("lookup"); // 'lookup' | 'create' | 'list'

  // State tra cứu
  const [searchType, setSearchType] = useState("imei"); // 'imei' | 'phone' | 'order'
  const [searchValue, setSearchValue] = useState("358912345678901");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [lookupError, setLookupError] = useState(null);
  const [copiedImei, setCopiedImei] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // Mẫu test nhanh
  const quickDemoChips = [
    { label: "iPhone 15 Pro (IMEI)", type: "imei", val: "358912345678901" },
    { label: "Galaxy S24 Ultra (IMEI)", type: "imei", val: "359876543210123" },
    { label: "Xiaomi 14 (IMEI)", type: "imei", val: "862345678901234" },
    { label: "SĐT Khách (0987654321)", type: "phone", val: "0987654321" },
    { label: "Mã Đơn (DH-20261020-1001)", type: "order", val: "DH-20261020-1001" },
  ];

  // State danh sách toàn bộ bảo hành
  const [warrantiesList, setWarrantiesList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listSearch, setListSearch] = useState("");

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
    if (e) e.preventDefault();
    const val = (searchValue || "").trim();
    if (!val) return;

    setLoading(true);
    setLookupError(null);
    setResults([]);

    try {
      const data = await warrantyApi.smartLookup(val, searchType);
      if (data && data.length > 0) {
        setResults(data);
        // Tự động đồng bộ lại radio button nếu nhận diện được
        if (data[0].orderCode && val === data[0].orderCode) {
          setSearchType("order");
        } else if (data[0].customerPhone && val === data[0].customerPhone) {
          setSearchType("phone");
        } else if (data[0].imeiNumber && val === data[0].imeiNumber) {
          setSearchType("imei");
        }
      } else {
        setLookupError(`Không tìm thấy thông tin bảo hành cho mã "${val}". Quý khách vui lòng kiểm tra lại số IMEI (15 số), Số điện thoại hoặc Mã đơn hàng.`);
      }
    } catch (err) {
      setLookupError(err.response?.data?.message || err.message || `Không tìm thấy thông tin bảo hành cho "${val}".`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoClick = (chip) => {
    setSearchType(chip.type);
    setSearchValue(chip.val);
    setLoading(true);
    setLookupError(null);
    setResults([]);

    const doSearch = async () => {
      try {
        const data = await warrantyApi.smartLookup(chip.val, chip.type);
        if (data && data.length > 0) {
          setResults(data);
        } else {
          setLookupError(`Không tìm thấy thông tin bảo hành cho "${chip.val}".`);
        }
      } catch (err) {
        setLookupError(err.response?.data?.message || err.message || `Không tìm thấy thông tin bảo hành cho "${chip.val}".`);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  };

  const copyToClipboard = (imei) => {
    navigator.clipboard.writeText(imei);
    setCopiedImei(imei);
    setTimeout(() => setCopiedImei(null), 2000);
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

  const filteredWarranties = warrantiesList.filter((w) => {
    if (!listSearch.trim()) return true;
    const q = listSearch.toLowerCase();
    return (
      (w.imeiNumber && w.imeiNumber.toLowerCase().includes(q)) ||
      (w.productName && w.productName.toLowerCase().includes(q)) ||
      (w.customerName && w.customerName.toLowerCase().includes(q)) ||
      (w.customerPhone && w.customerPhone.toLowerCase().includes(q)) ||
      (w.orderCode && w.orderCode.toLowerCase().includes(q))
    );
  });

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

      {activeTab === "lookup" && (
        <div className="card warranty-container">
          <div className="card-header">
            <div>
              <h2 className="text-lg font-bold">Tra cứu thông tin bảo hành điện tử</h2>
              <p className="page-sub">Kiểm tra qua số IMEI máy, Số điện thoại người mua hoặc Mã đơn hàng</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4 flex-wrap">
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
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="radio"
                name="searchType"
                checked={searchType === "order"}
                onChange={() => setSearchType("order")}
              />
              Tra cứu theo Mã đơn hàng
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
                    : searchType === "phone"
                    ? "Nhập số điện thoại khách hàng (VD: 0987654321)"
                    : "Nhập mã đơn hàng (VD: DH-20261020-1001)"
                }
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang tra cứu..." : "Kiểm tra ngay"}
            </button>
          </form>

          {/* Quick Demo Chips */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-sm">
            <span className="text-muted font-medium flex items-center gap-1" style={{ fontSize: "12px" }}>
              <Sparkles size={14} color="#ea580c" /> Thử nhanh mã mẫu:
            </span>
            {quickDemoChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickDemoClick(chip)}
                style={{
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "3px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: 500,
                  color: "#1e293b",
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Hướng dẫn khách hàng: Lấy mã ở đâu */}
          <div style={{ marginTop: "16px", padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              onClick={() => setShowGuide(!showGuide)}
            >
              <span style={{ fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", color: "var(--primary, #0071e3)" }}>
                <HelpCircle size={15} /> Hướng dẫn tư vấn khách hàng: "Không biết lấy số IMEI hoặc mã bảo hành ở đâu?"
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-secondary, #64748b)" }}>{showGuide ? "Thu gọn ▲" : "Xem hướng dẫn ▼"}</span>
            </div>
            {showGuide && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginTop: "10px", fontSize: "11px", color: "#475569" }}>
                <div><strong>1. Bấm *#06#:</strong> Khách bấm phím gọi *#06# trên bàn phím điện thoại để hiện ngay 15 số IMEI.</div>
                <div><strong>2. Tra cứu bằng SĐT:</strong> Không cần IMEI, chỉ cần nhập đúng SĐT lúc mua là ra tất cả máy.</div>
                <div><strong>3. Vỏ hộp máy:</strong> Tem dán mặt sau vỏ hộp máy có in IMEI kèm mã vạch chuẩn.</div>
                <div><strong>4. Mã đơn hàng:</strong> Nhập mã đơn DH-xxxx được cấp khi mua hàng trên website.</div>
              </div>
            )}
          </div>

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
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span className="value bold font-mono">{result.imeiNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(result.imeiNumber)}
                            style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "2px 6px", cursor: "pointer", fontSize: "10px" }}
                          >
                            {copiedImei === result.imeiNumber ? "✓ Đã chép" : "Chép"}
                          </button>
                        </div>
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
      )}

      {activeTab === "create" && (
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
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 className="text-lg font-bold">Danh sách thiết bị đã kích hoạt bảo hành</h2>
              <p className="page-sub">Quản lý toàn bộ thời hạn bảo hành chính hãng ({filteredWarranties.length} thiết bị)</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Lọc theo IMEI, Tên máy, SĐT, Mã đơn..."
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                style={{
                  height: "36px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  width: "260px",
                  outline: "none",
                }}
              />
              <button onClick={fetchAllWarranties} className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", height: "36px" }}>
                <Clock size={15} /> Làm mới
              </button>
            </div>
          </div>

          {listLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Loader2 size={24} className="spinner-icon" style={{ margin: "0 auto 10px auto" }} />
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>Đang tải danh sách bảo hành...</p>
            </div>
          ) : filteredWarranties.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
              {warrantiesList.length === 0
                ? "Chưa có thông tin bảo hành nào được kích hoạt."
                : `Không tìm thấy bảo hành nào khớp với từ khóa "${listSearch}".`}
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
                    <th style={{ padding: "12px 14px" }}>Mã đơn</th>
                    <th style={{ padding: "12px 14px" }}>Thời hạn</th>
                    <th style={{ padding: "12px 14px" }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarranties.map((w) => (
                    <tr key={w.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>{w.imeiNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(w.imeiNumber)}
                            title="Chép IMEI"
                            style={{
                              background: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              borderRadius: "4px",
                              padding: "2px 5px",
                              cursor: "pointer",
                              fontSize: "10px",
                              color: "#334155",
                            }}
                          >
                            {copiedImei === w.imeiNumber ? "✓" : "Copy"}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <strong>{w.productName}</strong>
                        {w.variantName && <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{w.variantName}</div>}
                      </td>
                      <td style={{ padding: "12px 14px" }}>{w.customerName}</td>
                      <td style={{ padding: "12px 14px" }}>{w.customerPhone}</td>
                      <td style={{ padding: "12px 14px", color: "var(--primary, #0071e3)", fontWeight: 500 }}>
                        {w.orderCode || "N/A"}
                      </td>
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

