package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.CartItemRequest;
import com.example.demoSpringBoot.dto.CartItemResponse;
import com.example.demoSpringBoot.dto.CartResponse;
import com.example.demoSpringBoot.exception.BadRequestException;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.AppUser;
import com.example.demoSpringBoot.model.Cart;
import com.example.demoSpringBoot.model.CartItem;
import com.example.demoSpringBoot.model.PhoneVariant;
import com.example.demoSpringBoot.repository.CartItemRepository;
import com.example.demoSpringBoot.repository.CartRepository;
import com.example.demoSpringBoot.repository.PhoneVariantRepository;
import com.example.demoSpringBoot.repository.UserRepository;
import com.example.demoSpringBoot.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PhoneVariantRepository variantRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           PhoneVariantRepository variantRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            AppUser user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toResponse(cart);
    }

    @Override
    public CartResponse addToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        PhoneVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("PhoneVariant", "id", request.getVariantId()));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Số lượng tồn kho không đủ (còn lại: " + variant.getStockQuantity() + ")");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndVariantId(cart.getId(), variant.getId());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setVariant(variant);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse updateCartItem(Long userId, Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (quantity <= 0) {
            Cart cart = item.getCart();
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
            return toResponse(cart);
        }

        if (item.getVariant().getStockQuantity() < quantity) {
            throw new BadRequestException("Số lượng tồn kho không đủ (còn lại: " + item.getVariant().getStockQuantity() + ")");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return toResponse(item.getCart());
    }

    @Override
    public CartResponse removeCartItem(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser() != null ? cart.getUser().getId() : null);

        double totalAmount = 0.0;
        int totalQuantity = 0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                PhoneVariant v = item.getVariant();
                double lineTotal = v.getPrice() * item.getQuantity();
                totalAmount += lineTotal;
                totalQuantity += item.getQuantity();

                String variantName = (v.getStorage() != null ? v.getStorage() : "") + " " +
                        (v.getColor() != null ? v.getColor() : "");

                CartItemResponse itemResp = new CartItemResponse(
                        item.getId(),
                        v.getId(),
                        v.getPhone() != null ? v.getPhone().getName() : "Điện thoại",
                        variantName.trim(),
                        v.getSku(),
                        v.getPrice(),
                        item.getQuantity(),
                        lineTotal,
                        v.getThumbnailUrl()
                );
                response.getItems().add(itemResp);
            }
        }

        response.setTotalAmount(totalAmount);
        response.setTotalQuantity(totalQuantity);
        return response;
    }
}
