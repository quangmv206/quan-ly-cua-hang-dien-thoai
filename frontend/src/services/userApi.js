import apiClient from "../api/apiClient";

export const userApi = {
  getAll: () => apiClient.get("/users"),
  createUser: (data) => apiClient.post("/users/register", data),
  getProfile: () => apiClient.get("/users/profile"),
  updateProfile: (data) => apiClient.put("/users/profile", data),
  changePassword: (data) => apiClient.put("/users/change-password", data),
  getMyOrders: () => apiClient.get("/orders/my-orders"),
};
