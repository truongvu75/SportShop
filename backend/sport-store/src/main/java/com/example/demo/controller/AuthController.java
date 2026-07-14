package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.request.ChangePasswordRequestDTO;
import com.example.demo.dto.request.RegisterAccountAndCustomerRequestDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.model.Province;
import com.example.demo.repository.AccountRepository;
import com.example.demo.security.JwtService;
import com.example.demo.service.AccountService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private AccountService accountService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtService jwtService;

	// 1. CHỨC NĂNG ĐĂNG KÝ (REGISTER)
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterAccountAndCustomerRequestDTO request) {
		String username = request.getUsername();
		String password = request.getPassword();

		// Kiểm tra xem trùng username không
		if (accountService.existsByUsername(username)) {
			return ResponseEntity.badRequest().body("Tài khoản đã tồn tại!");
		}

		// Tạo tài khoản mới
		Account newAccount = new Account();
		newAccount.setUsername(username);

		// Bắt buộc phải mã hóa mật khẩu trước khi lưu vào DB!
		newAccount.setPassword(passwordEncoder.encode(password));
		newAccount.setActive(true); // Mặc định tài khoản kích hoạt luôn
		newAccount.setRole("ROLE_CUSTOMER");

		// Trường thông tin của Customer
		Customer customer = new Customer();
		customer.setCustomerName(request.getCustomerName());
		customer.setPhone(request.getPhone());
		customer.setAddress(request.getAddress());
		customer.setProvince(new Province(request.getProvince()));
		customer.setEmail(request.getEmail());

		accountService.createAccountAndCustomer(newAccount, customer);
		return ResponseEntity.ok("Đăng ký tài khoản thành công!");
	}

	// 2. CHỨC NĂNG ĐĂNG NHẬP (LOGIN)
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
		String username = request.get("username");
		String password = request.get("password");
//		System.out.println(password);

		try {
			// 1. Gọi bộ máy xác thực tự động so khớp username & mật khẩu trong DB
			// Hàm này tự động gọi CustomUserDetailsService của bạn để load account và gộp
			// quyền
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(username, password));

			// 2. Mẹo tối ưu: Lấy trực tiếp đối tượng Account đã được xác thực và gộp quyền
			// thành công từ bộ nhớ
			// Bạn ép kiểu từ Principal về class Account của mình. Không cần gọi DB lần 2!
			Account account = (Account) authentication.getPrincipal();

			// 3. Sinh JWT Token (Lúc này JwtService sẽ lấy được đầy đủ mảng quyền đã gộp để
			// nén vào Token)
			String token = jwtService.generateToken(account);

			// 4. Trả về thông tin cho ReactJS
			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("username", account.getUsername());

			// Trả về danh sách quyền đầy đủ (gồm cả quyền hệ thống lẫn quyền chi tiết của
			// Employee nếu có)
			// để ReactJS dựa vào đây ẩn/hiển thị các nút bấm trên giao diện
			response.put("roles", account.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());

			return ResponseEntity.ok(response);

		} catch (BadCredentialsException e) {
			// Bắt lỗi sai tên đăng nhập hoặc sai mật khẩu
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tên đăng nhập hoặc mật khẩu không chính xác!");

		} catch (DisabledException e) {
			// Bắt lỗi khi trường IsActive dưới DB của Account = false
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body("Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt!");

		} catch (Exception e) {
			// Bắt các lỗi hệ thống phát sinh khác nếu có
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Có lỗi xảy ra trong quá trình đăng nhập: " + e.getMessage());
		}
	}

	// 3. CHỨC NĂNG ĐỔI MẬT KHẨU (CHANGE PASSWORD)
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO request) {
		try {
			accountService.changePassword(request.getCurrentPassword(), request.getNewPassword());
			return ResponseEntity.ok("Đổi mật khẩu thành công!");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
}