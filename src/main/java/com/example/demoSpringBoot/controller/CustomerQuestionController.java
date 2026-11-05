package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.model.CustomerQuestion;
import com.example.demoSpringBoot.repository.CustomerQuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
public class CustomerQuestionController {

    private final CustomerQuestionRepository questionRepository;

    public CustomerQuestionController(CustomerQuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping
    public List<CustomerQuestion> getAllQuestions(@RequestParam(required = false) Integer phoneId) {
        List<CustomerQuestion> list;
        if (phoneId != null) {
            list = questionRepository.findByPhoneIdOrderByCreatedAtDesc(phoneId);
        } else {
            list = questionRepository.findAllByOrderByCreatedAtDesc();
        }

        if (list.isEmpty()) {
            return List.of(
                    new CustomerQuestion(
                            phoneId,
                            "Chị Thi",
                            "Cho mình hỏi trước mình mua iPhone 15 Pro Max màu cam 512GB, giờ đổi 16 Pro Max 512GB thì bù trừ thêm bao nhiêu?",
                            "Dạ Phone Store xin chào Chị Thi! Chương trình Thu cũ Đổi mới trợ giá đến 3.000.000đ. Nhân viên Phone Store sẽ gọi lại qua số điện thoại để báo giá chi tiết và định giá máy nhanh cho chị trong 5 phút ạ!"
                    ),
                    new CustomerQuestion(
                            phoneId,
                            "Anh Hoàng Long",
                            "Mua máy có được bóc seal kiểm tra tại chỗ trước khi thanh toán không shop?",
                            "Dạ chào Anh Long, Phone Store cam kết khách hàng được đồng kiểm niêm phong chính hãng, kích hoạt kiểm tra màn hình và tính năng trước khi ký nhận hoặc thanh toán ạ!"
                    )
            );
        }
        return list;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerQuestion submitQuestion(@RequestBody CustomerQuestion q) {
        if (q.getAuthorName() == null || q.getAuthorName().trim().isEmpty()) {
            q.setAuthorName("Khách hàng");
        }
        q.setAnswer("Cảm ơn câu hỏi của bạn. Đội ngũ kỹ thuật viên Phone Store đang tiếp nhận và sẽ giải đáp trong vòng 15-30 phút!");
        q.setAnswered(true);
        q.setCreatedAt(LocalDateTime.now());
        return questionRepository.save(q);
    }

    @PutMapping("/{id}/answer")
    public CustomerQuestion answerQuestion(@PathVariable Long id, @RequestBody Map<String, String> body) {
        CustomerQuestion q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        q.setAnswer(body.getOrDefault("answer", ""));
        q.setAnswered(true);
        return questionRepository.save(q);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
        return Map.of("message", "Đã xóa câu hỏi thành công.");
    }
}

