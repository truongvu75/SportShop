package com.example.demo.service;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.CreateOrderRequestDTO;
import com.example.demo.dto.request.UpdateOrderStatusRequestDTO;
import com.example.demo.dto.response.OrderDetailResponseDTO;
import com.example.demo.dto.response.OrderResponseDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import com.example.demo.model.Customer;
import com.example.demo.model.Employee;
import com.example.demo.model.Order;
import com.example.demo.model.OrderDetail;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.OrderStatusEnum;
import com.example.demo.model.Product;
import com.example.demo.model.ProductVariant;
import com.example.demo.model.Province;
import com.example.demo.model.Shipper;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.OrderDetailRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.OrderStatusRepository;
import com.example.demo.repository.ProductVariantRepository;
import com.example.demo.repository.ProvinceRepository;
import com.example.demo.repository.ShipperRepository;
import com.example.demo.security.SecurityUtils;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Service xử lý các nghiệp vụ liên quan đến Đơn hàng (Order)
 */
@Service
public class OrderService {

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private OrderDetailRepository orderDetailRepository;

	@Autowired
	private OrderStatusRepository orderStatusRepository;

	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private ProvinceRepository provinceRepository;

	@Autowired
	private ShipperRepository shipperRepository;

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private CartItemRepository cartItemRepository;

	@Autowired
	private ProductVariantRepository productVariantRepository;
	
	@Autowired
	private PaymentService paymentService;

	/**
	 * Lấy hoặc tạo trạng thái đơn hàng tự động để tránh lỗi DB trống dữ liệu
	 */
	private OrderStatus getOrCreateStatus(OrderStatusEnum statusEnum) {
		return orderStatusRepository.findById(statusEnum.getStatus()).orElseGet(() -> {
			OrderStatus newStatus = new OrderStatus(statusEnum.getStatus(), statusEnum.getDescription());
			return orderStatusRepository.save(newStatus);
		});
	}

