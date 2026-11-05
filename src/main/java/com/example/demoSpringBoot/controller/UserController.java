package com.example.demoSpringBoot.controller;

import com.example.demoSpringBoot.dto.UserRequest;
import com.example.demoSpringBoot.dto.UserResponse;
import com.example.demoSpringBoot.exception.UnauthorizedException;
import com.example.demoSpringBoot.mapper.UserMapper;
import com.example.demoSpringBoot.model.AppUser;
import com.example.demoSpringBoot.repository.UserRepository;
import com.example.demoSpringBoot.security.SecurityUtils;
import com.example.demoSpringBoot.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserController(UserService userService,
                          SecurityUtils securityUtils,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          UserMapper userMapper) {
        this.userService = userService;
        this.securityUtils = securityUtils;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Validated @RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/profile")
    public UserResponse getProfile() {
        AppUser user = securityUtils.getCurrentUser()
                .orElseThrow(() -> new UnauthorizedException("Vui lòng đăng nhập để xem thông tin tài khoản"));
        return userMapper.toResponse(user);
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(@RequestBody Map<String, String> body) {
        AppUser user = securityUtils.getCurrentUser()
                .orElseThrow(() -> new UnauthorizedException("Vui lòng đăng nhập để cập nhật tài khoản"));

        if (body.containsKey("fullName")) {
            user.setFullName(body.get("fullName"));
        }
        if (body.containsKey("phone")) {
            user.setPhone(body.get("phone"));
        }
        if (body.containsKey("email")) {
            user.setEmail(body.get("email"));
        }

        AppUser saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @PutMapping("/change-password")
    public Map<String, String> changePassword(@RequestBody Map<String, String> body) {
        AppUser user = securityUtils.getCurrentUser()
                .orElseThrow(() -> new UnauthorizedException("Vui lòng đăng nhập để đổi mật khẩu"));

        String oldPass = body.get("oldPassword");
        String newPass = body.get("newPassword");

        if (newPass == null || newPass.trim().length() < 6) {
            throw new RuntimeException("Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        if (oldPass != null && !passwordEncoder.matches(oldPass, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);

        return Map.of("message", "Đổi mật khẩu thành công!");
    }

    @PostMapping("/logout")
    public Map<String, String> logout(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return Map.of("message", "Đăng xuất thành công. Hãy xóa token ở client.");
    }
}
