package com.example.demo.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dành cho các request từ client của Product
 *  Không cần ID vì khi tạo mới Product thì DB tự gen
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDTO {

    private String productName;

    private String productDescription;

    private BigDecimal basePrice;

    private String photo;

    private Boolean isSelling;

    private Integer categoryId;

    private Integer brandId;

    /**
     * Danh sách biến thể sản phẩm
     */
    private List<ProductVariantRequestDTO> variants;

 
}