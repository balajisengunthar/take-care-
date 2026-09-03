package com.forgiveme.controller;

import com.forgiveme.model.Message;
import com.forgiveme.repository.MessageRepository;
import com.forgiveme.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final MessageRepository messageRepo;
    private final JwtService jwtService;

    public ChatController(MessageRepository messageRepo, JwtService jwtService) {
        this.messageRepo = messageRepo;
        this.jwtService = jwtService;
    }


    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(
            @RequestHeader("Authorization") String authHeader) {
        validateToken(authHeader);
        return ResponseEntity.ok(messageRepo.findAllByOrderBySentAtAsc());
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {

        String name    = extractName(authHeader);
        String content = body.getOrDefault("content", "").trim();

        if (content.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (content.length() > 500) {
            return ResponseEntity.badRequest().build();
        }

        Message msg = new Message();
        msg.setSenderName(name);
        msg.setContent(content);
        return ResponseEntity.ok(messageRepo.save(msg));
    }

    // ---- Helpers ----

    private void validateToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        jwtService.parseToken(token); // throws if invalid
    }

    private String extractName(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtService.extractName(token);
    }
}
