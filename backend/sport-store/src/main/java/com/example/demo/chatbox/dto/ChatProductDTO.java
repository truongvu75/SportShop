package com.example.demo.chatbox.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lớp DTO đại diện cho sản phẩm được trả về sau khi được query từ DB, với Specification nhận từ chatbox 
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatProductDTO {

    private Integer productID;

    private String productName;

    private BigDecimal basePrice;

    private String photo;

    private String brand;

    private String category;
}