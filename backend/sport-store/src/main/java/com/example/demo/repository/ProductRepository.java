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
	 * Lấy ra danh sách sản phẩm bán chạy nhất
	 * 
	 * @param pageable
	 * @return
	 */
	@Query(value = """
			    SELECT pd.* FROM OrderDetail od
			    JOIN [Order] o ON od.OrderID = o.OrderID
			    JOIN ProductVariant pv ON od.VariantID = pv.VariantID
			    JOIN Product pd ON pd.ProductID = pv.ProductID
			    WHERE
			      (:brandID IS NULL OR pd.BrandID = :brandID)
			  		AND
			      (:categoryID IS NULL OR pd.CategoryID = :categoryID)
			    	AND
			       o.Status = 4
			    GROUP BY pd.ProductID, pd.ProductName, pd.ProductDescription,
			             pd.BasePrice, pd.Photo, pd.IsSelling, pd.CategoryID, pd.BrandID
			    ORDER BY SUM(od.Quantity) DESC
			""", nativeQuery = true)
	List<Product> findTopSellingProducts(@Param("brandID") Integer brandID, @Param("categoryID") Integer categoryID,
			Pageable pageable);

}