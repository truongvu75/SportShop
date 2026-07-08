package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * DTO dành cho request tạo mới Account và Customer
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterAccountAndCustomerRequestDTO {

	//THông tin tài khoản
	private String username;
	private String password;
	
	//Thông tin khách hàng
	private String customerName;
	private String phone;
	private String address;
	private String province;
	private String email;
	
	
}
