package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Rating;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Rating
 */
@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {

    /**
     * Lấy toàn bộ đánh giá của 1 sản phẩm, sắp xếp mới nhất lên đầu
     */
    List<Rating> findByProductProductIDOrderByCreatedTimeDesc(Integer productID);

    /**
     * Tính số sao trung bình của sản phẩm
     */
    @Query("SELECT AVG(r.star) FROM Rating r WHERE r.product.productID = :productID")
    Double getAverageStarByProductID(@Param("productID") Integer productID);

    /**
     * Kiểm tra khách hàng đã đánh giá sản phẩm này chưa (chặn đánh giá 2 lần)
     */
    boolean existsByCustomerCustomerIDAndProductProductID(Integer customerID, Integer productID);

    /**
     * Lấy đánh giá của 1 khách hàng cho 1 sản phẩm cụ thể (phục vụ Update/Delete)
     */
    Optional<Rating> findByCustomerCustomerIDAndProductProductID(Integer customerID, Integer productID);

    /**
     * Lấy toàn bộ đánh giá của 1 khách hàng bằng mã Khách hàng
     * @param customerID
     * @return
     */
    List<Rating> findByCustomerCustomerID(Integer customerID);
    
    /* ====== LẤY DANH SÁCH TOÀN BỘ ĐÁNH GIÁ ====== */
    /**
     * Lấy toàn bộ đánh giá, không lọc và có phân trang
     */
    Page<Rating> findAll(Pageable pageable);
    
    /**
     * Lấy danh sách đánh giá chưa có phản hồi
     * @param pageable
     * @return
     */
    @Query(value = "SELECT * FROM Rating WHERE ReplyBy IS NULL", nativeQuery = true)
    Page<Rating> findUnrepliedRatings(Pageable pageable);
    
    /**
     * Lấy danh sách đánh giá đã có phản hồi
     * @param pageable
     * @return
     */
    @Query(value = "SELECT * FROM Rating WHERE ReplyBy IS NOT NULL", nativeQuery = true)
    Page<Rating> findRepliedRatings(Pageable pageable);
}

