package com.example.demoSpringBoot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyRequest {
    @NotBlank(message = "Số IMEI không được để trống")
    private String imeiNumber;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String productName;

    private String variantName;

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String customerName;

    @NotBlank(message = "Số điện thoại khách hàng không được để trống")
    private String customerPhone;

    private String orderCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private String note;
}
