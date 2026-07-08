package com.example.demo.dto.request;

import lombok.Data;

/**
 * DTO nhận dữ liệu đổi mật khẩu từ phía Client
 */
@Data
public class ChangePasswordRequestDTO {

    /**
     * Mật khẩu hiện tại của tài khoản (để xác minh danh tính)
     */
    private String currentPassword;

    /**
     * Mật khẩu mới muốn đặt (tối thiểu 6 ký tự)
     */
    private String newPassword;
}
