package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.SupplierRequest;
import com.example.demoSpringBoot.dto.SupplierResponse;

import java.util.List;

public interface SupplierService {
    List<SupplierResponse> getAllSuppliers();
    SupplierResponse getSupplierById(Long id);
    SupplierResponse createSupplier(SupplierRequest request);
    SupplierResponse updateSupplier(Long id, SupplierRequest request);
    void deleteSupplier(Long id);
}

