package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Customer;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Customer
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

	/**
	 * Danh sách Khách hàng có phân trang và tìm kiếm dựa vào tên Khách hàng
	 * 
	 * @param customerName
	 * @param pageable
	 * @return
	 */
	Page<Customer> findByCustomerNameContainingIgnoreCase(String customerName, Pageable pageable);

	/**
	 * Tìm kiếm Customer dựa vào Account ID thật
	 * 
	 * @param accountId
	 * @return
	 */
	Optional<Customer> findByAccountAccountId(Long accountId);
}
