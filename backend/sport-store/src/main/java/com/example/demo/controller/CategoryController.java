package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.response.CategoryResponseDTO;
import com.example.demo.model.Category;
import com.example.demo.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;
	
	/**
	 * GET /api/categories/all
	 * Lấy danh sách loại hàng (Không phân trang)
	 * @return
	 */
	@GetMapping("/all")
	public ResponseEntity<List<CategoryResponseDTO>> getAll(){
		
		List<CategoryResponseDTO> response = categoryService.getAll();
		
		return ResponseEntity.ok(response);
	}

	/**
	 * GET /api/categories
	 * Trả về 200 OK kèm danh sách phân trang
	 */
	@GetMapping
	public ResponseEntity<Page<CategoryResponseDTO>> getAllCategories(
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int size) {
		Page<CategoryResponseDTO> categoryPage = categoryService.getAllCategories(page, size);
		
		return ResponseEntity.ok(categoryPage); // Status 200 OK
	}

	/**
	 * POST /api/categories
	 * Trả về 201 Created sau khi tạo thành công
	 */
	@PostMapping
	public ResponseEntity<Category> createCategory(@RequestBody Category category) {
		Category createdCategory = categoryService.createCategory(category);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory); // Status 201 Created
	}

	/**
	 * PUT /api/categories/{id}
	 * Trả về 200 OK kèm dữ liệu đã cập nhật
	 */
	@PutMapping("/{id}")
	public ResponseEntity<Category> updateCategory(
			@PathVariable Integer id,
			@RequestBody Category category) {
		Category updatedCategory = categoryService.updateCategory(id, category);

		return ResponseEntity.ok(updatedCategory); // Status 200 OK
	}

	/**
	 * DELETE /api/categories/{id}
	 * Trả về 200 OK kèm thông báo xóa thành công
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCategory(@PathVariable Integer id) {
		categoryService.deleteCategory(id);

		return ResponseEntity.ok("Delete category successfully"); // Status 200 OK
	}
}