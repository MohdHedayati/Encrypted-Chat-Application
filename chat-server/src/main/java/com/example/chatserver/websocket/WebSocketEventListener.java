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
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Set;

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
        String username = sha.getUser() != null ? sha.getUser().getName() : null;
        String sessionId = sha.getSessionId();

        logger.info("SessionConnectEvent: username={}, sessionId={}, Principal={}", username, sessionId, sha.getUser());

        // On connect, we just add the user to our registry.
        if (username != null && sessionId != null) {
            activeUserRegistry.addUser(username, sessionId);
            logger.info("User connected and added to registry: {} (session: {})", username, sessionId);
        }
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String destination = sha.getDestination();

        // When a user subscribes to the user list, we know they are ready.
        // Now we can safely broadcast the full, updated user list to everyone.
        if ("/topic/users".equals(destination)) {
            logger.info("User subscribed to /topic/users. Broadcasting full user list.");
            broadcastUserList();
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = sha.getSessionId();

        logger.info("SessionDisconnectEvent: sessionId={}", sessionId);

        // Find the user by session ID and remove them.
        String username = activeUserRegistry.removeUserBySessionId(sessionId);

        if (username != null) {
            logger.info("User disconnected: {} (session: {})", username, sessionId);
            // Broadcast the new list after a user disconnects.
            broadcastUserList();
        }
    }

    private void broadcastUserList() {
        Set<String> users = activeUserRegistry.getAllUsers();
        messagingTemplate.convertAndSend("/topic/users", users);
        logger.info("Broadcasting user list to /topic/users: {}", users);
    }
}