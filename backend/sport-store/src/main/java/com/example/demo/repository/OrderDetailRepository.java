package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.OrderDetail;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của OrderDetail
 */
@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    /**
     * Tìm kiếm chi tiết đơn hàng dựa trên Mã Đơn hàng
     */
    List<OrderDetail> findByOrderOrderID(Integer orderID);
}

