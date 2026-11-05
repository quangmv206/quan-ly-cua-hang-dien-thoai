package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.AddressRequest;
import com.example.demoSpringBoot.dto.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getUserAddresses(Long userId);
    AddressResponse addAddress(Long userId, AddressRequest request);
    void deleteAddress(Long userId, Long addressId);
}
