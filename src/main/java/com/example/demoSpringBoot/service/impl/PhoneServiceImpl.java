package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.PhoneRequest;
import com.example.demoSpringBoot.dto.PhoneResponse;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.mapper.PhoneMapper;
import com.example.demoSpringBoot.model.Brand;
import com.example.demoSpringBoot.model.Category;
import com.example.demoSpringBoot.model.Phone;
import com.example.demoSpringBoot.repository.BrandRepository;
import com.example.demoSpringBoot.repository.CategoryRepository;
import com.example.demoSpringBoot.repository.PhoneRepository;
import com.example.demoSpringBoot.service.PhoneService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class PhoneServiceImpl implements PhoneService {

    private final PhoneRepository phoneRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final PhoneMapper phoneMapper;

    public PhoneServiceImpl(
            PhoneRepository phoneRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            PhoneMapper phoneMapper
    ) {
        this.phoneRepository = phoneRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.phoneMapper = phoneMapper;
    }

    @Override
    public PhoneResponse createPhone(PhoneRequest request) {
        Brand brand = getBrandById(request.getBrandId());
        Category category = getCategoryById(request.getCategoryId());
        Phone phone = phoneMapper.toEntity(request);

        phone.setId(null);
        phone.setBrand(brand);
        phone.setCategory(category);

        return phoneMapper.toResponse(phoneRepository.save(phone));
    }

    @Override
    public List<PhoneResponse> getAllPhones() {
        return phoneRepository.findAll()
                .stream()
                .filter(p -> !"INACTIVE".equalsIgnoreCase(p.getStatus()))
                .map(phoneMapper::toResponse)
                .toList();
    }

    @Override
    public PhoneResponse getPhoneById(Integer id) {
        return phoneMapper.toResponse(getExistingPhone(id));
    }

    @Override
    public PhoneResponse updatePhone(Integer id, PhoneRequest request) {
        Phone existingPhone = getExistingPhone(id);
        phoneMapper.updateEntity(existingPhone, request);

        if (request.getBrandId() != null) {
            existingPhone.setBrand(getBrandById(request.getBrandId()));
        }
        if (request.getCategoryId() != null) {
            existingPhone.setCategory(getCategoryById(request.getCategoryId()));
        }

        return phoneMapper.toResponse(phoneRepository.save(existingPhone));
    }

    @Override
    public List<PhoneResponse> searchPhonesByName(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên điện thoại không được để trống");
        }

        return phoneRepository.findByNameContainingIgnoreCase(name.trim())
                .stream()
                .filter(p -> !"INACTIVE".equalsIgnoreCase(p.getStatus()))
                .map(phoneMapper::toResponse)
                .toList();
    }

    @Override
    public void deletePhone(Integer id) {
        Phone existingPhone = getExistingPhone(id);
        // Xóa mềm: Chuyển status = INACTIVE để bảo toàn toàn vẹn dữ liệu đơn hàng và lịch sử nhập kho
        existingPhone.setStatus("INACTIVE");
        phoneRepository.save(existingPhone);
    }

    private Phone getExistingPhone(Integer id) {
        return phoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy Phone có id = " + id
                ));
    }

    private Brand getBrandById(Integer brandId) {
        if (brandId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "brandId không được để trống");
        }
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy Brand có id = " + brandId
                ));
    }

    private Category getCategoryById(Integer categoryId) {
        if (categoryId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "categoryId không được để trống");
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy Category có id = " + categoryId
                ));
    }
}
