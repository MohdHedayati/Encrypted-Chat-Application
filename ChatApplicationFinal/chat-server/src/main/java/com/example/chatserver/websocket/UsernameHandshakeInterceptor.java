package com.example.chatserver.websocket;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.security.Principal;
import java.util.Map;

public class UsernameHandshakeInterceptor implements HandshakeInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(UsernameHandshakeInterceptor.class);

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        // Get authenticated user from HTTP session (set by Spring Security)
        Principal principal = request.getPrincipal();

        if (principal != null) {
            String username = principal.getName();
            logger.info("HandshakeInterceptor: Authenticated user connecting: {}", username);
            attributes.put("username", username);
            return true;  // Allow connection
        } else {
            logger.warn("HandshakeInterceptor: Unauthenticated user attempted to connect. Rejecting.");
            return false;  // Reject connection if not authenticated
        }
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception ex) {
        // No action needed
    }

    public static class UsernameHandshakeHandler extends DefaultHandshakeHandler {
        private static final Logger logger = LoggerFactory.getLogger(UsernameHandshakeHandler.class);

        @Override
        protected Principal determineUser(
                ServerHttpRequest request,
                WebSocketHandler wsHandler,
                Map<String, Object> attributes) {

            String username = (String) attributes.get("username");
            logger.info("HandshakeHandler: Determining Principal for username: {}", username);

            if (username == null) {
                logger.warn("HandshakeHandler: No username found in attributes.");
                return null;
            }

            return () -> username;
        }
    }
}