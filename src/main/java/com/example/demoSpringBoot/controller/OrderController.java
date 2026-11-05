package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.OrderRequest;
import com.example.demoSpringBoot.dto.OrderResponse;
import com.example.demoSpringBoot.dto.OrderStatusUpdateRequest;
import com.example.demoSpringBoot.exception.UnauthorizedException;
import com.example.demoSpringBoot.security.SecurityUtils;
import com.example.demoSpringBoot.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtils securityUtils;

    public OrderController(OrderService orderService, SecurityUtils securityUtils) {
        this.orderService = orderService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody OrderRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return orderService.createOrder(userId, request);
    }

    @GetMapping("/my-orders")
    public List<OrderResponse> getMyOrders() {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để xem lịch sử đơn hàng");
        }
        return orderService.getUserOrders(userId);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/code/{orderCode}")
    public OrderResponse getOrderByCode(@PathVariable String orderCode) {
        return orderService.getOrderByCode(orderCode);
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return orderService.updateOrderStatus(id, request);
    }
}
