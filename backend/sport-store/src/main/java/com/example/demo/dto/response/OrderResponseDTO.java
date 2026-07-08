package com.example.demo.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về thông tin đầy đủ của Đơn hàng cho Client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {

    private Integer orderID;
    private Date orderTime;
    private String deliveryAddress;
    private Date acceptTime;
    private Date shippedTime;
    private Date finishedTime;
    private String payMethod;

    private String deliveryProvince;
    
    // Thông tin trạng thái đơn hàng
    private Integer statusID;
    private String statusDescription;

    // Các thông tin liên kết
    private String shipperName;
    private String employeeName;
    private Integer customerID;
    private String customerName;

    // Chi tiết sản phẩm trong đơn hàng
    private List<OrderDetailResponseDTO> items;

    // Tổng tiền thanh toán của đơn hàng (Tổng cộng các details)
    private BigDecimal totalAmount;
    
    //Đường dẫn dành cho VNPay
    private String paymentUrl;
}
