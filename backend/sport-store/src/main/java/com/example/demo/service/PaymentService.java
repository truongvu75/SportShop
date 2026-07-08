package com.example.demo.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.config.VNPayConfig;
import com.example.demo.model.Account;
import com.example.demo.model.Cart;
import com.example.demo.model.Order;
import com.example.demo.model.OrderStatus;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.util.VNPayUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class PaymentService {

	@Autowired
	private VNPayConfig vnPayConfig;

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private CartItemRepository cartItemRepository;

	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private OrderRepository orderRepository;

	/**
	 * Hàm tạo Url Payment
	 * 
	 * @param orderId
	 * @param totalAmount
	 * @param request
	 * @return
	 */
	public String createVNPayPaymentUrl(Integer orderId, long totalAmount, HttpServletRequest request) {
		String vnp_Version = "2.1.0";
		String vnp_Command = "pay";
		String vnp_OrderInfo = "Thanh toan don hang vnp_" + orderId;
		String vnp_TxnRef = String.valueOf(orderId); // Dùng mã đơn hàng làm mã giao dịch
		String vnp_IpAddr = VNPayUtil.getIpAddress(request);
		String vnp_TmnCode = vnPayConfig.getTmnCode();

		Map<String, String> vnp_Params = new HashMap<>();
		vnp_Params.put("vnp_Version", vnp_Version);
		vnp_Params.put("vnp_Command", vnp_Command);
		vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
		vnp_Params.put("vnp_Amount", String.valueOf(totalAmount * 100)); // VNPay yêu cầu nhân 100
		vnp_Params.put("vnp_CurrCode", "VND");
		vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
		vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
		vnp_Params.put("vnp_OrderType", "other");
		vnp_Params.put("vnp_Locale", "vn");
		vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
		vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

		Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String vnp_CreateDate = simpleDateFormat.format(calendar.getTime());
		vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

		calendar.add(Calendar.MINUTE, 15); // Hết hạn sau 15'
		String vnp_ExpireDate = simpleDateFormat.format(calendar.getTime());
		vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

		List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
		Collections.sort(fieldNames);
		StringBuilder hashData = new StringBuilder();
		StringBuilder query = new StringBuilder();

		Iterator<String> itr = fieldNames.iterator();
		while (itr.hasNext()) {
			String fieldName = itr.next();
			String fieldValue = vnp_Params.get(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				// Build hash data
				hashData.append(fieldName);
				hashData.append('=');
				hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

				// Build query
				query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
				query.append('=');
				query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
				if (itr.hasNext()) {
					query.append('&');
					hashData.append('&');
				}
			}
		}

		String queryUrl = query.toString();
		String vnp_SecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
		queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

		return vnPayConfig.getPayUrl() + "?" + queryUrl;
	}

	@Transactional
	public String processOrderPayment(String orderIdStr, String responseCode) {
		Integer orderId = Integer.parseInt(orderIdStr);
		Optional<Order> orderOptional = orderRepository.findById(orderId);
		Integer customerId = orderOptional.get().getCustomer().getCustomerID();

		Cart cart = cartRepository.findByCustomerCustomerID(customerId)
				.orElseThrow(() -> new RuntimeException("Giỏ hàng chưa được khởi tạo"));

		if (orderOptional.isEmpty()) {
			return "01"; // Order not found
		}

		Order order = orderOptional.get();

		// Kiểm tra xem đơn hàng đã được xử lý trước đó chưa (Tránh VNPay gọi trùng)
		if (order.getStatus().getStatus() != 1) {
			return "02"; // Order already confirmed
		}

		OrderStatus newStatus = new OrderStatus();
		if ("00".equals(responseCode)) {
			// Thanh toán thành công -> Chuyển sang trạng thái 2 (Đã duyệt)
			newStatus.setStatus(2);
			order.setStatus(newStatus);

			// Xóa sản phẩm ra khỏi giỏ
			cartItemRepository.deleteByCartCartID(cart.getCartID());
		} else {
			// Thanh toán thất bại hoặc khách bấm hủy -> Chuyển sang trạng thái 5 (Đã hủy)
			newStatus.setStatus(5);
			order.setStatus(newStatus);

			// TODO: Hoàn trả lại số lượng vật phẩm (Stock) về kho tại đây nếu cần
		}

		orderRepository.save(order);
		return "00"; // Xử lý thành công hoàn toàn
	}
}
