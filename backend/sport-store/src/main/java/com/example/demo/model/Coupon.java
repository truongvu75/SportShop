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
@Table(name = "coupon")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "couponid")
    private Integer couponID;

    /**
     * Mã giảm giá
     */
    @Column(name = "code")
    private String code;

    /**
     * Phần trăm giảm
     */
    @Column(name = "discountpercent")
    private Integer discountPercent;

    /**
     * Hạn sử dụng
     */
    @Column(name = "expireddate")
    private Date expiredDate;

    /**
     * Lượt sử dụng giới hạn
     */
    @Column(name = "usagelimit")
    private Integer usageLimit;

}
