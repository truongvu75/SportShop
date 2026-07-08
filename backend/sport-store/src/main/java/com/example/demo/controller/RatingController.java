package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.request.CreateRatingRequestDTO;
import com.example.demo.dto.request.ReplyRatingRequestDTO;
import com.example.demo.dto.response.RatingResponseDTO;
import com.example.demo.service.RatingService;

import jakarta.validation.Valid;

/**
 * Controller xử lý các API liên quan đến Đánh giá sản phẩm (Rating)
 */
@RestController
@RequestMapping("/api/ratings")
public class RatingController {

	@Autowired
	private RatingService ratingService;

	// ===================== PUBLIC ENDPOINTS =====================

	/**
	 * GET /api/ratings/product/{productID} Lấy toàn bộ đánh giá của sản phẩm (Công
	 * khai - không cần đăng nhập)
	 */
	@GetMapping("/product/{productID}")
	public ResponseEntity<?> getRatingsByProduct(@PathVariable Integer productID) {
		try {
			List<RatingResponseDTO> ratings = ratingService.getRatingsByProduct(productID);
			return ResponseEntity.ok(ratings);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Lỗi khi tải danh sách đánh giá: " + e.getMessage()));
		}
	}

	/**
	 * GET /api/ratings Lấy toàn bộ đánh giá sản phẩm của Khách hàng
	 * 
	 * @param customerID
	 * @return
	 */
	@GetMapping("/me")
	public ResponseEntity<?> getAllRatingsByCustomerID() {
		try {
			List<RatingResponseDTO> list = ratingService.getAllRatingByCustomerID();

			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Lỗi khi tải danh sách đánh giá: " + e.getMessage()));
		}
	}

	/**
	 * GET /api/ratings/product/{productID}/average Lấy điểm trung bình của sản phẩm
	 * (Công khai - không cần đăng nhập)
	 */
	@GetMapping("/product/{productID}/average")
	public ResponseEntity<?> getAverageStar(@PathVariable Integer productID) {
		try {
			Double avg = ratingService.getAverageStar(productID);
			Map<String, Object> result = new HashMap<>();
			result.put("productID", productID);
			result.put("averageStar", avg);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Lỗi khi tính điểm trung bình: " + e.getMessage()));
		}
	}

	// ===================== AUTHENTICATED ENDPOINTS =====================

	/**
	 * GET /api/ratings/check-eligibility/{productID} Kiểm tra xem khách hàng đang
	 * đăng nhập có đủ điều kiện đánh giá không Trả về: 0 = Chưa mua, 1 = Có thể
	 * đánh giá, 2 = Đã đánh giá rồi
	 */
	@GetMapping("/check-eligibility/{productID}")
	public ResponseEntity<?> checkEligibility(@PathVariable Integer productID) {
		try {
			int status = ratingService.checkEligibility(productID);
			Map<String, Object> result = new HashMap<>();
			result.put("status", status);
			result.put("message", switch (status) {
			case 0 -> "Bạn chưa mua sản phẩm này.";
			case 1 -> "Bạn có thể đánh giá sản phẩm này.";
			case 2 -> "Bạn đã đánh giá sản phẩm này rồi.";
			default -> "Không xác định.";
			});
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
		}
	}

	/**
	 * POST /api/ratings Khách hàng gửi đánh giá mới (Yêu cầu đăng nhập)
	 */
	@PostMapping
	public ResponseEntity<?> submitRating(@RequestBody CreateRatingRequestDTO request) {
		try {
			RatingResponseDTO result = ratingService.submitRating(request);
			return ResponseEntity.status(HttpStatus.CREATED).body(result);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Gửi đánh giá thất bại. Vui lòng thử lại!"));
		}
	}

	/**
	 * PUT /api/ratings/{ratingID} Khách hàng chỉnh sửa đánh giá của mình (Yêu cầu
	 * đăng nhập)
	 */
	@PutMapping("/{ratingID}")
	public ResponseEntity<?> updateRating(@PathVariable Integer ratingID, @RequestBody CreateRatingRequestDTO request) {
		try {
			RatingResponseDTO result = ratingService.updateRating(ratingID, request);
			return ResponseEntity.ok(result);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Cập nhật đánh giá thất bại. Vui lòng thử lại!"));
		}
	}

	/**
	 * DELETE /api/ratings/{ratingID} Khách hàng xóa đánh giá của mình (Yêu cầu đăng
	 * nhập)
	 */
	@DeleteMapping("/{ratingID}")
	public ResponseEntity<?> deleteRating(@PathVariable Integer ratingID) {
		try {
			ratingService.deleteRating(ratingID);
			return ResponseEntity.ok(Map.of("message", "Đã xóa đánh giá thành công!"));
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Xóa đánh giá thất bại. Vui lòng thử lại!"));
		}
	}

	/**
	 * POST /api/ratings/reply/{ratingID} Nhân viên phản hồi đánh giá của khách hàng
	 * 
	 * @param ratingID Mã đánh giá
	 * @return
	 */
	@PostMapping("/reply/{ratingID}")
	public ResponseEntity<RatingResponseDTO> replyRating(@PathVariable Integer ratingID,
			@Valid @RequestBody ReplyRatingRequestDTO request) {

		RatingResponseDTO responseDTO = ratingService.replyRating(ratingID, request);
		return ResponseEntity.ok(responseDTO);

	}

	@GetMapping
	public ResponseEntity<Page<RatingResponseDTO>> getAllRatings(@RequestParam(defaultValue = "ALL") String status,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<RatingResponseDTO> ratings = ratingService.getAllRatings(status, pageable);
		
		System.out.println(status);
		
		return ResponseEntity.ok(ratings);
	}
}
