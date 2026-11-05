import apiClient from "../api/apiClient";

export const voucherApi = {
  // Lấy các mã voucher đang hoạt động
  getActive: () => apiClient.get("/vouchers"),

  // Lấy toàn bộ mã voucher cho Admin
  getAllForAdmin: () => apiClient.get("/vouchers/admin/all"),

  // Tạo mới voucher
  create: (data) => apiClient.post("/vouchers", data),

  // Cập nhật voucher
  update: (id, data) => apiClient.put(`/vouchers/${id}`, data),

  // Xóa voucher
  delete: (id) => apiClient.delete(`/vouchers/${id}`),

  // Kiểm tra & áp dụng mã voucher
  validate: (code, amount = 0) =>
    apiClient.get(`/vouchers/validate?code=${encodeURIComponent(code)}&amount=${amount}`),
};
