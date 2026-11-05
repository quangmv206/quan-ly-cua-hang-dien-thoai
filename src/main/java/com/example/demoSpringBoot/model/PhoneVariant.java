package com.example.demoSpringBoot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "phone_variants")
public class PhoneVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phone_id", nullable = false)
    @JsonIgnore
    private Phone phone;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(length = 50)
    private String color;

    @Column(length = 50)
    private String storage; // e.g. 128GB, 256GB, 512GB, 1TB

    @Column(length = 50)
    private String ram; // e.g. 8GB, 12GB, 16GB

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int stockQuantity;

    @Column(columnDefinition = "LONGTEXT")
    private String thumbnailUrl;

    @Column(length = 20)
    private String status = "ACTIVE";
}
