package com.example.demo.chatbox.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.chatbox.dto.AIIntentDTO;
import com.example.demo.chatbox.gemini.GeminiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiServiceImpl implements GeminiService {

	@Value("${gemini.api.key}")
	private String apiKey;

	private final RestTemplate restTemplate = new RestTemplate();

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public AIIntentDTO parseIntent(String userMessage) {

		try {

			String prompt = buildPrompt(userMessage);

			String rawText = callGemini(prompt);
			System.out.println("RAW GEMINI:");
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
				- minPrice
				- maxPrice

				Rules:
				- Return JSON only
				- No explanation
				- No markdown
				- No ```json

				Example:

				User:
				"Tìm giày Nike dưới 2 triệu"

				Output:
				{
				  "intent":"SEARCH_PRODUCT",
				  "searchValue":"giày",
				  "brand":"Nike",
				  "maxPrice":2000000
				}

				User message:
				"%s"
				""".formatted(userMessage);
	}

	private String callGemini(String prompt) throws Exception {

		String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
				+ apiKey;

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.APPLICATION_JSON);

		String requestBody = """
				{
				  "contents": [
				    {
				      "parts": [
				        {
				          "text": "%s"
				        }
				      ]
				    }
				  ]
				}
				""".formatted(prompt.replace("\"", "\\\""));

		HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

		ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

		GeminiResponse geminiResponse = objectMapper.readValue(response.getBody(), GeminiResponse.class);

		return geminiResponse.getCandidates().get(0).getContent().getParts().get(0).getText();
	}

	private String cleanJson(String text) {

		return text.replace("```json", "").replace("```", "").trim();
	}
}