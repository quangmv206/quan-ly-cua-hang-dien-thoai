package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.PurchaseOrderRequest;
import com.example.demoSpringBoot.dto.PurchaseOrderResponse;
import com.example.demoSpringBoot.security.SecurityUtils;
import com.example.demoSpringBoot.service.PurchaseOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;
    private final SecurityUtils securityUtils;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService, SecurityUtils securityUtils) {
        this.purchaseOrderService = purchaseOrderService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public List<PurchaseOrderResponse> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @GetMapping("/{id}")
    public PurchaseOrderResponse getPurchaseOrderById(@PathVariable Long id) {
        return purchaseOrderService.getPurchaseOrderById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseOrderResponse createPurchaseOrder(@Valid @RequestBody PurchaseOrderRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return purchaseOrderService.createPurchaseOrder(userId, request);
    }
}

