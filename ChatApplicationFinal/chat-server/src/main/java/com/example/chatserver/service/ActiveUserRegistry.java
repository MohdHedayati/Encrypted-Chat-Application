package com.example.chatserver.service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ActiveUserRegistry {
    // Stores username -> sessionId
    private final ConcurrentHashMap<String, String> users = new ConcurrentHashMap<>();
    // Stores sessionId -> username for quick lookup on disconnect
    private final ConcurrentHashMap<String, String> sessionToUser = new ConcurrentHashMap<>();

    public void addUser(String username, String sessionId) {
        users.put(username, sessionId);
        sessionToUser.put(sessionId, username);
    }

    public String removeUserBySessionId(String sessionId) {
        String username = sessionToUser.remove(sessionId);
        if (username != null) {
            users.remove(username);
        }
        return username;
    }

    public Set<String> getAllUsers() {
        return users.keySet();
    }
}

