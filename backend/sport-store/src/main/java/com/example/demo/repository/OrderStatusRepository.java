package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.OrderStatus;

/**
 * Repository xử lý các truy vấn liên quan đến OrderStatus
 */
@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
}
