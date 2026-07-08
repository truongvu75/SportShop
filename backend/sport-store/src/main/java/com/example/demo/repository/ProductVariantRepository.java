package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.ProductVariant;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của ProductVariant
 */
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
	/**
	 * Lấy danh sách sản phẩm biến thể dựa vào Mã sản phẩm
	 * @param productId Mã sản phẩm
	 * @return
	 */
	List<ProductVariant> findByProduct_ProductID(Integer productId);

	/**
	 * Tìm sản phẩm biến thể từ Mã SKU
	 * @param sku
	 * @return
	 */
    Optional<ProductVariant> findBySku(String sku);
}
