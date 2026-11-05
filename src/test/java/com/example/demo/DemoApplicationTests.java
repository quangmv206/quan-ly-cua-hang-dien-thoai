package com.example.demo;

import com.example.demoSpringBoot.model.Brand;
import com.example.demoSpringBoot.model.Category;
import com.example.demoSpringBoot.model.Phone;
import com.example.demoSpringBoot.repository.BrandRepository;
import com.example.demoSpringBoot.repository.CategoryRepository;
import com.example.demoSpringBoot.repository.PhoneRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = com.example.demoSpringBoot.DemoApplication.class)
@Transactional
class DemoApplicationTests {

    @Autowired
    private PhoneRepository phoneRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private com.example.demoSpringBoot.service.PhoneService phoneService;

    private Brand testBrand;
    private Category testCategory;
    private Phone testPhone;

    @BeforeEach
    void setUp() {
        // Tìm hoặc tạo Brand & Category test để không vi phạm ràng buộc khóa ngoại
        testBrand = brandRepository.findAll().stream().findFirst()
                .orElseGet(() -> brandRepository.save(new Brand(null, "Test Apple", "Apple Inc.")));
        testCategory = categoryRepository.findAll().stream().findFirst()
                .orElseGet(() -> categoryRepository.save(new Category(null, "Test Smartphone", "Điện thoại thông minh")));

        // Tạo 1 máy test riêng biệt độc lập (không dính khóa ngoại tới đơn hàng hay biến thể)
        testPhone = phoneRepository.save(new Phone(null, "Test iPhone Unit", testBrand, testCategory, 25000000, 10));
    }

    @Test
    void testFindAll() {
        List<Phone> phones = phoneRepository.findAll();
        assertNotNull(phones);
        assertFalse(phones.isEmpty(), "Danh sách điện thoại không được rỗng");
    }

    @Test
    void testFindById() {
        Optional<Phone> phone = phoneRepository.findById(testPhone.getId());
        assertTrue(phone.isPresent());
        assertEquals("Test iPhone Unit", phone.get().getName());
    }

    @Test
    void testSave() {
        Phone newPhone = new Phone(null, "Test iPhone SE", testBrand, testCategory, 12000000, 20);
        Phone saved = phoneRepository.save(newPhone);
        assertNotNull(saved.getId());
        assertEquals("Test iPhone SE", saved.getName());
    }

    @Test
    void testUpdate() {
        testPhone.setName("Test iPhone Updated");
        testPhone.setPrice(30000000);
        phoneRepository.save(testPhone);

        Phone phoneAfterUpdate = phoneRepository.findById(testPhone.getId()).orElse(null);
        assertNotNull(phoneAfterUpdate);
        assertEquals("Test iPhone Updated", phoneAfterUpdate.getName());
        assertEquals(30000000, phoneAfterUpdate.getPrice());
    }

    @Test
    void testDelete() {
        // Xóa máy test độc lập qua phoneService (Soft delete chuyển status INACTIVE)
        Integer idToDelete = testPhone.getId();
        phoneService.deletePhone(idToDelete);

        Phone phoneAfterDelete = phoneRepository.findById(idToDelete).orElse(null);
        assertNotNull(phoneAfterDelete);
        assertEquals("INACTIVE", phoneAfterDelete.getStatus());
    }
}
