package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.PhoneRequest;
import com.example.demoSpringBoot.dto.PhoneResponse;

import java.util.List;

public interface PhoneService {
    PhoneResponse createPhone(PhoneRequest request);
    List<PhoneResponse> getAllPhones();
    PhoneResponse getPhoneById(Integer id);
    PhoneResponse updatePhone(Integer id, PhoneRequest request);
    List<PhoneResponse> searchPhonesByName(String name);
    void deletePhone(Integer id);
}
