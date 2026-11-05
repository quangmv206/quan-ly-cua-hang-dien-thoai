import apiClient from "../api/apiClient";

export const catalogApi = {
  // Thương hiệu (Brands)
  getBrands: () => apiClient.get("/brands"),
  getBrandById: (id) => apiClient.get(`/brands/${id}`),
  createBrand: (data) => apiClient.post("/brands", data),
  updateBrand: (id, data) => apiClient.put(`/brands/${id}`, data),
  deleteBrand: (id) => apiClient.delete(`/brands/${id}`),

  // Danh mục (Categories)
  getCategories: () => apiClient.get("/categories"),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
  createCategory: (data) => apiClient.post("/categories", data),
  updateCategory: (id, data) => apiClient.put(`/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
};
