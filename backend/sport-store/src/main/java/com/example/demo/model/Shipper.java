package com.example.demo.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Đơn vị vận chuyển
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "shipper")
public class Shipper {

	/**
	 * Mã đơn vị vận chuyển
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shipperid")
	private Integer shipperID;

	/**
	 * Tên đơn vị vận chuyển
	 */
	@Column(name = "shippername")
	private String shipperName;

	/**
	 * Số điện thoại đơn vị vận chuyển
	 */
	@Column(name = "phone")
	private String phone;
}
