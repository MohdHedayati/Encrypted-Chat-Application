package com.example.chatserver.controller;

public class ChatMessage {
    private String from;
    private String to;


    private String encryptedContent;     // Base64 encoded encrypted message
    private String encryptedAESKey;      // Base64 encoded wrapped aes key
    private String iv;                   // Base64 encoded initialization vector

    public ChatMessage() {}

    public ChatMessage(String from, String to, String encryptedContent, String encryptedAESKey, String iv) {
        this.from = from;
        this.to = to;
        this.encryptedContent = encryptedContent;
        this.encryptedAESKey = encryptedAESKey;
        this.iv = iv;
    }

    // Getters and Setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getEncryptedContent() { return encryptedContent; }
    public void setEncryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; }

    public String getEncryptedAESKey() { return encryptedAESKey; }
    public void setEncryptedAESKey(String encryptedAESKey) { this.encryptedAESKey = encryptedAESKey; }

    public String getIv() { return iv; }
    public void setIv(String iv) { this.iv = iv; }
}