package com.example.demo.chatbox.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.demo.chatbox.dto.AIIntentDTO;
import com.example.demo.chatbox.dto.ChatProductDTO;
import com.example.demo.chatbox.dto.ChatRequestDTO;
import com.example.demo.chatbox.dto.ChatResponseDTO;
import com.example.demo.chatbox.mapper.ChatMapper;
import com.example.demo.dto.request.ProductSearchDTO;
import com.example.demo.model.Product;
import com.example.demo.repository.BrandRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.specification.ProductSpecification;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {

	private final CategoryRepository categoryRepository;

	private final BrandRepository brandRepository;

	private final GeminiService geminiService;

	private final GroqService groqService;

	private final ChatMapper chatMapper;

	private final ProductRepository productRepository;

	@Override
	public ChatResponseDTO chat(ChatRequestDTO request) {

		AIIntentDTO intent = groqService.parseIntent(request.getMessage());
//		AIIntentDTO intent = geminiService.parseIntent(request.getMessage());

		System.out.println(intent);
		switch (intent.getIntent()) {

		case "SEARCH_PRODUCT":
			return searchProduct(intent);

		case "BEST_SELLER":
			return bestSeller(intent);

		case "RECOMMEND_PRODUCT":
			return recommend();

		default:
			return new ChatResponseDTO("Xin lỗi, tôi chưa hiểu yêu cầu của bạn.", List.of());
		}
	}

	private ChatResponseDTO searchProduct(AIIntentDTO intent) {

		ProductSearchDTO searchDTO = chatMapper.toSearchDTO(intent);

		List<Product> products = productRepository.findAll(ProductSpecification.filterProducts(searchDTO));

		List<ChatProductDTO> result = products.stream().map(chatMapper::toChatProductDTO).toList();

		return new ChatResponseDTO("Tôi tìm thấy " + result.size() + " sản phẩm phù hợp.", result);
	}

	private ChatResponseDTO bestSeller(AIIntentDTO intent) {

		ProductSearchDTO searchDTO = chatMapper.toSearchDTO(intent);

		// Kiểm tra null trước khi lấy intValue, nếu null thì giữ nguyên null
		Integer brandId = searchDTO.getBrandId() != null ? searchDTO.getBrandId().intValue() : null;
		Integer categoryId = searchDTO.getCategoryId() != null ? searchDTO.getCategoryId().intValue() : null;

		List<Product> products = productRepository.findTopSellingProducts(brandId, categoryId, PageRequest.of(0, 5));

		List<ChatProductDTO> result = products.stream().map(chatMapper::toChatProductDTO).toList();

		return new ChatResponseDTO("Đây là các sản phẩm bán chạy nhất.", result);
	}

	private ChatResponseDTO recommend() {

		return new ChatResponseDTO("Chức năng đang phát triển.", List.of());
	}
}