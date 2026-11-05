package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.BrandRequest;
import com.example.demoSpringBoot.dto.BrandResponse;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.mapper.BrandMapper;
import com.example.demoSpringBoot.model.Brand;
import com.example.demoSpringBoot.repository.BrandRepository;
import com.example.demoSpringBoot.service.BrandService;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    public BrandServiceImpl(BrandRepository brandRepository, BrandMapper brandMapper) {
        this.brandRepository = brandRepository;
        this.brandMapper = brandMapper;
    }

    @Override
    public BrandResponse createBrand(BrandRequest request) {
        Brand brand = brandMapper.toEntity(request);
        brand.setId(null);
        return brandMapper.toResponse(brandRepository.save(brand));
    }

    @Override
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll()
                .stream()
                .map(brandMapper::toResponse)
                .toList();
    }

    @Override
    public BrandResponse getBrandById(Integer id) {
        return brandMapper.toResponse(getExistingBrand(id));
    }

    @Override
    public BrandResponse updateBrand(Integer id, BrandRequest request) {
        Brand brand = getExistingBrand(id);
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        return brandMapper.toResponse(brandRepository.save(brand));
    }

    @Override
    public void deleteBrand(Integer id) {
        Brand brand = getExistingBrand(id);
        brandRepository.delete(brand);
    }

    private Brand getExistingBrand(Integer id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy Brand có id = " + id
                ));
    }
}
