package com.example.demo.dto.request.employee;

import java.util.List;

import lombok.Data;

/**
 * Lớp DTO dùng cho request nhận từ Client đối với ChangeRole
 */
@Data
public class EmployeeRoleRequestDTO {

	/**
	 * Danh sách Roles
	 */
	private List<String> roleNames;
}