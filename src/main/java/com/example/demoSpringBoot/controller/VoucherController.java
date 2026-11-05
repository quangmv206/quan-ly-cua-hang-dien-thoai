package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.model.Voucher;
import com.example.demoSpringBoot.repository.VoucherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {

    private final VoucherRepository voucherRepository;

    public VoucherController(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    // 1. Lấy danh sách voucher đang kích hoạt (Public cho khách hàng)
    @GetMapping
    public List<Voucher> getAllActiveVouchers() {
        return voucherRepository.findByActiveTrue();
    }

    // 2. Lấy toàn bộ voucher (Bao gồm cả hết hạn/khóa) cho Admin quản trị
    @GetMapping("/admin/all")
    public List<Voucher> getAllVouchersForAdmin() {
        return voucherRepository.findAll();
    }

    // 3. Thêm voucher mới (Admin)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Voucher createVoucher(@RequestBody Voucher voucher) {
        if (voucher.getCode() != null) {
            voucher.setCode(voucher.getCode().trim().toUpperCase());
        }
        if (voucher.getExpiresAt() == null) {
            voucher.setExpiresAt(LocalDateTime.now().plusMonths(6));
        }
        voucher.setActive(true);
        return voucherRepository.save(voucher);
    }

    // 4. Cập nhật voucher (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @RequestBody Voucher details) {
        return voucherRepository.findById(id).map(v -> {
            if (details.getCode() != null) v.setCode(details.getCode().trim().toUpperCase());
            if (details.getTitle() != null) v.setTitle(details.getTitle());
            if (details.getDescription() != null) v.setDescription(details.getDescription());
            if (details.getDiscountAmount() != null) v.setDiscountAmount(details.getDiscountAmount());
            if (details.getDiscountPercent() != null) v.setDiscountPercent(details.getDiscountPercent());
            if (details.getMinOrderAmount() != null) v.setMinOrderAmount(details.getMinOrderAmount());
            if (details.getMaxDiscountAmount() != null) v.setMaxDiscountAmount(details.getMaxDiscountAmount());
            if (details.getExpiresAt() != null) v.setExpiresAt(details.getExpiresAt());
            v.setActive(details.isActive());
            return ResponseEntity.ok(voucherRepository.save(v));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Xóa / Tắt kích hoạt voucher (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVoucher(@PathVariable Long id) {
        return voucherRepository.findById(id).map(v -> {
            voucherRepository.delete(v);
            return ResponseEntity.ok(Map.of("message", "Đã xóa mã voucher thành công."));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 6. Kiểm tra hợp lệ & Áp dụng voucher khi thanh toán
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateVoucher(
            @RequestParam String code,
            @RequestParam(defaultValue = "0") Double amount
    ) {
        Map<String, Object> response = new HashMap<>();

        if (code == null || code.trim().isEmpty()) {
            response.put("valid", false);
            response.put("message", "Vui lòng nhập mã giảm giá.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<Voucher> optionalVoucher = voucherRepository.findByCodeIgnoreCaseAndActiveTrue(code.trim());
        if (optionalVoucher.isEmpty()) {
            response.put("valid", false);
            response.put("message", "Mã giảm giá không tồn tại hoặc đã hết hạn.");
            return ResponseEntity.ok(response);
        }

        Voucher voucher = optionalVoucher.get();
        if (voucher.getExpiresAt() != null && voucher.getExpiresAt().isBefore(LocalDateTime.now())) {
            response.put("valid", false);
            response.put("message", "Mã giảm giá đã hết hạn sử dụng.");
            return ResponseEntity.ok(response);
        }

        if (voucher.getMinOrderAmount() != null && amount < voucher.getMinOrderAmount()) {
            response.put("valid", false);
            response.put("message", String.format("Mã chỉ áp dụng cho đơn hàng từ %,.0f đ trở lên.", voucher.getMinOrderAmount()));
            return ResponseEntity.ok(response);
        }

        // Kiểm tra loại mã giảm phí vận chuyển (FREESHIP):
        if ("FREESHIP".equalsIgnoreCase(voucher.getCode())) {
            double shippingDiscount = 30000.0;
            response.put("valid", true);
            response.put("code", voucher.getCode());
            response.put("title", voucher.getTitle());
            response.put("discountAmount", shippingDiscount);
            response.put("isShippingVoucher", true);
            response.put("finalAmount", Math.max(0.0, amount));
            response.put("message", "Áp dụng thành công mã FREESHIP: Giảm 30.000đ phí vận chuyển!");
            return ResponseEntity.ok(response);
        }

        double discount = 0.0;
        if (voucher.getDiscountAmount() != null && voucher.getDiscountAmount() > 0) {
            discount = voucher.getDiscountAmount();
        } else if (voucher.getDiscountPercent() != null && voucher.getDiscountPercent() > 0) {
            discount = amount * (voucher.getDiscountPercent() / 100.0);
            if (voucher.getMaxDiscountAmount() != null && discount > voucher.getMaxDiscountAmount()) {
                discount = voucher.getMaxDiscountAmount();
            }
        }

        // Không cho phép số tiền giảm vượt quá giá trị đơn hàng, nhưng nếu đơn hàng nhỏ hơn mệnh giá voucher thì chỉ giảm tối đa bằng giá trị đơn hàng
        discount = Math.min(discount, amount);
        double finalAmount = Math.max(0.0, amount - discount);

        response.put("valid", true);
        response.put("code", voucher.getCode());
        response.put("title", voucher.getTitle());
        response.put("discountAmount", discount);
        response.put("finalAmount", finalAmount);
        response.put("message", "Áp dụng mã giảm giá thành công: " + voucher.getTitle());

        return ResponseEntity.ok(response);
    }
}
