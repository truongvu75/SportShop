package com.example.demo.model;

/**
 * Enum quản lý các trạng thái của đơn hàng
 */
public enum OrderStatusEnum {
    PENDING(1, "Chờ xác nhận"),
    ACCEPT(2, "Đã duyệt"),
    SHIPPED(3, "Đang giao hàng"),
    FINISHED(4, "Đã hoàn thành"),
    CANCELLED(5, "Đã hủy");

    private final Integer status;
    private final String description;

    OrderStatusEnum(Integer status, String description) {
        this.status = status;
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public static OrderStatusEnum fromStatus(Integer status) {
        for (OrderStatusEnum item : OrderStatusEnum.values()) {
            if (item.getStatus().equals(status)) {
                return item;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + status);
    }
}
