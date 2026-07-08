package com.example.demo.dto.response.employee;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * DTO dành cho Response với các chức năng: List, ...
 */
@Data
public class EmployeeResponseDTO {

	private Integer employeeID;

	private String employeeName;

	private String phone;

	private String address;

	private String email;

	private Date birthDate;

	private String photo;

	private boolean isWorking;

	private String username;

	private List<String> roleNames;
}