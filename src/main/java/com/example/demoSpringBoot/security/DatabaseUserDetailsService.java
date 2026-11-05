package com.example.demoSpringBoot.security;

import com.example.demoSpringBoot.model.AppUser;
import com.example.demoSpringBoot.repository.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DatabaseUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + username));

        String rawRole = user.getRole() != null ? user.getRole().trim() : "ROLE_USER";
        String roleWithPrefix = rawRole.startsWith("ROLE_") ? rawRole : ("ROLE_" + rawRole.toUpperCase());
        String roleWithoutPrefix = roleWithPrefix.replace("ROLE_", "");

        return new User(
                user.getUsername(),
                user.getPassword(),
                List.of(
                        new SimpleGrantedAuthority(roleWithPrefix),
                        new SimpleGrantedAuthority(roleWithoutPrefix)
                )
        );
    }
}
