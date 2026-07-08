package com.example.demo.chatbox.dto;

import lombok.Data;

@Data
public class ChatRequestDTO {

    private String message;

    private Integer customerId;
}
