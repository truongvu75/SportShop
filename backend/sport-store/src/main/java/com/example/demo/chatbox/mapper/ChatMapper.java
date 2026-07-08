package com.example.demo.chatbox.mapper;

import org.springframework.stereotype.Component;

import com.example.demo.chatbox.dto.AIIntentDTO;
import com.example.demo.chatbox.dto.ChatProductDTO;
import com.example.demo.dto.request.ProductSearchDTO;
import com.example.demo.model.Product;
import com.example.demo.repository.BrandRepository;
import com.example.demo.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ChatMapper {

	private final BrandRepository brandRepository;

	private final CategoryRepository categoryRepository;

	public ProductSearchDTO toSearchDTO(AIIntentDTO intent) {

		ProductSearchDTO dto = new ProductSearchDTO();

		// map brand name -> brandId
		if (intent.getBrand() != null) {
			String brandName = intent.getBrand().trim();
			brandRepository.findByBrandNameIgnoreCase(brandName)
					.ifPresent(brand -> dto.setBrandId(brand.getBrandID().longValue()));
		}

		// category
		if (intent.getCategory() != null) {
			String categoryName = intent.getCategory().trim();
			categoryRepository.findByCategoryNameIgnoreCase(categoryName)
					.ifPresent(category -> dto.setCategoryId(category.getCategoryID().longValue()));
		}
		dto.setSearchValue(intent.getSearchValue());

		dto.setMinPrice(intent.getMinPrice());

		dto.setMaxPrice(intent.getMaxPrice());

		return dto;
	}

	public ChatProductDTO toChatProductDTO(Product product) {

		return new ChatProductDTO(product.getProductID(), product.getProductName(), product.getBasePrice(),
				product.getPhoto(), product.getBrand().getBrandName(), product.getCategory().getCategoryName());
	}
}