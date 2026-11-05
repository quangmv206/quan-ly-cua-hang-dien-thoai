import apiClient from "../api/apiClient";

export const phoneApi = {
  // Lấy danh sách toàn bộ điện thoại (Public)
  getAll: () => apiClient.get("/phones"),

  // Tìm kiếm điện thoại theo tên (Public)
  search: (keyword) => apiClient.get(`/phones/search?name=${encodeURIComponent(keyword)}`),

  // Lấy chi tiết điện thoại theo ID
  getById: (id) => apiClient.get(`/phones/${id}`),

  // Thêm điện thoại mới (Yêu cầu ADMIN)
  create: (data) => apiClient.post("/phones", data),

  // Cập nhật thông tin điện thoại (Yêu cầu ADMIN)
  update: (id, data) => apiClient.put(`/phones/${id}`, data),

  // Xóa điện thoại (Yêu cầu ADMIN)
  delete: (id) => apiClient.delete(`/phones/${id}`),

  // Lấy danh sách biến thể (màu sắc, RAM/ROM) của một điện thoại
  getVariants: (phoneId) => apiClient.get(`/phones/${phoneId}/variants`),

  // Thêm biến thể mới cho điện thoại (Yêu cầu ADMIN)
  addVariant: (phoneId, data) => apiClient.post(`/phones/${phoneId}/variants`, data),

  // Thêm ma trận nhiều biến thể tự động cùng lúc (Yêu cầu ADMIN)
  addVariantsBatch: async (phoneId, dataList) => {
    try {
      return await apiClient.post(`/phones/${phoneId}/variants/batch`, dataList);
    } catch (err) {
      // Nếu là lỗi xác thực/phân quyền (401, 403) thì quăng lỗi ra ngay để giao diện xử lý
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw err;
      }
      // Fallback: nếu endpoint batch chưa có (404) thì gọi tuần tự từng biến thể
      if (err.response?.status === 404) {
        const results = [];
        for (const item of dataList) {
          const res = await apiClient.post(`/phones/${phoneId}/variants`, item);
          results.push(res.data);
        }
        return { data: results };
      }
      throw err;
    }
  },

  // Cập nhật biến thể (Yêu cầu ADMIN)
  updateVariant: (variantId, data) => apiClient.put(`/variants/${variantId}`, data),

  // Xóa biến thể (Yêu cầu ADMIN)
  deleteVariant: (variantId) => apiClient.delete(`/variants/${variantId}`),
};
