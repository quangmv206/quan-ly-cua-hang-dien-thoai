package com.example.demoSpringBoot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {
    @NotBlank(message = "Trạng thái không được để trống")
    private String status; // PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED

    private String paymentStatus; // UNPAID, PAID
}
