package com.forgiveme.controller;

import com.forgiveme.model.ApologyStatus;
import com.forgiveme.repository.ApologyStatusRepository;
import com.forgiveme.service.JwtService;
import com.forgiveme.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/apology")
public class ApologyController {

    private final ApologyStatusRepository apologyRepo;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    public ApologyController(ApologyStatusRepository apologyRepo, JwtService jwtService, NotificationService notificationService) {
        this.apologyRepo = apologyRepo;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }


    @GetMapping("/status")
    public ResponseEntity<ApologyStatus> getStatus(
            @RequestHeader("Authorization") String authHeader) {
        validateToken(authHeader);
        List<ApologyStatus> statuses = apologyRepo.findAll();
        if (statuses.isEmpty()) {
            ApologyStatus s = apologyRepo.save(new ApologyStatus(null, "WAITING"));
            return ResponseEntity.ok(s);
        }
        return ResponseEntity.ok(statuses.get(0));
    }

    @PostMapping("/status")
    public ResponseEntity<ApologyStatus> updateStatus(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {

        String name      = extractName(authHeader);
        String role      = extractRole(authHeader);
        String newStatus = body.getOrDefault("status", "").toUpperCase();

        if (!List.of("WAITING", "SEEN", "ACCEPTED").contains(newStatus)) {
            return ResponseEntity.badRequest().build();
        }

        List<ApologyStatus> statuses = apologyRepo.findAll();
        ApologyStatus apologyStatus;
        if (statuses.isEmpty()) {
            apologyStatus = new ApologyStatus(null, newStatus);
        } else {
            apologyStatus = statuses.get(0);
            apologyStatus.setStatus(newStatus);
        }
        apologyRepo.save(apologyStatus);

        // Fire notification when receiver accepts
        if ("ACCEPTED".equals(newStatus) && "RECEIVER".equals(role)) {
            notificationService.notifyApologyAccepted(name);
        }

        return ResponseEntity.ok(apologyStatus);
    }

    // ---- Helpers ----
    private void validateToken(String authHeader) {
        jwtService.parseToken(authHeader.replace("Bearer ", ""));
    }

    private String extractName(String authHeader) {
        return jwtService.extractName(authHeader.replace("Bearer ", ""));
    }

    private String extractRole(String authHeader) {
        return jwtService.extractRole(authHeader.replace("Bearer ", ""));
    }
}
