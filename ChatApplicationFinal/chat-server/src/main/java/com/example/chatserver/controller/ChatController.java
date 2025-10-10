package com.example.chatserver.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/private")
    public void sendPrivate(@Payload ChatMessage message, Principal principal) {
        if (principal == null) {
            logger.error("Unauthenticated message attempt");
            return;
        }

        String actualSender = principal.getName();
        message.setFrom(actualSender);  // Force correct sender

        logger.info("Routing encrypted message from {} to {}: {}", actualSender, message.getTo(), message.getTo());

        messagingTemplate.convertAndSendToUser(
                message.getTo(),
                "/queue/messages",
                message
        );
    }
}
