package com.example.demo.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.AddToCartRequestDTO;
import com.example.demo.dto.request.UpdateCartItemRequestDTO;
import com.example.demo.dto.response.CartItemResponseDTO;
import com.example.demo.dto.response.CartResponseDTO;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import com.example.demo.model.Customer;
import com.example.demo.model.Product;
import com.example.demo.model.ProductVariant;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.ProductVariantRepository;
import com.example.demo.security.SecurityUtils;

/**
 * Service xử lý các nghiệp vụ liên quan đến Giỏ hàng (Cart)
 */
@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;


    /**
     * Lấy hoặc tạo mới giỏ hàng của khách hàng hiện tại
     */
    private Cart getOrCreateCart() {
    	Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
    	
        Customer customer = customerRepository.findById(CURRENT_CUSTOMER_ID)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return cartRepository.findByCustomerCustomerID(CURRENT_CUSTOMER_ID)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });
    }

    /**
     * Lấy chi tiết giỏ hàng của khách hàng hiện tại
     */
    public CartResponseDTO getCart() {
        Cart cart = getOrCreateCart();
        return mapToCartResponseDTO(cart);
    }

    /**
     * Lấy tổng số lượng vật phẩm trong giỏ hàng (để hiển thị badge số lượng)
     */
    public Integer getCartCount() {
    	Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
    	
        Optional<Cart> cartOpt = cartRepository.findByCustomerCustomerID(CURRENT_CUSTOMER_ID);
        if (cartOpt.isEmpty()) {
            return 0;
        }
        
        List<CartItem> items = cartItemRepository.findByCartCartID(cartOpt.get().getCartID());
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    /**
     * Thêm sản phẩm biến thể vào giỏ hàng
     * Cộng dồn số lượng nếu sản phẩm đã có sẵn
     */
    @Transactional
    public CartResponseDTO addToCart(AddToCartRequestDTO request) {
        Cart cart = getOrCreateCart();

        ProductVariant variant = productVariantRepository.findById(request.getVariantID())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        Optional<CartItem> existingItemOpt = cartItemRepository
                .findByCartCartIDAndVariantVariantID(cart.getCartID(), variant.getVariantID());

        if (existingItemOpt.isPresent()) {
            // Đã có sẵn biến thể này trong giỏ -> Cộng dồn số lượng
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            // Cập nhật lại giá hiện tại của biến thể phòng khi giá thay đổi
            item.setUnitPrice(variant.getPrice());
            cartItemRepository.save(item);
        } else {
            // Chưa có -> Tạo mới vật phẩm trong giỏ
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setVariant(variant);
            item.setQuantity(request.getQuantity());
            item.setUnitPrice(variant.getPrice());
            cartItemRepository.save(item);
        }

        // Tải lại giỏ hàng từ DB để nhận danh sách items mới nhất
        Cart updatedCart = cartRepository.findById(cart.getCartID())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToCartResponseDTO(updatedCart);
    }

    /**
     * Cập nhật số lượng của một vật phẩm trong giỏ hàng
     */
    @Transactional
    public CartResponseDTO updateCartItem(Integer cartItemID, UpdateCartItemRequestDTO request) {
        CartItem item = cartItemRepository.findById(cartItemID)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
        
        // Bảo mật: Kiểm tra xem giỏ hàng này có thuộc về khách hàng hiện tại không
        if (!item.getCart().getCustomer().getCustomerID().equals(CURRENT_CUSTOMER_ID)) {
            throw new RuntimeException("Unauthorized access to this cart item");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        Cart updatedCart = cartRepository.findById(item.getCart().getCartID())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToCartResponseDTO(updatedCart);
    }

    /**
     * Xóa một vật phẩm khỏi giỏ hàng
     */
    @Transactional
    public CartResponseDTO removeFromCart(Integer cartItemID) {
        CartItem item = cartItemRepository.findById(cartItemID)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Cart cart = item.getCart();

        Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
        
        // Bảo mật: Kiểm tra quyền sở hữu
        if (!cart.getCustomer().getCustomerID().equals(CURRENT_CUSTOMER_ID)) {
            throw new RuntimeException("Unauthorized access to this cart item");
        }

        // Tối ưu JPA Cache: Xóa vật phẩm khỏi danh sách Java của Cart
        if (cart.getItems() != null) {
            cart.getItems().remove(item);
        }

        cartItemRepository.delete(item);

        return mapToCartResponseDTO(cart);
    }

    /**
     * Xóa sạch toàn bộ vật phẩm trong giỏ hàng
     */
    @Transactional
    public CartResponseDTO clearCart() {
        Cart cart = getOrCreateCart();
        cartItemRepository.deleteByCartCartID(cart.getCartID());

        // Tối ưu JPA Cache: Xóa toàn bộ phần tử trong danh sách Java của Cart
        if (cart.getItems() != null) {
            cart.getItems().clear();
        }

        return mapToCartResponseDTO(cart);
    }

    // ================= HELPER MAPPER METHODS =================

    /**
     * Chuyển đổi Entity Cart sang CartResponseDTO
     */
    private CartResponseDTO mapToCartResponseDTO(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setCartID(cart.getCartID());
        
        if (cart.getCustomer() != null) {
            dto.setCustomerID(cart.getCustomer().getCustomerID());
            dto.setCustomerName(cart.getCustomer().getCustomerName());
        }

        List<CartItemResponseDTO> itemDTOs = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                CartItemResponseDTO itemDTO = mapToCartItemResponseDTO(item);
                itemDTOs.add(itemDTO);
                totalPrice = totalPrice.add(itemDTO.getTotalPrice());
            }
        }

        dto.setItems(itemDTOs);
        dto.setTotalPrice(totalPrice);
        return dto;
    }

    /**
     * Chuyển đổi Entity CartItem sang CartItemResponseDTO
     */
    private CartItemResponseDTO mapToCartItemResponseDTO(CartItem item) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setCartItemID(item.getCartItemID());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        
        BigDecimal qty = BigDecimal.valueOf(item.getQuantity());
        dto.setTotalPrice(item.getUnitPrice().multiply(qty));

        ProductVariant variant = item.getVariant();
        if (variant != null) {
            dto.setVariantID(variant.getVariantID());
            dto.setStock(variant.getStock());

            Product product = variant.getProduct();
            if (product != null) {
                dto.setProductID(product.getProductID());
                dto.setProductName(product.getProductName());
                dto.setPhoto(product.getPhoto());
            }

            if (variant.getSize() != null) {
                dto.setSizeName(variant.getSize().getSizeName());
            }

            if (variant.getColor() != null) {
                dto.setColorName(variant.getColor().getColorName());
                dto.setHexCode(variant.getColor().getHexCode());
            }
        }

        return dto;
    }
}
