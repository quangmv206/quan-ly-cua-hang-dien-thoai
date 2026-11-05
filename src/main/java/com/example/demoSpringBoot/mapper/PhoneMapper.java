package com.example.demoSpringBoot.mapper;

import com.example.demoSpringBoot.dto.PhoneRequest;
import com.example.demoSpringBoot.dto.PhoneResponse;
import com.example.demoSpringBoot.model.Phone;
import org.springframework.stereotype.Component;

@Component
public class PhoneMapper {

    private final BrandMapper brandMapper;
    private final CategoryMapper categoryMapper;

    public PhoneMapper(BrandMapper brandMapper, CategoryMapper categoryMapper) {
        this.brandMapper = brandMapper;
        this.categoryMapper = categoryMapper;
    }

    public Phone toEntity(PhoneRequest request) {
        Phone phone = new Phone();
        mapCommon(phone, request);
        return phone;
    }

    public void updateEntity(Phone phone, PhoneRequest request) {
        mapCommon(phone, request);
    }

    private void mapCommon(Phone phone, PhoneRequest request) {
        phone.setName(request.getName());
        phone.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        phone.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        phone.setDescription(request.getDescription());
        phone.setImageUrl(request.getImageUrl());

        // Thông số kỹ thuật chi tiết
        phone.setScreenSize(request.getScreenSize());
        phone.setScreenTech(request.getScreenTech());
        phone.setScreenResolution(request.getScreenResolution());
        phone.setCpu(request.getCpu());
        phone.setGpu(request.getGpu());
        phone.setOs(request.getOs());
        phone.setRam(request.getRam());
        phone.setStorage(request.getStorage());
        phone.setRearCamera(request.getRearCamera());
        phone.setFrontCamera(request.getFrontCamera());
        phone.setBattery(request.getBattery());
        phone.setCharging(request.getCharging());
        phone.setSim(request.getSim());
        phone.setNetwork(request.getNetwork());
        phone.setWaterproof(request.getWaterproof());
        phone.setWeight(request.getWeight());
        phone.setOrigin(request.getOrigin());
        phone.setWarrantyPeriod(request.getWarrantyPeriod());
    }

    public PhoneResponse toResponse(Phone phone) {
        return new PhoneResponse(
                phone.getId(),
                phone.getName(),
                brandMapper.toResponse(phone.getBrand()),
                categoryMapper.toResponse(phone.getCategory()),
                phone.getPrice(),
                phone.getQuantity(),
                phone.getDescription(),
                phone.getImageUrl(),
                phone.getScreenSize(),
                phone.getScreenTech(),
                phone.getScreenResolution(),
                phone.getCpu(),
                phone.getGpu(),
                phone.getOs(),
                phone.getRam(),
                phone.getStorage(),
                phone.getRearCamera(),
                phone.getFrontCamera(),
                phone.getBattery(),
                phone.getCharging(),
                phone.getSim(),
                phone.getNetwork(),
                phone.getWaterproof(),
                phone.getWeight(),
                phone.getOrigin(),
                phone.getWarrantyPeriod()
        );
    }
}
