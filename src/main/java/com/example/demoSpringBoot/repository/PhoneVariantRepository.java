package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.PhoneVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhoneVariantRepository extends JpaRepository<PhoneVariant, Long> {
    List<PhoneVariant> findByPhoneId(Integer phoneId);
    Optional<PhoneVariant> findBySku(String sku);
}
