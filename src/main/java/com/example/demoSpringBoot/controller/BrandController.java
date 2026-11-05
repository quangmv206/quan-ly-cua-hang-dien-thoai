package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.BrandRequest;
import com.example.demoSpringBoot.dto.BrandResponse;
import com.example.demoSpringBoot.service.BrandService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    // CREATE Brand
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BrandResponse createBrand(@Validated @RequestBody BrandRequest request) {
        return brandService.createBrand(request);
    }

    // READ all Brands
    @GetMapping
    public List<BrandResponse> getAllBrands() {
        return brandService.getAllBrands();
    }

    // READ Brand by id
    @GetMapping("/{id}")
    public BrandResponse getBrandById(@PathVariable Integer id) {
        return brandService.getBrandById(id);
    }

    // UPDATE Brand
    @PutMapping("/{id}")
    public BrandResponse updateBrand(
            @PathVariable Integer id,
            @Validated @RequestBody BrandRequest request
    ) {
        return brandService.updateBrand(id, request);
    }

    // DELETE Brand
    @DeleteMapping("/{id}")
    public Map<String, String> deleteBrand(@PathVariable Integer id) {
        brandService.deleteBrand(id);
        return Map.of(
                "message", "Xóa thương hiệu thành công",
                "brandId", id.toString()
        );
    }
}
