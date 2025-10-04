package com.example.chatserver.controller;

import com.example.chatserver.service.ActiveUserRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final ActiveUserRegistry activeUserRegistry;

    public UserController(ActiveUserRegistry activeUserRegistry) {
        this.activeUserRegistry = activeUserRegistry;
    }

    @GetMapping("/users/online")
    public List<String> getOnlineUsers() {
        return activeUserRegistry.getAllUsers()
                .stream()
                .toList();
    }
}
