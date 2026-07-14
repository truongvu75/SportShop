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
 * Chi tiết đơn hàng
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "orderdetail")
public class OrderDetail {

	/**
	 * Mã chi tiết đơn hàng
	 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderdetailid")
    private Integer orderDetailID;

    /**
     * Số lượng sản phẩm
     */
    @Column(name = "quantity")
    private Integer quantity;

    /**
     * Giá 
     */
    @Column(name = "saleprice")
    private BigDecimal salePrice;

    /**
     * Đơn hàng
     */
    @ManyToOne
    @JoinColumn(name = "orderid")
    private Order order;

    /**
     * Sản phẩm
     */
    @ManyToOne
    @JoinColumn(name = "variantid")
    private ProductVariant variant;

}