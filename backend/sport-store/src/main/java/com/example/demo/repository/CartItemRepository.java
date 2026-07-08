package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

	/**
	 * Lấy danh sách sản phẩm 
	 * @param cartID Mã giỏ hàng
	 * @return
	 */
	List<CartItem> findByCartCartID(Integer cartID);

	/**
	 * Lấy 1 sản phẩm từ giỏ bằng Mã giỏ và Mã sản phẩm
	 * @param cartID
	 * @param variantID
	 * @return
	 */
	Optional<CartItem> findByCartCartIDAndVariantVariantID(Integer cartID, Integer variantID);

	/**
	 * Xóa sản phẩm khỏi giỏ
	 * @param cartID
	 */
	void deleteByCartCartID(Integer cartID);
}