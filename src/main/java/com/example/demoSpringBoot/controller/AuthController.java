package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.ForgotPasswordRequest;
import com.example.demoSpringBoot.dto.LoginRequest;
import com.example.demoSpringBoot.dto.LoginResponse;
import com.example.demoSpringBoot.dto.ResetPasswordRequest;
import com.example.demoSpringBoot.exception.BadRequestException;
import com.example.demoSpringBoot.exception.ResourceNotFoundException;
import com.example.demoSpringBoot.model.AppUser;
import com.example.demoSpringBoot.repository.UserRepository;
import com.example.demoSpringBoot.security.JwtService;
import com.example.demoSpringBoot.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Validated @RequestBody LoginRequest request) {
        String identifier = request.getUsername().trim();
        UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDetails.getUsername(), request.getPassword())
        );

        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(token, "Bearer", jwtService.getExpirationSeconds());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Validated @RequestBody ForgotPasswordRequest request) {
        String input = request.getEmail().trim();
        // Tìm kiếm theo Email trước, nếu không thấy thì thử theo Username
        AppUser user = userRepository.findByEmail(input)
                .or(() -> userRepository.findByUsername(input))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với thông tin: " + input));

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new BadRequestException("Tài khoản này chưa được cấu hình địa chỉ email. Vui lòng liên hệ quản trị viên.");
        }

        // Tạo mã OTP ngẫu nhiên 6 chữ số
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setResetPasswordOtp(otp);
        user.setResetPasswordOtpExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Gửi mã OTP qua email
        emailService.sendForgotPasswordOtpEmail(user.getEmail(), otp);

        String maskedEmail = maskEmail(user.getEmail());
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("success", true);
        resp.put("message", "Mã xác thực OTP đã được tạo cho " + maskedEmail + ". Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam).");
        resp.put("email", user.getEmail());
        resp.put("devOtp", otp); // Hỗ trợ test nhanh trực tiếp trên giao diện

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Validated @RequestBody ResetPasswordRequest request) {
        String input = request.getEmail().trim();
        AppUser user = userRepository.findByEmail(input)
                .or(() -> userRepository.findByUsername(input))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với thông tin: " + input));

        if (user.getResetPasswordOtp() == null || user.getResetPasswordOtpExpiry() == null) {
            throw new BadRequestException("Không có yêu cầu đặt lại mật khẩu nào đang chờ. Vui lòng gửi lại mã OTP.");
        }

        if (user.getResetPasswordOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Mã xác thực OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        if (!user.getResetPasswordOtp().equals(request.getOtp().trim())) {
            throw new BadRequestException("Mã xác thực OTP không chính xác. Vui lòng kiểm tra lại.");
        }

        // Cập nhật mật khẩu mới & Xóa OTP
        user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đặt lại mật khẩu thành công! Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay.",
                "username", user.getUsername(),
                "email", user.getEmail() != null ? user.getEmail() : ""
        ));
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String name = parts[0];
        if (name.length() <= 2) {
            return name.charAt(0) + "***@" + parts[1];
        }
        return name.substring(0, 2) + "***" + name.charAt(name.length() - 1) + "@" + parts[1];
    }
}
