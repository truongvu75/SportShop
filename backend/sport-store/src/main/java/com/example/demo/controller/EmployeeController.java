package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.request.employee.*;
import com.example.demo.dto.response.employee.*;
import com.example.demo.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	/**
	 * GET /employees
	 */
	@GetMapping
	public ResponseEntity<Page<EmployeeResponseDTO>> getAllEmployees(

			@RequestParam(defaultValue = "0") int page,

			@RequestParam(defaultValue = "10") int size,

			@RequestParam(required = false) String keyword) {

		Page<EmployeeResponseDTO> result = employeeService.getAllEmployees(page, size, keyword);

		return ResponseEntity.ok(result);
	}

	/**
	 * POST /employees
	 */
	@PostMapping
	public ResponseEntity<EmployeeResponseDTO> createEmployee(

			@RequestBody EmployeeRequestDTO request) {

		EmployeeResponseDTO response = employeeService.createEmployee(request);

		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	/**
	 * PUT /employees/{id}
	 */
	@PutMapping("/{id}")
	public ResponseEntity<EmployeeResponseDTO> updateEmployee(

			@PathVariable Integer id,

			@RequestBody EmployeeRequestDTO request) {

		EmployeeResponseDTO response = employeeService.updateEmployee(id, request);

		return ResponseEntity.ok(response);
	}

	/**
	 * PUT /employees/{id}/role
	 */
	@PutMapping("/role/{id}")
	public ResponseEntity<EmployeeResponseDTO> updateRole(

			@PathVariable Integer id,

			@RequestBody EmployeeRoleRequestDTO request) {

		EmployeeResponseDTO response = employeeService.updateRole(id, request);

		return ResponseEntity.ok(response);
	}
}