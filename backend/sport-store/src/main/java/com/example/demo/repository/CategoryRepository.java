package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Category;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Category
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer>, JpaSpecificationExecutor<Category> {

	Optional<Category> findByCategoryNameIgnoreCase(String categoryName);
}
