package com.example.demo.dto.response;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về thông tin giỏ hàng của khách hàng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {

    private Integer cartID;
    private Integer customerID;
    private String customerName;
    private List<CartItemResponseDTO> items;
    private BigDecimal totalPrice; // Tổng tiền toàn bộ giỏ hàng

}
