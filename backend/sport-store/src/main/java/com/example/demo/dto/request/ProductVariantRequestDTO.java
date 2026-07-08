package com.example.demo.dto.request;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho ProductVariant nhận từ các request client gửi lên, dùng khi create Product
 */
@Data
@NoArgsConstructor
public class ProductVariantRequestDTO {

	/**
	 * Mã biến thể sản phẩm
	 */
    private Integer variantId;

    /**
     * Mã size
     */
    private Integer sizeId;

    /**
     * Mã màu 
     */
    private Integer colorId;

    /**
     * Giá sản phẩm
     */
    private BigDecimal price;

    /**
     * Số lượng
     */
    private Integer stock;

    /**
     * Mã SKU
     */
    private String sku;

   
}