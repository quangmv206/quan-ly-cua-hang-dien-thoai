import React, { useState } from "react";
import { X, LogIn, Key, User as UserIcon, AlertCircle, Loader2, UserPlus, CheckCircle2, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { authApi } from "../services/authApi";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  // 'login' | 'register' | 'forgot_password'
  const [modalMode, setModalMode] = useState("login");

  // Login & Register Form State
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ROLE_ADMIN");

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (modalMode === "register") {
        // Đăng ký tài khoản mới kèm email
        await authApi.register({
          username: username.trim(),
          email: email.trim(),
          password: password,
          role: role,
        });
        setSuccessMsg(`Đã tạo tài khoản "${username}" thành công! Đang tự động đăng nhập...`);
        await authApi.login(username.trim(), password);
        onLoginSuccess(authApi.getCurrentUser());
        setTimeout(() => onClose(), 800);
      } else {
        // Đăng nhập
        await authApi.login(username.trim(), password);
        onLoginSuccess(authApi.getCurrentUser());
        onClose();
      }
    } catch (err) {
      if (modalMode === "login" && username.trim() === "admin") {
        setError("Tài khoản 'admin' chưa tồn tại trong Database. Hãy nhấn nút 'Khởi tạo tài khoản Admin' bên dưới!");
      } else {
        setError(err.response?.data?.message || err.message || "Sai tài khoản hoặc mật khẩu");
      }
    } finally {
      setLoading(false);
    }
  };

  // Gửi mã OTP xác thực quên mật khẩu
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await authApi.forgotPassword(forgotEmail.trim());
      setOtpSent(true);
      if (res.data?.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      setSuccessMsg(res.data?.message || "Mã xác thực OTP đã được gửi đến email của bạn.");
    } catch (err) {
      if (err.message === "Network Error" || !err.response) {
        setError("Không thể kết nối đến máy chủ Backend (port 8080). Vui lòng đảm bảo Spring Boot đã khởi động lại thành công.");
      } else {
        setError(err.response?.data?.message || err.message || "Không tìm thấy tài khoản hoặc không thể gửi mã OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận đổi mật khẩu với OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || !newPassword.trim()) {
      setError("Vui lòng nhập đầy đủ mã OTP và mật khẩu mới.");
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await authApi.resetPassword(forgotEmail.trim(), otpCode.trim(), newPassword);
      const validUsername = res.data?.username || forgotEmail.trim();
      setSuccessMsg("Đặt lại mật khẩu thành công! Đang tự động đăng nhập...");

      // Tự động đăng nhập luôn vào tài khoản!
      try {
        await authApi.login(validUsername, newPassword);
        onLoginSuccess(authApi.getCurrentUser());
        setTimeout(() => onClose(), 800);
      } catch {
        // Fallback: chuyển về form đăng nhập với thông tin điền sẵn
        setTimeout(() => {
          setModalMode("login");
          setUsername(validUsername);
          setPassword(newPassword);
          setOtpSent(false);
          setOtpCode("");
          setNewPassword("");
        }, 1200);
      }
    } catch (err) {
      if (err.message === "Network Error" || !err.response) {
        setError("Không thể kết nối đến máy chủ Backend (port 8080).");
      } else {
        setError(err.response?.data?.message || err.message || "Mã xác thực OTP không đúng hoặc đã hết hạn.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickInitAdmin = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await authApi.register({
        username: "admin",
        email: "admin@phonestore.vn",
        password: "admin123",
        role: "ROLE_ADMIN",
      });
      await authApi.login("admin", "admin123");
      onLoginSuccess(authApi.getCurrentUser());
      onClose();
    } catch (err) {
      try {
        await authApi.login("admin", "admin123");
        onLoginSuccess(authApi.getCurrentUser());
        onClose();
      } catch (loginErr) {
        setError("Không thể khởi tạo tài khoản Admin. Vui lòng kiểm tra lại kết nối Spring Boot.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuick = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {modalMode === "login" && "Đăng nhập tài khoản"}
            {modalMode === "register" && "Đăng ký tài khoản"}
            {modalMode === "forgot_password" && "Khôi phục mật khẩu"}
          </h3>
          <button onClick={onClose} className="btn-icon close-btn">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "16px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: "16px" }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ----------------- CHẾ ĐỘ QUÊN MẬT KHẨU ----------------- */}
        {modalMode === "forgot_password" ? (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="modal-form">
                <p style={{ fontSize: "13px", color: "var(--color-slate, #64748b)", marginBottom: "16px" }}>
                  Nhập địa chỉ Email hoặc Tên đăng nhập của bạn. Hệ thống sẽ gửi mã OTP gồm 6 chữ số để xác thực.
                </p>
                <div className="form-group">
                  <label className="form-label">Email tài khoản</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input has-icon"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="vidu@gmail.com hoặc username"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="modal-actions mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode("login");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="btn btn-ghost text-xs mr-auto flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Quay lại Đăng nhập
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="spinner-icon" size={16} /> Đang gửi OTP...
                      </>
                    ) : (
                      <>
                        <Mail size={16} /> Gửi mã xác thực OTP
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="modal-form">
                {devOtp && (
                  <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#92400e", marginBottom: "16px" }}>
                    <strong>💡 Mã OTP test nhanh:</strong> <span style={{ letterSpacing: "2px", fontWeight: "bold", fontSize: "15px", color: "#b45309" }}>{devOtp}</span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(devOtp)}
                      style={{ marginLeft: "10px", fontSize: "11px", textDecoration: "underline", background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
                    >
                      (Bấm để điền ngay)
                    </button>
                    <div style={{ fontSize: "11px", color: "#a16207", marginTop: "4px" }}>
                      * Để email gửi thẳng vào hòm thư Gmail thực tế, bạn cần điền Gmail & Mật khẩu ứng dụng trong <code>application.properties</code>.
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Mã xác thực OTP (6 số)</label>
                  <div className="input-with-icon">
                    <ShieldCheck size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input has-icon"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.trim())}
                      placeholder="Nhập mã 6 chữ số trong email"
                      maxLength={6}
                      required
                      autoFocus
                      style={{ letterSpacing: "2px", fontWeight: "bold" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mật khẩu mới</label>
                  <div className="input-with-icon">
                    <Key size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-input has-icon"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="modal-actions mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setError(null);
                    }}
                    className="btn btn-ghost text-xs mr-auto flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Gửi lại mã khác
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="spinner-icon" size={16} /> Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Key size={16} /> Đặt lại mật khẩu
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ----------------- CHẾ ĐỘ ĐĂNG NHẬP / ĐĂNG KÝ ----------------- */
          <form onSubmit={handleLoginOrRegister} className="modal-form">
            <div className="form-group">
              <label className="form-label">
                {modalMode === "register" ? "Tên đăng nhập" : "Tên đăng nhập hoặc Email"}
              </label>
              <div className="input-with-icon">
                <UserIcon size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input has-icon"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={modalMode === "register" ? "Tạo username mới" : "Username hoặc email (ví dụ: taihuynh240805@gmail.com)"}
                  required
                />
              </div>
            </div>

            {modalMode === "register" && (
              <div className="form-group">
                <label className="form-label">Địa chỉ Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-input has-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com (nhận thông báo đơn & OTP)"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Mật khẩu</label>
                {modalMode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode("forgot_password");
                      setError(null);
                      setSuccessMsg(null);
                      setForgotEmail(username !== "admin" ? username : "");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-pricing-blue, #2563eb)",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "0 0 4px 0",
                      fontWeight: 500,
                    }}
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="input-with-icon">
                <Key size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input has-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  required
                />
              </div>
            </div>

            {modalMode === "register" && (
              <div className="form-group">
                <label className="form-label">Vai trò tài khoản</label>
                <select
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                  <option value="ROLE_USER">Khách hàng (ROLE_USER)</option>
                </select>
              </div>
            )}

            {modalMode === "login" && (
              <div className="quick-fill-box">
                <span className="quick-title">Tài khoản mặc định:</span>
                <div className="quick-buttons">
                  <button
                    type="button"
                    className="btn-badge"
                    onClick={() => fillQuick("admin", "admin123")}
                  >
                    Admin (admin123)
                  </button>
                  <button
                    type="button"
                    className="btn-badge"
                    onClick={() => fillQuick("user", "user123")}
                  >
                    User (user123)
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleQuickInitAdmin}
                    className="btn btn-outline-primary text-xs w-full py-1.5 flex items-center justify-center gap-1.5"
                    disabled={loading}
                  >
                    <UserPlus size={14} /> Khởi tạo tài khoản Admin ngay (Auto-setup)
                  </button>
                </div>
              </div>
            )}

            <div className="modal-actions mt-4">
              <button
                type="button"
                onClick={() => {
                  setModalMode(modalMode === "login" ? "register" : "login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="btn btn-ghost text-xs mr-auto"
              >
                {modalMode === "register" ? "← Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
              </button>

              <button type="button" onClick={onClose} className="btn btn-secondary">
                Đóng
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="spinner-icon" size={16} /> Đang xử lý...
                  </>
                ) : modalMode === "register" ? (
                  <>
                    <UserPlus size={16} /> Đăng ký
                  </>
                ) : (
                  <>
                    <LogIn size={16} /> Đăng nhập
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
