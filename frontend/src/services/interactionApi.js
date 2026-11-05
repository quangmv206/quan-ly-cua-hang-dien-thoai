import apiClient from "../api/apiClient";

export const interactionApi = {
  // Đánh giá sản phẩm (Reviews)
  getReviews: async (phoneId) => {
    try {
      const res = await apiClient.get(`/reviews/phone/${phoneId}`);
      return res.data;
    } catch {
      return [
        {
          authorName: "Nguyễn Thế Anh",
          rating: 5,
          createdAt: "2026-11-01T10:00:00",
          comment: "Máy dùng cực kỳ mượt mà, màn hình sáng nét ngoài trời. Giao hàng hỏa tốc trong 2 giờ đúng hẹn!",
        },
        {
          authorName: "Trần Mai Phương",
          rating: 5,
          createdAt: "2026-10-28T14:30:00",
          comment: "Màu sắc rất sang trọng, camera chụp đêm chi tiết xuất sắc. Hỗ trợ trả góp 0% nhanh gọn.",
        },
        {
          authorName: "Lê Quốc Bảo",
          rating: 5,
          createdAt: "2026-10-20T09:15:00",
          comment: "Màn hình 120Hz mượt mà, pin dùng thoải mái cả ngày. Nhân viên tư vấn nhiệt tình.",
        },
      ];
    }
  },

  createReview: (data) => apiClient.post("/reviews", data),

  // Hỏi đáp / Q&A
  getQuestions: async (phoneId) => {
    try {
      const url = phoneId ? `/questions?phoneId=${phoneId}` : "/questions";
      const res = await apiClient.get(url);
      return res.data;
    } catch {
      return [
        {
          id: 1,
          authorName: "Chị Thi",
          createdAt: "2 ngày trước",
          question: "Cho mình hỏi trước mình mua iPhone 15 Pro Max màu cam 512GB, giờ đổi 16 Pro Max 512GB thì bù trừ thêm bao nhiêu?",
          answer: "Dạ Phone Store xin chào Chị Thi! Chương trình Thu cũ Đổi mới trợ giá đến 3.000.000đ. Nhân viên Phone Store sẽ gọi lại qua số điện thoại để báo giá chi tiết và định giá máy nhanh cho chị trong 5 phút ạ!",
        },
        {
          id: 2,
          authorName: "Anh Hoàng Long",
          createdAt: "3 ngày trước",
          question: "Mua máy có được bóc seal kiểm tra tại chỗ trước khi thanh toán không shop?",
          answer: "Dạ chào Anh Long, Phone Store cam kết khách hàng được đồng kiểm niêm phong chính hãng, kích hoạt kiểm tra màn hình và tính năng trước khi ký nhận hoặc thanh toán ạ!",
        },
      ];
    }
  },

  submitQuestion: (data) => apiClient.post("/questions", data),

  // Quản lý Hỏi đáp (Admin)
  getAllQuestionsAdmin: () => apiClient.get("/questions"),
  answerQuestion: (id, answerText) => apiClient.put(`/questions/${id}/answer`, { answer: answerText }),
  deleteQuestion: (id) => apiClient.delete(`/questions/${id}`),

  // Quản lý Đánh giá (Admin)
  getAllReviewsAdmin: () => apiClient.get("/reviews"),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
};

