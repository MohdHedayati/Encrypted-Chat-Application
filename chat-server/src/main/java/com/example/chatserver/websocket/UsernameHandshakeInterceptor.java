package com.example.chatserver.websocket;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.http.server.ServletServerHttpRequest;

import java.security.Principal;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UsernameHandshakeInterceptor implements HandshakeInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(UsernameHandshakeInterceptor.class);

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        String username = request.getHeaders().getFirst("username");
        // Try to get username from query string if not in headers
        if ((username == null || username.isEmpty()) && request instanceof ServletServerHttpRequest) {
            String query = ((ServletServerHttpRequest) request).getServletRequest().getQueryString();
            if (query != null) {
                for (String param : query.split("&")) {
                    String[] kv = param.split("=");
                    if (kv.length == 2 && kv[0].equals("username")) {
                        username = java.net.URLDecoder.decode(kv[1], java.nio.charset.StandardCharsets.UTF_8);
                        break;
                    }
                }
            }
        }
        logger.info("HandshakeInterceptor: Received username: {}", username);
        if (username != null && !username.isEmpty()) {
            attributes.put("username", username);
            logger.info("HandshakeInterceptor: Username attribute set: {}", username);
        } else {
            logger.warn("HandshakeInterceptor: No username provided in handshake.");
        }
        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception ex) {
        // No action needed after handshake
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
                logger.warn("HandshakeHandler: No username found in attributes. Falling back to default Principal.");
                return super.determineUser(request, wsHandler, attributes);
            }
            // Return a Principal object with the username
            return () -> username;
        }
    }
}
