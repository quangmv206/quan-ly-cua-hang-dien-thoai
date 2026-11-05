package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.WarrantyRequest;
import com.example.demoSpringBoot.dto.WarrantyResponse;
import com.example.demoSpringBoot.exception.BadRequestException;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.Order;
import com.example.demoSpringBoot.model.OrderItem;
import com.example.demoSpringBoot.model.Warranty;
import com.example.demoSpringBoot.repository.OrderRepository;
import com.example.demoSpringBoot.repository.WarrantyRepository;
import com.example.demoSpringBoot.service.WarrantyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class WarrantyServiceImpl implements WarrantyService {

    private final WarrantyRepository warrantyRepository;
    private final OrderRepository orderRepository;

    public WarrantyServiceImpl(WarrantyRepository warrantyRepository, OrderRepository orderRepository) {
        this.warrantyRepository = warrantyRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public WarrantyResponse checkWarrantyByImei(String imeiNumber) {
        Warranty warranty = warrantyRepository.findByImeiNumber(imeiNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Warranty", "imeiNumber", imeiNumber));
        return toResponse(warranty);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarrantyResponse> checkWarrantyByPhone(String customerPhone) {
        List<Warranty> warranties = warrantyRepository.findByCustomerPhone(customerPhone.trim());
        return warranties.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<WarrantyResponse> checkWarrantyByOrderCode(String orderCode) {
        List<Warranty> warranties = warrantyRepository.findByOrderCode(orderCode.trim());
        if (warranties.isEmpty()) {
            Optional<Order> optOrder = orderRepository.findByOrderCode(orderCode.trim());
            if (optOrder.isPresent()) {
                Order order = optOrder.get();
                if (order.getItems() != null && !order.getItems().isEmpty()) {
                    List<Warranty> createdList = new ArrayList<>();
                    for (OrderItem item : order.getItems()) {
                        for (int q = 0; q < item.getQuantity(); q++) {
                            Warranty w = new Warranty();
                            String cleanDigits = order.getOrderCode().replaceAll("\\D", "");
                            if (cleanDigits.length() < 11) {
                                cleanDigits = String.format("%-11s", cleanDigits).replace(' ', '0');
                            } else if (cleanDigits.length() > 11) {
                                cleanDigits = cleanDigits.substring(cleanDigits.length() - 11);
                            }
                            String imei = "3589" + cleanDigits;
                            if (warrantyRepository.findByImeiNumber(imei).isPresent()) {
                                long random11 = 10000000000L + (long)(new Random().nextDouble() * 89999999999L);
                                imei = "3589" + String.valueOf(random11).substring(0, 11);
                            }
                            w.setImeiNumber(imei);
                            w.setProductName(item.getProductName());
                            w.setVariantName(item.getVariantName() != null ? item.getVariantName() : "Tiêu chuẩn");
                            w.setCustomerName(order.getRecipientName());
                            w.setCustomerPhone(order.getRecipientPhone());
                            w.setOrderCode(order.getOrderCode());
                            LocalDate start = order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate() : LocalDate.now();
                            w.setStartDate(start);
                            w.setEndDate(start.plusMonths(12));
                            w.setStatus("ACTIVE");
                            w.setNote("Bảo hành chính hãng kích hoạt theo đơn #" + order.getOrderCode());
                            createdList.add(warrantyRepository.save(w));
                        }
                    }
                    return createdList.stream().map(this::toResponse).collect(Collectors.toList());
                }
            }
        }
        return warranties.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<WarrantyResponse> searchWarranties(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllWarranties();
        }
        String clean = query.trim();
        List<Warranty> warranties = warrantyRepository.searchWarranties(clean);
        if (warranties.isEmpty()) {
            List<WarrantyResponse> fromOrder = checkWarrantyByOrderCode(clean);
            if (!fromOrder.isEmpty()) {
                return fromOrder;
            }
        }
        return warranties.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public WarrantyResponse createWarranty(WarrantyRequest request) {
        if (warrantyRepository.findByImeiNumber(request.getImeiNumber().trim()).isPresent()) {
            throw new BadRequestException("Số IMEI này đã được kích hoạt bảo hành trong hệ thống.");
        }

        Warranty warranty = new Warranty();
        warranty.setImeiNumber(request.getImeiNumber().trim());
        warranty.setProductName(request.getProductName());
        warranty.setVariantName(request.getVariantName());
        warranty.setCustomerName(request.getCustomerName());
        warranty.setCustomerPhone(request.getCustomerPhone());
        warranty.setOrderCode(request.getOrderCode());

        LocalDate start = request.getStartDate() != null ? request.getStartDate() : LocalDate.now();
        LocalDate end = request.getEndDate() != null ? request.getEndDate() : start.plusMonths(12);
        warranty.setStartDate(start);
        warranty.setEndDate(end);
        warranty.setStatus(LocalDate.now().isAfter(end) ? "EXPIRED" : "ACTIVE");
        warranty.setNote(request.getNote());

        return toResponse(warrantyRepository.save(warranty));
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarrantyResponse> getAllWarranties() {
        return warrantyRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private WarrantyResponse toResponse(Warranty warranty) {
        LocalDate today = LocalDate.now();
        long daysRemaining = 0;
        String status = warranty.getStatus();

        if (today.isAfter(warranty.getEndDate())) {
            daysRemaining = 0;
            status = "EXPIRED";
        } else {
            daysRemaining = ChronoUnit.DAYS.between(today, warranty.getEndDate());
        }

        return new WarrantyResponse(
                warranty.getId(),
                warranty.getImeiNumber(),
                warranty.getProductName(),
                warranty.getVariantName(),
                warranty.getCustomerName(),
                warranty.getCustomerPhone(),
                warranty.getOrderCode(),
                warranty.getStartDate(),
                warranty.getEndDate(),
                status,
                warranty.getNote(),
                daysRemaining
        );
    }
}
