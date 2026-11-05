package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.PhoneRequest;
import com.example.demoSpringBoot.dto.PhoneResponse;
import com.example.demoSpringBoot.service.PhoneService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/phones")
public class PhoneController {

    private final PhoneService phoneService;

    public PhoneController(PhoneService phoneService) {
        this.phoneService = phoneService;
    }

    // CREATE Phone
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PhoneResponse createPhone(@Validated @RequestBody PhoneRequest request) {
        return phoneService.createPhone(request);
    }

    // READ all Phones
    @GetMapping
    public List<PhoneResponse> getAllPhones() {
        return phoneService.getAllPhones();
    }

    // SEARCH Phones by name
    @GetMapping("/search")
    public List<PhoneResponse> searchPhonesByName(@RequestParam String name) {
        return phoneService.searchPhonesByName(name);
    }

    // READ Phone by id
    @GetMapping("/{id}")
    public PhoneResponse getPhoneById(@PathVariable Integer id) {
        return phoneService.getPhoneById(id);
    }

    // UPDATE Phone
    @PutMapping("/{id}")
    public PhoneResponse updatePhone(
            @PathVariable Integer id,
            @Validated @RequestBody PhoneRequest request
    ) {
        return phoneService.updatePhone(id, request);
    }

    // DELETE Phone
    @DeleteMapping("/{id}")
    public Map<String, String> deletePhone(@PathVariable Integer id) {
        phoneService.deletePhone(id);
        return Map.of(
                "message", "Xóa điện thoại thành công",
                "phoneId", id.toString()
        );
    }
}
