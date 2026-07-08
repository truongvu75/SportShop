package com.example.demo.security;

import com.example.demo.model.Account;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import java.util.List;
import java.util.Collections;

/**
 * Utility class cung cấp các hàm tiện ích để bóc tách thông tin 
 * của người dùng đang đăng nhập thực tế từ Tấm vé thông hành (JWT) trong RAM.
 */
public class SecurityUtils {

    // Khóa constructor để ngăn việc khởi tạo thực thể lớp tiện ích bằng từ khóa `new`
    private SecurityUtils() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 1. Lấy toàn bộ thực thể Account (UserDetails) đang đăng nhập
     */
    public static Account getCurrentAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Kiểm tra xem user đã đăng nhập hợp lệ chưa
        if (authentication == null || !authentication.isAuthenticated() 
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!");
        }

        // Ép kiểu Principal về Class Account của bạn để lấy toàn bộ thông tin
        if (authentication.getPrincipal() instanceof Account) {
            return (Account) authentication.getPrincipal();
        }
        
        throw new RuntimeException("Thông tin xác thực không hợp lệ!");
    }

    /**
     * 2. Lấy nhanh Username của tài khoản đang đăng nhập
     */
    public static String getCurrentUsername() {
        return getCurrentAccount().getUsername();
    }

    /**
     * 3. Lấy nhanh AccountID thật của tài khoản đang đăng nhập
     */
    public static Long getCurrentAccountId() {
        return getCurrentAccount().getAccountId();
    }

    /**
     * 4. Lấy danh sách các Quyền (Roles) đã được gộp động của tài khoản này
     */
    public static List<String> getCurrentUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return Collections.emptyList();
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }

    /**
     * 5. Hàm tiện ích để kiểm tra nhanh xem User hiện tại có sở hữu một quyền nào đó không
     * Ví dụ: if (SecurityUtils.hasRole("ROLE_ADMIN")) { ... }
     */
    public static boolean hasRole(String roleName) {
        String targetRole = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName.toUpperCase();
        return getCurrentUserRoles().contains(targetRole);
    }
}