package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Wishlist;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Wishlist
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
	/**
	 * Lấy danh sách sản phẩm yêu thích của Khách hàng
	 * @param customerID Mã Khách hàng
	 * @return
	 */
    List<Wishlist> findByCustomerCustomerID(Integer customerID);
    
    /**
     * Tìm kiếm sản phẩm yêu thích cụ thể ID Khách hàng và ID Sản phẩm
     * @param customerID
     * @param productID
     * @return
     */
    Optional<Wishlist> findByCustomerCustomerIDAndProductProductID(Integer customerID, Integer productID);
}
