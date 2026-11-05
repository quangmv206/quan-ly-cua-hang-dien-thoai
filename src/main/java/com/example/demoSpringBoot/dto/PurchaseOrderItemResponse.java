package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItemResponse {
    private Long id;
    private Long variantId;
    private String productName;
    private String variantName;
    private String sku;
    private int quantity;
    private double unitCost;
    private double lineTotal;
}

