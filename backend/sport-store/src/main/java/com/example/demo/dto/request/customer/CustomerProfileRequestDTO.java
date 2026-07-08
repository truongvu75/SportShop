package com.example.demo.dto.request.customer;

import lombok.Data;

/**
 * DTO dành cho Request lấy thông tin Khách hàng
 */
@Data
public class CustomerProfileRequestDTO {

	private String customerName;

	private String phone;

	private String address;

	private String email;

	private String provinceName;
}