package com.example.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Giỏ hàng
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Cart")
public class Cart {

	/**
	 * Mã giỏ hàng
	 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CartID")
    private Integer cartID;

    /**
     * Khách hàng, 1 khách hàng chỉ có 1 giỏ
     */
    @OneToOne
    @JoinColumn(name = "CustomerID")
    private Customer customer;
    
    @OneToMany(mappedBy = "cart")
    private List<CartItem> items;

}