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
 * Màu của sản phẩm
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Color")
public class ProductColor {

	/**
	 * Mã màu
	 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ColorID")
    private Integer colorID;

    /**
     * Tên màu
     */
    @Column(name = "ColorName")
    private String colorName;

    /**
     * Mã màu hệ 16
     */
    @Column(name = "HexCode")
    private String hexCode;

}
