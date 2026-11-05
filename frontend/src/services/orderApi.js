import apiClient from "../api/apiClient";

export const orderApi = {
  // Lấy toàn bộ đơn hàng (Yêu cầu ADMIN)
  getAll: () => apiClient.get("/orders"),

  // Lấy chi tiết đơn hàng theo ID
  getById: (id) => apiClient.get(`/orders/${id}`),

  // Lấy đơn hàng theo mã đơn
  getByCode: (orderCode) => apiClient.get(`/orders/code/${orderCode}`),

  // Lấy danh sách đơn hàng của người dùng đang đăng nhập
  getMyOrders: () => apiClient.get("/orders/my-orders"),

  // Cập nhật trạng thái đơn hàng & thanh toán (Yêu cầu ADMIN)
  updateStatus: (id, { status, paymentStatus }) =>
    apiClient.put(`/orders/${id}/status`, { status, paymentStatus }),

  // Tạo đơn hàng mới
  create: (data) => apiClient.post("/orders", data),
};

