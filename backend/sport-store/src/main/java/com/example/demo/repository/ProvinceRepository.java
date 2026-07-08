package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Province;

/**
 * Repository xử lý các truy vấn liên quan đến Province
 */
@Repository
public interface ProvinceRepository extends JpaRepository<Province, String> {
}
