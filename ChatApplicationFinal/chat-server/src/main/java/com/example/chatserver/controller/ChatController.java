package com.example.chatserver.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/private")
    public void sendPrivate(@Payload ChatMessage message) {
        logger.info("Received private message from {} to {}: {}", message.getFrom(), message.getTo(), message.getContent());
        messagingTemplate.convertAndSendToUser(
                message.getTo(), "/queue/messages", message
        );
        logger.info("Sent message to user destination: /user/{}/queue/messages", message.getTo());
    }
}
