package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.model.Order;
import com.example.demoSpringBoot.repository.OrderRepository;
import com.example.demoSpringBoot.service.PayOSService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class PayOSServiceImpl implements PayOSService {

    @Value("${payos.client-id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String PAYOS_CREATE_URL = "https://api-merchant.payos.vn/v2/payment-requests";

    public PayOSServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Map<String, Object> createPaymentLink(Order order, String returnUrl, String cancelUrl) {
        try {
            // PayOS orderCode bắt buộc là số nguyên (long). Sử dụng timestamp hoặc ID đơn hàng
            long orderCode = System.currentTimeMillis() / 1000;
            if (order.getId() != null) {
                // Tạo số nguyên duy nhất từ ID đơn hàng
                orderCode = (order.getId() * 100000L) + (System.currentTimeMillis() % 100000L);
            }

            long amount = Math.round(order.getTotalAmount());
            if (amount <= 0) {
                // Nếu tổng thanh toán là 0đ (do giảm giá voucher 100%), không thể tạo link PayOS vì PayOS yêu cầu tối thiểu 1.000đ
                throw new RuntimeException("Đơn hàng 0đ (đã được giảm giá 100%) không cần quét QR qua PayOS.");
            }

            String description = "DH " + (order.getOrderCode() != null ? order.getOrderCode() : String.valueOf(order.getId()));
            if (description.length() > 25) {
                description = description.substring(0, 25);
            }

            if (returnUrl == null || returnUrl.isBlank()) {
                returnUrl = "http://localhost:5173/order-success?orderId=" + order.getOrderCode();
            }
            if (cancelUrl == null || cancelUrl.isBlank()) {
                cancelUrl = "http://localhost:5173/checkout";
            }

            // 1. Tạo chuỗi ký HMAC-SHA256: amount, cancelUrl, description, orderCode, returnUrl theo alphabet
            String signatureData = String.format(
                    "amount=%d&cancelUrl=%s&description=%s&orderCode=%d&returnUrl=%s",
                    amount, cancelUrl, description, orderCode, returnUrl
            );

            String signature = hmacSha256(signatureData, checksumKey);

            // 2. Tạo body gửi tới payOS
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("orderCode", orderCode);
            requestBody.put("amount", amount);
            requestBody.put("description", description);
            requestBody.put("cancelUrl", cancelUrl);
            requestBody.put("returnUrl", returnUrl);
            requestBody.put("signature", signature);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-client-id", clientId);
            headers.set("x-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(PAYOS_CREATE_URL, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map body = response.getBody();
                String code = String.valueOf(body.get("code"));
                if ("00".equals(code) || "0".equals(code)) {
                    Map<String, Object> data = (Map<String, Object>) body.get("data");
                    return data;
                } else {
                    throw new RuntimeException("PayOS trả về lỗi: " + body.get("desc"));
                }
            } else {
                throw new RuntimeException("Không thể kết nối PayOS Gateway, status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println(">>> [PayOS] Lỗi tạo link thanh toán: " + e.getMessage());
            throw new RuntimeException("Lỗi tạo thanh toán PayOS: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyWebhook(Map<String, Object> webhookBody) {
        if (webhookBody == null || !webhookBody.containsKey("data") || !webhookBody.containsKey("signature")) {
            return false;
        }

        try {
            Map<String, Object> data = (Map<String, Object>) webhookBody.get("data");
            String receivedSignature = (String) webhookBody.get("signature");

            // Sắp xếp các key của data theo thứ tự A-Z
            List<String> sortedKeys = new ArrayList<>(data.keySet());
            Collections.sort(sortedKeys);

            StringBuilder dataString = new StringBuilder();
            for (String key : sortedKeys) {
                Object val = data.get(key);
                String strVal = (val != null) ? String.valueOf(val) : "";
                if (dataString.length() > 0) {
                    dataString.append("&");
                }
                dataString.append(key).append("=").append(strVal);
            }

            String calculated = hmacSha256(dataString.toString(), checksumKey);
            return calculated.equalsIgnoreCase(receivedSignature);

        } catch (Exception e) {
            System.err.println(">>> [PayOS] Lỗi verify webhook signature: " + e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional
    public void handleWebhook(Map<String, Object> webhookBody) {
        try {
            Map<String, Object> data = (Map<String, Object>) webhookBody.get("data");
            String desc = data.get("description") != null ? String.valueOf(data.get("description")) : "";

            // Trích xuất mã đơn hàng từ mô tả (VD: "DH PS-123456" hoặc "DH-1")
            String orderCode = null;
            if (desc.startsWith("DH ")) {
                orderCode = desc.substring(3).trim();
            }

            if (orderCode != null) {
                Optional<Order> orderOpt = orderRepository.findByOrderCode(orderCode);
                if (orderOpt.isPresent()) {
                    Order order = orderOpt.get();
                    order.setPaymentStatus("PAID");
                    order.setStatus("CONFIRMED");
                    order.setPaymentMethod("PAYOS_MB");
                    orderRepository.save(order);
                    System.out.println(">>> [PayOS Webhook] Đã tự động cập nhật đơn hàng thành công: " + orderCode);
                }
            }
        } catch (Exception e) {
            System.err.println(">>> [PayOS Webhook] Lỗi cập nhật đơn hàng: " + e.getMessage());
        }
    }

    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hmacBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tính mã HMAC SHA256", e);
        }
    }
}

