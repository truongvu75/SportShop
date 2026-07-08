package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO nhận thông tin đặt hàng từ người dùng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDTO {

    /**
     * Địa chỉ giao hàng chi tiết
     */
    private String deliveryAddress;

    /**
     * Tên tỉnh/thành phố nhận hàng
     */
    private String deliveryProvince;

    /**
     * Phương thức thanh toán (ví dụ: COD, VNPAY)
     */
    private String payMethod;

    /**
     * Mã nhà vận chuyển (tùy chọn)
     */
    private Integer shipperID;
}
