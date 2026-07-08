package com.example.demo.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lớp đại diện cho biến thể Sản phẩm được trả về từ API
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductVariantResponseDTO {

	private Integer variantID;
	private BigDecimal price;
	private Integer stock;
	private String sku;
	
	private String size;
	private String color;
}
