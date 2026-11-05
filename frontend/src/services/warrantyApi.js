import apiClient from "../api/apiClient";

export const warrantyApi = {
  // Tra cứu theo số IMEI (Public)
  checkByImei: (imei) => apiClient.get(`/warranties/check?imei=${encodeURIComponent(imei)}`),

  // Tra cứu theo số điện thoại (Public)
  checkByPhone: (phone) => apiClient.get(`/warranties/phone?phone=${encodeURIComponent(phone)}`),

  // Kích hoạt thông tin bảo hành mới (Yêu cầu ADMIN)
  create: (data) => apiClient.post("/warranties", data),

  // Lấy toàn bộ danh sách bảo hành (Yêu cầu ADMIN)
  getAll: () => apiClient.get("/warranties"),
};

