package com.example.demo.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO chứa thông tin chi tiết từng sản phẩm trong đơn đặt hàng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponseDTO {

    private Integer orderDetailID;
    private Integer quantity;
    private BigDecimal salePrice;
    private BigDecimal totalPrice; // quantity * salePrice

    // Thông tin biến thể & sản phẩm liên quan
    private Integer variantID;
    private Integer productID;
    private String productName;
    private String photo;
    private String sizeName;
    private String colorName;
    private String hexCode;
}
