package com.example.demoSpringBoot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    // Giảm theo số tiền cố định (VND)
    private Double discountAmount;

    // Hoặc giảm theo phần trăm (0 - 100)
    private Double discountPercent;

    // Đơn hàng tối thiểu
    private Double minOrderAmount;

    // Số tiền giảm tối đa (khi giảm theo %)
    private Double maxDiscountAmount;

    private LocalDateTime expiresAt;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count")
    private Integer usedCount = 0;

    private boolean active = true;

    public Voucher(String code, String title, Double discountAmount, Double minOrderAmount) {
        this.code = code;
        this.title = title;
        this.discountAmount = discountAmount;
        this.minOrderAmount = minOrderAmount;
        this.usedCount = 0;
        this.active = true;
        this.expiresAt = LocalDateTime.now().plusMonths(6);
    }
}

