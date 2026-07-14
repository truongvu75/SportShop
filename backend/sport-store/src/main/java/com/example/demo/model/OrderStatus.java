package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Các trạng thái của đơn hàng: Chờ xác nhận, Chờ giao hàng, Đang giao, Đã giao...
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "orderstatus")
public class OrderStatus {

	/**
	 * Mã trạng thái
	 */
	@Id
	@Column(name = "status")
	private Integer status;
	
	/**
	 * Mô tả của trạng thái
	 */
	@Column(name = "description")
	private String description;
}
