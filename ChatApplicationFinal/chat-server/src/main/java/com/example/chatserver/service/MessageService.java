package com.example.chatserver.service;

import com.example.chatserver.dto.MessageDTO;
import com.example.chatserver.entity.Message;
import com.example.chatserver.entity.User;
import com.example.chatserver.repository.MessageRepository;
import com.example.chatserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MessageDTO saveMessage(String senderUsername, String receiverUsername, String content) {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found: " + senderUsername));

        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found: " + receiverUsername));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);

        return convertToDTO(savedMessage);
    }

    public List<MessageDTO> getConversation(String username1, String username2) {
        User user1 = userRepository.findByUsername(username1)
                .orElseThrow(() -> new RuntimeException("User not found: " + username1));

        User user2 = userRepository.findByUsername(username2)
                .orElseThrow(() -> new RuntimeException("User not found: " + username2));

        List<Message> messages = messageRepository.findConversationBetweenUsers(user1.getId(), user2.getId());

        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MessageDTO convertToDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .from(message.getSender().getUsername())
                .to(message.getReceiver().getUsername())
                .content(message.getContent())
                .timestamp(message.getCreatedAt())
                .isRead(message.getIsRead())
                .build();
    }
}