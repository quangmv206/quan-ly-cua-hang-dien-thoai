package com.example.demoSpringBoot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "phones")
public class Phone extends RepresentationModel<Phone> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private double price;
    private int quantity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(length = 20)
    private String status = "ACTIVE";

    // --- CẤU HÌNH CHI TIẾT ĐIỆN THOẠI (SMARTPHONE SPECIFICATIONS) ---
    // 1. Màn hình
    @Column(length = 100)
    private String screenSize; // VD: "6.9 inch"

    @Column(length = 150)
    private String screenTech; // VD: "Super Retina XDR OLED, 120Hz ProMotion"

    @Column(length = 100)
    private String screenResolution; // VD: "2868 x 1320 Pixels"

    // 2. Vi xử lý & Hệ điều hành
    @Column(length = 150)
    private String cpu; // VD: "Apple A18 Pro 6 nhân" / "Snapdragon 8 Gen 3"

    @Column(length = 100)
    private String gpu; // VD: "Apple GPU 6 nhân"

    @Column(length = 100)
    private String os; // VD: "iOS 18" / "Android 14"

    @Column(length = 50)
    private String ram; // VD: "8 GB"

    @Column(length = 50)
    private String storage; // VD: "256 GB"

    // 3. Hệ thống Camera
    @Column(length = 250)
    private String rearCamera; // VD: "Chính 48 MP & Phụ 48 MP, 12 MP"

    @Column(length = 150)
    private String frontCamera; // VD: "12 MP, HDR, quay video 4K"

    // 4. Pin & Công nghệ Sạc
    @Column(length = 100)
    private String battery; // VD: "4685 mAh"

    @Column(length = 150)
    private String charging; // VD: "Sạc nhanh 45W, Sạc không dây MagSafe 25W"

    // 5. Kết nối & Tiện ích
    @Column(length = 100)
    private String sim; // VD: "1 Nano SIM & 1 eSIM"

    @Column(length = 100)
    private String network; // VD: "5G, Wi-Fi 7, Bluetooth 5.4"

    @Column(length = 100)
    private String waterproof; // VD: "IP68 (Kháng nước ở độ sâu 6m trong 30 phút)"

    @Column(length = 100)
    private String weight; // VD: "227 g, Khung viền Titan"

    @Column(length = 100)
    private String origin; // VD: "Năm 2024 / Mỹ"

    @Column(length = 100)
    private String warrantyPeriod; // VD: "12 tháng chính hãng"

    @OneToMany(mappedBy = "phone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PhoneVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "phone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PhoneImage> images = new ArrayList<>();

    public Phone(Integer id, String name, Brand brand, Category category, double price, int quantity) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.status = "ACTIVE";
    }
}
