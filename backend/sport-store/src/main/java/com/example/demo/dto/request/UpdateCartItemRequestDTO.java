package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO nhận yêu cầu cập nhật số lượng của một sản phẩm trong giỏ hàng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartItemRequestDTO {

    /**
     * Số lượng cập nhật mới
     */
    private Integer quantity;

}
