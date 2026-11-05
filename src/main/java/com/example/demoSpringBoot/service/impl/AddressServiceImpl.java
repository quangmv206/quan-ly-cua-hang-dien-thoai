package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.AddressRequest;
import com.example.demoSpringBoot.dto.AddressResponse;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.Address;
import com.example.demoSpringBoot.model.AppUser;
import com.example.demoSpringBoot.repository.AddressRepository;
import com.example.demoSpringBoot.repository.UserRepository;
import com.example.demoSpringBoot.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.isDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(addr -> {
                addr.setDefault(false);
                addressRepository.save(addr);
            });
        }

        Address address = new Address();
        address.setUser(user);
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setAddressDetail(request.getAddressDetail());
        address.setDefault(request.isDefault());

        return toResponse(addressRepository.save(address));
    }

    @Override
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
        if (address.getUser() != null && address.getUser().getId().equals(userId)) {
            addressRepository.delete(address);
        }
    }

    private AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getRecipientName(),
                address.getPhone(),
                address.getProvince(),
                address.getDistrict(),
                address.getWard(),
                address.getAddressDetail(),
                address.isDefault()
        );
    }
}
