package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Province;
import com.example.demo.repository.ProvinceRepository;

/**
 * Controller cung cấp REST API cho Tỉnh/Thành phố (Province)
 */
@RestController
@RequestMapping("/api/provinces")
public class ProvinceController {

    @Autowired
    private ProvinceRepository provinceRepository;

    /**
     * GET /api/provinces
     * Lấy danh sách toàn bộ Tỉnh/Thành phố trong hệ thống
     */
    @GetMapping
    public ResponseEntity<List<Province>> getAllProvinces() {
        List<Province> provinces = provinceRepository.findAll();
        if (provinces.isEmpty()) {
            String[] defaults = {"Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương", "Đồng Nai"};
            for (String pName : defaults) {
                provinceRepository.save(new Province(pName));
            }
            provinces = provinceRepository.findAll();
        }
        return ResponseEntity.ok(provinces);
    }
}
