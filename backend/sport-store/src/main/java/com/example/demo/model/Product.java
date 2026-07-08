package com.example.demo.model;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sản phẩm
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Product")
public class Product {

	/**
	 * Mã sản phẩm
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ProductID")
	private Integer productID;

	/**
	 * Tên sản phẩm
	 */
	@Column(name = "ProductName")
	private String productName;

	/**
	 * Mô tả sản phẩm
	 */
	@Column(name = "ProductDescription")
	private String productDescription;

	/**
	 * Giá cơ bản của sản phẩm
	 */
	@Column(name = "BasePrice")
	private BigDecimal basePrice;

	/**
	 * Ảnh sản phẩm
	 */
	@Column(name = "Photo")
	private String photo;

	/**
	 * Trạng thái bán
	 */
	@Column(name = "IsSelling")
	private Boolean isSelling;

	/**
	 * Loại hàng
	 */
	@ManyToOne
	@JoinColumn(name = "CategoryID")
	private Category category;

	/**
	 * Hãng của sản phẩm
	 */
	@ManyToOne
	@JoinColumn(name = "BrandID")
	private Brand brand;
	
	@OneToMany(mappedBy = "product")
//	@JsonManagedReference // 🌟 Thêm dòng này
	private List<ProductVariant> variants;
	

}
