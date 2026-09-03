package com.forgiveme.controller;

import com.forgiveme.model.User;
import com.forgiveme.repository.UserRepository;
import com.forgiveme.service.JwtService;
import com.forgiveme.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    public AuthController(UserRepository userRepo, JwtService jwtService, NotificationService notificationService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String name     = body.getOrDefault("name", "").trim();
        String password = body.getOrDefault("password", "").trim();

        if (name.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Name and password are required."));
        }

        User user = userRepo.findByNameIgnoreCase(name).orElse(null);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid name or password. 💔"));
        }

        // If receiver logs in, notify sender
        if ("RECEIVER".equals(user.getRole())) {
            notificationService.notifyReceiverLoggedIn(user.getName());
        }

        String token = jwtService.generateToken(user.getName(), user.getRole());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "name", user.getName(),
                        "role", user.getRole()
                )
        ));
    }
}
