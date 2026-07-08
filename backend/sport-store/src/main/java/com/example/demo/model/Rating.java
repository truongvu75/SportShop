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
@Table(name = "Rating")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RatingID")
    private Integer ratingID;

    /**
     * Số sao
     */
    @Column(name = "Star")
    private Integer star;

    /**
     * Nội dung đánh giá
     */
    @Column(name = "Comment")
    private String comment;

    /**
     * Thời gian đánh giá
     */
    @Column(name = "CreatedTime")
    private Date createdTime;

    /**
     * Sản phẩm được đánh giá
     */
    @ManyToOne
    @JoinColumn(name = "ProductID")
    private Product product;

    /**
     * Khách hàng đánh giá
     */
    @ManyToOne
    @JoinColumn(name = "CustomerID")
    private Customer customer;
    
    /**
     * Phản hồi của nhân viên
     */
    @Column(name = "Reply")
    private String reply;
    
    /**
     * Thời gian phản hồi
     */
    @Column(name = "ReplyTime")
    private Date replyTime;
    
    /**
     * Nhân viên phản hồi
     */
    @ManyToOne
    @JoinColumn(name = "ReplyBy")
    private Employee employee;

}