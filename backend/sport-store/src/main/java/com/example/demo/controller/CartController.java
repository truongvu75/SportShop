package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.AddToCartRequestDTO;
import com.example.demo.dto.request.UpdateCartItemRequestDTO;
import com.example.demo.dto.response.CartResponseDTO;
import com.example.demo.service.CartService;

/**
 * Controller cung cấp các REST API endpoints quản lý Giỏ hàng (Cart)
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * GET /api/cart
     * Lấy chi tiết giỏ hàng của khách hàng hiện tại
     */
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart() {
        CartResponseDTO response = cartService.getCart();
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/cart/count
     * Lấy tổng số lượng vật phẩm có trong giỏ hàng (để hiện badge)
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> getCartCount() {
        Integer count = cartService.getCartCount();
        return ResponseEntity.ok(count);
    }

    /**
     * POST /api/cart/items
     * Thêm sản phẩm biến thể vào giỏ hàng
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addToCart(@RequestBody AddToCartRequestDTO request) {
        CartResponseDTO response = cartService.addToCart(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/cart/items/{id}
     * Cập nhật số lượng của vật phẩm trong giỏ hàng
     */
    @PutMapping("/items/{id}")
    public ResponseEntity<CartResponseDTO> updateCartItem(
            @PathVariable Integer id,
            @RequestBody UpdateCartItemRequestDTO request) {
        CartResponseDTO response = cartService.updateCartItem(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/cart/items/{id}
     * Xóa một vật phẩm khỏi giỏ hàng
     */
    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartResponseDTO> removeFromCart(@PathVariable Integer id) {
        CartResponseDTO response = cartService.removeFromCart(id);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/cart/clear
     * Xóa sạch toàn bộ vật phẩm trong giỏ hàng
     */
    @DeleteMapping
    public ResponseEntity<CartResponseDTO> clearCart() {
        CartResponseDTO response = cartService.clearCart();
        return ResponseEntity.ok(response);
    }
}
