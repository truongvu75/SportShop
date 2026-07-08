package com.example.demo.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.Account;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.EmployeeRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// 1. Tìm Account từ DB
		Account account = accountRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + username));

		// 2. Tạo danh sách chứa các quyền để nạp cho Spring Security
		List<GrantedAuthority> dbAuthorities = new ArrayList<>();

		// Quyền tối thiểu: Lấy từ trường Role của bảng Account (Ví dụ: "ROLE_CUSTOMER"
		// hoặc "ROLE_EMPLOYEE")
		String baseRole = account.getRole().toUpperCase();
		dbAuthorities.add(new SimpleGrantedAuthority(baseRole));

		// 3. Nếu Account này thuộc phân hệ Nhân viên (EMPLOYEE), tiến hành lấy thêm
		// quyền chi tiết
		if ("ROLE_EMPLOYEE".equalsIgnoreCase(account.getRole())) {
			employeeRepository.findByAccountAccountId(account.getAccountId()).ifPresent(employee -> {
				String detailRole = employee.getRoleNames(); // Ví dụ: "ADMIN", "MANAGER"
				if (detailRole != null && !detailRole.isEmpty()) {
					String subRole = detailRole.toUpperCase();
					dbAuthorities.add(new SimpleGrantedAuthority(subRole));
				}
			});
		}

		// 4. Nạp toàn bộ danh sách quyền gộp này vào thực thể Account
		account.setAuthorities(dbAuthorities);

		return account;

	}

}
