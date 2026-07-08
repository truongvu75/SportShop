package com.example.demo.service;

import com.example.demo.repository.CustomerRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.repository.AccountRepository;
import com.example.demo.security.SecurityUtils;

@Service
public class AccountService {

	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	AccountService(CustomerRepository customerRepository) {
		this.customerRepository = customerRepository;
	}

	public boolean existsByUsername(String username) {
		return accountRepository.existsByUsername(username);
	}

	public Account getAccountByUserName(String Username) {
		Account account = accountRepository.findByUsername(Username)
				.orElseThrow(() -> new RuntimeException("Account not found"));

		return account;
	}

	@Transactional // QUAN TRỌNG: Đảm bảo cả Account và Customer cùng lưu thành công, hoặc không gì cả
	public void createAccountAndCustomer(Account account, Customer customer) {
		// 1. Lưu tài khoản trước để sinh ID
		Account savedAccount = accountRepository.save(account);

		// 2. Gán tài khoản đã lưu vào cho khách hàng
		customer.setAccount(savedAccount);

		// 3. Lưu khách hàng
		customerRepository.save(customer);
	}

	/**
	 * Đổi mật khẩu cho tài khoản đang đăng nhập
	 * @param currentPassword Mật khẩu hiện tại để xác minh
	 * @param newPassword     Mật khẩu mới muốn đặt
	 */
	@Transactional
	public void changePassword(String currentPassword, String newPassword) {
		// 1. Lấy thông tin tài khoản đang đăng nhập từ Security Context
		Account currentAccount = SecurityUtils.getCurrentAccount();

		// 2. Tìm tài khoản thật trong DB để tránh lỗi Hibernate detached entity
		Account account = accountRepository.findById(currentAccount.getAccountId().intValue())
				.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

		// 3. Xác minh mật khẩu hiện tại
		if (!passwordEncoder.matches(currentPassword, account.getPassword())) {
			throw new RuntimeException("Mật khẩu hiện tại không chính xác!");
		}

		// 4. Encode mật khẩu mới và cập nhật vào DB
		account.setPassword(passwordEncoder.encode(newPassword));
		accountRepository.save(account);
	}

}