	/**
	 * Nghiệp vụ: Tạo/Thêm mới đơn hàng Backend nhận DTO thông tin mua hàng, còn các
	 * sản phẩm lấy trực tiếp từ Giỏ hàng. Khi tạo thành công: trừ kho
	 * ProductVariant và xóa toàn bộ vật phẩm trong giỏ hàng.
	 */
	@Transactional
	public OrderResponseDTO createOrder(CreateOrderRequestDTO request, HttpServletRequest httpServletRequest) {
		Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
		Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();

		// 1. Kiểm tra Customer
		Customer customer = customerRepository.findById(CURRENT_CUSTOMER_ID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin khách hàng!"));

		// 2. Lấy giỏ hàng của Customer
		Cart cart = cartRepository.findByCustomerCustomerID(CURRENT_CUSTOMER_ID)
				.orElseThrow(() -> new RuntimeException("Giỏ hàng của khách hàng chưa được khởi tạo!"));

		// 3. Lấy danh sách sản phẩm trong giỏ hàng
		List<CartItem> cartItems = cartItemRepository.findByCartCartID(cart.getCartID());
		if (cartItems.isEmpty()) {
			throw new RuntimeException("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi mua hàng.");
		}

		// 4. Kiểm tra và giải quyết Tỉnh/Thành phố nhận hàng
		Province province = provinceRepository.findById(request.getDeliveryProvince()).orElseGet(() -> {
			Province newProvince = new Province(request.getDeliveryProvince());
			return provinceRepository.save(newProvince);
		});

		// 5. Kiểm tra Đơn vị vận chuyển (nếu có)
		Shipper shipper = null;
		if (request.getShipperID() != null) {
			shipper = shipperRepository.findById(request.getShipperID()).orElse(null);
		}	
		
		
		// 6. Khởi tạo Đơn hàng mới
		Order order = new Order();
		order.setOrderTime(new Date());
		order.setDeliveryAddress(request.getDeliveryAddress());
		//order.setPayMethod(request.getPayMethod());
		System.out.println("Phương thức thanh toán "+request.getPayMethod());
		order.setDeliveryProvince(province);
		order.setCustomer(customer);
		order.setShipper(shipper);
		order.setStatus(getOrCreateStatus(OrderStatusEnum.PENDING)); // Mặc định là Chờ xác nhận

		
		// Lưu đơn hàng trước để lấy OrderID
		Order savedOrder = orderRepository.save(order);

		List<OrderDetail> orderDetails = new ArrayList<>();

		// 7. Duyệt danh sách items trong giỏ hàng để tạo OrderDetail và trừ Stock
		for (CartItem item : cartItems) {
			ProductVariant variant = item.getVariant();
			if (variant == null) {
				throw new RuntimeException("Có lỗi xảy ra: Sản phẩm biến thể không hợp lệ.");
			}

			// Kiểm tra số lượng tồn kho
			if (variant.getStock() < item.getQuantity()) {
				Product prod = variant.getProduct();
				String prodName = prod != null ? prod.getProductName() : "Sản phẩm";
				String size = variant.getSize() != null ? variant.getSize().getSizeName() : "";
				String color = variant.getColor() != null ? variant.getColor().getColorName() : "";
				throw new RuntimeException("Sản phẩm " + prodName + " (Size: " + size + ", Màu: " + color
						+ ") không đủ hàng trong kho! Hiện chỉ còn: " + variant.getStock());
			}

			// Trừ số lượng tồn kho
			variant.setStock(variant.getStock() - item.getQuantity());
			productVariantRepository.save(variant);

			// Tạo chi tiết đơn hàng
			OrderDetail detail = new OrderDetail();
			detail.setOrder(savedOrder);
			detail.setVariant(variant);
			detail.setQuantity(item.getQuantity());
			detail.setSalePrice(variant.getPrice()); // Lưu giá tại thời điểm mua

			OrderDetail savedDetail = orderDetailRepository.save(detail);
			orderDetails.add(savedDetail);
		}
		
		OrderResponseDTO dto = mapToOrderResponseDTO(savedOrder, orderDetails);

		long totalAmount = dto.getTotalAmount().longValueExact();
		savedOrder.setTotalAmount(dto.getTotalAmount());	//Lưu tổng giá của đơn hàng vào DB
		
		if ("COD".equalsIgnoreCase(request.getPayMethod())) {
			//Nếu là COD thì xóa giỏ hàng vì đơn đã hoàn thành bước đặt
			cartItemRepository.deleteByCartCartID(cart.getCartID());
			savedOrder.setPayMethod("COD");
			orderRepository.save(savedOrder);
			
			dto.setPaymentUrl(null);	//COD thì không có link thanh toán
			dto.setPayMethod("COD");
		}else if ("VNPAY".equalsIgnoreCase(request.getPayMethod())) {
			savedOrder.setPayMethod("VNPAY");
			orderRepository.save(savedOrder);
			
			//Gọi PaymentService để tạo link VNPAY 
			String vnpayUrl = paymentService.createVNPayPaymentUrl(savedOrder.getOrderID(), totalAmount, httpServletRequest);
			
			System.out.println("Payment URL: "+vnpayUrl);
			
			//Nhét paymentUrl vào DTO trả về
			dto.setPaymentUrl(vnpayUrl);
			dto.setPayMethod("VNPAY");
		}

		
		return dto;
	}

	/**
	 * Nghiệp vụ: Xem danh sách tất cả đơn hàng (Dành cho Admin - có phân trang)
	 */
	public Page<OrderResponseDTO> getAllOrders(int page, int size) {
		if (page < 1)
			page = 1;
		if (size < 1)
			size = 10;

		Pageable pageable = PageRequest.of(page - 1, size, Sort.by("orderID").descending());
		Page<Order> ordersPage = orderRepository.findAll(pageable);

		List<OrderResponseDTO> dtoList = ordersPage.getContent().stream().map(order -> {
			List<OrderDetail> details = orderDetailRepository.findByOrderOrderID(order.getOrderID());
			return mapToOrderResponseDTO(order, details);
		}).collect(Collectors.toList());

		return new PageImpl<>(dtoList, pageable, ordersPage.getTotalElements());
	}

	/**
	 * Nghiệp vụ: Xem danh sách đơn hàng của tôi (Dành cho khách hàng hiện tại)
	 */
	public List<OrderResponseDTO> getMyOrders() {
		Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
		Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();

		List<Order> orders = orderRepository.findByCustomerCustomerIDOrderByOrderTimeDesc(CURRENT_CUSTOMER_ID);
		return orders.stream().map(order -> {
			List<OrderDetail> details = orderDetailRepository.findByOrderOrderID(order.getOrderID());
			return mapToOrderResponseDTO(order, details);
		}).collect(Collectors.toList());
	}

	/**
	 * Nghiệp vụ: Xem chi tiết một đơn hàng theo ID
	 */
	public OrderResponseDTO getOrderById(Integer orderID) {
		Order order = orderRepository.findById(orderID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng có mã: " + orderID));

		// Bảo mật: Đối với khách hàng thường thì chỉ cho phép xem đơn hàng của chính họ
		// Ở đây giả lập kiểm tra ID khách hàng đăng nhập
		Long ACCOUNTID = SecurityUtils.getCurrentAccountId();

		List<String> roles = SecurityUtils.getCurrentUserRoles();
		for (String string : roles) {
			System.out.println(string);
		}

		boolean isAdminOrEmployee = roles.contains("ROLE_EMPLOYEE"); // Nếu Employee/Admin thì được xem

		if (!isAdminOrEmployee) { // Nếu không phải thì phải kiểm tra order chính chủ không?
			Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
			if (!order.getCustomer().getCustomerID().equals(CURRENT_CUSTOMER_ID)) {
				throw new AccessDeniedException("Bạn không có quyền xem đơn hàng này!!");
			}

		}

		List<OrderDetail> details = orderDetailRepository.findByOrderOrderID(order.getOrderID());
		return mapToOrderResponseDTO(order, details);
	}

	/**
	 * Nghiệp vụ: Cập nhật trạng thái đơn hàng (Dành cho Admin)
	 */
	@Transactional
	public OrderResponseDTO updateOrderStatus(Integer orderID, UpdateOrderStatusRequestDTO request) {
		Order order = orderRepository.findById(orderID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng có mã: " + orderID));

		OrderStatusEnum targetStatus = OrderStatusEnum.fromStatus(request.getStatus());
		OrderStatus statusEntity = getOrCreateStatus(targetStatus);

		order.setStatus(statusEntity);

		Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Employee CURRENT_EMPLOYEE = employeeRepository.findByAccountAccountId(ACCOUNTID).get();
		// Cập nhật các trường thời gian tương ứng với trạng thái
		Date now = new Date();
		if (targetStatus == OrderStatusEnum.ACCEPT) {
			order.setAcceptTime(now); // Đơn hàng được duyệt
			order.setEmployee(CURRENT_EMPLOYEE);
		} else if (targetStatus == OrderStatusEnum.SHIPPED) {
			order.setShippedTime(now); // chuẩn bị giao
		} else if (targetStatus == OrderStatusEnum.FINISHED) {
			if (order.getAcceptTime() == null) {
				order.setAcceptTime(now);
			}
			if (order.getShippedTime() == null) {
				order.setShippedTime(now);
			}
			order.setFinishedTime(now);
		} else if (targetStatus == OrderStatusEnum.CANCELLED) {
			// Nếu hủy bởi Admin, hoàn trả lại số lượng tồn kho (nếu đơn chưa từng giao
			// thành công)
			if (order.getFinishedTime() == null) {
				restoreStock(orderID);
			}
		}

		Order updatedOrder = orderRepository.save(order);
		List<OrderDetail> details = orderDetailRepository.findByOrderOrderID(order.getOrderID());
		return mapToOrderResponseDTO(updatedOrder, details);
	}

	/**
	 * Nghiệp vụ: Khách hàng tự hủy đơn hàng Điều kiện: Chỉ được phép hủy khi đơn
	 * hàng đang ở trạng thái PENDING (Chờ xác nhận)
	 */
	@Transactional
	public OrderResponseDTO cancelOrder(Integer orderID) {
		Order order = orderRepository.findById(orderID)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng có mã: " + orderID));

		// Bảo mật: Chỉ chủ nhân đơn hàng mới được hủy
		Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
		Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();

		if (!order.getCustomer().getCustomerID().equals(CURRENT_CUSTOMER_ID)) {
			throw new RuntimeException("Bạn không có quyền thực hiện hành động này với đơn hàng!");
		}

		// Kiểm tra điều kiện: chỉ hủy khi trạng thái là PENDING (Chờ xác nhận)
		if (order.getStatus() == null || !order.getStatus().getStatus().equals(OrderStatusEnum.PENDING.getStatus())) {
			throw new RuntimeException("Chỉ được phép hủy đơn hàng khi đơn hàng đang ở trạng thái 'Chờ xác nhận'!");
		}

		// 1. Hoàn trả lại số lượng tồn kho của các sản phẩm biến thể trong đơn hàng
		restoreStock(orderID);

		// 2. Chuyển trạng thái đơn hàng sang Đã Hủy (CANCELLED)
		OrderStatus cancelledStatus = getOrCreateStatus(OrderStatusEnum.CANCELLED);
		order.setStatus(cancelledStatus);

		Order updatedOrder = orderRepository.save(order);
		List<OrderDetail> details = orderDetailRepository.findByOrderOrderID(order.getOrderID());
		return mapToOrderResponseDTO(updatedOrder, details);
	}

	/**
	 * Helper: Hoàn trả số lượng tồn kho cho các biến thể trong đơn hàng
	 */
	private void restoreStock(Integer orderID) {
		List<OrderDetail> details = orderDetailRepository.findByOrderOrderID(orderID);
		for (OrderDetail detail : details) {
			ProductVariant variant = detail.getVariant();
			if (variant != null) {
				variant.setStock(variant.getStock() + detail.getQuantity());
				productVariantRepository.save(variant);
			}
		}
	}

	// ================= MAPPING HELPER METHOD =================

	/**
	 * Chuyển đổi từ Entity Order sang DTO trả về cho client
	 */
	private OrderResponseDTO mapToOrderResponseDTO(Order order, List<OrderDetail> details) {
		OrderResponseDTO dto = new OrderResponseDTO();
		dto.setOrderID(order.getOrderID());
		dto.setOrderTime(order.getOrderTime());
		dto.setDeliveryAddress(order.getDeliveryAddress());
		dto.setAcceptTime(order.getAcceptTime());
		dto.setShippedTime(order.getShippedTime());
		dto.setFinishedTime(order.getFinishedTime());
		dto.setPayMethod(order.getPayMethod());

		if (order.getDeliveryProvince() != null) {
			dto.setDeliveryProvince(order.getDeliveryProvince().getProvinceName());
		}

		if (order.getStatus() != null) {
			dto.setStatusID(order.getStatus().getStatus());
			dto.setStatusDescription(order.getStatus().getDescription());
		}

		if (order.getShipper() != null) {
			dto.setShipperName(order.getShipper().getShipperName());
		}

		if (order.getEmployee() != null) {
			dto.setEmployeeName(order.getEmployee().getEmployeeName());
		}

		if (order.getCustomer() != null) {
			dto.setCustomerID(order.getCustomer().getCustomerID());
			dto.setCustomerName(order.getCustomer().getCustomerName());
		}

		List<OrderDetailResponseDTO> itemDTOs = new ArrayList<>();
		BigDecimal totalAmount = BigDecimal.ZERO;

		if (details != null) {
			for (OrderDetail detail : details) {
				OrderDetailResponseDTO detailDTO = new OrderDetailResponseDTO();
				detailDTO.setOrderDetailID(detail.getOrderDetailID());
				detailDTO.setQuantity(detail.getQuantity());
				detailDTO.setSalePrice(detail.getSalePrice());

				BigDecimal qty = BigDecimal.valueOf(detail.getQuantity());
				BigDecimal itemTotal = detail.getSalePrice().multiply(qty);
				detailDTO.setTotalPrice(itemTotal);
				totalAmount = totalAmount.add(itemTotal);

				ProductVariant variant = detail.getVariant();
				if (variant != null) {
					detailDTO.setVariantID(variant.getVariantID());

					Product product = variant.getProduct();
					if (product != null) {
						detailDTO.setProductID(product.getProductID());
						detailDTO.setProductName(product.getProductName());
						detailDTO.setPhoto(product.getPhoto());
					}

					if (variant.getSize() != null) {
						detailDTO.setSizeName(variant.getSize().getSizeName());
					}

					if (variant.getColor() != null) {
						detailDTO.setColorName(variant.getColor().getColorName());
						detailDTO.setHexCode(variant.getColor().getHexCode());
					}
				}
				itemDTOs.add(detailDTO);
			}
		}

		dto.setItems(itemDTOs);
		dto.setTotalAmount(totalAmount);
		return dto;
	}
}
