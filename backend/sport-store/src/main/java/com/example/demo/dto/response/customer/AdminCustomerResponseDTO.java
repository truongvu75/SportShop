package com.example.demo.dto.response.customer;

import lombok.Data;

/**
 * DTO dành cho response gửi về lại Client 
 */
@Data
public class AdminCustomerResponseDTO {

	private Integer customerID;

	private String customerName;

	private String phone;

	private String address;

	private String email;

	private String provinceName;

	private boolean isLocked;

	private String username;
}