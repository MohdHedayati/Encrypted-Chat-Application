package com.example.chatserver.controller;

import com.example.chatserver.service.ActiveUserRegistry;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ActiveUserRegistry activeUserRegistry;

    public ChatController(SimpMessagingTemplate messagingTemplate, ActiveUserRegistry activeUserRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.activeUserRegistry = activeUserRegistry;
    }

    // private message: client sends {to, from, content}
    @MessageMapping("/private")
    public void sendPrivate(@Payload ChatMessage message) {
        messagingTemplate.convertAndSendToUser(
                message.getTo(), "/queue/messages", message
        );
    }
}
