package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Brand;
import com.example.demo.service.BrandService;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

	@Autowired
	private BrandService brandService;

	/**
	 * GET /api/brands
	 * Trả về 200 OK kèm danh sách phân trang
	 */
	@GetMapping
	public ResponseEntity<Page<Brand>> getAllBrands(
			@RequestParam(defaultValue = "1") int page, 
			@RequestParam(defaultValue = "10") int size) {
		Page<Brand> pageBrand = brandService.getAllBrands(page, size);
		
		return ResponseEntity.ok(pageBrand); // Status 200 OK
	}
	
	/**
	 * GET api/brands/all
	 * Trả về danh sách loại hàng, không phân trang
	 * @return
	 */
	@GetMapping("/all")
	public List<Brand> getAll(){
		return brandService.getAll();
	}

	/**
	 * POST /api/brands
	 * Trả về 201 Created sau khi tạo thành công
	 */
	@PostMapping
	public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
		Brand createdBrand = brandService.createBrand(brand);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(createdBrand); // Status 201 Created
	}

	/**
	 * PUT /api/brands/{id}
	 * Trả về 200 OK kèm dữ liệu đã cập nhật
	 */
	@PutMapping("/{id}")
	public ResponseEntity<Brand> updateBrand(
			@PathVariable Integer id,
			@RequestBody Brand brand) {
		Brand updatedBrand = brandService.updateBrand(id, brand);

		return ResponseEntity.ok(updatedBrand); // Status 200 OK
	}

	/**
	 * DELETE /api/brands/{id}
	 * Trả về 200 OK (hoặc bạn có thể dùng 24 No Content nếu không trả về chuỗi text)
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteBrand(@PathVariable Integer id) {
		brandService.deleteBrand(id);

		return ResponseEntity.ok("Delete brand successfully"); // Status 200 OK
	}
}