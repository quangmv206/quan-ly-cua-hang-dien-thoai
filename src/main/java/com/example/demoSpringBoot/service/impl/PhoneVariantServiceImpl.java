package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.PhoneVariantRequest;
import com.example.demoSpringBoot.dto.PhoneVariantResponse;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.Phone;
import com.example.demoSpringBoot.model.PhoneVariant;
import com.example.demoSpringBoot.repository.PhoneRepository;
import com.example.demoSpringBoot.repository.PhoneVariantRepository;
import com.example.demoSpringBoot.service.PhoneVariantService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PhoneVariantServiceImpl implements PhoneVariantService {

    private final PhoneVariantRepository variantRepository;
    private final PhoneRepository phoneRepository;
    private final com.example.demoSpringBoot.repository.OrderItemRepository orderItemRepository;
    private final com.example.demoSpringBoot.repository.CartItemRepository cartItemRepository;

    public PhoneVariantServiceImpl(PhoneVariantRepository variantRepository,
                                   PhoneRepository phoneRepository,
                                   com.example.demoSpringBoot.repository.OrderItemRepository orderItemRepository,
                                   com.example.demoSpringBoot.repository.CartItemRepository cartItemRepository) {
        this.variantRepository = variantRepository;
        this.phoneRepository = phoneRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PhoneVariantResponse> getVariantsByPhoneId(Integer phoneId) {
        return variantRepository.findByPhoneId(phoneId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PhoneVariantResponse addVariant(Integer phoneId, PhoneVariantRequest request) {
        Phone phone = phoneRepository.findById(phoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Phone", "id", phoneId));

        PhoneVariant variant = new PhoneVariant();
        variant.setPhone(phone);
        variant.setSku(request.getSku());
        variant.setColor(request.getColor());
        variant.setStorage(request.getStorage());
        variant.setRam(request.getRam());
        variant.setPrice(request.getPrice());
        variant.setStockQuantity(request.getStockQuantity());
        variant.setThumbnailUrl(request.getThumbnailUrl());
        variant.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        return toResponse(variantRepository.save(variant));
    }

    @Override
    public List<PhoneVariantResponse> addVariantsBatch(Integer phoneId, List<PhoneVariantRequest> requests) {
        Phone phone = phoneRepository.findById(phoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Phone", "id", phoneId));

        int addedStock = 0;
        List<PhoneVariant> savedVariants = new java.util.ArrayList<>();

        for (PhoneVariantRequest req : requests) {
            PhoneVariant variant = new PhoneVariant();
            variant.setPhone(phone);

            String sku = req.getSku();
            if (sku == null || sku.isBlank() || variantRepository.findBySku(sku).isPresent()) {
                sku = (sku != null && !sku.isBlank() ? sku : "SKU") + "-" + (100 + new java.util.Random().nextInt(900));
            }
            variant.setSku(sku);
            variant.setColor(req.getColor());
            variant.setStorage(req.getStorage());
            variant.setRam(req.getRam());
            variant.setPrice(req.getPrice());
            variant.setStockQuantity(req.getStockQuantity());
            variant.setThumbnailUrl(req.getThumbnailUrl());
            variant.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");

            savedVariants.add(variantRepository.save(variant));
            addedStock += req.getStockQuantity();
        }

        if (addedStock > 0) {
            phone.setQuantity(phone.getQuantity() + addedStock);
            phoneRepository.save(phone);
        }

        return savedVariants.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public PhoneVariantResponse updateVariant(Long variantId, PhoneVariantRequest request) {
        PhoneVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("PhoneVariant", "id", variantId));

        if (request.getSku() != null) variant.setSku(request.getSku());
        if (request.getColor() != null) variant.setColor(request.getColor());
        if (request.getStorage() != null) variant.setStorage(request.getStorage());
        if (request.getRam() != null) variant.setRam(request.getRam());
        variant.setPrice(request.getPrice());
        variant.setStockQuantity(request.getStockQuantity());
        if (request.getThumbnailUrl() != null) variant.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getStatus() != null) variant.setStatus(request.getStatus());

        return toResponse(variantRepository.save(variant));
    }

    @Override
    public void deleteVariant(Long variantId) {
        PhoneVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("PhoneVariant", "id", variantId));

        // 1. Xóa các mục trong giỏ hàng tham chiếu đến biến thể này
        cartItemRepository.deleteByVariantId(variantId);

        // 2. Gỡ liên kết variant trong các đơn hàng đã mua (giữ nguyên thông tin tên, giá, số lượng lịch sử)
        orderItemRepository.detachVariant(variantId);

        // 3. Giảm tổng tồn kho của Phone tương ứng nếu có
        if (variant.getPhone() != null && variant.getStockQuantity() > 0) {
            Phone phone = variant.getPhone();
            phone.setQuantity(Math.max(0, phone.getQuantity() - variant.getStockQuantity()));
            phoneRepository.save(phone);
        }

        variantRepository.delete(variant);
    }

    private PhoneVariantResponse toResponse(PhoneVariant variant) {
        return new PhoneVariantResponse(
                variant.getId(),
                variant.getSku(),
                variant.getColor(),
                variant.getStorage(),
                variant.getRam(),
                variant.getPrice(),
                variant.getStockQuantity(),
                variant.getThumbnailUrl(),
                variant.getStatus()
        );
    }
}
