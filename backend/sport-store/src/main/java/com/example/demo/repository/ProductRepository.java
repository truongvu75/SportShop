package com.example.demo.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Product;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Product
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

	/**
	 * Kiểm tra có sản phẩm thuộc Brand này không
	 * 
	 * @param brandID
	 * @return
	 */
	boolean existsByBrand_BrandID(Integer brandID);

	/**
	 * Kiểm tra có sản phẩm thuộc Category này không
	 * 
	 * @param categoryID
	 * @return
	 */
	boolean existsByCategory_CategoryID(Integer categoryID);

	/**
	 * Lấy ra danh sách sản phẩm bán chạy nhất * @param brandID
	 * 
	 * @param categoryID
	 * @param pageable
	 * @return
	 */
	@Query(value = """
			    SELECT pd.* FROM orderdetail od
			    JOIN orders o ON od.orderid = o.orderid
			    JOIN productvariant pv ON od.variantid = pv.variantid
			    JOIN product pd ON pd.productid = pv.productid
			    WHERE
			      (:brandID IS NULL OR pd.brandid = :brandID)
			      AND
			      (:categoryID IS NULL OR pd.categoryid = :categoryID)
			      AND
			      o.status = 4
			    GROUP BY pd.productid -- Trong Postgres, gom nhóm theo PK của bảng pd là đủ để SELECT pd.*
			    ORDER BY SUM(od.quantity) DESC
			""", countQuery = """
			    SELECT COUNT(DISTINCT pd.productid) FROM orderdetail od
			    JOIN orders o ON od.orderid = o.orderid
			    JOIN productvariant pv ON od.variantid = pv.variantid
			    JOIN product pd ON pd.productid = pv.productid
			    WHERE
			      (:brandID IS NULL OR pd.brandid = :brandID)
			      AND
			      (:categoryID IS NULL OR pd.categoryid = :categoryID)
			      AND
			      o.status = 4
			""", nativeQuery = true)
	List<Product> findTopSellingProducts(@Param("brandID") Integer brandID, @Param("categoryID") Integer categoryID,
			Pageable pageable);

}