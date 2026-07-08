package com.example.demo.chatbox.service;

import com.example.demo.chatbox.dto.AIIntentDTO;

public interface GeminiService {

    AIIntentDTO parseIntent(String userMessage);
}
