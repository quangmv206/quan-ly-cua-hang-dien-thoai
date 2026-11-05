package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhoneDetailResponse {
    private Integer id;
    private String name;
    private BrandResponse brand;
    private CategoryResponse category;
    private double price;
    private int quantity;
    private String description;
    private String specifications;
    private String imageUrl;
    private String status;
    private List<PhoneVariantResponse> variants;
}
