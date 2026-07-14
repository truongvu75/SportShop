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
@Table(name = "employee")
public class Employee {

	/**
	 * Mã nhân viên
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employeeid")
	private Integer employeeID;
	
	/**
	 * Tên nhân viên
	 */
	@Column(name = "employeename")
	private String employeeName;
	
	/**
	 * Số điện thoại
	 */
	@Column(name = "phone")
	private String phone;
	
	/**
	 * Địa chỉ
	 */
	@Column(name = "address")
	private String address;
	
	/**
	 * Email
	 */
	@Column(name = "email")
	private String email;
	
	/**
	 * Ngày sinh
	 */
	@Column(name = "birthdate")
	private Date birthDate;
	
	/**
	 * Ảnh
	 */
	@Column(name = "photo")
	private String photo;
	
	/**
	 * Trạng thái làm việc
	 */
	@Column(name = "isworking")
	private boolean isWorking;
	
	/**
	 * Các quyền của nhân viên. Phân các bằng dấu ','
	 */
	@Column(name = "rolenames")
	private String roleNames;
	
	@OneToOne
	@JoinColumn(name = "accountid")
	private Account account;
}
