package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.request.customer.AdminCustomerRequestDTO;
import com.example.demo.dto.request.customer.CustomerProfileRequestDTO;
import com.example.demo.dto.response.customer.AdminCustomerResponseDTO;
import com.example.demo.dto.response.customer.CustomerProfileResponseDTO;
import com.example.demo.model.Customer;
import com.example.demo.model.Province;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.ProvinceRepository;
import com.example.demo.security.SecurityUtils;

/**
 * Cung cấp các chức năng giao tiếp giữa Repository và Controller của Customer
 */
@Service
public class CustomerService {

	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private ProvinceRepository provinceRepository;


	
	//======= PHẦN DÀNH CHO KHÁCH HÀNG BAO GỒM: XEM THÔNG TIN CÁ NHÂN, CẬP NHẬT THÔNG TIN CÁ NHÂN ====//
	/**
	 * Lấy thông tin cá nhân
	 */
	public CustomerProfileResponseDTO getProfile() {
		Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
		
		Customer customer = customerRepository.findById(CURRENT_CUSTOMER_ID)
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		return mapToProfileResponseDTO(customer);
	}

	/**
	 * Cập nhật thông tin cá nhân
	 */
	public CustomerProfileResponseDTO updateProfile(CustomerProfileRequestDTO request) {
		Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
		
		Customer customer = customerRepository.findById(CURRENT_CUSTOMER_ID)
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		customer.setCustomerName(request.getCustomerName());
		customer.setPhone(request.getPhone());
		customer.setAddress(request.getAddress());
		customer.setEmail(request.getEmail());

		/**
		 * Tạm tắt province
		 */
		Province province = provinceRepository.findById(request.getProvinceName())
				.orElseThrow(() -> new RuntimeException("Province not found"));

		customer.setProvince(province);

		customerRepository.save(customer);

		return mapToProfileResponseDTO(customer);
	}

	/**
	 * Mapping entity -> DTO
	 */
	private CustomerProfileResponseDTO mapToProfileResponseDTO(Customer customer) {

		CustomerProfileResponseDTO dto = new CustomerProfileResponseDTO();

		dto.setCustomerID(customer.getCustomerID());
		dto.setCustomerName(customer.getCustomerName());
		dto.setPhone(customer.getPhone());
		dto.setAddress(customer.getAddress());
		dto.setEmail(customer.getEmail());

		if (customer.getProvince() != null) {
			dto.setProvinceName(customer.getProvince().getProvinceName());
		}

		return dto;
	}

	
	// ======PHẦN ADMIN BAO GỒM: DANH SÁCH, CHI TIẾT KHÁCH HÀNG, CẬP NHẬT THÔNG TIN KHÁCH HÀNG =====//
	/**
	 * Danh sách khách hàng có phân trang và tìm kiếm
	 */
	public Page<AdminCustomerResponseDTO> getAllCustomers(int page, int size, String keyword) {

		Pageable pageable = PageRequest.of(page, size);

		Page<Customer> customerPage;

		if (keyword == null || keyword.isBlank()) {

			customerPage = customerRepository.findAll(pageable);

		} else {

			customerPage = customerRepository.findByCustomerNameContainingIgnoreCase(keyword, pageable);
		}

		return customerPage.map(this::mapToAdminResponseDTO);
	}

	
	/**
	 * Cập nhật khách hàng
	 */
	public AdminCustomerResponseDTO updateCustomer(
			Integer id,
			AdminCustomerRequestDTO request) {

		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		customer.setCustomerName(request.getCustomerName());
		customer.setPhone(request.getPhone());
		customer.setAddress(request.getAddress());
		customer.setEmail(request.getEmail());
		customer.setLocked(request.isLocked());

		/**
		 * Tạm tắt province
		 */
		Province province = provinceRepository
				.findById(request.getProvinceName())
				.orElseThrow(() -> new RuntimeException("Province not found"));

		customer.setProvince(province);

		customerRepository.save(customer);

		return mapToAdminResponseDTO(customer);
	}


	/**
	 * Chuyển Entity thành DTO
	 */
	private AdminCustomerResponseDTO mapToAdminResponseDTO(Customer customer) {

		AdminCustomerResponseDTO dto = new AdminCustomerResponseDTO();

		dto.setCustomerID(customer.getCustomerID());
		dto.setCustomerName(customer.getCustomerName());
		dto.setPhone(customer.getPhone());
		dto.setAddress(customer.getAddress());
		dto.setEmail(customer.getEmail());
		dto.setLocked(customer.isLocked());

		if (customer.getProvince() != null) {
			dto.setProvinceName(customer.getProvince().getProvinceName());
		}

		if (customer.getAccount() != null) {
			dto.setUsername(customer.getAccount().getUsername());
		}

		return dto;
	}

}