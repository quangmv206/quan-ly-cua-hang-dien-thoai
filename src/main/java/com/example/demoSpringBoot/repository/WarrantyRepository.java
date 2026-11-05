package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByImeiNumber(String imeiNumber);
    List<Warranty> findByCustomerPhone(String customerPhone);
    List<Warranty> findByOrderCode(String orderCode);

    @Query("SELECT w FROM Warranty w WHERE LOWER(w.imeiNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(w.customerPhone) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(w.orderCode) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(w.customerName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Warranty> searchWarranties(@Param("query") String query);
}
