package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Khách hàng
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "customer")
public class Customer {
	/**
	 * Mã Khách hàng
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "customerid")
	private Integer customerID;
	
	/**
	 * Tên Khách hàng
	 */
	@Column(name = "customername")
	private String customerName;
	
	/**
	 * Số điện thoại
	 */
	@Column(name = "phone")
	private String phone;
	
	/**
	 * Địa chỉ: phường, xã...
	 */
	@Column(name = "address")
	private String address;
	
	/**
	 * Email
	 */
	@Column(name = "email")
	private String email;
	
	/**
	 * Kiểm soát truy cập tạm thời của khách hàng
	 */
	@Column(name = "islocked")
	private boolean isLocked;
	
	/**
	 * Tỉnh/thành phố
	 */
	@ManyToOne
	@JoinColumn(name = "province")
	private Province province;
	
	@OneToOne
	@JoinColumn(name = "accountid")
	private Account account;
}
