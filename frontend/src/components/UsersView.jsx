import React, { useState, useEffect } from "react";
import { Users, UserPlus, Shield, Key, CheckCircle, AlertCircle, RefreshCw, UserCheck, Loader2 } from "lucide-react";
import { userApi } from "../services/userApi";
import LoadingSpinner from "./LoadingSpinner";

export default function UsersView({ user, onRequireLogin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form thêm tài khoản mới
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "ROLE_USER",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách tài khoản (Có thể cần đăng nhập tài khoản có quyền xem).");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setFormData({
      username: "",
      password: "",
      role: "ROLE_USER",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setFormError("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setFormError("Mật khẩu phải có ít nhất 4 ký tự");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      await userApi.createUser({
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role,
      });
      showToast(`Tạo tài khoản "${formData.username}" thành công!`);
      setModalOpen(false);
      await fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Lỗi tạo tài khoản");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="users-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-heading">Người dùng & Phân quyền</h1>
          <p className="page-sub">Quản lý danh sách tài khoản quản trị viên và khách hàng</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchUsers} className="btn btn-secondary">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <UserPlus size={18} /> Thêm tài khoản
          </button>
        </div>
      </div>

      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
          <div className="stat-data">
            <span className="stat-title">Tổng số người dùng</span>
            <span className="stat-value">{users.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Shield size={24} />
          </div>
          <div className="stat-data">
            <span className="stat-title">Quản trị viên (ADMIN)</span>
            <span className="stat-value">
              {users.filter((u) => u.role === "ROLE_ADMIN").length}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <UserCheck size={24} />
          </div>
          <div className="stat-data">
            <span className="stat-title">Khách mua hàng (USER)</span>
            <span className="stat-value">
              {users.filter((u) => u.role !== "ROLE_ADMIN").length}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Đang tải danh sách người dùng..." />
      ) : error ? (
        <div className="card text-center p-8">
          <AlertCircle size={40} className="text-warning mx-auto mb-2" />
          <h3 className="text-base font-bold text-error">{error}</h3>
          <p className="text-muted text-sm mt-1">
            Vui lòng đăng nhập với tài khoản <code>admin / admin123</code> để xem danh sách.
          </p>
          <button onClick={onRequireLogin} className="btn btn-primary mt-4">
            Đăng nhập ngay
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="card text-center p-8">
          <Users size={48} className="text-muted mx-auto mb-2" />
          <h3 className="text-lg font-bold">Chưa có người dùng nào trong cơ sở dữ liệu</h3>
          <p className="text-muted">Nhấn nút "Thêm tài khoản" ở trên để khởi tạo.</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên tài khoản (Username)</th>
                <th>Vai trò (Role)</th>
                <th>Trạng thái phân quyền</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.role === "ROLE_ADMIN";
                return (
                  <tr key={u.id}>
                    <td className="text-muted font-mono">#{u.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className={`user-avatar-small ${isAdmin ? "admin" : "user"}`}>
                          {isAdmin ? <Shield size={14} /> : <Users size={14} />}
                        </div>
                        <span className="font-bold text-base">{u.username}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${isAdmin ? "role-admin" : "role-user"}`}>
                        {u.role || "ROLE_USER"}
                      </span>
                    </td>
                    <td>
                      <span className="badge-outline">
                        {isAdmin ? "Toàn quyền quản trị hệ thống" : "Khách hàng mua sắm & đặt hàng"}
                      </span>
                    </td>
                    <td className="text-muted text-sm">
                      {u.username === "admin" ? "Tài khoản Super Admin mặc định" : "Tài khoản hệ thống"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm Người Dùng Mới */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tạo mới tài khoản người dùng</h3>
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

            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  Tên đăng nhập (Username) <span className="req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: nhanvien1, quanly_kho..."
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mật khẩu <span className="req">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Tối thiểu 4 ký tự"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vai trò (Role)</label>
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={saving}
                >
                  <option value="ROLE_USER">ROLE_USER (Khách mua hàng)</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN (Quản trị viên toàn quyền)</option>
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
                      <Loader2 size={16} className="spinner-icon" /> Đang tạo...
                    </>
                  ) : (
                    "Tạo tài khoản"
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

