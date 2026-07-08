package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Shipper;

/**
 * Lớp liên quan đến xử lý, làm việc với DB của Shipper
 */
@Repository
public interface ShipperRepository extends JpaRepository<Shipper, Integer> {

}
