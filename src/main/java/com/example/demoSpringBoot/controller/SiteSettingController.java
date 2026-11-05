package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.model.SiteSetting;
import com.example.demoSpringBoot.repository.SiteSettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/site-settings")
public class SiteSettingController {

    private final SiteSettingRepository siteSettingRepository;

    public SiteSettingController(SiteSettingRepository siteSettingRepository) {
        this.siteSettingRepository = siteSettingRepository;
    }

    // 1. Lấy toàn bộ cấu hình (Public)
    @GetMapping
    public Map<String, String> getAllSettings() {
        List<SiteSetting> list = siteSettingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (SiteSetting s : list) {
            map.put(s.getKey(), s.getValue());
        }
        return map;
    }

    // 2. Lấy cấu hình theo key
    @GetMapping("/{key}")
    public ResponseEntity<SiteSetting> getSettingByKey(@PathVariable String key) {
        return siteSettingRepository.findById(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Lấy cấu hình theo nhóm trang (home, products, policy, store...)
    @GetMapping("/group/{pageGroup}")
    public List<SiteSetting> getSettingsByGroup(@PathVariable String pageGroup) {
        return siteSettingRepository.findByPageGroup(pageGroup);
    }

    // 4. Lưu / Cập nhật một cấu hình
    @PutMapping("/{key}")
    public ResponseEntity<SiteSetting> saveSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> payload
    ) {
        String value = payload.getOrDefault("value", "");
        String pageGroup = payload.getOrDefault("pageGroup", "global");
        String description = payload.getOrDefault("description", "");

        SiteSetting setting = siteSettingRepository.findById(key)
                .orElse(new SiteSetting(key, pageGroup, value, description));

        setting.setValue(value);
        if (payload.containsKey("pageGroup")) {
            setting.setPageGroup(pageGroup);
        }
        if (payload.containsKey("description")) {
            setting.setDescription(description);
        }
        setting.setUpdatedAt(LocalDateTime.now());

        SiteSetting saved = siteSettingRepository.save(setting);
        return ResponseEntity.ok(saved);
    }

    // 5. Lưu hàng loạt nhiều cấu hình cùng lúc (Batch Update)
    @PostMapping("/batch")
    public ResponseEntity<Map<String, String>> batchUpdateSettings(@RequestBody Map<String, Map<String, String>> batch) {
        for (Map.Entry<String, Map<String, String>> entry : batch.entrySet()) {
            String key = entry.getKey();
            Map<String, String> payload = entry.getValue();
            String value = payload.getOrDefault("value", "");
            String pageGroup = payload.getOrDefault("pageGroup", "global");
            String description = payload.getOrDefault("description", "");

            SiteSetting setting = siteSettingRepository.findById(key)
                    .orElse(new SiteSetting(key, pageGroup, value, description));

            setting.setValue(value);
            if (payload.containsKey("pageGroup")) setting.setPageGroup(pageGroup);
            if (payload.containsKey("description")) setting.setDescription(description);
            setting.setUpdatedAt(LocalDateTime.now());
            siteSettingRepository.save(setting);
        }
        return ResponseEntity.ok(Map.of("message", "Đã cập nhật toàn bộ cấu hình thành công!"));
    }
}

