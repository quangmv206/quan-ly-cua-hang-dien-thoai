package com.example.demoSpringBoot.service;

import com.example.demoSpringBoot.dto.UserRequest;
import com.example.demoSpringBoot.dto.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    List<UserResponse> getAllUsers();
}
