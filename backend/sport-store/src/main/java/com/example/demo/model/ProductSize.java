package com.example.demo.model;

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
 * Size của sản phẩm
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "sizes")
public class ProductSize {

	/**
	 * Mã size
	 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sizeid")
    private Integer sizeID;

    /**
     * Tên size
     */
    @Column(name = "sizename")
    private String sizeName;

}