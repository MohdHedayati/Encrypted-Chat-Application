package com.example.chatserver.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserSessionHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, String> userSessions = new ConcurrentHashMap<>();

    public UserSessionHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void addUser(String username, String sessionId) {
        userSessions.put(username, sessionId);
        broadcastUsers();
    }

    public void removeUser(String username) {
        userSessions.remove(username);
        broadcastUsers();
    }

    public Map<String, String> getOnlineUsers() {
        return userSessions;
    }

    private void broadcastUsers() {
        messagingTemplate.convertAndSend("/topic/users", userSessions.keySet());
    }
}
