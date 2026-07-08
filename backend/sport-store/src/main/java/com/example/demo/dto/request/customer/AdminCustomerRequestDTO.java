package com.example.demo.dto.request.customer;

import lombok.Data;

/**
 * DTO dành cho request từ client(ADMIN) lấy danh sách Customer
 */
@Data
public class AdminCustomerRequestDTO {

	private String customerName;

	private String phone;

	private String address;

	private String email;

	private String provinceName;

	private boolean isLocked;
}