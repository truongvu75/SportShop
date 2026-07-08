package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.CreateOrderRequestDTO;
import com.example.demo.dto.request.UpdateOrderStatusRequestDTO;
import com.example.demo.dto.response.OrderResponseDTO;
import com.example.demo.service.OrderService;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Controller cung cấp các REST API endpoints quản lý Đơn hàng (Order)
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * POST /api/orders
     * Khách hàng đặt mua hàng (Tạo đơn hàng từ giỏ hàng hiện tại)
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody CreateOrderRequestDTO request, HttpServletRequest servletRequest) {
        OrderResponseDTO response = orderService.createOrder(request, servletRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/orders
     * Employee/Admin xem danh sách toàn bộ đơn hàng (có phân trang)
     * Yêu cầu quyền ROLE_EMPLOYEE
     */
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping
    public ResponseEntity<Page<OrderResponseDTO>> getAllOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderResponseDTO> response = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/orders/my-orders
     * Khách hàng xem danh sách đơn hàng của chính mình
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders() {
        List<OrderResponseDTO> response = orderService.getMyOrders();
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/orders/{id}
     * Xem chi tiết một đơn hàng theo mã đơn hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Integer id) {
        OrderResponseDTO response = orderService.getOrderById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/orders/{id}/status
     * Employee cập nhật trạng thái đơn hàng (Duyệt đơn, Đang giao, Đã hoàn thành, Hủy đơn)
     * Yêu cầu quyền ROLE_EMPLOYEE
     */
    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Integer id,
            @RequestBody UpdateOrderStatusRequestDTO request) {
        OrderResponseDTO response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/orders/{id}/cancel
     * Khách hàng tự hủy đơn hàng của mình (Chỉ khi đơn hàng đang ở trạng thái 'Chờ xác nhận')
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable Integer id) {
        OrderResponseDTO response = orderService.cancelOrder(id);
        return ResponseEntity.ok(response);
    }
}
