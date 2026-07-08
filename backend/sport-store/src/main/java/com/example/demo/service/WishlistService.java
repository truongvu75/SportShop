package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.response.ProductResponseDTO;
import com.example.demo.dto.response.ProductVariantResponseDTO;
import com.example.demo.model.Customer;
import com.example.demo.model.Product;
import com.example.demo.model.Wishlist;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.WishlistRepository;
import com.example.demo.security.SecurityUtils;

/**
 * Service xử lý các nghiệp vụ liên quan đến Wishlist (Danh sách yêu thích)
 */
@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;


    /**
     * Lấy danh sách sản phẩm yêu thích của khách hàng
     */
    public List<ProductResponseDTO> getWishlist() {
    	Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
    	
        List<Wishlist> wishlists = wishlistRepository.findByCustomerCustomerID(CURRENT_CUSTOMER_ID);
        return wishlists.stream()
                .map(w -> mapToProductResponseDTO(w.getProduct()))
                .collect(Collectors.toList());
    }

    /**
     * Thêm sản phẩm vào danh sách yêu thích
     */
    @Transactional
    public ProductResponseDTO addToWishlist(Integer productID) {
    	Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
    	
        Optional<Wishlist> existing = wishlistRepository.findByCustomerCustomerIDAndProductProductID(CURRENT_CUSTOMER_ID, productID);
        if (existing.isPresent()) {
            return mapToProductResponseDTO(existing.get().getProduct());
        }

        Customer customer = customerRepository.findById(CURRENT_CUSTOMER_ID)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));
        Product product = productRepository.findById(productID)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        Wishlist wishlist = new Wishlist();
        wishlist.setCustomer(customer);
        wishlist.setProduct(product);
        wishlist = wishlistRepository.save(wishlist);

        return mapToProductResponseDTO(wishlist.getProduct());
    }

    /**
     * Xóa sản phẩm khỏi danh sách yêu thích
     */
    @Transactional
    public void removeFromWishlist(Integer productID) {
    	Long ACCOUNTID = SecurityUtils.getCurrentAccountId();
    	Integer CURRENT_CUSTOMER_ID = customerRepository.findByAccountAccountId(ACCOUNTID).get().getCustomerID();
    	
        Optional<Wishlist> existing = wishlistRepository.findByCustomerCustomerIDAndProductProductID(CURRENT_CUSTOMER_ID, productID);
        existing.ifPresent(wishlist -> wishlistRepository.delete(wishlist));
    }

    /**
     * Chuyển đổi Product Entity sang ProductResponseDTO tương thích với Frontend
     */
    private ProductResponseDTO mapToProductResponseDTO(Product product) {
        ProductResponseDTO pDto = new ProductResponseDTO();
        pDto.setProductID(product.getProductID());
        pDto.setProductName(product.getProductName());
        pDto.setDescription(product.getProductDescription());
        pDto.setBasePrice(product.getBasePrice());
        pDto.setPhoto(product.getPhoto());
        pDto.setIsSelling(product.getIsSelling());

        if (product.getCategory() != null) {
            pDto.setCategory(product.getCategory().getCategoryName());
        }
        if (product.getBrand() != null) {
            pDto.setBrand(product.getBrand().getBrandName());
        }

        // Bản đồ hóa các variants để kiểm tra Stock ở Frontend
        if (product.getVariants() != null) {
            List<ProductVariantResponseDTO> variantDtos = product.getVariants().stream().map(variant -> {
                ProductVariantResponseDTO vDto = new ProductVariantResponseDTO();
                vDto.setVariantID(variant.getVariantID());
                vDto.setPrice(variant.getPrice());
                vDto.setStock(variant.getStock());
                vDto.setSku(variant.getSku());

                if (variant.getSize() != null) {
                    vDto.setSize(variant.getSize().getSizeName());
                }
                if (variant.getColor() != null) {
                    vDto.setColor(variant.getColor().getColorName());
                }
                return vDto;
            }).collect(Collectors.toList());
            pDto.setVariants(variantDtos);
        }

        return pDto;
    }
}
