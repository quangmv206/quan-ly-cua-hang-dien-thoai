package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPhoneIdOrderByCreatedAtDesc(Integer phoneId);
    List<Review> findAllByOrderByCreatedAtDesc();
}

