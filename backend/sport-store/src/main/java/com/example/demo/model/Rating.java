package com.example.demo.model;

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
 * Đánh giá sản phẩm đã mua
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "rating")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ratingid")
    private Integer ratingID;

    /**
     * Số sao
     */
    @Column(name = "star")
    private Integer star;

    /**
     * Nội dung đánh giá
     */
    @Column(name = "\"Comment\"")
    private String comment;

    /**
     * Thời gian đánh giá
     */
    @Column(name = "createdtime")
    private Date createdTime;

    /**
     * Sản phẩm được đánh giá
     */
    @ManyToOne
    @JoinColumn(name = "productid")
    private Product product;

    /**
     * Khách hàng đánh giá
     */
    @ManyToOne
    @JoinColumn(name = "customerid")
    private Customer customer;
    
    /**
     * Phản hồi của nhân viên
     */
    @Column(name = "reply")
    private String reply;
    
    /**
     * Thời gian phản hồi
     */
    @Column(name = "replytime")
    private Date replyTime;
    
    /**
     * Nhân viên phản hồi
     */
    @ManyToOne
    @JoinColumn(name = "replyby")
    private Employee employee;

}