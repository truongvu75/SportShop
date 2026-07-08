package com.example.demo.repository.specification;

import com.example.demo.dto.request.ProductSearchDTO;
import com.example.demo.model.Product;
import com.example.demo.model.ProductVariant;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

/**
 * Lớp xử lý, tạo bộ lọc động cho Sản phẩm
 */
public class ProductSpecification {

	/**
	 * Lọc các giá trị tìm kiếm nhận từ Client Nếu giá trị nào không có thì bỏ qua
	 * * @param criteria DTO nhận từ Client
	 * 
	 * @return Specification<Product>
	 */
	public static Specification<Product> filterProducts(ProductSearchDTO criteria) {
		return (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();

			// 1. Tìm theo Tên HOẶC Mô tả sản phẩm (Tìm kiếm gần đúng, không phân biệt hoa
			// thường)
			if (criteria.getSearchValue() != null && !criteria.getSearchValue().trim().isEmpty()) {
				String searchPattern = "%" + criteria.getSearchValue().trim().toLowerCase() + "%";

				// Điều kiện tìm theo Tên
				Predicate likeName = criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")),
						searchPattern);

				// Điều kiện tìm theo Mô tả
				Predicate likeDescription = criteriaBuilder.like(criteriaBuilder.lower(root.get("productDescription")),
						searchPattern);

				// Gộp lại thành: (productName LIKE ... OR productDescription LIKE ...)
				Predicate nameOrDescPredicate = criteriaBuilder.or(likeName, likeDescription);
				predicates.add(nameOrDescPredicate);
			}

			// 2. Lọc theo Hãng (BrandID trên Header)
			if (criteria.getBrandId() != null) {
				predicates.add(criteriaBuilder.equal(root.get("brand").get("brandID"), criteria.getBrandId()));
			}

			// 3. Lọc theo Loại hàng (CategoryID trên Header)
			if (criteria.getCategoryId() != null) {
				predicates.add(criteriaBuilder.equal(root.get("category").get("categoryID"), criteria.getCategoryId()));
			}

			// --- KIỂM TRA ĐIỀU KIỆN LỌC Ở SIDEBAR (Thuộc về ProductVariant) ---
			boolean hasVariantFilter = (criteria.getMinPrice() != null) || (criteria.getMaxPrice() != null)
					|| (criteria.getColorIds() != null && !criteria.getColorIds().isEmpty())
					|| (criteria.getSizeIds() != null && !criteria.getSizeIds().isEmpty());

			if (hasVariantFilter) {
				// Tránh trùng lặp bản ghi Product khi Join với nhiều Variant (Cartesian
				// Product)
				query.distinct(true);

				// Thực hiện INNER JOIN từ Product sang ProductVariant
				Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.INNER);

				// 4. Lọc theo Khoảng giá (Price ở Sidebar)
				if (criteria.getMinPrice() != null) {
					predicates.add(
							criteriaBuilder.greaterThanOrEqualTo(variantJoin.get("price"), criteria.getMinPrice()));
				}
				if (criteria.getMaxPrice() != null) {
					predicates.add(criteriaBuilder.lessThanOrEqualTo(variantJoin.get("price"), criteria.getMaxPrice()));
				}

				// 5. Lọc theo danh sách Màu sắc (Color ở Sidebar)
				if (criteria.getColorIds() != null && !criteria.getColorIds().isEmpty()) {
					predicates.add(variantJoin.get("color").get("colorID").in(criteria.getColorIds()));
				}

				// 6. Lọc theo danh sách Kích cỡ (Size ở Sidebar)
				if (criteria.getSizeIds() != null && !criteria.getSizeIds().isEmpty()) {
					predicates.add(variantJoin.get("size").get("sizeID").in(criteria.getSizeIds()));
				}
			}

			// Kết hợp tất cả các cụm điều kiện lớn bằng phép AND
			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		};
	}
}