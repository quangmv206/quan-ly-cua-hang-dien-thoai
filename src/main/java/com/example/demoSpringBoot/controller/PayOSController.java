package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.model.Order;
import com.example.demoSpringBoot.repository.OrderRepository;
import com.example.demoSpringBoot.service.PayOSService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment/payos")
@CrossOrigin(origins = "*")
public class PayOSController {

    private final PayOSService payOSService;
    private final OrderRepository orderRepository;

    public PayOSController(PayOSService payOSService, OrderRepository orderRepository) {
        this.payOSService = payOSService;
        this.orderRepository = orderRepository;
    }

    /**
     * Tạo liên kết thanh toán PayOS VietQR tự động
     */
    @PostMapping("/create-payment-link")
    public ResponseEntity<?> createPaymentLink(@RequestBody Map<String, Object> request) {
        try {
            String orderCode = (String) request.get("orderCode");
            String returnUrl = (String) request.get("returnUrl");
            String cancelUrl = (String) request.get("cancelUrl");

            if (orderCode == null || orderCode.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Thiếu mã đơn hàng orderCode"));
            }

            Optional<Order> orderOpt = orderRepository.findByOrderCode(orderCode);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy đơn hàng: " + orderCode));
            }

            Order order = orderOpt.get();
            Map<String, Object> paymentData = payOSService.createPaymentLink(order, returnUrl, cancelUrl);

            return ResponseEntity.ok(paymentData);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    /**
     * Webhook nhận thông báo giao dịch thành công tự động từ PayOS
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> webhookBody) {
        try {
            boolean isValid = payOSService.verifyWebhook(webhookBody);
            if (!isValid) {
                System.err.println(">>> [PayOS Webhook] Chữ ký Webhook không hợp lệ!");
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid signature"));
            }

            payOSService.handleWebhook(webhookBody);
            return ResponseEntity.ok(Map.of("success", true, "message", "Webhook processed"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}

