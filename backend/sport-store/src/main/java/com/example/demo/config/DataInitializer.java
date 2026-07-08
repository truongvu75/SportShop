package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.model.Account;
import com.example.demo.model.Employee;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.EmployeeRepository;

/**
 * DataInitializer — Tự động khởi tạo dữ liệu mẫu khi server khởi động.
 *
 * Mục đích: Tạo tài khoản nhân viên mặc định (nhanvien01 / 123456)
 * nếu chưa tồn tại trong DB. Mật khẩu sẽ được mã hóa BCrypt tự động.
 *
 * Thông tin tài khoản được tạo:
 *   - Username : nhanvien01
 *   - Password : 123456  (BCrypt, không lưu plaintext)
 *   - Role     : EMPLOYEE  →  Spring Security: ROLE_EMPLOYEE
 */
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedEmployeeAccount(
            AccountRepository accountRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            final String EMPLOYEE_USERNAME = "nhanvien01";

            // Kiểm tra: nếu đã tồn tại thì bỏ qua, không tạo lại
            if (accountRepository.existsByUsername(EMPLOYEE_USERNAME)) {
                System.out.println("[DataInitializer] Tài khoản '" + EMPLOYEE_USERNAME
                        + "' đã tồn tại. Bỏ qua khởi tạo.");
                return;
            }

            // === BƯỚC 1: Tạo Account với BCrypt password ===
            Account account = new Account();
            account.setUsername(EMPLOYEE_USERNAME);
            account.setPassword(passwordEncoder.encode("123456")); // BCrypt tự động
            account.setRole("ROLE_EMPLOYEE");   // CustomUserDetailsService đọc field này → ROLE_EMPLOYEE
            account.setActive(true);

            Account savedAccount = accountRepository.save(account);

            // === BƯỚC 2: Tạo hồ sơ Employee liên kết với Account vừa tạo ===
            Employee employee = new Employee();
            employee.setEmployeeName("Nhân viên 1");
            employee.setPhone("0901234567");
            employee.setEmail("nhanvien01@velocity.vn");
            employee.setWorking(true);
            employee.setRoleNames("STAFF");      // Sub-role phụ (tuỳ mở rộng sau)
            employee.setAccount(savedAccount);   // Liên kết FK AccountID

            employeeRepository.save(employee);

            System.out.println("=====================================================");
            System.out.println("[DataInitializer] Tạo tài khoản nhân viên thành công!");
            System.out.println("  Username : " + EMPLOYEE_USERNAME);
            System.out.println("  Password : 123456");
            System.out.println("  Role     : ROLE_EMPLOYEE");
            System.out.println("=====================================================");
        };
    }
}
