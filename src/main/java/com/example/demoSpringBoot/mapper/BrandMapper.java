package com.example.demoSpringBoot.mapper;

import com.example.demoSpringBoot.dto.BrandRequest;
import com.example.demoSpringBoot.dto.BrandResponse;
import com.example.demoSpringBoot.model.Brand;
import org.springframework.stereotype.Component;

@Component
public class BrandMapper {

    public Brand toEntity(BrandRequest request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        return brand;
    }

    public BrandResponse toResponse(Brand brand) {
        if (brand == null) {
            return null;
        }
        return new BrandResponse(brand.getId(), brand.getName(), brand.getDescription());
    }
}
