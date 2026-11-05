package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.SiteSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteSettingRepository extends JpaRepository<SiteSetting, String> {
    List<SiteSetting> findByPageGroup(String pageGroup);
}

