package com.example.demoSpringBoot.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {
    private Long variantId;
    private Integer phoneId;
    private String productName;
    private String variantName;
    private Double price;

    @Min(value = 1, message = "Số lượng phải >= 1")
    private int quantity = 1;
}
