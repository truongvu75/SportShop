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
@Table(name = "Customer")
public class Customer {
	/**
	 * Mã Khách hàng
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CustomerID")
	private Integer customerID;
	
	/**
	 * Tên Khách hàng
	 */
	@Column(name = "CustomerName")
	private String customerName;
	
	/**
	 * Số điện thoại
	 */
	@Column(name = "Phone")
	private String phone;
	
	/**
	 * Địa chỉ: phường, xã...
	 */
	@Column(name = "Address")
	private String address;
	
	/**
	 * Email
	 */
	@Column(name = "Email")
	private String email;
	
	/**
	 * Kiểm soát truy cập tạm thời của khách hàng
	 */
	@Column(name = "IsLocked")
	private boolean isLocked;
	
	/**
	 * Tỉnh/thành phố
	 */
	@ManyToOne
	@JoinColumn(name = "Province")
	private Province province;
	
	@OneToOne
	@JoinColumn(name = "AccountID")
	private Account account;
}
