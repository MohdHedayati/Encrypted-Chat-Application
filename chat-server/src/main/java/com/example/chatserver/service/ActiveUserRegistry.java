package com.example.chatserver.service;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ActiveUserRegistry {
    private final Map<String, String> userSessions = new ConcurrentHashMap<>();

    public void addUser(String sessionId, String username) {
        userSessions.put(sessionId, username);
    }

    public void removeUser(String sessionId) {
        userSessions.remove(sessionId);
    }

    public Map<String, String> getAllUsers() {
        return Collections.unmodifiableMap(userSessions);
    }
}
