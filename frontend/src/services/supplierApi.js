import apiClient from "../api/apiClient";

export const supplierApi = {
  getAll: () => apiClient.get("/suppliers"),
  getById: (id) => apiClient.get(`/suppliers/${id}`),
  create: (data) => apiClient.post("/suppliers", data),
  update: (id, data) => apiClient.put(`/suppliers/${id}`, data),
  delete: (id) => apiClient.delete(`/suppliers/${id}`),
};

