package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Account;
import com.example.demo.model.Employee;
import java.util.List;
import java.util.Optional;


/**
 * Lớp liên quan đến xử lý, làm việc với DB của Employee
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

	/**
	 * Danh sách nhân viên dựa vào EmployeeName có phân trang
	 * @param employeeName
	 * @param pageable
	 * @return
	 */
	Page<Employee> findByEmployeeNameContainingIgnoreCase(String employeeName, Pageable pageable);

	/**
	 * Lấy nhân viên dựa vào AccountId
	 * @param accountId
	 * @return
	 */
	Optional<Employee> findByAccountAccountId(Long accountId);
}
