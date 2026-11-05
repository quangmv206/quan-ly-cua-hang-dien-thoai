import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  CheckCircle,
  AlertCircle,
  Trash2,
  Send,
  User,
  Clock,
  Smartphone,
  CheckCheck,
  ShieldCheck,
  Search
} from "lucide-react";
import { interactionApi } from "../services/interactionApi";
import LoadingSpinner from "./LoadingSpinner";

export default function QuestionsReviewsView({ user, onRequireLogin }) {
  const [activeTab, setActiveTab] = useState("questions"); // 'questions' | 'reviews'
  const [questions, setQuestions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Trả lời câu hỏi
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, rRes] = await Promise.all([
        interactionApi.getAllQuestionsAdmin().catch(() => ({ data: [] })),
        interactionApi.getAllReviewsAdmin().catch(() => ({ data: [] })),
      ]);
      setQuestions(qRes.data || []);
      setReviews(rRes.data || []);
    } catch (err) {
      console.warn("Lỗi tải hỏi đáp & đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartAnswer = (q) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    setAnsweringId(q.id);
    setAnswerText(q.answer || "");
  };

  const handleSaveAnswer = async (qId) => {
    if (!answerText.trim()) {
      alert("Vui lòng nhập nội dung câu trả lời của kỹ thuật viên.");
      return;
    }
    setSubmittingAnswer(true);
    try {
      await interactionApi.answerQuestion(qId, answerText.trim());
      showToast("Đã gửi câu trả lời tư vấn viên thành công!");
      setAnsweringId(null);
      setAnswerText("");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi gửi câu trả lời", "error");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    try {
      await interactionApi.deleteQuestion(qId);
      showToast("Đã xóa câu hỏi thành công.");
      fetchData();
    } catch (err) {
      showToast("Lỗi xóa câu hỏi", "error");
    }
  };

  const handleDeleteReview = async (rId) => {
    if (!user || user.role !== "ROLE_ADMIN") {
      onRequireLogin();
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await interactionApi.deleteReview(rId);
      showToast("Đã xóa đánh giá thành công.");
      fetchData();
    } catch (err) {
      showToast("Lỗi xóa đánh giá", "error");
    }
  };

  return (
    <div className="qa-reviews-page" style={{ padding: "24px 32px" }}>
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 100 }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
          Quản Lý Hỏi & Đáp & Đánh Giá Khách Hàng
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
          Kỹ thuật viên trả lời các thắc mắc của khách hàng tại trang chi tiết sản phẩm và quản lý đánh giá 5 sao.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", marginBottom: "24px", paddingBottom: "8px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`btn ${activeTab === "questions" ? "btn-primary" : "btn-outline"}`}
          style={{ fontSize: "13px", padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <MessageSquare size={16} />
          <span>Hỏi & Đáp Kỹ thuật ({questions.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`btn ${activeTab === "reviews" ? "btn-primary" : "btn-outline"}`}
          style={{ fontSize: "13px", padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Star size={16} />
          <span>Đánh giá từ khách ({reviews.length})</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Đang nạp dữ liệu..." />
      ) : activeTab === "questions" ? (
        /* ================= TAB HỎI ĐÁP ================= */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {questions.length > 0 ? (
            questions.map((q) => (
              <div
                key={q.id}
                className="card"
                style={{
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-primary)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(0,113,227,0.1)", color: "var(--color-pricing-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                      <User size={18} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>{q.authorName || "Khách hàng"}</h4>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {q.createdAt ? q.createdAt.split("T")[0] : "Gần đây"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="btn-icon text-danger"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--text-primary)", marginBottom: "16px", padding: "10px 14px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
                  <strong>Câu hỏi:</strong> {q.question}
                </div>

                {/* Câu trả lời hiện tại */}
                {q.answer && answeringId !== q.id && (
                  <div style={{ padding: "12px 16px", borderRadius: "8px", borderLeft: "3px solid var(--color-pricing-blue)", backgroundColor: "rgba(0,113,227,0.04)", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--color-pricing-blue)", marginBottom: "4px" }}>
                      <ShieldCheck size={14} />
                      <span>Phản hồi từ Quản trị viên / Phone Store:</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)" }}>{q.answer}</p>
                  </div>
                )}

                {/* Form nhập câu trả lời */}
                {answeringId === q.id ? (
                  <div style={{ marginTop: "12px" }}>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Nhập nội dung phản hồi chính thức từ Phone Store..."
                      style={{ marginBottom: "10px" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setAnsweringId(null)}
                        className="btn btn-outline"
                        style={{ fontSize: "12px", padding: "6px 14px" }}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        disabled={submittingAnswer}
                        onClick={() => handleSaveAnswer(q.id)}
                        className="btn btn-primary"
                        style={{ fontSize: "12px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Send size={13} />
                        <span>{submittingAnswer ? "Đang gửi..." : "Lưu & Xuất bản phản hồi"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartAnswer(q)}
                    className="btn btn-outline"
                    style={{ fontSize: "12px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <MessageSquare size={14} />
                    <span>{q.answer ? "Chỉnh sửa câu trả lời" : "Gõ câu trả lời kỹ thuật viên"}</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Chưa có câu hỏi nào từ khách hàng.
            </div>
          )}
        </div>
      ) : (
        /* ================= TAB ĐÁNH GIÁ (REVIEWS) ================= */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div
                key={r.id}
                className="card"
                style={{
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-primary)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "14px" }}>{r.authorName || "Khách hàng"}</strong>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", color: "#f59e0b", fontSize: "13px" }}>
                        {Array.from({ length: r.rating || 5 }, (_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </span>
                      {r.verifiedPurchase && (
                        <span style={{ fontSize: "11px", color: "#16a34a", backgroundColor: "#dcfce7", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                          ✓ Đã mua hàng
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {r.createdAt ? r.createdAt.split("T")[0] : "Gần đây"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(r.id)}
                    className="btn-icon text-danger"
                    title="Xóa đánh giá"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)", lineHeight: "1.5" }}>
                  {r.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Chưa có đánh giá nào từ khách hàng.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

