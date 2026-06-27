package com.civiceye.backend.controller;

import com.civiceye.backend.model.Issue;
import com.civiceye.backend.service.GeminiService;
import com.civiceye.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/copilot")
public class CopilotController {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private IssueService issueService;

    @PostMapping
    public ResponseEntity<?> promptCopilot(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }

        if (history == null) {
            history = new ArrayList<>();
        }

        List<Issue> activeIssues = issueService.getAllIssues();
        String advice = geminiService.generateCopilotAdvisory(message, history, activeIssues);

        return ResponseEntity.ok(Map.of("reply", advice));
    }
}
