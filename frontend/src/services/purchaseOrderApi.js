import apiClient from "../api/apiClient";

export const purchaseOrderApi = {
  getAll: () => apiClient.get("/purchase-orders"),
  getById: (id) => apiClient.get(`/purchase-orders/${id}`),
  create: (data) => apiClient.post("/purchase-orders", data),
};

