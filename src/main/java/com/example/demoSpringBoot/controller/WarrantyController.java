package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.WarrantyRequest;
import com.example.demoSpringBoot.dto.WarrantyResponse;
import com.example.demoSpringBoot.service.WarrantyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warranties")
public class WarrantyController {

    private final WarrantyService warrantyService;

    public WarrantyController(WarrantyService warrantyService) {
        this.warrantyService = warrantyService;
    }

    @GetMapping("/check")
    public WarrantyResponse checkByImei(@RequestParam String imei) {
        return warrantyService.checkWarrantyByImei(imei);
    }

    @GetMapping("/phone")
    public List<WarrantyResponse> checkByPhone(@RequestParam String phone) {
        return warrantyService.checkWarrantyByPhone(phone);
    }

    @GetMapping("/order")
    public List<WarrantyResponse> checkByOrder(@RequestParam String orderCode) {
        return warrantyService.checkWarrantyByOrderCode(orderCode);
    }

    @GetMapping("/search")
    public List<WarrantyResponse> searchWarranties(@RequestParam(required = false, defaultValue = "") String q) {
        return warrantyService.searchWarranties(q);
    }

    @GetMapping
    public List<WarrantyResponse> getAllWarranties() {
        return warrantyService.getAllWarranties();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WarrantyResponse createWarranty(@Valid @RequestBody WarrantyRequest request) {
        return warrantyService.createWarranty(request);
    }
}
