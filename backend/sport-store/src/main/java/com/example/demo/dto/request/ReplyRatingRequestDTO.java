package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lớp DTO gửi Request phản hồi đánh giá của Nhân viên 
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReplyRatingRequestDTO {
	
	/**
	 * Nội dung phản hồi
	 */
	@NotBlank(message = "Nội dung phản hồi không được để trống!")
	private String reply;
}
