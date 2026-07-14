package com.example.demo.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Biến thể của sản phẩm, chứa số lượng, màu sắc của 1 sản phẩm cụ thể
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "productvariant")
public class ProductVariant {

	/**
	 * Mã sản phẩm(biến thể)
	 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variantid")
    private Integer variantID;

    /**
     * Giá sản phẩm
     */
    @Column(name = "price")
    private BigDecimal price;

    /**
     * Số lượng còn
     */
    @Column(name = "stock")
    private Integer stock;

    /**
     * Mã sản phẩm theo dõi từng biến thể
     */
    @Column(name = "sku")
    private String sku;

    /**
     * Sản phẩm
     */
    @ManyToOne
    @JoinColumn(name = "productid")
    private Product product;

    /**
     * Size sản phẩm
     */
    @ManyToOne
    @JoinColumn(name = "sizeid")
    private ProductSize size;

    /**
     * Màu sắc sản phẩm
     */
    @ManyToOne
    @JoinColumn(name = "colorid")
    private ProductColor color;

}
