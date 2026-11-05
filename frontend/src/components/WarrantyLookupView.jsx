import React, { useState } from "react";
import { ShieldCheck, Search, AlertCircle, Calendar, Phone, CheckCircle, Clock } from "lucide-react";
import apiClient from "../api/apiClient";

export default function WarrantyLookupView() {
  const [imei, setImei] = useState("358912345678901");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!imei.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await apiClient.get(`/warranties/check?imei=${encodeURIComponent(imei.trim())}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Không tìm thấy thông tin bảo hành với số IMEI này");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card warranty-container">
      <div className="card-header">
        <div>
          <h2 className="page-heading">Tra cứu bảo hành điện thoại</h2>
          <p className="page-sub">Nhập số IMEI (15 chữ số) để kiểm tra thời hạn và thông tin kích hoạt bảo hành chính hãng</p>
        </div>
      </div>

      <form onSubmit={handleLookup} className="search-bar lookup-bar">
        <div className="search-input-wrapper">
          <ShieldCheck className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            placeholder="Nhập số IMEI máy (VD: 358912345678901)"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Đang tra cứu..." : "Kiểm tra ngay"}
        </button>
      </form>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="warranty-card">
          <div className="warranty-badge-status">
            <CheckCircle size={20} className="text-success" />
            <span className="status-label">Bảo hành chính hãng: {result.status === "ACTIVE" ? "CÒN HIỆU LỰC" : "HẾT HẠN"}</span>
          </div>

          <div className="warranty-grid">
            <div className="warranty-item">
              <span className="label">Số IMEI máy:</span>
              <span className="value bold">{result.imeiNumber}</span>
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
              <span className="value">{result.customerName}</span>
            </div>
            <div className="warranty-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">{result.customerPhone}</span>
            </div>
            <div className="warranty-item">
              <span className="label">Mã hóa đơn mua:</span>
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
            <span>Thời hạn còn lại: <strong>{result.daysRemaining} ngày</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
