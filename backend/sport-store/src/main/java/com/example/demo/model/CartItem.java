package com.example.demo.model;

import java.math.BigDecimal;
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
 * Sản phẩm trong giỏ
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "cartItem")
public class CartItem {

	/**
	 * Mã "sản phẩm" trong giỏ
	 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartitemid")
    private Integer cartItemID;

    /**
     * Số lượng
     */
    @Column(name = "quantity")
    private Integer quantity;

    /**
     * Giá
     */
    @Column(name = "unitprice")
    private BigDecimal unitPrice;

    /**
     * Giỏ hàng
     */
    @ManyToOne
    @JoinColumn(name = "cartid")
    private Cart cart;

    /**
     * Sản phẩm cụ thể (sản phẩm biến thể) chứa đầy đủ giá, màu sắc, size
     */
    @ManyToOne
    @JoinColumn(name = "variantid")
    private ProductVariant variant;

}