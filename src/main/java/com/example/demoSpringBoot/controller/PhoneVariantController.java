package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.PhoneVariantRequest;
import com.example.demoSpringBoot.dto.PhoneVariantResponse;
import com.example.demoSpringBoot.service.PhoneVariantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PhoneVariantController {

    private final PhoneVariantService variantService;

    public PhoneVariantController(PhoneVariantService variantService) {
        this.variantService = variantService;
    }

    @GetMapping("/phones/{phoneId}/variants")
    public List<PhoneVariantResponse> getVariants(@PathVariable Integer phoneId) {
        return variantService.getVariantsByPhoneId(phoneId);
    }

    @PostMapping("/phones/{phoneId}/variants")
    @ResponseStatus(HttpStatus.CREATED)
    public PhoneVariantResponse addVariant(@PathVariable Integer phoneId, @Valid @RequestBody PhoneVariantRequest request) {
        return variantService.addVariant(phoneId, request);
    }

    @PostMapping("/phones/{phoneId}/variants/batch")
    @ResponseStatus(HttpStatus.CREATED)
    public List<PhoneVariantResponse> addVariantsBatch(@PathVariable Integer phoneId, @Valid @RequestBody List<PhoneVariantRequest> requests) {
        return variantService.addVariantsBatch(phoneId, requests);
    }

    @PutMapping("/variants/{variantId}")
    public PhoneVariantResponse updateVariant(@PathVariable Long variantId, @Valid @RequestBody PhoneVariantRequest request) {
        return variantService.updateVariant(variantId, request);
    }

    @DeleteMapping("/variants/{variantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVariant(@PathVariable Long variantId) {
        variantService.deleteVariant(variantId);
    }
}
