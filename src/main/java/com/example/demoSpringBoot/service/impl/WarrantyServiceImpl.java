package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.WarrantyRequest;
import com.example.demoSpringBoot.dto.WarrantyResponse;
import com.example.demoSpringBoot.exception.BadRequestException;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.Warranty;
import com.example.demoSpringBoot.repository.WarrantyRepository;
import com.example.demoSpringBoot.service.WarrantyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WarrantyServiceImpl implements WarrantyService {

    private final WarrantyRepository warrantyRepository;

    public WarrantyServiceImpl(WarrantyRepository warrantyRepository) {
        this.warrantyRepository = warrantyRepository;
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
