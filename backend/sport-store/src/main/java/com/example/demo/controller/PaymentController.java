package com.example.demo.controller;

import com.example.demo.config.VNPayConfig;
import com.example.demo.util.VNPayUtil;
import com.example.demo.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

	@Autowired
	private VNPayConfig vnPayConfig;

	@Autowired
	private PaymentService paymentService; 

	@GetMapping("/vnpay-ipn")
	public ResponseEntity<?> processVNPayIPN(HttpServletRequest request) {
		Map<String, String> fields = new HashMap<>();
		for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
			String fieldName = params.nextElement();
			String fieldValue = request.getParameter(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				fields.put(fieldName, fieldValue);
			}
		}

		String vnp_SecureHash = request.getParameter("vnp_SecureHash");
		fields.remove("vnp_SecureHash");
		fields.remove("vnp_SecureHashType");

		// Sắp xếp dữ liệu để kiểm tra chữ ký bảo mật
		List<String> fieldNames = new ArrayList<>(fields.keySet());
		Collections.sort(fieldNames);
		StringBuilder hashData = new StringBuilder();
		Iterator<String> itr = fieldNames.iterator();
		while (itr.hasNext()) {
			String fieldName = itr.next();
			String fieldValue = fields.get(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
				if (itr.hasNext()) {
					hashData.append('&');
				}
			}
		}

		// Xác thực chữ ký checksum từ VNPay gửi sang
		String checkSign = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
		if (!checkSign.equalsIgnoreCase(vnp_SecureHash)) {
			return ResponseEntity.ok(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
		}

		// Lấy thông tin giao dịch
		String orderIdStr = request.getParameter("vnp_TxnRef");
		String responseCode = request.getParameter("vnp_ResponseCode");

		// Đẩy xuống tầng Service để xử lý nghiệp vụ DB
		String resultStatus = paymentService.processOrderPayment(orderIdStr, responseCode);

		// Trả kết quả chuẩn JSON theo đúng tài liệu kỹ thuật của VNPay
		if ("01".equals(resultStatus)) {
			return ResponseEntity.ok(Map.of("RspCode", "01", "Message", "Order not Found"));
		} else if ("02".equals(resultStatus)) {
			return ResponseEntity.ok(Map.of("RspCode", "02", "Message", "Order already confirmed"));
		}

		return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
	}
}