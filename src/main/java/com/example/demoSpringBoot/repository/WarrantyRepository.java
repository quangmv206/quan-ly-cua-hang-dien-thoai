package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByImeiNumber(String imeiNumber);
    List<Warranty> findByCustomerPhone(String customerPhone);
    List<Warranty> findByOrderCode(String orderCode);
}
