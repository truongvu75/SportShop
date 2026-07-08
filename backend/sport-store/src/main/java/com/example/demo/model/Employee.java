package com.example.demo.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Nhân viên
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Employee")
public class Employee {

	/**
	 * Mã nhân viên
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "EmployeeID")
	private Integer employeeID;
	
	/**
	 * Tên nhân viên
	 */
	@Column(name = "EmployeeName")
	private String employeeName;
	
	/**
	 * Số điện thoại
	 */
	@Column(name = "Phone")
	private String phone;
	
	/**
	 * Địa chỉ
	 */
	@Column(name = "Address")
	private String address;
	
	/**
	 * Email
	 */
	@Column(name = "Email")
	private String email;
	
	/**
	 * Ngày sinh
	 */
	@Column(name = "BirthDate")
	private Date birthDate;
	
	/**
	 * Ảnh
	 */
	@Column(name = "Photo")
	private String photo;
	
	/**
	 * Trạng thái làm việc
	 */
	@Column(name = "IsWorking")
	private boolean isWorking;
	
	/**
	 * Các quyền của nhân viên. Phân các bằng dấu ','
	 */
	@Column(name = "RoleNames")
	private String roleNames;
	
	@OneToOne
	@JoinColumn(name = "AccountID")
	private Account account;
}
