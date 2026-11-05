package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.OrderRequest;
import com.example.demoSpringBoot.dto.OrderResponse;
import com.example.demoSpringBoot.dto.OrderStatusUpdateRequest;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(Long userId, OrderRequest request);
    OrderResponse getOrderById(Long orderId);
    OrderResponse getOrderByCode(String orderCode);
    List<OrderResponse> getUserOrders(Long userId);
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request);
}
