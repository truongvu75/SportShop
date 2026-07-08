package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.customer.AdminCustomerRequestDTO;
import com.example.demo.dto.request.customer.CustomerProfileRequestDTO;
import com.example.demo.dto.response.customer.AdminCustomerResponseDTO;
import com.example.demo.dto.response.customer.CustomerProfileResponseDTO;
import com.example.demo.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	@Autowired
	private CustomerService customerService;

	/**
	 * Xem thông tin cá nhân (Khách hàng)
	 * 
	 * @return
	 */
	@GetMapping("/profile")
	public ResponseEntity<CustomerProfileResponseDTO> getProfile() {
		CustomerProfileResponseDTO response = customerService.getProfile();
		return new ResponseEntity<>(response, HttpStatus.OK); // Trả về 200 OK
	}

	/**
	 * Cập nhật thông tin cá nhân
	 * @param request Dữ liệu thông tin cá nhân cần cập nhật
	 * @return
	 */
	@PutMapping("/profile")
	public ResponseEntity<CustomerProfileResponseDTO> updateProfile(@RequestBody CustomerProfileRequestDTO request) {
		CustomerProfileResponseDTO response = customerService.updateProfile(request);
		return new ResponseEntity<>(response, HttpStatus.OK); // Trả về 200 OK
	}

	/**
	 * Danh sách tất cả khách hàng có phân trang và tìm kiếm
	 */
	@GetMapping
	public ResponseEntity<Page<AdminCustomerResponseDTO>> getAllCustomers(
			@RequestParam(defaultValue = "0") int page, 
			@RequestParam(defaultValue = "10") int size, 
			@RequestParam(defaultValue = "") String keyword) {
		
		Page<AdminCustomerResponseDTO> response = customerService.getAllCustomers(page, size, keyword);
		return new ResponseEntity<>(response, HttpStatus.OK); // Trả về 200 OK
	}
	
	/**
	 * Cập nhật thông tin khách hàng: Họ tên, địa chỉ, sđt, email, islocked
	 * @param id Mã khách hàng
	 * @param request
	 * @return
	 */
	@PutMapping("/{id}")
	public ResponseEntity<AdminCustomerResponseDTO> updateCustomer(
			@PathVariable Integer id, 
			@RequestBody AdminCustomerRequestDTO request) {
		
		AdminCustomerResponseDTO response = customerService.updateCustomer(id, request);
		return new ResponseEntity<>(response, HttpStatus.OK); // Trả về 200 OK
	}
}