package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.ProductRequestDTO;
import com.example.demo.dto.request.ProductSearchDTO;
import com.example.demo.dto.request.ProductVariantRequestDTO;
import com.example.demo.dto.response.ProductResponseDTO;
import com.example.demo.dto.response.ProductVariantResponseDTO;
import com.example.demo.model.Brand;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.model.ProductColor;
import com.example.demo.model.ProductSize;
import com.example.demo.model.ProductVariant;
import com.example.demo.repository.BrandRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductColorRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductSizeRepository;
import com.example.demo.repository.ProductVariantRepository;
import com.example.demo.repository.specification.ProductSpecification;

@Service
public class ProductService {

	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private ProductVariantRepository productVariantRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private BrandRepository brandRepository;

	@Autowired
	private ProductSizeRepository sizeRepository;

	@Autowired
	private ProductColorRepository colorRepository;
	

	/**
	 * Lấy danh sách sản phẩm có lọc
	 * @param criteria DTO nhận từ Client
	 * @param page Trang hiện tại
	 * @param size Số lượng sản phẩm trong trang
	 * @return
	 */
	public Page<ProductResponseDTO> getProducts(ProductSearchDTO criteria, int page, int size) {
	    // Sắp xếp sản phẩm mới nhất lên đầu
	    Pageable pageable = PageRequest.of(page-1, size, Sort.by("productID").ascending());
	    
	    //Tạo điều kiện Spec
	    Specification<Product> spec = ProductSpecification.filterProducts(criteria);
	    
	    //Query xuống DB lấy lên Page chứa các Entity gốc
	    Page<Product> productPage = productRepository.findAll(spec, pageable);
	    
	    //Chuyển Entity gốc thành ResponseDTO
	    return productPage.map(
	    		Product -> {
	    			//Khởi tạo DTO cha
	    			ProductResponseDTO pDto = new ProductResponseDTO();
	    			pDto.setProductID(Product.getProductID());
	    			pDto.setProductName(Product.getProductName());
	    			pDto.setDescription(Product.getProductDescription());
	    			pDto.setBasePrice(Product.getBasePrice());
	    			pDto.setPhoto(Product.getPhoto());
	    			pDto.setIsSelling(Product.getIsSelling());
	    			
	    			// Bốc dữ liệu từ Object liên kết đặt vào trường String phẳng
	    			if (Product.getCategory() != null) {
		    			pDto.setCategory(Product.getCategory().getCategoryName());
	    				
	    			}
	    			if (Product.getBrand() != null) {
	                    pDto.setBrand(Product.getBrand().getBrandName());
	                }
	    			
	    			// Duyệt danh sách variants (Entity con) để chuyển thành VariantResponseDTO
	    			if (Product.getVariants() != null) {
	    				List<ProductVariantResponseDTO> variantDtos = Product.getVariants().stream().map(ProductVariant -> {
	    					ProductVariantResponseDTO vDto = new ProductVariantResponseDTO();
	    					vDto.setVariantID(ProductVariant.getVariantID());
	    					vDto.setPrice(ProductVariant.getPrice());
	                        vDto.setStock(ProductVariant.getStock());
	                        vDto.setSku(ProductVariant.getSku());
	                        
	                        //Lấy trực tiếp tên Size và tên Màu đưa ra ngoài
	                        if (ProductVariant.getSize() != null) {
	                        	vDto.setSize(ProductVariant.getSize().getSizeName());
	                        }
	                        if (ProductVariant.getColor() != null) {
	                            vDto.setColor(ProductVariant.getColor().getColorName());
	                        }
	                        return vDto;
	    				}).collect(Collectors.toList());
	    				
	    				// Đính kèm danh sách DTO con vào DTO cha
	    				pDto.setVariants(variantDtos);
	    			}
	    			
	    			return pDto;
	    		});
	}

