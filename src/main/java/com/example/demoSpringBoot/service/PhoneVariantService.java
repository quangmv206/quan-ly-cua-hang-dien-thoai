package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.PhoneVariantRequest;
import com.example.demoSpringBoot.dto.PhoneVariantResponse;

import java.util.List;

public interface PhoneVariantService {
    List<PhoneVariantResponse> getVariantsByPhoneId(Integer phoneId);
    PhoneVariantResponse addVariant(Integer phoneId, PhoneVariantRequest request);
    List<PhoneVariantResponse> addVariantsBatch(Integer phoneId, List<PhoneVariantRequest> requests);
    PhoneVariantResponse updateVariant(Long variantId, PhoneVariantRequest request);
    void deleteVariant(Long variantId);
}
