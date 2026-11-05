package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.PurchaseOrderRequest;
import com.example.demoSpringBoot.dto.PurchaseOrderResponse;

import java.util.List;

public interface PurchaseOrderService {
    List<PurchaseOrderResponse> getAllPurchaseOrders();
    PurchaseOrderResponse getPurchaseOrderById(Long id);
    PurchaseOrderResponse createPurchaseOrder(Long userId, PurchaseOrderRequest request);
}

