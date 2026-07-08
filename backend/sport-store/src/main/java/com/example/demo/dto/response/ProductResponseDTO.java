package com.example.demo.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lớp đại diện cho Sản phẩm được trả về từ API
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductResponseDTO {

	private Integer productID;
	private String productName;
	private String description;
	private BigDecimal basePrice;
	private String photo;
	private Boolean isSelling;
	private String category;
	private String brand;
	
	private List<ProductVariantResponseDTO> variants;

}
