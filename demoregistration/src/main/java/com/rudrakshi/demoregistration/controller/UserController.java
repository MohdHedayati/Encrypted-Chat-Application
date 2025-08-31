package com.rudrakshi.demoregistration.controller;

import com.rudrakshi.demoregistration.entity.User;
import com.rudrakshi.demoregistration.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user){
        try{
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        }
        catch (Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());

        }
    }


}
