package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.dto.request.ProductRequestDTO;
import com.example.demo.dto.request.ProductSearchDTO;
import com.example.demo.dto.response.ProductResponseDTO;
import com.example.demo.model.ProductColor;
import com.example.demo.model.ProductSize;
import com.example.demo.service.ProductService;


@RestController
@RequestMapping("/api/products")
public class ProductController {
	
	@Autowired
	private ProductService productService;

	/**
	 * Lấy danh sách Sản phẩm có sử dụng phân trang, bộ lọc...
	 * @param criteria Các điều kiện lọc nhận từ Client
	 * @param page Số trang
	 * @param size Số phần tử trong trang
	 * @return
	 */
	@GetMapping("/list")
	public ResponseEntity<Page<ProductResponseDTO>> getProducts(@ModelAttribute ProductSearchDTO criteria, 
			@RequestParam(defaultValue = "1") int page, 
			@RequestParam(defaultValue = "8") int size){
		Page<ProductResponseDTO> productPage = productService.getProducts(criteria, page, size);
		
		return ResponseEntity.ok(productPage);
	}
	
	/**
	 * Lấy chi tiết 1 sản phẩm
	 * @param id
	 * @return
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ProductResponseDTO> getProductDetail(@PathVariable Integer id){
		ProductResponseDTO productResponseDTO = productService.getProductDetail(id);
		
		return ResponseEntity.ok(productResponseDTO);
	}
	
	/**
	 * Thêm mới 1 sản phẩm
	 * @param request
	 * @return
	 */
	@PostMapping
	public ResponseEntity<ProductResponseDTO> createProduct(
	        @RequestBody ProductRequestDTO request){

	    ProductResponseDTO response = productService.createProduct(request);

	    return ResponseEntity.ok(response);
	}
	
	/**
	 * Cập nhật sản phẩm
	 * @param id Mã sản phẩm
	 * @param request DTO sản phẩm cần cập nhật
	 * @return
	 */
	@PutMapping("/{id}")
	public ResponseEntity<ProductResponseDTO> updateProduct(
	        @PathVariable Integer id,
	        @RequestBody ProductRequestDTO request){

		System.out.println(request.getIsSelling());
	    ProductResponseDTO response = productService.updateProduct(id, request);

	    return ResponseEntity.ok(response);
	}
	
	/**
	 * Xóa/Khóa 1 sản phẩm
	 * @param id Mã sản phẩm cần khóa
	 * @return
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable Integer id){

	    productService.deleteProduct(id);

	    return ResponseEntity.ok("Product deleted successfully");
	}
	
	/**
	 * Lấy danh sách tất cả size
	 * @return
	 */
	@GetMapping("/sizes")
	public ResponseEntity<List<ProductSize>> getAllSizes(){
				
		return ResponseEntity.ok(productService.getAllSize());
	}
	
	/**
	 * Lấy danh sách tất cả Color
	 * @return
	 */
	@GetMapping("/colors")
	public ResponseEntity<List<ProductColor>> getAllColors(){
		
		return ResponseEntity.ok(productService.getAllColor());
	}
}
