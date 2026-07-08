package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.ProductColor;

@Repository
public interface ProductColorRepository extends JpaRepository<ProductColor, Integer>{

}
