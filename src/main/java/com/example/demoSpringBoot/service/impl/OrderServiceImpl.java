package com.example.demoSpringBoot.service.impl;

import com.example.demoSpringBoot.dto.*;
import com.example.demoSpringBoot.exception.BadRequestException;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.*;
import com.example.demoSpringBoot.repository.*;
import com.example.demoSpringBoot.service.CartService;
import com.example.demoSpringBoot.service.EmailService;
import com.example.demoSpringBoot.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final PhoneVariantRepository variantRepository;
    private final PhoneRepository phoneRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final EmailService emailService;
    private final WarrantyRepository warrantyRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            PaymentRepository paymentRepository,
                            PhoneVariantRepository variantRepository,
                            PhoneRepository phoneRepository,
                            VoucherRepository voucherRepository,
                            UserRepository userRepository,
                            CartRepository cartRepository,
                            CartService cartService,
                            EmailService emailService,
                            WarrantyRepository warrantyRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.variantRepository = variantRepository;
        this.phoneRepository = phoneRepository;
        this.voucherRepository = voucherRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartService = cartService;
        this.emailService = emailService;
        this.warrantyRepository = warrantyRepository;
    }

    @Override
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        AppUser user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderCode(generateOrderCode());
        order.setRecipientName(request.getRecipientName());
        String email = request.getRecipientEmail();
        if ((email == null || email.isBlank()) && user != null) {
            email = user.getEmail();
        }
        if ((email == null || email.isBlank()) && request.getNote() != null && request.getNote().contains("Email: ")) {
            try {
                int idx = request.getNote().indexOf("Email: ");
                String sub = request.getNote().substring(idx + 7).trim();
                if (sub.endsWith(")")) sub = sub.substring(0, sub.length() - 1).trim();
                if (sub.contains("@")) {
                    email = sub;
                }
            } catch (Exception ignored) {}
        }
        order.setRecipientEmail(email);
        order.setRecipientPhone(request.getRecipientPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
        order.setNote(request.getNote());
        order.setStatus("PENDING");
        order.setPaymentStatus("COD".equalsIgnoreCase(request.getPaymentMethod()) ? "UNPAID" : "PAID");
        order.setCreatedAt(LocalDateTime.now());
        // Phí vận chuyển tiêu chuẩn là 30.000đ (nếu request truyền giá trị khác thì lấy theo request)
        double initialShipping = request.getShippingFee() != null ? request.getShippingFee() : 30000.0;
        order.setShippingFee(initialShipping);

        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0.0;

        // If specific items provided in request
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderItemRequest itemReq : request.getItems()) {
                PhoneVariant variant = null;
                if (itemReq.getVariantId() != null) {
                    variant = variantRepository.findById(itemReq.getVariantId()).orElse(null);
                }

                // Nếu không tìm thấy bằng variantId hoặc chỉ có phoneId, tự động tìm biến thể của máy đó
                if (variant == null && itemReq.getPhoneId() != null) {
                    Phone p = phoneRepository.findById(itemReq.getPhoneId()).orElse(null);
                    if (p != null) {
                        List<PhoneVariant> pVariants = variantRepository.findByPhoneId(p.getId());
                        if (!pVariants.isEmpty()) {
                            variant = pVariants.stream()
                                    .filter(v -> itemReq.getVariantName() != null &&
                                            (itemReq.getVariantName().toLowerCase().contains(v.getColor().toLowerCase()) ||
                                             (v.getStorage() != null && itemReq.getVariantName().contains(v.getStorage()))))
                                    .findFirst()
                                    .orElse(pVariants.get(0));
                        }
                    }
                }

                if (variant != null) {
                    if (variant.getStockQuantity() < itemReq.getQuantity()) {
                        throw new BadRequestException("Sản phẩm " + (variant.getPhone() != null ? variant.getPhone().getName() : "") +
                                " không đủ hàng tồn kho.");
                    }
                    variant.setStockQuantity(variant.getStockQuantity() - itemReq.getQuantity());
                    variantRepository.save(variant);

                    Phone p = variant.getPhone();
                    if (p != null) {
                        p.setQuantity(Math.max(0, p.getQuantity() - itemReq.getQuantity()));
                        phoneRepository.save(p);
                    }

                    OrderItem orderItem = createOrderItem(order, variant, itemReq.getQuantity());
                    subtotal += orderItem.getLineTotal();
                    orderItems.add(orderItem);
                } else {
                    // Fallback linh hoạt cho khách hàng từ storefront
                    Phone p = itemReq.getPhoneId() != null ? phoneRepository.findById(itemReq.getPhoneId()).orElse(null) : null;
                    if (p != null) {
                        p.setQuantity(Math.max(0, p.getQuantity() - itemReq.getQuantity()));
                        phoneRepository.save(p);
                    }
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProductName(itemReq.getProductName() != null && !itemReq.getProductName().trim().isEmpty()
                            ? itemReq.getProductName() : (p != null ? p.getName() : "Điện thoại thông minh"));
                    orderItem.setVariantName(itemReq.getVariantName() != null ? itemReq.getVariantName() : "Chính hãng");
                    orderItem.setSku("SKU-" + (itemReq.getPhoneId() != null ? itemReq.getPhoneId() : (System.currentTimeMillis() % 100000)));
                    orderItem.setQuantity(itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1);
                    double itemPrice = itemReq.getPrice() != null && itemReq.getPrice() > 0 ? itemReq.getPrice() : (p != null ? p.getPrice() : 15000000.0);
                    orderItem.setPrice(itemPrice);
                    orderItem.setLineTotal(itemPrice * orderItem.getQuantity());
                    subtotal += orderItem.getLineTotal();
                    orderItems.add(orderItem);
                }
            }
        } else if (userId != null) {
            // Checkout from user's cart
            Cart cart = cartRepository.findByUserId(userId).orElse(null);
            if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
                throw new BadRequestException("Giỏ hàng của bạn đang trống, không thể tạo đơn hàng.");
            }

            for (CartItem cartItem : cart.getItems()) {
                PhoneVariant variant = cartItem.getVariant();
                if (variant.getStockQuantity() < cartItem.getQuantity()) {
                    throw new BadRequestException("Sản phẩm " + (variant.getPhone() != null ? variant.getPhone().getName() : "") +
                            " không đủ tồn kho.");
                }

                variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
                variantRepository.save(variant);

                Phone p = variant.getPhone();
                if (p != null) {
                    p.setQuantity(Math.max(0, p.getQuantity() - cartItem.getQuantity()));
                    phoneRepository.save(p);
                }

                OrderItem orderItem = createOrderItem(order, variant, cartItem.getQuantity());
                subtotal += orderItem.getLineTotal();
                orderItems.add(orderItem);
            }

            // Clear cart after checkout
            cartService.clearCart(userId);
        } else {
            throw new BadRequestException("Vui lòng cung cấp danh sách sản phẩm để tạo đơn hàng.");
        }

        // Tính toán giảm giá Voucher (Server-side validation)
        double discount = 0.0;
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            String vCode = request.getVoucherCode().trim().toUpperCase();
            if ("FREESHIP".equalsIgnoreCase(vCode)) {
                order.setVoucherCode("FREESHIP");
                order.setShippingFee(0.0); // Miễn phí vận chuyển về 0đ
                discount = 0.0;
            } else {
                Optional<Voucher> optVoucher = voucherRepository.findByCodeIgnoreCaseAndActiveTrue(vCode);
                if (optVoucher.isPresent()) {
                    Voucher v = optVoucher.get();
                    if (v.getExpiresAt() == null || v.getExpiresAt().isAfter(LocalDateTime.now())) {
                        if (v.getMinOrderAmount() == null || subtotal >= v.getMinOrderAmount()) {
                            if (v.getDiscountAmount() != null && v.getDiscountAmount() > 0) {
                                discount = v.getDiscountAmount();
                            } else if (v.getDiscountPercent() != null && v.getDiscountPercent() > 0) {
                                discount = subtotal * (v.getDiscountPercent() / 100.0);
                                if (v.getMaxDiscountAmount() != null && discount > v.getMaxDiscountAmount()) {
                                    discount = v.getMaxDiscountAmount();
                                }
                            }
                            discount = Math.min(discount, subtotal);
                            int currentCount = v.getUsedCount() != null ? v.getUsedCount() : 0;
                            v.setUsedCount(currentCount + 1);
                            voucherRepository.save(v);
                            order.setVoucherCode(v.getCode());
                        }
                    }
                } else if (request.getDiscountAmount() != null && request.getDiscountAmount() > 0) {
                    discount = Math.min(request.getDiscountAmount(), subtotal);
                    order.setVoucherCode(vCode);
                }
            }
        } else if (request.getDiscountAmount() != null && request.getDiscountAmount() > 0) {
            discount = Math.min(request.getDiscountAmount(), subtotal);
        }

        order.setDiscountAmount(discount);
        // Tổng thanh toán = (Tiền hàng - Giảm giá sản phẩm) + Phí vận chuyển
        double finalTotal = Math.max(0.0, subtotal - discount) + order.getShippingFee();
        order.setTotalAmount(finalTotal);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Create Payment record
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setPaymentMethod(savedOrder.getPaymentMethod());
        payment.setAmount(savedOrder.getTotalAmount());
        payment.setStatus("COD".equalsIgnoreCase(savedOrder.getPaymentMethod()) ? "PENDING" : "SUCCESS");
        if ("SUCCESS".equals(payment.getStatus())) {
            payment.setPaidAt(LocalDateTime.now());
        }
        paymentRepository.save(payment);

        // Tự động kích hoạt thông tin bảo hành điện tử chính hãng cho từng thiết bị trong đơn hàng
        try {
            if (savedOrder.getItems() != null) {
                for (OrderItem item : savedOrder.getItems()) {
                    for (int q = 0; q < item.getQuantity(); q++) {
                        Warranty w = new Warranty();
                        // Sinh mã IMEI 15 số chuẩn (bắt đầu bằng đầu số TAC 3589...)
                        long random11Digits = 10000000000L + (long)(new Random().nextDouble() * 89999999999L);
                        String imei = "3589" + String.valueOf(random11Digits).substring(0, 11);
                        while (warrantyRepository.findByImeiNumber(imei).isPresent()) {
                            random11Digits = 10000000000L + (long)(new Random().nextDouble() * 89999999999L);
                            imei = "3589" + String.valueOf(random11Digits).substring(0, 11);
                        }
                        w.setImeiNumber(imei);
                        w.setProductName(item.getProductName());
                        w.setVariantName(item.getVariantName() != null ? item.getVariantName() : "Tiêu chuẩn");
                        w.setCustomerName(savedOrder.getRecipientName());
                        w.setCustomerPhone(savedOrder.getRecipientPhone());
                        w.setOrderCode(savedOrder.getOrderCode());
                        w.setStartDate(java.time.LocalDate.now());
                        w.setEndDate(java.time.LocalDate.now().plusMonths(12));
                        w.setStatus("ACTIVE");
                        w.setNote("Kích hoạt bảo hành điện tử chính hãng tự động theo đơn #" + savedOrder.getOrderCode());
                        warrantyRepository.save(w);
                    }
                }
            }
        } catch (Exception ignored) {}

        // Gửi email xác nhận đơn hàng tới khách hàng
        try {
            emailService.sendOrderConfirmationEmail(savedOrder);
        } catch (Exception ignored) {}

        return toResponse(savedOrder);
    }

    private OrderItem createOrderItem(Order order, PhoneVariant variant, int quantity) {
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setVariant(variant);
        item.setProductName(variant.getPhone() != null ? variant.getPhone().getName() : "Điện thoại");
        String variantName = (variant.getStorage() != null ? variant.getStorage() : "") + " " +
                (variant.getColor() != null ? variant.getColor() : "");
        item.setVariantName(variantName.trim());
        item.setSku(variant.getSku());
        item.setQuantity(quantity);
        item.setPrice(variant.getPrice());
        item.setLineTotal(variant.getPrice() * quantity);
        return item;
    }

    private String generateOrderCode() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomNum = 1000 + new Random().nextInt(9000);
        return "DH-" + dateStr + "-" + randomNum;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderCode", orderCode));
        return toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String oldStatus = order.getStatus();
        if (request.getStatus() != null) {
            String newStatus = request.getStatus().toUpperCase();
            order.setStatus(newStatus);
            if ("COMPLETED".equalsIgnoreCase(newStatus)) {
                order.setCompletedAt(LocalDateTime.now());
                order.setPaymentStatus("PAID");
            }

            // Hoàn lại tồn kho nếu đơn bị HỦY (CANCELLED)
            if ("CANCELLED".equalsIgnoreCase(newStatus) && !"CANCELLED".equalsIgnoreCase(oldStatus)) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        if (item.getVariant() != null) {
                            PhoneVariant v = item.getVariant();
                            v.setStockQuantity(v.getStockQuantity() + item.getQuantity());
                            variantRepository.save(v);
                            if (v.getPhone() != null) {
                                Phone p = v.getPhone();
                                p.setQuantity(p.getQuantity() + item.getQuantity());
                                phoneRepository.save(p);
                            }
                        }
                    }
                }
            }
        }
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus().toUpperCase());
        }

        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        if (order.getItems() != null) {
            itemResponses = order.getItems().stream().map(i -> new OrderItemResponse(
                    i.getId(),
                    i.getVariant() != null ? i.getVariant().getId() : null,
                    i.getProductName(),
                    i.getVariantName(),
                    i.getSku(),
                    i.getQuantity(),
                    i.getPrice(),
                    i.getLineTotal()
            )).collect(Collectors.toList());
        }

        OrderResponse resp = new OrderResponse(
                order.getId(),
                order.getOrderCode(),
                order.getRecipientName(),
                order.getRecipientPhone(),
                order.getShippingAddress(),
                order.getTotalAmount(),
                order.getShippingFee(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getPaymentMethod(),
                order.getNote(),
                order.getCreatedAt(),
                itemResponses
        );
        resp.setRecipientEmail(order.getRecipientEmail());
        resp.setVoucherCode(order.getVoucherCode());
        resp.setDiscountAmount(order.getDiscountAmount());
        return resp;
    }
}
