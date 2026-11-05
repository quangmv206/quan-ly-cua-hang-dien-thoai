package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhoneVariantResponse {
    private Long id;
    private String sku;
    private String color;
    private String storage;
    private String ram;
    private double price;
    private int stockQuantity;
    private String thumbnailUrl;
    private String status;
}
