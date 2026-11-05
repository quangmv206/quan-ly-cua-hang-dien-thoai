package com.example.demoSpringBoot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyResponse {
    private Long id;
    private String imeiNumber;
    private String productName;
    private String variantName;
    private String customerName;
    private String customerPhone;
    private String orderCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String note;
    private long daysRemaining;
}
