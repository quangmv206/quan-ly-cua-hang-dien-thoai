package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.WarrantyRequest;
import com.example.demoSpringBoot.dto.WarrantyResponse;

import java.util.List;

public interface WarrantyService {
    WarrantyResponse checkWarrantyByImei(String imeiNumber);
    List<WarrantyResponse> checkWarrantyByPhone(String customerPhone);
    WarrantyResponse createWarranty(WarrantyRequest request);
    List<WarrantyResponse> getAllWarranties();
}
