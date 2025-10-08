package com.example.chatserver.controller;

import com.example.chatserver.dto.MessageDTO;
import com.example.chatserver.service.MessageService;
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
    private final MessageService messageService;

    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/private")
    public void sendPrivate(@Payload ChatMessage message) {
        logger.info("Received private message from {} to {}: {}",
                message.getFrom(), message.getTo(), message.getContent());

        try {
            // Save to database
            MessageDTO savedMessage = messageService.saveMessage(
                    message.getFrom(),
                    message.getTo(),
                    message.getContent()
            );
            logger.info("Message saved to database with ID: {}", savedMessage.getId());

            // Send to receiver
            messagingTemplate.convertAndSendToUser(
                    message.getTo(),
                    "/queue/messages",
                    savedMessage
            );

            // Send to sender (for confirmation)
            messagingTemplate.convertAndSendToUser(
                    message.getFrom(),
                    "/queue/messages",
                    savedMessage
            );

            logger.info("Message broadcasted via WebSocket");
        } catch (Exception e) {
            logger.error("Error processing message: {}", e.getMessage(), e);
        }
    }
}