	/**
	 * Lấy chi tiết 1 sản phẩm
	 * @param productID Mã sản phẩm
	 * @return
	 */
	public ProductResponseDTO getProductDetail(Integer productID) {
		Product product = productRepository.findById(productID).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productID));
		
		//Chuyển nội dung Entity sang DTO
		ProductResponseDTO pDto = new ProductResponseDTO();
		pDto.setProductID(product.getProductID());
		pDto.setProductName(product.getProductName());
		pDto.setDescription(product.getProductDescription());
		pDto.setBasePrice(product.getBasePrice());
		pDto.setPhoto(product.getPhoto());
		pDto.setIsSelling(product.getIsSelling());
		
		// Bốc dữ liệu từ Object liên kết đặt vào trường String phẳng
		if (product.getCategory() != null) {
			pDto.setCategory(product.getCategory().getCategoryName());
			
		}
		if (product.getBrand() != null) {
            pDto.setBrand(product.getBrand().getBrandName());
        }
		
		if (product.getVariants() != null) {
			List<ProductVariantResponseDTO> variantDtos = product.getVariants().stream().map(ProductVariant -> {
				ProductVariantResponseDTO vDto = new ProductVariantResponseDTO();
				vDto.setVariantID(ProductVariant.getVariantID());
				vDto.setPrice(ProductVariant.getPrice());
                vDto.setStock(ProductVariant.getStock());
                vDto.setSku(ProductVariant.getSku());
                
                //Lấy trực tiếp tên Size và tên Màu đưa ra ngoài
                if (ProductVariant.getSize() != null) {
                	vDto.setSize(ProductVariant.getSize().getSizeName());
                }
                if (ProductVariant.getColor() != null) {
                    vDto.setColor(ProductVariant.getColor().getColorName());
                }
                
                return vDto;
			}).collect(Collectors.toList());
			
			pDto.setVariants(variantDtos);
		}
		return pDto;
	}
	
	/**
	 * Thêm mới 1 sản phẩm
	 * @param request
	 * @return
	 */
	@Transactional
	public ProductResponseDTO createProduct(ProductRequestDTO request) {

	    // ===== VALIDATE PRODUCT =====

	    if(request.getProductName() == null || request.getProductName().trim().isEmpty()) {
	        throw new RuntimeException("Product name is required");
	    }

	    if(request.getVariants() == null || request.getVariants().isEmpty()) {
	        throw new RuntimeException("Product must have at least 1 variant");
	    }

	    // ===== CATEGORY =====

	    Category category = categoryRepository.findById(request.getCategoryId())
	            .orElseThrow(() -> new RuntimeException("Category not found"));

	    // ===== BRAND =====

	    Brand brand = brandRepository.findById(request.getBrandId())
	            .orElseThrow(() -> new RuntimeException("Brand not found"));

	    // ===== CREATE PRODUCT =====

	    Product product = new Product();

	    product.setProductName(request.getProductName());
	    product.setProductDescription(request.getProductDescription());
	    product.setBasePrice(request.getBasePrice());
	    product.setPhoto(request.getPhoto());
	    product.setIsSelling(request.getIsSelling());

	    product.setCategory(category);
	    product.setBrand(brand);

	    product = productRepository.save(product);

	    // ===== SAVE VARIANTS =====

	    for(ProductVariantRequestDTO variantDTO : request.getVariants()) {

	        // ===== CHECK SIZE =====

	        ProductSize size = sizeRepository.findById(variantDTO.getSizeId())
	                .orElseThrow(() -> new RuntimeException("Size not found"));

	        // ===== CHECK COLOR =====

	        ProductColor color = colorRepository.findById(variantDTO.getColorId())
	                .orElseThrow(() -> new RuntimeException("Color not found"));

	        // ===== CHECK SKU =====

	        if(productVariantRepository.findBySku(variantDTO.getSku()).isPresent()) {
	            throw new RuntimeException("SKU already exists");
	        }

	        // ===== VALIDATE =====

	        if(variantDTO.getStock() < 0) {
	            throw new RuntimeException("Stock must be >= 0");
	        }

	        if(variantDTO.getPrice().doubleValue() <= 0) {
	            throw new RuntimeException("Price must be > 0");
	        }

	        // ===== CREATE VARIANT =====

	        ProductVariant variant = new ProductVariant();

	        variant.setProduct(product); //Tự động gán ID vào variant

	        variant.setSize(size);

	        variant.setColor(color);

	        variant.setPrice(variantDTO.getPrice());

	        variant.setStock(variantDTO.getStock());

	        variant.setSku(variantDTO.getSku());

	        productVariantRepository.save(variant);
	    }

	    return getProductDetail(product.getProductID());
	}
	
	/**
	 * Cập nhật 1 sản phẩm
	 * @param id
	 * @param request
	 * @return
	 */
	@Transactional
	public ProductResponseDTO updateProduct(Integer id, ProductRequestDTO request) {

	    Product product = productRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Product not found"));

	    // ===== 2. CATEGORY (Chỉ cập nhật nếu request có truyền categoryId) =====
	    if (request.getCategoryId() != null) {
	        Category category = categoryRepository.findById(request.getCategoryId())
	                .orElseThrow(() -> new RuntimeException("Category not found"));
	        product.setCategory(category);
	    } // Nếu null thì bỏ qua, giữ nguyên category cũ của product

	    // ===== 3. BRAND (Chỉ cập nhật nếu request có truyền brandId) =====
	    if (request.getBrandId() != null) {
	        Brand brand = brandRepository.findById(request.getBrandId())
	                .orElseThrow(() -> new RuntimeException("Brand not found"));
	        product.setBrand(brand);
	    } // Nếu null thì bỏ qua, giữ nguyên brand cũ của product

	    // ===== UPDATE PRODUCT =====

	    product.setProductName(request.getProductName());

	    product.setProductDescription(request.getProductDescription());

	    product.setBasePrice(request.getBasePrice());

	    product.setPhoto(request.getPhoto());

	    product.setIsSelling(request.getIsSelling());

	    productRepository.save(product);

	    // ===== GET OLD VARIANTS =====

	    List<ProductVariant> oldVariants =
	            productVariantRepository.findByProduct_ProductID(id);

	    // ===== DELETE OLD VARIANTS NOT IN REQUEST =====

	    List<Integer> requestVariantIds = request.getVariants()
	            .stream()
	            .filter(v -> v.getVariantId() != null)
	            .map(ProductVariantRequestDTO::getVariantId)
	            .toList();

	    for(ProductVariant oldVariant : oldVariants) {

	        if(!requestVariantIds.contains(oldVariant.getVariantID())) {

	            productVariantRepository.delete(oldVariant);
	        }
	    }

	    // ===== UPDATE / CREATE VARIANTS =====

	    for(ProductVariantRequestDTO variantDTO : request.getVariants()) {

	    	ProductSize size = sizeRepository.findById(variantDTO.getSizeId())
	                .orElseThrow(() -> new RuntimeException("Size not found"));

	    	ProductColor color = colorRepository.findById(variantDTO.getColorId())
	                .orElseThrow(() -> new RuntimeException("Color not found"));

	        // ===== UPDATE =====

	        if(variantDTO.getVariantId() != null) {

	            ProductVariant variant = productVariantRepository
	                    .findById(variantDTO.getVariantId())
	                    .orElseThrow(() -> new RuntimeException("Variant not found"));

	            variant.setSize(size);

	            variant.setColor(color);

	            variant.setPrice(variantDTO.getPrice());

	            variant.setStock(variantDTO.getStock());

	            variant.setSku(variantDTO.getSku());

	            productVariantRepository.save(variant);
	        }

	        // ===== CREATE NEW =====

	        else {

	            ProductVariant newVariant = new ProductVariant();

	            newVariant.setProduct(product);

	            newVariant.setSize(size);

	            newVariant.setColor(color);

	            newVariant.setPrice(variantDTO.getPrice());

	            newVariant.setStock(variantDTO.getStock());

	            newVariant.setSku(variantDTO.getSku());

	            productVariantRepository.save(newVariant);
	        }
	    }

	    return getProductDetail(product.getProductID());
	}
	
	/**
	 * Khóa/Xóa sản phẩm
	 * @param id Mã sản phẩm cần Xóa/Khóa
	 */
	@Transactional
	public void deleteProduct(Integer id) {

	    Product product = productRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Product not found"));

	    product.setIsSelling(false);

	    productRepository.save(product);
	}
	
	/**
	 * Lấy danh sách tất cả size
	 * @return
	 */
	public List<ProductSize> getAllSize(){
		return sizeRepository.findAll();
	}
	
	/**
	 * Lấy danh sách tất cả color
	 * @return
	 */
	public List<ProductColor> getAllColor(){
		return colorRepository.findAll();
	}
}
