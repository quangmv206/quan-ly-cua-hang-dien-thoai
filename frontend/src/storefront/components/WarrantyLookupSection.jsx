import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  AlertCircle,
  Calendar,
  Phone,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Package,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Smartphone,
  Printer,
  RotateCcw,
} from "lucide-react";
import { warrantyApi } from "../../services/warrantyApi";

export default function WarrantyLookupSection({ initialQuery = "", initialType = "imei" }) {
  const [searchType, setSearchType] = useState(initialType); // 'imei' | 'phone' | 'order'
  const [searchValue, setSearchValue] = useState(initialQuery || "358912345678901");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [copiedImei, setCopiedImei] = useState(null);
  const [showGuide, setShowGuide] = useState(true);

  // Mẫu test nhanh có sẵn trong hệ thống
  const quickDemoItems = [
    { label: "iPhone 15 Pro (IMEI)", type: "imei", val: "358912345678901" },
    { label: "Galaxy S24 Ultra (IMEI)", type: "imei", val: "359876543210123" },
    { label: "Xiaomi 14 (IMEI)", type: "imei", val: "862345678901234" },
    { label: "Tra theo SĐT (0987654321)", type: "phone", val: "0987654321" },
    { label: "Tra theo Đơn (DH-20261020-1001)", type: "order", val: "DH-20261020-1001" },
  ];

  // Tự động kiểm tra nếu có query ban đầu
  useEffect(() => {
    if (initialQuery) {
      setSearchValue(initialQuery);
      setSearchType(initialType);
      executeLookup(initialType, initialQuery);
    }
  }, [initialQuery, initialType]);

  const executeLookup = async (typeToSearch, valToSearch) => {
    const val = (valToSearch || "").trim();
    if (!val) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]);

    try {
      const data = await warrantyApi.smartLookup(val, typeToSearch);
      if (data && data.length > 0) {
        setResults(data);
        if (data[0].orderCode && val === data[0].orderCode) {
          setSearchType("order");
        } else if (data[0].customerPhone && val === data[0].customerPhone) {
          setSearchType("phone");
        } else if (data[0].imeiNumber && val === data[0].imeiNumber) {
          setSearchType("imei");
        }
      } else {
        setError(`Không tìm thấy dữ liệu bảo hành cho "${val}". Quý khách vui lòng kiểm tra lại số IMEI (15 số), Số điện thoại hoặc Mã đơn hàng.`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message ||
        `Không tìm thấy dữ liệu bảo hành cho "${val}".`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeLookup(searchType, searchValue);
  };

  const handleQuickDemoClick = (item) => {
    setSearchType(item.type);
    setSearchValue(item.val);
    executeLookup(item.type, item.val);
  };

  const copyToClipboard = (imei) => {
    navigator.clipboard.writeText(imei);
    setCopiedImei(imei);
    setTimeout(() => setCopiedImei(null), 2500);
  };

  return (
    <div className="warranty-lookup-component" style={{ marginTop: "10px" }}>
      {/* 1. KHỐI FORM TRA CỨU */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1px solid var(--color-hairline-silver)",
          padding: "28px 24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              backgroundColor: "rgba(0,113,227,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-pricing-blue)",
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "var(--color-ink)" }}>
              Tra cứu thông tin Bảo hành điện tử
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--color-slate)" }}>
              Kiểm tra thời hạn bảo hành, số IMEI và xuất xứ máy chính hãng phân phối tại Phone Store
            </p>
          </div>
        </div>

        {/* Lựa chọn phương thức tra cứu */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            margin: "20px 0 16px 0",
            flexWrap: "wrap",
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "12px",
          }}
        >
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              color: searchType === "imei" ? "var(--color-pricing-blue)" : "var(--color-slate)",
            }}
          >
            <input
              type="radio"
              name="storefrontSearchType"
              checked={searchType === "imei"}
              onChange={() => setSearchType("imei")}
              style={{ cursor: "pointer", accentColor: "var(--color-pricing-blue)" }}
            />
            <Smartphone size={15} />
            Tra cứu theo số IMEI (15 số)
          </label>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              color: searchType === "phone" ? "var(--color-pricing-blue)" : "var(--color-slate)",
            }}
          >
            <input
              type="radio"
              name="storefrontSearchType"
              checked={searchType === "phone"}
              onChange={() => setSearchType("phone")}
              style={{ cursor: "pointer", accentColor: "var(--color-pricing-blue)" }}
            />
            <Phone size={15} />
            Tra cứu theo Số điện thoại mua hàng
          </label>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              color: searchType === "order" ? "var(--color-pricing-blue)" : "var(--color-slate)",
            }}
          >
            <input
              type="radio"
              name="storefrontSearchType"
              checked={searchType === "order"}
              onChange={() => setSearchType("order")}
              style={{ cursor: "pointer", accentColor: "var(--color-pricing-blue)" }}
            />
            <Package size={15} />
            Tra cứu theo Mã đơn hàng (VD: DH-...)
          </label>
        </div>

        {/* Form Input + Button */}
        <form onSubmit={handleFormSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "260px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === "imei"
                  ? "Nhập 15 số IMEI điện thoại (VD: 358912345678901)"
                  : searchType === "phone"
                  ? "Nhập số điện thoại mua hàng (VD: 0987654321)"
                  : "Nhập mã đơn hàng (VD: DH-20261020-1001)"
              }
              style={{
                width: "100%",
                height: "46px",
                paddingLeft: "42px",
                paddingRight: "16px",
                fontSize: "14px",
                borderRadius: "12px",
                border: "1.5px solid #cbd5e1",
                outline: "none",
                fontFamily: searchType === "imei" ? "monospace" : "inherit",
                fontWeight: searchType === "imei" ? 600 : 400,
                transition: "border-color 150ms ease",
                backgroundColor: "#f8fafc",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-pricing-blue)")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pricing-blue"
            style={{
              height: "46px",
              padding: "0 28px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>Đang kiểm tra...</>
            ) : (
              <>
                <ShieldCheck size={18} /> Kiểm tra bảo hành ngay
              </>
            )}
          </button>
        </form>

        {/* Nút test nhanh / Sample Quick Chips */}
        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--color-slate)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Sparkles size={13} color="#ea580c" /> Thử nhanh mã mẫu:
          </span>
          {quickDemoItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickDemoClick(item)}
              style={{
                backgroundColor: "#f1f5f9",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "4px 10px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#eff6ff";
                e.currentTarget.style.color = "var(--color-pricing-blue)";
                e.currentTarget.style.borderColor = "#93c5fd";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
                e.currentTarget.style.color = "#1e293b";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. HƯỚNG DẪN: "LẤY MÃ Ở ĐÂU?" (GIẢI QUYẾT BĂN KHOĂN CỦA KHÁCH HÀNG) */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "16px",
          border: "1px dashed #cbd5e1",
          padding: "16px 20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setShowGuide(!showGuide)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <HelpCircle size={18} color="var(--color-pricing-blue)" />
            <strong style={{ fontSize: "14px", color: "var(--color-ink)" }}>
              Bạn chưa biết lấy số IMEI hoặc mã bảo hành ở đâu?
            </strong>
          </div>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "var(--color-slate)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {showGuide ? "Thu gọn" : "Xem hướng dẫn"}
            {showGuide ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showGuide && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <div style={{ backgroundColor: "#fff", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-pricing-blue)", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                <Phone size={14} /> Cách 1: Bấm phím *#06#
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
                Mở ứng dụng <strong>Điện thoại</strong> (bàn phím gọi số), bấm cụm phím <strong>*#06#</strong>. Dãy 15 số IMEI sẽ hiển thị ngay trên màn hình.
              </p>
            </div>

            <div style={{ backgroundColor: "#fff", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16a34a", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                <Phone size={14} /> Cách 2: Dùng Số điện thoại
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
                Không cần nhớ IMEI! Chọn mục <strong>"Tra cứu theo Số điện thoại"</strong> ở trên, nhập số điện thoại bạn đã dùng khi đặt hàng tại Phone Store.
              </p>
            </div>

            <div style={{ backgroundColor: "#fff", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ea580c", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                <Package size={14} /> Cách 3: Xem trên vỏ hộp máy
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
                Mặt sau vỏ hộp máy (hoặc tem niêm phong) luôn in sẵn dòng chữ <strong>IMEI / MEID</strong> gồm 15 chữ số kèm mã vạch.
              </p>
            </div>

            <div style={{ backgroundColor: "#fff", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7c3aed", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                <Smartphone size={14} /> Cách 4: Trong mục Đơn hàng
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
                Vào mục <strong>Tài khoản &gt; Đơn hàng của tôi</strong> để tra cứu mã đơn hàng (VD: DH-...) hoặc bấm xem chi tiết máy vừa mua.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. BÁO LỖI NẾU KHÔNG TÌM THẤY */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong>Không tìm thấy thông tin:</strong> {error}
            <div style={{ fontSize: "12px", color: "#7f1d1d", marginTop: "4px" }}>
              Gợi ý: Quý khách hãy thử đổi sang chế độ <em>"Tra cứu theo Số điện thoại"</em> hoặc bấm thử các mã mẫu phía trên.
            </div>
          </div>
        </div>
      )}

      {/* 4. HIỂN THỊ KẾT QUẢ THẺ BẢO HÀNH ĐIỆN TỬ VIP */}
      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-ink)" }}>
              Tìm thấy {results.length} thiết bị có thông tin bảo hành:
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#334155",
                cursor: "pointer",
              }}
            >
              <Printer size={14} /> In thẻ bảo hành
            </button>
          </div>

          {results.map((result, idx) => {
            const isActive = result.status === "ACTIVE";
            const percentRemaining = Math.max(0, Math.min(100, Math.round(((result.daysRemaining || 0) / 365) * 100)));

            return (
              <div
                key={result.id || result.imeiNumber || idx}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "24px",
                  border: `2px solid ${isActive ? "#86efac" : "#fca5a5"}`,
                  padding: "32px 28px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Dải ruy-băng góc hoặc biểu tượng nền sang trọng */}
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: isActive ? "rgba(22, 163, 74, 0.05)" : "rgba(220, 38, 38, 0.05)",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />

                {/* Header Thẻ: Huy hiệu trạng thái */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "18px",
                    marginBottom: "20px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        padding: "8px",
                        borderRadius: "12px",
                        backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                        color: isActive ? "#16a34a" : "#dc2626",
                      }}
                    >
                      <ShieldCheck size={26} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            backgroundColor: isActive ? "#16a34a" : "#dc2626",
                            color: "#fff",
                          }}
                        >
                          {isActive ? "BẢO HÀNH CHÍNH HÃNG" : "ĐÃ HẾT HẠN BẢO HÀNH"}
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          Tiêu chuẩn phân phối VNA
                        </span>
                      </div>
                      <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "4px 0 0 0", color: "var(--color-ink)" }}>
                        {result.productName}
                      </h3>
                      {result.variantName && (
                        <span style={{ fontSize: "13px", color: "var(--color-pricing-blue)", fontWeight: 600 }}>
                          Phiên bản: {result.variantName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Đồng hồ đếm ngược số ngày */}
                  <div
                    style={{
                      textAlign: "right",
                      backgroundColor: isActive ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${isActive ? "#bbf7d0" : "#fecaca"}`,
                      borderRadius: "14px",
                      padding: "10px 16px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>Thời hạn còn lại:</span>
                    <strong style={{ fontSize: "18px", color: isActive ? "#16a34a" : "#dc2626" }}>
                      {isActive ? `${result.daysRemaining} ngày` : "0 ngày"}
                    </strong>
                  </div>
                </div>

                {/* Thanh tiến độ trực quan */}
                <div style={{ marginBottom: "24px", position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                    <span>Ngày kích hoạt: <strong>{result.startDate}</strong></span>
                    <span>Hạn bảo hành: <strong>{result.endDate}</strong></span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${isActive ? percentRemaining : 0}%`,
                        backgroundColor: isActive ? "#16a34a" : "#dc2626",
                        borderRadius: "9999px",
                        transition: "width 500ms ease",
                      }}
                    />
                  </div>
                </div>

                {/* Grid chi tiết thông số bảo hành */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    backgroundColor: "#f8fafc",
                    padding: "20px",
                    borderRadius: "16px",
                    marginBottom: "20px",
                    fontSize: "13px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div>
                    <span style={{ color: "#64748b", display: "block", marginBottom: "3px" }}>Số IMEI máy (15 số):</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <strong style={{ fontFamily: "monospace", fontSize: "15px", color: "var(--color-ink)", letterSpacing: "0.05em" }}>
                        {result.imeiNumber}
                      </strong>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(result.imeiNumber)}
                        title="Sao chép số IMEI"
                        style={{
                          background: "#e2e8f0",
                          border: "none",
                          borderRadius: "4px",
                          padding: "3px 6px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "11px",
                          color: "#334155",
                        }}
                      >
                        {copiedImei === result.imeiNumber ? (
                          <>
                            <Check size={12} color="#16a34a" /> <span style={{ color: "#16a34a", marginLeft: "2px" }}>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> <span style={{ marginLeft: "2px" }}>Chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", display: "block", marginBottom: "3px" }}>Khách hàng đăng ký:</span>
                    <strong style={{ color: "var(--color-ink)" }}>{result.customerName}</strong>
                    <div style={{ color: "#64748b", fontSize: "12px" }}>SĐT: {result.customerPhone}</div>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", display: "block", marginBottom: "3px" }}>Mã đơn mua hàng:</span>
                    <strong style={{ color: "var(--color-pricing-blue)" }}>{result.orderCode || "Tại Showroom"}</strong>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", display: "block", marginBottom: "3px" }}>Ghi chú xuất kho:</span>
                    <span style={{ color: "#475569" }}>{result.note || "Hàng mới nguyên seal chính hãng"}</span>
                  </div>
                </div>

                {/* Các đặc quyền bảo hành chính hãng */}
                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "16px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                    fontSize: "12px",
                    color: "#334155",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span><strong>1 đổi 1 trong 30 ngày</strong> nếu có lỗi nhà sản xuất</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span>Bảo hành tại <strong>TTBH Ủy Quyền Toàn Quốc</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span>Hỗ trợ mượn máy dùng tạm trong khi sửa</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span>Vệ sinh máy & cài đặt phần mềm trọn đời</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

