package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.example.demo.model.Brand;
import com.example.demo.repository.BrandRepository;
import com.example.demo.repository.ProductRepository;

/**
 * Lớp Service cung cấp các chức năng cho BrandController
 */
@Service
public class BrandService {

	@Autowired
	private BrandRepository brandRepository;
	

	@Autowired
	private ProductRepository productRepository;

	/**
	 * Lấy danh sách tất cả Brand có phân trang
	 * @return
	 */
	public Page<Brand> getAllBrands(int page, int size) {
		if (page < 1) page = 1;
		if (size < 1) size = 10;
		
		Pageable pageable = PageRequest.of(page - 1, size, Sort.by("brandID"));
		
		return brandRepository.findAll(pageable);
	}
	
	/**
	 * Lấy danh sách tất cả Brand không phân trang
	 * @return
	 */
	public List<Brand> getAll(){
		
		return brandRepository.findAll();
	}

	/**
	 * Thêm mới một Brand
	 * @param brand
	 * @return
	 */
	public Brand createBrand(Brand brand) {
		return brandRepository.save(brand);
	}

	/**
	 * Cập nhật thông tin một Brand
	 * @param id
	 * @param brand
	 * @return
	 */
	public Brand updateBrand(Integer id, Brand brand) {

		Brand existingBrand = brandRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Brand not found"));

		existingBrand.setBrandName(brand.getBrandName());

		return brandRepository.save(existingBrand);
	}

	/**
	 * Xóa một Brand
	 * @param id
	 */
	public void deleteBrand(Integer id) {

		Brand existingBrand = brandRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Brand not found"));
		
		if (productRepository.existsByBrand_BrandID(id)) {
			throw new RuntimeException("Không thể xóa thương hiệu này vì đang có sản phẩm thuộc thương hiệu!!");
		}

		brandRepository.delete(existingBrand);
	}
}
