package com.example.demoSpringBoot.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderRequest {
    @NotNull(message = "Nhà cung cấp không được để trống")
    private Long supplierId;

    private String note;
    private String status = "COMPLETED"; // PENDING, COMPLETED, CANCELLED

    @NotEmpty(message = "Danh sách sản phẩm nhập không được để trống")
    @Valid
    private List<PurchaseOrderItemRequest> items;
}

