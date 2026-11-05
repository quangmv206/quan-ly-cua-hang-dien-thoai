package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderCode;
    private String recipientName;
    private String recipientEmail;
    private String recipientPhone;
    private String shippingAddress;
    private double totalAmount;
    private double shippingFee;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private String note;
    private String voucherCode;
    private double discountAmount;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items = new ArrayList<>();

    public OrderResponse(Long id, String orderCode, String recipientName, String recipientPhone,
                         String shippingAddress, double totalAmount, double shippingFee,
                         String status, String paymentStatus, String paymentMethod, String note,
                         LocalDateTime createdAt, List<OrderItemResponse> items) {
        this.id = id;
        this.orderCode = orderCode;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.shippingAddress = shippingAddress;
        this.totalAmount = totalAmount;
        this.shippingFee = shippingFee;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.note = note;
        this.createdAt = createdAt;
        this.items = items;
    }
}
