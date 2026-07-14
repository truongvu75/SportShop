package com.example.demo.model;

import java.math.BigDecimal;
import java.util.Date;

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
 * Đơn hàng
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "orders")
public class Order {
	
	/**
	 * Mã đơn hàng
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "orderid")
	private Integer orderID;
	
	/**
	 * Ngày đặt hàng
	 */
	@Column(name = "ordertime")
	private Date orderTime;
	
	/**
	 * Địa chỉ giao
	 */
	@Column(name = "deliveryaddress")
	private String deliveryAddress;
	
	/**
	 * Ngày duyệt đơn
	 */
	@Column(name = "accepttime")
	private Date acceptTime;
	
	/**
	 * Ngày giao cho đơn vị vận chuyển
	 */
	@Column(name = "shippedtime")
	private Date shippedTime;
	
	/**
	 * Ngày giao hàng
	 */
	@Column(name = "finishedtime")
	private Date finishedTime;
	
	/**
	 * Phương thức thanh toán
	 */
	@Column(name = "paymethod")
	private String payMethod;
	
	/**
	 * Tổng thành tiền của đơn hàng
	 */
	@Column(name = "totalamount")
	private BigDecimal totalAmount;
	
	/*RELATIONSHIP*/
	
	/**
	 * Tỉnh/Thành phố nhận hàng
	 */
	@ManyToOne
	@JoinColumn(name = "deliveryprovince") //FK trong Order trong DB
	private Province deliveryProvince;
	
	/**
	 * Trạng thái hóa đơn
	 */
	@ManyToOne
	@JoinColumn(name = "status")
	private OrderStatus status;
	
	/**
	 * Đơn vị vận chuyển
	 */
	@ManyToOne
    @JoinColumn(name = "shipperid")
    private Shipper shipper;

	/**
	 * Nhân viên xử lý đơn hàng
	 */
    @ManyToOne
    @JoinColumn(name = "employeeid")
    private Employee employee;

    /**
     * Khách hàng
     */
    @ManyToOne
    @JoinColumn(name = "customerid")
    private Customer customer;

    /**
     * Mã giảm giá (nếu có)
     */
//    @ManyToOne
//    @JoinColumn(name = "CouponID")
   // private Coupon coupon;

}
