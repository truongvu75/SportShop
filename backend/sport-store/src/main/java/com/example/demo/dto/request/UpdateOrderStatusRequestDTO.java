package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO gửi yêu cầu cập nhật trạng thái đơn hàng (dành cho Admin)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequestDTO {

    /**
     * Mã trạng thái mới của đơn hàng (1: Chờ xác nhận, 2: Đang giao, 3: Đã giao, 4: Đã hủy)
     */
    private Integer status;
}
