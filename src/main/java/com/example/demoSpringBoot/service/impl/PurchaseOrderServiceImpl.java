package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.PurchaseOrderItemRequest;
import com.example.demoSpringBoot.dto.PurchaseOrderItemResponse;
import com.example.demoSpringBoot.dto.PurchaseOrderRequest;
import com.example.demoSpringBoot.dto.PurchaseOrderResponse;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.*;
import com.example.demoSpringBoot.repository.*;
import com.example.demoSpringBoot.service.PurchaseOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final PhoneVariantRepository variantRepository;
    private final PhoneRepository phoneRepository;
    private final UserRepository userRepository;

    public PurchaseOrderServiceImpl(
            PurchaseOrderRepository purchaseOrderRepository,
            SupplierRepository supplierRepository,
            PhoneVariantRepository variantRepository,
            PhoneRepository phoneRepository,
            UserRepository userRepository
    ) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.variantRepository = variantRepository;
        this.phoneRepository = phoneRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));
        return toResponse(po);
    }

    @Override
    public PurchaseOrderResponse createPurchaseOrder(Long userId, PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", request.getSupplierId()));

        AppUser user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        PurchaseOrder po = new PurchaseOrder();
        po.setPurchaseCode("PO-" + System.currentTimeMillis() + "-" + (100 + new Random().nextInt(900)));
        po.setSupplier(supplier);
        po.setStatus(request.getStatus() != null ? request.getStatus() : "COMPLETED");
        po.setNote(request.getNote());
        po.setCreatedBy(user);
        po.setCreatedAt(LocalDateTime.now());

        double total = 0;
        List<PurchaseOrderItem> items = new ArrayList<>();

        for (PurchaseOrderItemRequest itemReq : request.getItems()) {
            PhoneVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("PhoneVariant", "id", itemReq.getVariantId()));

            double lineTotal = itemReq.getQuantity() * itemReq.getUnitCost();
            total += lineTotal;

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setPurchaseOrder(po);
            item.setVariant(variant);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitCost(itemReq.getUnitCost());
            item.setLineTotal(lineTotal);
            items.add(item);

            // Tự động tăng tồn kho nếu trạng thái là COMPLETED
            if ("COMPLETED".equalsIgnoreCase(po.getStatus())) {
                variant.setStockQuantity(variant.getStockQuantity() + itemReq.getQuantity());
                variantRepository.save(variant);

                Phone phone = variant.getPhone();
                if (phone != null) {
                    phone.setQuantity(phone.getQuantity() + itemReq.getQuantity());
                    phoneRepository.save(phone);
                }
            }
        }

        po.setTotalAmount(total);
        po.setItems(items);

        PurchaseOrder savedPo = purchaseOrderRepository.save(po);
        return toResponse(savedPo);
    }

    private PurchaseOrderResponse toResponse(PurchaseOrder po) {
        List<PurchaseOrderItemResponse> itemResponses = new ArrayList<>();
        if (po.getItems() != null) {
            for (PurchaseOrderItem item : po.getItems()) {
                PhoneVariant v = item.getVariant();
                String productName = v != null && v.getPhone() != null ? v.getPhone().getName() : "Sản phẩm";
                String variantName = v != null ? (v.getColor() + " - " + v.getStorage()) : "";
                String sku = v != null ? v.getSku() : "";

                itemResponses.add(new PurchaseOrderItemResponse(
                        item.getId(),
                        v != null ? v.getId() : null,
                        productName,
                        variantName,
                        sku,
                        item.getQuantity(),
                        item.getUnitCost(),
                        item.getLineTotal()
                ));
            }
        }

        return new PurchaseOrderResponse(
                po.getId(),
                po.getPurchaseCode(),
                po.getSupplier() != null ? po.getSupplier().getId() : null,
                po.getSupplier() != null ? po.getSupplier().getName() : "N/A",
                po.getTotalAmount(),
                po.getStatus(),
                po.getNote(),
                po.getCreatedAt(),
                itemResponses
        );
    }
}

