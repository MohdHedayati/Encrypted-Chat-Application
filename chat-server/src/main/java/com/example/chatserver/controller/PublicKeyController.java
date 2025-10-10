package com.example.chatserver.controller;

import com.example.chatserver.entity.User;
import com.example.chatserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/keys")
public class PublicKeyController {

    @Autowired
    private UserRepository userRepository;

    //Get public key for a specific user
    //GET /api/keys/{username}

    @GetMapping("/{username}")
    public ResponseEntity<?> getPublicKey(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("username", user.getUsername());
                    response.put("publicKey", user.getPublicKey());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}