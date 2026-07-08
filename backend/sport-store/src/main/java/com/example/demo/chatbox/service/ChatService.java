package com.example.demo.chatbox.service;

import com.example.demo.chatbox.dto.ChatRequestDTO;
import com.example.demo.chatbox.dto.ChatResponseDTO;

public interface ChatService {
	ChatResponseDTO chat(ChatRequestDTO request);
}
