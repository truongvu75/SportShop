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
@Table(name = "[Order]")
public class Order {
	
	/**
	 * Mã đơn hàng
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "OrderID")
	private Integer orderID;
	
	/**
	 * Ngày đặt hàng
	 */
	@Column(name = "OrderTime")
	private Date orderTime;
	
	/**
	 * Địa chỉ giao
	 */
	@Column(name = "DeliveryAddress")
	private String deliveryAddress;
	
	/**
	 * Ngày duyệt đơn
	 */
	@Column(name = "AcceptTime")
	private Date acceptTime;
	
	/**
	 * Ngày giao cho đơn vị vận chuyển
	 */
	@Column(name = "ShippedTime")
	private Date shippedTime;
	
	/**
	 * Ngày giao hàng
	 */
	@Column(name = "FinishedTime")
	private Date finishedTime;
	
	/**
	 * Phương thức thanh toán
	 */
	@Column(name = "PayMethod")
	private String payMethod;
	
	/**
	 * Tổng thành tiền của đơn hàng
	 */
	@Column(name = "TotalAmount")
	private BigDecimal totalAmount;
	
	/*RELATIONSHIP*/
	
	/**
	 * Tỉnh/Thành phố nhận hàng
	 */
	@ManyToOne
	@JoinColumn(name = "DeliveryProvince") //FK trong Order trong DB
	private Province deliveryProvince;
	
	/**
	 * Trạng thái hóa đơn
	 */
	@ManyToOne
	@JoinColumn(name = "Status")
	private OrderStatus status;
	
	/**
	 * Đơn vị vận chuyển
	 */
	@ManyToOne
    @JoinColumn(name = "ShipperID")
    private Shipper shipper;

	/**
	 * Nhân viên xử lý đơn hàng
	 */
    @ManyToOne
    @JoinColumn(name = "EmployeeID")
    private Employee employee;

    /**
     * Khách hàng
     */
    @ManyToOne
    @JoinColumn(name = "CustomerID")
    private Customer customer;

    /**
     * Mã giảm giá (nếu có)
     */
//    @ManyToOne
//    @JoinColumn(name = "CouponID")
   // private Coupon coupon;

}
