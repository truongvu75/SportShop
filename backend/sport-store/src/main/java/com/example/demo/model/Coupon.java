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
 * Mã giảm giá
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Coupon")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CouponID")
    private Integer couponID;

    /**
     * Mã giảm giá
     */
    @Column(name = "Code")
    private String code;

    /**
     * Phần trăm giảm
     */
    @Column(name = "DiscountPercent")
    private Integer discountPercent;

    /**
     * Hạn sử dụng
     */
    @Column(name = "ExpiredDate")
    private Date expiredDate;

    /**
     * Lượt sử dụng giới hạn
     */
    @Column(name = "UsageLimit")
    private Integer usageLimit;

}
