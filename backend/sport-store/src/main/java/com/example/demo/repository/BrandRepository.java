package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {

	Optional<Brand> findByBrandNameIgnoreCase(String brandName);
}