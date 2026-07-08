package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO nhận yêu cầu tạo mới hoặc cập nhật đánh giá sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRatingRequestDTO {

    private Integer productID;

    private Integer star;

    private String comment;

}
