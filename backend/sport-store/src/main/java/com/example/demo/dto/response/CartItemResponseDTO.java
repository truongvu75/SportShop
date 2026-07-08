package com.example.demo.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về thông tin chi tiết từng vật phẩm trong giỏ hàng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {

    private Integer cartItemID;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice; // quantity * unitPrice
    
    // Thông tin biến thể & sản phẩm
    private Integer variantID;
    private Integer productID;
    private String productName;
    private String photo;
    private String sizeName;
    private String colorName;
    private String hexCode;
    private Integer stock;

}
