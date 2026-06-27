package com.civiceye.backend.controller;

import com.civiceye.backend.model.UserProfile;
import com.civiceye.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IssueService issueService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        String normalizedEmail = email.toLowerCase().trim();
        Optional<UserProfile> existingUser = issueService.getUserByEmail(normalizedEmail);
        
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(existingUser.get());
        }

        // Auto-create citizen profile if not registered
        String displayName = normalizedEmail.split("@")[0]
                .replace(".", " ")
                .replace("_", " ");
        // Titlecase name
        StringBuilder nameBuilder = new StringBuilder();
        for (String word : displayName.split(" ")) {
            if (!word.isEmpty()) {
                nameBuilder.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }
        String finalName = nameBuilder.toString().trim();
        if (finalName.isEmpty()) {
            finalName = "Citizen";
        }

        UserProfile newUser = UserProfile.builder()
                .email(normalizedEmail)
                .name(finalName)
                .role("citizen")
                .avatar(String.format("https://images.unsplash.com/photo-%d?auto=format&fit=crop&w=150&q=80",
                        1500000000000L + new Random().nextInt(1000000)))
                .rewardPoints(10)
                .achievements(List.of("Active Citizen"))
                .build();

        issueService.saveUser(newUser);
        return ResponseEntity.ok(newUser);
    }
}
