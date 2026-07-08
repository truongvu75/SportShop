package com.example.demo.dto.response.customer;

import lombok.Data;

/**
 * DTO dành cho response lấy thông tin khách hàng
 */
@Data
public class CustomerProfileResponseDTO {

	private Integer customerID;

	private String customerName;

	private String phone;

	private String address;

	private String email;

	private String provinceName;
}