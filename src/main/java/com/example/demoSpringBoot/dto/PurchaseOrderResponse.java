package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderResponse {
    private Long id;
    private String purchaseCode;
    private Long supplierId;
    private String supplierName;
    private double totalAmount;
    private String status;
    private String note;
    private LocalDateTime createdAt;
    private List<PurchaseOrderItemResponse> items = new ArrayList<>();
}

