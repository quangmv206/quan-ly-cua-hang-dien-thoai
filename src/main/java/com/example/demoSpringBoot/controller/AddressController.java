package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.AddressRequest;
import com.example.demoSpringBoot.dto.AddressResponse;
import com.example.demoSpringBoot.exception.UnauthorizedException;
import com.example.demoSpringBoot.security.SecurityUtils;
import com.example.demoSpringBoot.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final SecurityUtils securityUtils;

    public AddressController(AddressService addressService, SecurityUtils securityUtils) {
        this.addressService = addressService;
        this.securityUtils = securityUtils;
    }

    private Long getRequiredUserId() {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để quản lý sổ địa chỉ");
        }
        return userId;
    }

    @GetMapping
    public List<AddressResponse> getUserAddresses() {
        return addressService.getUserAddresses(getRequiredUserId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AddressResponse addAddress(@Valid @RequestBody AddressRequest request) {
        return addressService.addAddress(getRequiredUserId(), request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(getRequiredUserId(), id);
    }
}
