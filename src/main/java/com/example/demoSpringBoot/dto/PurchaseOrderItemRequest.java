package com.example.demoSpringBoot.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItemRequest {
    @NotNull(message = "Mã biến thể sản phẩm không được để trống")
    private Long variantId;

    @Min(value = 1, message = "Số lượng nhập tối thiểu là 1")
    private int quantity;

    @Min(value = 0, message = "Giá nhập không được âm")
    private double unitCost;
}

