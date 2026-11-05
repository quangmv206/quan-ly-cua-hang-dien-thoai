package com.example.demoSpringBoot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demoSpringBoot.security.JwtAuthenticationFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Auth endpoints - public
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/users/register").permitAll()
                        // Phone endpoints & variants
                        .requestMatchers(HttpMethod.GET, "/api/phones/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/phones/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/phones/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/phones/**").hasRole("ADMIN")
                        .requestMatchers("/api/variants/**").hasRole("ADMIN")
                        // Brand endpoints
                        .requestMatchers(HttpMethod.GET, "/api/brands").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/brands/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/brands").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/brands/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/brands/{id}").hasRole("ADMIN")
                        // Category endpoints
                        .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/{id}").hasRole("ADMIN")
                        // Warranty endpoints (public lookup, admin create & manage)
                        .requestMatchers(HttpMethod.GET, "/api/warranties/check").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/warranties/phone").permitAll()
                        .requestMatchers("/api/warranties/**").hasRole("ADMIN")
                        // Site Settings / CMS (Storefront public GET, Admin PUT/POST)
                        .requestMatchers(HttpMethod.GET, "/api/site-settings/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/site-settings/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/site-settings/**").hasRole("ADMIN")
                        // Storefront & Admin Order endpoints (GET permitted for dashboard counters)
                        .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/orders/code/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/orders/my-orders").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/orders/{id}").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/orders/{id}/status").hasAnyAuthority("ROLE_ADMIN", "ADMIN")
                        // PayOS Gateway endpoints
                        .requestMatchers("/api/payment/payos/**").permitAll()
                        // Vouchers: public active list and validation, Admin full management
                        .requestMatchers(HttpMethod.GET, "/api/vouchers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers/validate").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers/code/**").permitAll()
                        .requestMatchers("/api/vouchers/**").hasRole("ADMIN")
                        // Reviews & Questions (Storefront public submit, Admin moderate/answer/delete)
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/reviews").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/questions/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/questions").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/questions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/questions/**").hasRole("ADMIN")
                        // User Profile & Change Password & Admin Users Management
                        .requestMatchers(HttpMethod.GET, "/api/users/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/change-password").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/users").permitAll()
                        // Supplier endpoints
                        .requestMatchers("/api/suppliers/**").hasRole("ADMIN")
                        // Purchase Order endpoints
                        .requestMatchers("/api/purchase-orders/**").hasRole("ADMIN")
                        // Everything else requires authentication (Cart, User Orders, Addresses, etc.)
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(com.example.demoSpringBoot.repository.UserRepository userRepository) {
        return identifier -> userRepository.findByUsernameOrEmail(identifier, identifier)
                .map(user -> {
                    String role = user.getRole();
                    String rawRole = (role != null) ? role.replace("ROLE_", "") : "USER";
                    return org.springframework.security.core.userdetails.User.builder()
                            .username(user.getUsername())
                            .password(user.getPassword())
                            .authorities("ROLE_" + rawRole, rawRole)
                            .build();
                })
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("Không tìm thấy người dùng: " + identifier));
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

