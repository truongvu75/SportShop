package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.dto.response.CategoryResponseDTO;
import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;

/**
 * Lớp Service cung cấp các chức năng cho CategoryController
 */
@Service
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private ProductRepository productRepository;

	/**
	 * Hàm lấy tất cả loại hàng, không phân trang (Phục vụ cho dropdown)
	 * @return
	 */
	public List<CategoryResponseDTO> getAll() {
		List<Category> lst = categoryRepository.findAll();

		return lst.stream().map(c -> new CategoryResponseDTO(c.getCategoryID(), c.getCategoryName()))
				.collect(Collectors.toList());
	}

	/**
	 * Lấy danh sách tất cả Loại hàng
	 * 
	 * @return
	 */
	public Page<CategoryResponseDTO> getAllCategories(int page, int size) {
		if (page < 1)
			page = 1;
		if (size < 1)
			size = 10;

		Pageable pageable = PageRequest.of(page - 1, size, Sort.by("categoryID"));

		Page<Category> categoryPage = categoryRepository.findAll(pageable);

		return categoryPage.map(Category -> {
			CategoryResponseDTO dto = new CategoryResponseDTO();
			dto.setCategoryID(Category.getCategoryID());
			dto.setCategoryName(Category.getCategoryName());
			return dto;
		});
	}

	/**
	 * Thêm mới 1 loại hàng
	 * 
	 * @param category Loại hàng cần thêm
	 * @return
	 */
	public Category createCategory(Category category) {
		return categoryRepository.save(category);
	}

	/**
	 * Cập nhật loại hàng
	 * 
	 * @param id       Mã loại hàng
	 * @param category Dữ liệu loại hàng cần cập nhật
	 * @return
	 */
	public Category updateCategory(Integer id, Category category) {

		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found"));

		existingCategory.setCategoryName(category.getCategoryName());

		return categoryRepository.save(existingCategory);
	}

	/**
	 * Xóa loại hàng
	 * 
	 * @param id Mã loại hàng
	 */
	public void deleteCategory(Integer id) {

		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found"));

		if (productRepository.existsByCategory_CategoryID(id)) {
			throw new RuntimeException("Không thể xóa Loại hàng này vì có Sản phẩm đang sử dụng!!");
		}
		categoryRepository.delete(existingCategory);
	}
}