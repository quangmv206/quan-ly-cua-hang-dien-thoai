package com.example.demoSpringBoot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer phoneId;

    @Column(nullable = false, length = 100)
    private String authorName;

    @Column(length = 20)
    private String authorPhone;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT")
    private String answer;

    private boolean answered = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public CustomerQuestion(Integer phoneId, String authorName, String question, String answer) {
        this.phoneId = phoneId;
        this.authorName = authorName;
        this.question = question;
        this.answer = answer;
        this.answered = answer != null && !answer.trim().isEmpty();
        this.createdAt = LocalDateTime.now();
    }
}

