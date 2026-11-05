package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long variantId;
    private String productName;
    private String variantName;
    private String sku;
    private double price;
    private int quantity;
    private double lineTotal;
    private String thumbnailUrl;
}
