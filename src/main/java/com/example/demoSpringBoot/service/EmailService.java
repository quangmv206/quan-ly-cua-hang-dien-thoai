package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.model.Order;

public interface EmailService {
    /**
     * Gửi email xác nhận đơn hàng tới khách hàng
     */
    void sendOrderConfirmationEmail(Order order);

    /**
     * Gửi mã OTP xác thực khôi phục mật khẩu
     */
    void sendForgotPasswordOtpEmail(String toEmail, String otp);
}

