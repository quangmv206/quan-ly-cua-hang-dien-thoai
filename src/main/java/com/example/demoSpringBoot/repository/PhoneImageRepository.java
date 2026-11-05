package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.PhoneImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhoneImageRepository extends JpaRepository<PhoneImage, Long> {
    List<PhoneImage> findByPhoneIdOrderBySortOrderAsc(Integer phoneId);
}
