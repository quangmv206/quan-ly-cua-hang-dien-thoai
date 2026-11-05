import apiClient from "../api/apiClient";

export const cartApi = {
  // Lấy giỏ hàng của user hiện tại
  getCart: () => apiClient.get("/cart"),

  // Thêm sản phẩm / biến thể vào giỏ hàng
  addToCart: (data) => apiClient.post("/cart/items", data),

  // Cập nhật số lượng mặt hàng trong giỏ
  updateItem: (itemId, quantity) =>
    apiClient.put(`/cart/items/${itemId}?quantity=${quantity}`),

  // Xóa mặt hàng khỏi giỏ
  removeItem: (itemId) => apiClient.delete(`/cart/items/${itemId}`),

  // Xóa toàn bộ giỏ hàng
  clearCart: () => apiClient.delete("/cart"),
};

