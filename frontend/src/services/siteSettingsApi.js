import apiClient from "../api/apiClient";

export const siteSettingsApi = {
  // Lấy toàn bộ cấu hình trang người dùng
  getAll: () => apiClient.get("/site-settings"),

  // Lấy cấu hình theo key
  getByKey: (key) => apiClient.get(`/site-settings/${key}`),

  // Lấy cấu hình theo nhóm (home, products, policy, store)
  getByGroup: (group) => apiClient.get(`/site-settings/group/${group}`),

  // Lưu / Cập nhật một cấu hình
  save: (key, payload) => apiClient.put(`/site-settings/${key}`, payload),

  // Lưu hàng loạt nhiều cấu hình cùng lúc
  saveBatch: (batch) => apiClient.post("/site-settings/batch", batch),
};

