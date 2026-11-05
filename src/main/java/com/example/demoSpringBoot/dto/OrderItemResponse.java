package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long variantId;
    private String productName;
    private String variantName;
    private String sku;
    private int quantity;
    private double price;
    private double lineTotal;
}
