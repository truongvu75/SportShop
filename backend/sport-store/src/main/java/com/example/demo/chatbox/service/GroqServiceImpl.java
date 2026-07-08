package com.example.demo.chatbox.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.chatbox.dto.AIIntentDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GroqServiceImpl implements GroqService {

	@Value("${groq.api.key}")
	private String apiKey;

	private final RestTemplate restTemplate = new RestTemplate();

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public AIIntentDTO parseIntent(String userMessage) {

		try {

			String prompt = buildPrompt(userMessage);

			String rawText = callGroq(prompt);

			System.out.println("RAW GROQ:");
			System.out.println(rawText);

			rawText = cleanJson(rawText);

			System.out.println("AFTER CLEAN:");
			System.out.println(rawText);

			return objectMapper.readValue(rawText, AIIntentDTO.class);

		} catch (Exception e) {

			e.printStackTrace();

			AIIntentDTO unknown = new AIIntentDTO();

			unknown.setIntent("UNKNOWN");

			return unknown;
		}
	}

	private String buildPrompt(String userMessage) {

		return """
				You are an AI shopping assistant.

				Analyze the user message.

				Return ONLY valid JSON.

				Available intents:
				- SEARCH_PRODUCT
				- BEST_SELLER
				- RECOMMEND_PRODUCT
				- UNKNOWN

				Extract:
				- intent
				- searchValue
				- brand
				- category
				- minPrice
				- maxPrice

				IMPORTANT RULES:

				- brand is manufacturer name
				- category is product type
				- searchValue is only extra keyword
				- price must be number only
				- return JSON only
				- no explanation
				- no markdown

				EXAMPLES:

				User:
				"Cho tôi tất hãng Puma"

				Output:
				{
				  "intent":"SEARCH_PRODUCT",
				  "brand":"Puma",
				  "category":"tất"
				}

				User:
				"Tìm giày Nike dưới 2 triệu"

				Output:
				{
				  "intent":"SEARCH_PRODUCT",
				  "brand":"Nike",
				  "category":"giày",
				  "maxPrice":2000000
				}

				User:
				"Cho tôi áo Adidas"

				Output:
				{
				  "intent":"SEARCH_PRODUCT",
				  "brand":"Adidas",
				  "category":"áo"
				}
				
				User:
				"Tất bán chạy nhất"
				
				Output:
				{
				  "intent":"BEST_SELLER",
				  "category":"tất"
				}
				
				User:
				"Giày Nike bán chạy"
				
				Output:
				{
				  "intent":"BEST_SELLER",
				  "brand":"Nike",
				  "category":"giày"
				}

				User message:
				"%s"
				""".formatted(userMessage);
	}

	private String callGroq(String prompt) throws Exception {

		String url = "https://api.groq.com/openai/v1/chat/completions";

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.APPLICATION_JSON);

		headers.setBearerAuth(apiKey);

		Map<String, Object> requestBody = new HashMap<>();

		requestBody.put("model", "llama-3.3-70b-versatile");

		requestBody.put("temperature", 0);

		List<Map<String, String>> messages = List.of(
				Map.of("role", "system", "content", "You are an AI shopping assistant."),
				Map.of("role", "user", "content", prompt));

		requestBody.put("messages", messages);

		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

		ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

		JsonNode root = objectMapper.readTree(response.getBody());

		return root.get("choices").get(0).get("message").get("content").asText();
	}

	private String cleanJson(String text) {

		return text.replace("```json", "").replace("```", "").trim();
	}
}