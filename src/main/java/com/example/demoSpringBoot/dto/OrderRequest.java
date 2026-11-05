package com.example.demoSpringBoot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotBlank(message = "Tên người nhận không được để trống")
    private String recipientName;

    private String recipientEmail;

    @NotBlank(message = "Số điện thoại người nhận không được để trống")
    private String recipientPhone;

    @NotBlank(message = "Địa chỉ nhận hàng không được để trống")
    private String shippingAddress;

    private String paymentMethod = "COD"; // COD, VNPAY, MOMO, BANKING
    private String note;
    private String voucherCode;
    private Double discountAmount = 0.0;
    private Double shippingFee = 0.0;

    // If empty, will checkout all items from user's cart
    private List<OrderItemRequest> items;
}
