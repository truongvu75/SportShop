package com.example.demo.chatbox.service;

import com.example.demo.chatbox.dto.AIIntentDTO;

public interface GroqService {

    AIIntentDTO parseIntent(String userMessage);
}