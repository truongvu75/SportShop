package com.example.demo.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.request.employee.EmployeeRequestDTO;
import com.example.demo.dto.request.employee.EmployeeRoleRequestDTO;
import com.example.demo.dto.response.employee.EmployeeResponseDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Employee;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.EmployeeRepository;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private AccountRepository accountRepository;

	/**
	 * Danh sách nhân viên có phân trang và tìm kiếm
	 */
	public Page<EmployeeResponseDTO> getAllEmployees(int page, int size, String keyword) {

		Pageable pageable = PageRequest.of(page, size);

		Page<Employee> employeePage;

		if (keyword == null || keyword.isBlank()) {

			employeePage = employeeRepository.findAll(pageable);

		} else {

			employeePage = employeeRepository.findByEmployeeNameContainingIgnoreCase(keyword, pageable);
		}

		return employeePage.map(this::mapToResponseDTO);
	}

	/**
	 * Tạo nhân viên
	 */
	public EmployeeResponseDTO createEmployee(EmployeeRequestDTO request) {

		/**
		 * Username lấy từ email
		 */
		String username = request.getEmail();

		if (accountRepository.existsByUsername(username)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
		}

		/**
		 * Tạo account
		 */
		Account account = new Account();

		account.setUsername(username);
		account.setPassword(request.getPassword());
		account.setActive(true);

		accountRepository.save(account);

		/**
		 * Convert roles list -> string
		 */
		String roles = String.join(",", request.getRoleNames());

		/**
		 * Tạo employee
		 */
		Employee employee = new Employee();

		employee.setEmployeeName(request.getEmployeeName());
		employee.setPhone(request.getPhone());
		employee.setAddress(request.getAddress());
		employee.setEmail(request.getEmail());
		employee.setBirthDate(request.getBirthDate());
		employee.setPhoto(request.getPhoto());
		employee.setWorking(request.isWorking());

		employee.setRoleNames(roles);

		employee.setAccount(account);

		employeeRepository.save(employee);

		return mapToResponseDTO(employee);
	}

	/**
	 * Cập nhật nhân viên
	 */
	public EmployeeResponseDTO updateEmployee(Integer id, EmployeeRequestDTO request) {

		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

		employee.setEmployeeName(request.getEmployeeName());
		employee.setPhone(request.getPhone());
		employee.setAddress(request.getAddress());
		employee.setEmail(request.getEmail());
		employee.setBirthDate(request.getBirthDate());
		employee.setPhoto(request.getPhoto());
		employee.setWorking(request.isWorking());

		employeeRepository.save(employee);

		return mapToResponseDTO(employee);
	}

	/**
	 * Cập nhật role
	 */
	public EmployeeResponseDTO updateRole(Integer id, EmployeeRoleRequestDTO request) {

		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

		String roles = String.join(",", request.getRoleNames());

		employee.setRoleNames(roles);

		employeeRepository.save(employee);

		return mapToResponseDTO(employee);
	}

	/**
	 * Mapping entity -> DTO
	 */
	private EmployeeResponseDTO mapToResponseDTO(Employee employee) {

		EmployeeResponseDTO dto = new EmployeeResponseDTO();

		dto.setEmployeeID(employee.getEmployeeID());
		dto.setEmployeeName(employee.getEmployeeName());
		dto.setPhone(employee.getPhone());
		dto.setAddress(employee.getAddress());
		dto.setEmail(employee.getEmail());
		dto.setBirthDate(employee.getBirthDate());
		dto.setPhoto(employee.getPhoto());
		dto.setWorking(employee.isWorking());

		if (employee.getAccount() != null) {

			dto.setUsername(employee.getAccount().getUsername());
		}

		if (employee.getRoleNames() != null && !employee.getRoleNames().isBlank()) {

			dto.setRoleNames(Arrays.asList(employee.getRoleNames().split(",")));
		}

		return dto;
	}
}