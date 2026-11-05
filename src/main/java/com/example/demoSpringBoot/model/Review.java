package com.example.demoSpringBoot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer phoneId;

    @Column(nullable = false, length = 100)
    private String authorName;

    @Column(length = 20)
    private String authorPhone;

    private int rating = 5; // 1 to 5 stars

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    private boolean verifiedPurchase = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review(Integer phoneId, String authorName, int rating, String comment) {
        this.phoneId = phoneId;
        this.authorName = authorName;
        this.rating = rating;
        this.comment = comment;
        this.verifiedPurchase = true;
        this.createdAt = LocalDateTime.now();
    }
}

