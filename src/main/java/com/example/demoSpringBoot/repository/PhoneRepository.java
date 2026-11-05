package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.Phone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhoneRepository extends JpaRepository<Phone, Integer> {
    List<Phone> findByNameContainingIgnoreCase(String name);
}
