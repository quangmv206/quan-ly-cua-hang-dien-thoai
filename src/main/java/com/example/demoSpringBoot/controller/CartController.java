package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.CartItemRequest;
import com.example.demoSpringBoot.dto.CartResponse;
import com.example.demoSpringBoot.exception.UnauthorizedException;
import com.example.demoSpringBoot.security.SecurityUtils;
import com.example.demoSpringBoot.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final SecurityUtils securityUtils;

    public CartController(CartService cartService, SecurityUtils securityUtils) {
        this.cartService = cartService;
        this.securityUtils = securityUtils;
    }

    private Long getRequiredUserId() {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để sử dụng giỏ hàng");
        }
        return userId;
    }

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCartByUserId(getRequiredUserId());
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addToCart(@Valid @RequestBody CartItemRequest request) {
        return cartService.addToCart(getRequiredUserId(), request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponse updateCartItem(@PathVariable Long itemId, @RequestParam int quantity) {
        return cartService.updateCartItem(getRequiredUserId(), itemId, quantity);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeCartItem(@PathVariable Long itemId) {
        return cartService.removeCartItem(getRequiredUserId(), itemId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearCart(getRequiredUserId());
    }
}
