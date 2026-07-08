package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Cart;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Cart
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

	/**
	 * Lấy giỏ hàng bằng Mã Khách hàng
	 * @param customerID
	 * @return
	 */
	Optional<Cart> findByCustomerCustomerID(Integer customerID);
	
}
