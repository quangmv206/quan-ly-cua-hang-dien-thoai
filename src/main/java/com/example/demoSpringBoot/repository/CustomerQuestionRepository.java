package com.example.demoSpringBoot.repository;

import com.example.demoSpringBoot.model.CustomerQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerQuestionRepository extends JpaRepository<CustomerQuestion, Long> {
    List<CustomerQuestion> findAllByOrderByCreatedAtDesc();
    List<CustomerQuestion> findByPhoneIdOrderByCreatedAtDesc(Integer phoneId);
}

