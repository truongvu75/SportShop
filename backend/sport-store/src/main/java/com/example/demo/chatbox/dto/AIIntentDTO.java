package com.example.demo.chatbox.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

/**
 * Lớp đại diện cho các yêu cầu/điều kiện mà chat gửi lên, sẽ map vào
 * ProductSpecification để dùng Specification
 */
@Data
public class AIIntentDTO {

	private String intent;

	private String searchValue;

    private String category;

	// AI trả tên brand
	// VD: Nike, Adidas
	private String brand;

	private BigDecimal minPrice;

	private BigDecimal maxPrice;
}
