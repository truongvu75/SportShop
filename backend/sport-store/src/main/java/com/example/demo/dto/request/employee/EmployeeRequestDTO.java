package com.example.demo.dto.request.employee;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * DTO dành cho request các chức năng: Create, Update
 */
@Data
public class EmployeeRequestDTO {

	private String employeeName;

	private String phone;

	private String address;

	private String email;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date birthDate;

	private String photo;

	private boolean isWorking;

	/**
	 * Mật khẩu account
	 */
	private String password;

	/**
	 * Danh sách roles
	 */
	private List<String> roleNames;
}