package com.example.demo.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO phản hồi thông tin đánh giá sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponseDTO {

    private Integer ratingID;
    
    private String productName;

    private Integer star;

    private String comment;

    private Date createdTime;

    private Integer customerID;

    private String customerName;

    private String reply;

    private Date replyTime;

    private String employeeName;

}
