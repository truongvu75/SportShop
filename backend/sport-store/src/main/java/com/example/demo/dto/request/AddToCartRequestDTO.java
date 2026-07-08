package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO nhận yêu cầu thêm sản phẩm biến thể vào giỏ hàng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequestDTO {

    /**
     * Mã sản phẩm biến thể (VariantID)
     */
    private Integer variantID;

    /**
     * Số lượng thêm vào
     */
    private Integer quantity;

}
