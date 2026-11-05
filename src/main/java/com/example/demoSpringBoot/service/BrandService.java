package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.BrandRequest;
import com.example.demoSpringBoot.dto.BrandResponse;

import java.util.List;

public interface BrandService {
    BrandResponse createBrand(BrandRequest request);
    List<BrandResponse> getAllBrands();
    BrandResponse getBrandById(Integer id);
    BrandResponse updateBrand(Integer id, BrandRequest request);
    void deleteBrand(Integer id);
}
