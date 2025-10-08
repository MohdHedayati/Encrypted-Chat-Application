package com.example.chatserver.controller;

import com.example.chatserver.dto.MessageDTO;
import com.example.chatserver.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/conversation/{otherUsername}")
    public ResponseEntity<?> getConversation(
            @PathVariable String otherUsername,
            Authentication authentication) {

        try {
            String currentUsername = authentication.getName();
            List<MessageDTO> messages = messageService.getConversation(currentUsername, otherUsername);

            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching messages: " + e.getMessage());
        }
    }
}