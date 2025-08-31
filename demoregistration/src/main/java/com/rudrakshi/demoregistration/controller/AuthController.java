package com.rudrakshi.demoregistration.controller;

import com.rudrakshi.demoregistration.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager){
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
    try{

        UsernamePasswordAuthenticationToken AuthToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());


            Authentication authentication = authenticationManager.authenticate(AuthToken);
            return ResponseEntity.ok().body("Login successful for user: " + authentication.getName());
    } catch (Exception e) {
        return ResponseEntity.status(401).body("Invalid Username or password");
    }
    }

}
