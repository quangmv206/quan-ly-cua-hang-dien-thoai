package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.CartItemRequest;
import com.example.demoSpringBoot.dto.CartResponse;

public interface CartService {
    CartResponse getCartByUserId(Long userId);
    CartResponse addToCart(Long userId, CartItemRequest request);
    CartResponse updateCartItem(Long userId, Long cartItemId, int quantity);
    CartResponse removeCartItem(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
