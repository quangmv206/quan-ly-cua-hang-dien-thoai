import apiClient from "../api/apiClient";

export const authApi = {
  // Đăng nhập lấy JWT Token
  login: async (username, password) => {
    const response = await apiClient.post("/auth/login", { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);
      try {
        const payloadBase64 = response.data.token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        const roles = payload.roles || [];
        const role = roles.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : "ROLE_USER";
        localStorage.setItem("role", role);
      } catch {
        const role = username === "admin" ? "ROLE_ADMIN" : "ROLE_USER";
        localStorage.setItem("role", role);
      }
    }
    return response.data;
  },

  // Đăng ký tài khoản
  register: (data) => apiClient.post("/users/register", data),

  // Quên mật khẩu - gửi mã OTP về email
  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),

  // Đặt lại mật khẩu với mã OTP
  resetPassword: (email, otp, newPassword) =>
    apiClient.post("/auth/reset-password", { email, otp, newPassword }),

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (!token) return null;
    return { token, username, role, isAdmin: role === "ROLE_ADMIN" };
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  },
};
