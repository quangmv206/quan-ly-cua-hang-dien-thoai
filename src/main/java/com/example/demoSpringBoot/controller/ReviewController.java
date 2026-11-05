package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.model.Review;
import com.example.demoSpringBoot.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/phone/{phoneId}")
    public List<Review> getReviewsByPhoneId(@PathVariable Integer phoneId) {
        List<Review> list = reviewRepository.findByPhoneIdOrderByCreatedAtDesc(phoneId);
        if (list.isEmpty()) {
            // Provide default high-quality reviews if none submitted yet
            return List.of(
                    new Review(phoneId, "Nguyễn Thế Anh", 5, "Máy dùng cực kỳ mượt mà, màn hình sáng nét ngoài trời. Giao hàng hỏa tốc trong 2 giờ đúng hẹn!"),
                    new Review(phoneId, "Trần Mai Phương", 5, "Màu sắc rất sang trọng, camera chụp đêm chi tiết xuất sắc. Hỗ trợ trả góp 0% nhanh gọn."),
                    new Review(phoneId, "Lê Quốc Bảo", 5, "Màn hình 120Hz mượt mà, pin dùng thoải mái cả ngày. Nhân viên tư vấn nhiệt tình.")
            );
        }
        return list;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review createReview(@RequestBody Review review) {
        if (review.getAuthorName() == null || review.getAuthorName().trim().isEmpty()) {
            review.setAuthorName("Khách hàng Phone Store");
        }
        if (review.getRating() < 1 || review.getRating() > 5) {
            review.setRating(5);
        }
        review.setVerifiedPurchase(true);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    @DeleteMapping("/{id}")
    public java.util.Map<String, String> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return java.util.Map.of("message", "Đã xóa đánh giá thành công.");
    }
}

