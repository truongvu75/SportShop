package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Order;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Order
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    /**
     * Tìm kiếm danh sách đơn hàng của khách hàng theo Mã Khách hàng, sắp xếp theo thời gian đặt mới nhất
     */
    List<Order> findByCustomerCustomerIDOrderByOrderTimeDesc(Integer customerID);

    /**
     * Kiểm tra khách hàng có đơn hàng Đã hoàn thành (status = 4) chứa sản phẩm này không.
     * Đây là điều kiện tiên quyết để được phép đánh giá sản phẩm.
     */
    @Query("SELECT COUNT(o) > 0 FROM Order o " +
           "JOIN o.status s " +
           "JOIN OrderDetail od ON od.order = o " +
           "WHERE o.customer.customerID = :customerID " +
           "AND s.status = 4 " +
           "AND od.variant.product.productID = :productID")
    boolean hasPurchasedProduct(@Param("customerID") Integer customerID, @Param("productID") Integer productID);
    
     
}



