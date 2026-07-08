package com.example.demo.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lớp DTO chứa dữ liệu từ Client đưa xuống
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductSearchDTO {
	// Các trường trên Header
    private String searchValue;
    private Long brandId;
    private Long categoryId;

    // Các trường ở Sidebar
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<Integer> colorIds; // Cho phép tick chọn nhiều màu cùng lúc
    private List<Integer> sizeIds;  // Cho phép tick chọn nhiều size cùng lúc

    // Getters and Setters

}
