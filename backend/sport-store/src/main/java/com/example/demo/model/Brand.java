package com.example.demo.model;

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
 * Hãng của sản phẩm
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Brand")
public class Brand {
	/**
	 * Mã hãng 
	 */
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BrandID")
    private Integer brandID;

	/**
	 * Tên hãng
	 */
    @Column(name = "BrandName")
    private String brandName;
}
