package com.example.chatserver.websocket;

import com.example.chatserver.service.ActiveUserRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final ActiveUserRegistry activeUserRegistry;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketEventListener(ActiveUserRegistry activeUserRegistry, SimpMessagingTemplate messagingTemplate) {
        this.activeUserRegistry = activeUserRegistry;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String username = sha.getFirstNativeHeader("username");
        String sessionId = sha.getSessionId();

        if (username != null) {
            activeUserRegistry.addUser(sessionId, username);
            logger.info("User connected: {} (session: {})", username, sessionId);
            // Broadcast updated user list
            messagingTemplate.convertAndSend("/topic/users", activeUserRegistry.getAllUsers().values());
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = StompHeaderAccessor.wrap(event.getMessage()).getSessionId();
        activeUserRegistry.removeUser(sessionId);
        logger.info("User disconnected (session: {})", sessionId);
        // Broadcast updated user list
        messagingTemplate.convertAndSend("/topic/users", activeUserRegistry.getAllUsers().values());
    }
}
