package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.response.ProductResponseDTO;
import com.example.demo.service.WishlistService;

/**
 * Controller cung cấp REST API cho Module Wishlist (Danh sách sản phẩm yêu thích)
 */
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    /**
     * GET /api/wishlist
     * Lấy danh sách sản phẩm yêu thích
     */
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getWishlist() {
        List<ProductResponseDTO> response = wishlistService.getWishlist();
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/wishlist/{productId}
     * Thêm sản phẩm vào danh sách yêu thích
     */
    @PostMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> addToWishlist(@PathVariable Integer productId) {
        ProductResponseDTO response = wishlistService.addToWishlist(productId);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/wishlist/{productId}
     * Xóa sản phẩm khỏi danh sách yêu thích
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Integer productId) {
        wishlistService.removeFromWishlist(productId);
        return ResponseEntity.ok().build();
    }
}
