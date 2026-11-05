package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhoneRequest {
    private String name;
    private Integer brandId;
    private Integer categoryId;
    private Double price;
    private Integer quantity;
    private String description;
    private String imageUrl;

    // Chi tiết thông số kỹ thuật (Hardware Specs)
    private String screenSize;
    private String screenTech;
    private String screenResolution;
    private String cpu;
    private String gpu;
    private String os;
    private String ram;
    private String storage;
    private String rearCamera;
    private String frontCamera;
    private String battery;
    private String charging;
    private String sim;
    private String network;
    private String waterproof;
    private String weight;
    private String origin;
    private String warrantyPeriod;
}
