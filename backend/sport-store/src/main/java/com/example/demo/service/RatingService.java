package com.example.demo.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.CreateRatingRequestDTO;
import com.example.demo.dto.request.ReplyRatingRequestDTO;
import com.example.demo.dto.response.RatingResponseDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.model.Employee;
import com.example.demo.model.Product;
import com.example.demo.model.Rating;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.RatingRepository;
import com.example.demo.security.SecurityUtils;

/**
 * Service xử lý các nghiệp vụ liên quan đến Đánh giá sản phẩm (Rating)
 */
@Service
public class RatingService {

	@Autowired
	private RatingRepository ratingRepository;

	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	// ===================== CUSTOMER OPERATIONS =====================

	/**
	 * Nghiệp vụ: Khách hàng gửi đánh giá mới cho sản phẩm. Điều kiện: Đã mua & nhận
	 * thành công, và chưa từng đánh giá sản phẩm này.
	 */
	@Transactional
	public RatingResponseDTO submitRating(CreateRatingRequestDTO dto) {
		// 1. Xác định khách hàng đang đăng nhập
		Long accountID = SecurityUtils.getCurrentAccountId();
		Customer customer = customerRepository.findByAccountAccountId(accountID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin khách hàng!"));

		Integer customerID = customer.getCustomerID();
		Integer productID = dto.getProductID();

		// 2. Validate star (1-5)
		if (dto.getStar() == null || dto.getStar() < 1 || dto.getStar() > 5) {
			throw new RuntimeException("Số sao đánh giá phải từ 1 đến 5!");
		}

		// 3. Validate comment
		if (dto.getComment() == null || dto.getComment().trim().isEmpty()) {
			throw new RuntimeException("Nội dung đánh giá không được để trống!");
		}
		if (dto.getComment().length() > 500) {
			throw new RuntimeException("Nội dung đánh giá không được vượt quá 500 ký tự!");
		}

		// 4. Kiểm tra khách hàng đã mua và nhận thành công sản phẩm này chưa
		boolean hasPurchased = orderRepository.hasPurchasedProduct(customerID, productID);
		if (!hasPurchased) {
			throw new RuntimeException("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công!");
		}

		// 5. Kiểm tra đã đánh giá sản phẩm này chưa
		boolean alreadyRated = ratingRepository.existsByCustomerCustomerIDAndProductProductID(customerID, productID);
		if (alreadyRated) {
			throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi! Bạn có thể chỉnh sửa đánh giá hiện tại.");
		}

		// 6. Lấy thực thể Product từ DB
		Product product = productRepository.findById(productID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có mã: " + productID));

		// 7. Tạo và lưu đánh giá mới
		Rating rating = new Rating();
		rating.setProduct(product);
		rating.setCustomer(customer);
		rating.setStar(dto.getStar());
		rating.setComment(dto.getComment().trim());
		rating.setCreatedTime(new Date());

		Rating savedRating = ratingRepository.save(rating);
		return mapToDTO(savedRating);
	}

	/**
	 * Nghiệp vụ: Khách hàng cập nhật đánh giá của chính mình.
	 */
	@Transactional
	public RatingResponseDTO updateRating(Integer ratingID, CreateRatingRequestDTO dto) {
		Long accountID = SecurityUtils.getCurrentAccountId();
		Customer customer = customerRepository.findByAccountAccountId(accountID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin khách hàng!"));

		Rating rating = ratingRepository.findById(ratingID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá có mã: " + ratingID));

		// Bảo mật: Chỉ chủ đánh giá mới được sửa
		if (!rating.getCustomer().getCustomerID().equals(customer.getCustomerID())) {
			throw new RuntimeException("Bạn không có quyền chỉnh sửa đánh giá này!");
		}

		// Validate
		if (dto.getStar() == null || dto.getStar() < 1 || dto.getStar() > 5) {
			throw new RuntimeException("Số sao đánh giá phải từ 1 đến 5!");
		}
		if (dto.getComment() == null || dto.getComment().trim().isEmpty()) {
			throw new RuntimeException("Nội dung đánh giá không được để trống!");
		}
		if (dto.getComment().length() > 500) {
			throw new RuntimeException("Nội dung đánh giá không được vượt quá 500 ký tự!");
		}

		rating.setStar(dto.getStar());
		rating.setComment(dto.getComment().trim());

		Rating updatedRating = ratingRepository.save(rating);
		return mapToDTO(updatedRating);
	}

	/**
	 * Nghiệp vụ: Khách hàng xóa đánh giá của chính mình.
	 */
	@Transactional
	public void deleteRating(Integer ratingID) {
		Long accountID = SecurityUtils.getCurrentAccountId();
		Customer customer = customerRepository.findByAccountAccountId(accountID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin khách hàng!"));

		Rating rating = ratingRepository.findById(ratingID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá có mã: " + ratingID));

		// Bảo mật: Chỉ chủ đánh giá mới được xóa
		if (!rating.getCustomer().getCustomerID().equals(customer.getCustomerID())) {
			throw new RuntimeException("Bạn không có quyền xóa đánh giá này!");
		}

		ratingRepository.delete(rating);
	}

	// ===================== PUBLIC QUERY OPERATIONS =====================

	/**
	 * Lấy toàn bộ đánh giá của sản phẩm (Công khai)
	 */
	public List<RatingResponseDTO> getRatingsByProduct(Integer productID) {
		return ratingRepository.findByProductProductIDOrderByCreatedTimeDesc(productID).stream().map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	/**
	 * Lấy toàn bộ đánh giá của Khách hàng
	 * 
	 * @param customerID
	 * @return
	 */
	public List<RatingResponseDTO> getAllRatingByCustomerID() {
		// Lấy CustomerID từ JWT xuống
		Long ACCOUNT_ID = SecurityUtils.getCurrentAccountId();
		Optional<Customer> customer = customerRepository.findByAccountAccountId(ACCOUNT_ID);

		return ratingRepository.findByCustomerCustomerID(customer.get().getCustomerID()).stream().map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	/**
	 * Lấy điểm đánh giá trung bình của sản phẩm
	 */
	public Double getAverageStar(Integer productID) {
		Double avg = ratingRepository.getAverageStarByProductID(productID);
		return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
	}

	/**
	 * Kiểm tra khách hàng hiện tại có đủ điều kiện đánh giá sản phẩm không. Trả về:
	 * 0 = Chưa mua, 1 = Có thể đánh giá, 2 = Đã đánh giá rồi
	 */
	public int checkEligibility(Integer productID) {
		Long accountID = SecurityUtils.getCurrentAccountId();
		Customer customer = customerRepository.findByAccountAccountId(accountID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin khách hàng!"));

		Integer customerID = customer.getCustomerID();

		if (!orderRepository.hasPurchasedProduct(customerID, productID)) {
			return 0; // Chưa mua sản phẩm này
		}
		if (ratingRepository.existsByCustomerCustomerIDAndProductProductID(customerID, productID)) {
			return 2; // Đã đánh giá rồi
		}
		return 1; // Đủ điều kiện đánh giá
	}

	/**
	 * Phản hồi đánh giá sản phẩm của khách hàng
	 * @param replyRatingRequestDTO DTO chứa reply của nhân viên, bao gồm: RatingID, Reply(String)
	 * @return
	 */
	@Transactional
	public RatingResponseDTO replyRating(Integer ratingID, ReplyRatingRequestDTO replyRatingRequestDTO) {
		Account account = SecurityUtils.getCurrentAccount();
		String role = account.getRole().trim();

		if (!role.trim().toUpperCase().equals("ROLE_EMPLOYEE")) {
			throw new RuntimeException("Bạn không có quyền phản hồi đánh giá này!");
		}
		
		Employee employee = employeeRepository.findByAccountAccountId(account.getAccountId())
				.orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên này!!"));

		Rating rating = ratingRepository.findById(ratingID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá có mã: " + ratingID));

		rating.setReply(replyRatingRequestDTO.getReply()); // set reply của nhân viên vào!
		rating.setReplyTime(new Date());
		rating.setEmployee(employee); // set employee để lấy employeeId gán vào DB
		
		Rating replyRating = ratingRepository.save(rating);
		
		return mapToDTO(replyRating);
	}

	/**
	 * Lấy danh sách tất cả đánh giá về sản phẩm, bao gồm: Đã phản hồi và chưa phản hồi
	 * @param status
	 * @param pageable
	 * @return
	 */
	public Page<RatingResponseDTO> getAllRatings(String status, Pageable pageable){
		Page<Rating> ratingPage;
		
		switch (status.trim().toUpperCase()) {
		case "UNREPLIED": 	//Đánh giá ở trạng thái chưa phản hồi
			ratingPage = ratingRepository.findUnrepliedRatings(pageable);
			break;
		case "REPLIED":	//Đánh giá đã phản hồi
			ratingPage = ratingRepository.findRepliedRatings(pageable);
			break;
		default: 	//ALL đánh giá
			ratingPage = ratingRepository.findAll(pageable);
			break;
		}
		
		return ratingPage.map(this :: mapToDTO);	//Convert Page<Rating> => Page<DTO Response>
		
	}
	
	// ===================== MAPPING HELPER =====================

	/**
	 * Map từ Entity Rating sang DTO phản hồi
	 */
	private RatingResponseDTO mapToDTO(Rating rating) {
		RatingResponseDTO dto = new RatingResponseDTO();
		dto.setRatingID(rating.getRatingID());
		dto.setProductName(rating.getProduct().getProductName());
		dto.setStar(rating.getStar());
		dto.setComment(rating.getComment());
		dto.setCreatedTime(rating.getCreatedTime());
		dto.setReply(rating.getReply());
		dto.setReplyTime(rating.getReplyTime());

		if (rating.getCustomer() != null) {
			dto.setCustomerID(rating.getCustomer().getCustomerID());
			dto.setCustomerName(rating.getCustomer().getCustomerName());
		}
		if (rating.getEmployee() != null) {
			dto.setEmployeeName(rating.getEmployee().getEmployeeName());
		}
		return dto;
	}
}
