package com.example.demo.security;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Kích hoạt @PreAuthorize / @PostAuthorize trên các phương thức
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        	.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Tắt CSRF vì dùng REST API + JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không tạo session trên Server
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Cho phép tự do vào các API Login / Register
                .requestMatchers("/api/provinces/**").permitAll() // Cho phép lấy danh sách tỉnh thành để hiển thị trên form Register
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll() // Cho phép vào các API GET sản phẩm
                .requestMatchers(HttpMethod.GET, "/api/ratings/product/**").permitAll() // Cho phép xem đánh giá sản phẩm (công khai)
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/payment/**").permitAll()
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers("/api/orders/**").hasAnyRole("EMPLOYEE", "CUSTOMER") // Phân quyền chỉ Nhân viên mới vào được cụm admin
                .anyRequest().authenticated() // Mọi API khác bắt buộc phải đăng nhập (có Token hợp lệ)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Chèn bộ lọc kiểm tra JWT lên trước tiên

        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Cho phép cổng ReactJS truy cập vào Backend
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "https://sport-shop-eight.vercel.app/", "https://sport-shop-truong-vu.vercel.app/")); 
        
        // Cho phép tất cả các phương thức HTTP thông dụng
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
        
        // QUAN TRỌNG: Cho phép đính kèm mọi loại Header (bao gồm Authorization của JWT)
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control")); 
        
        // Cho phép gửi kèm Cookie hoặc thông tin chứng thực nếu cần
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng luật này cho toàn bộ API
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder()); // Cấu hình tự động mã hóa & giải mã mật khẩu bằng BCrypt
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Công cụ mã hóa mật khẩu một chiều siêu an toàn
    }
}