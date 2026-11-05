package com.example.demoSpringBoot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private AppUser user;

    @Column(nullable = false, length = 150)
    private String recipientName;

    @Column(length = 150)
    private String recipientEmail;

    @Column(nullable = false, length = 20)
    private String recipientPhone;

    @Column(nullable = false, length = 500)
    private String shippingAddress;

    @Column(nullable = false)
    private double totalAmount;

    private double shippingFee = 0.0;

    @Column(length = 60)
    private String voucherCode;

    private double discountAmount = 0.0;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED

    @Column(nullable = false, length = 30)
    private String paymentStatus = "UNPAID"; // UNPAID, PAID, REFUNDED

    @Column(length = 50)
    private String paymentMethod = "COD"; // COD, VNPAY, MOMO, BANKING

    @Column(length = 500)
    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
