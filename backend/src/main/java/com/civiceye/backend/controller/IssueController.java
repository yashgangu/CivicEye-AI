package com.civiceye.backend.controller;

import com.civiceye.backend.model.*;
import com.civiceye.backend.service.GeminiService;
import com.civiceye.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private GeminiService geminiService;

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @PostMapping("/analyze-and-check")
    public ResponseEntity<?> analyzeAndCheck(@RequestBody Map<String, Object> request) {
        String imageUrl = (String) request.get("imageUrl");
        String description = (String) request.get("description");
        Boolean forceSubmit = (Boolean) request.get("forceSubmit");
        
        Map<String, Object> gpsMap = (Map<String, Object>) request.get("gps");
        if (gpsMap == null || gpsMap.get("lat") == null || gpsMap.get("lng") == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "GPS location is required."));
        }

        GPSLocation gps = GPSLocation.builder()
                .lat(Double.parseDouble(gpsMap.get("lat").toString()))
                .lng(Double.parseDouble(gpsMap.get("lng").toString()))
                .address((String) gpsMap.get("address"))
                .build();

        // 1. Geofenced Duplication detection (threshold = 200m)
        if (forceSubmit == null || !forceSubmit) {
            double thresholdMeters = 200.0;
            List<Issue> activeIssues = issueService.getAllIssues();
            for (Issue existing : activeIssues) {
                if (!"Resolved".equalsIgnoreCase(existing.getStatus())) {
                    double dist = issueService.getDistanceMeters(
                            gps.getLat(), gps.getLng(),
                            existing.getGps().getLat(), existing.getGps().getLng()
                    );
                    if (dist <= thresholdMeters) {
                        return ResponseEntity.ok(Map.of(
                                "duplicateDetected", true,
                                "existingIssue", existing,
                                "distance", Math.round(dist)
                        ));
                    }
                }
            }
        }

        // 2. Perform Intelligent AI analysis
        Map<String, Object> aiResult = geminiService.analyzeIssue(imageUrl, description, gps);
        return ResponseEntity.ok(aiResult);
    }

    @PostMapping("/submit")
    public ResponseEntity<Issue> submitIssue(@RequestBody Issue issue) {
        issue.setId(UUID.randomUUID().toString());
        issue.setStatus("Reported");
        issue.setVerificationCount(0);
        issue.setRejectionCount(0);
        issue.setVerifications(new ArrayList<>());
        issue.setCreatedAt(Instant.now().toString());

        // Recalculate priority details
        issueService.recalculatePriority(issue);
        issueService.saveIssue(issue);

        // Award Reporter points
        Optional<UserProfile> reporter = issueService.getUserByEmail(issue.getReporterEmail());
        if (reporter.isPresent()) {
            UserProfile user = reporter.get();
            user.setRewardPoints(user.getRewardPoints() + 15);
            if (!user.getAchievements().contains("Community Guard")) {
                user.getAchievements().add("Community Guard");
            }
            issueService.saveUser(user);
        }

        return ResponseEntity.ok(issue);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyIssue(@RequestBody Map<String, String> request) {
        String issueId = request.get("issueId");
        String citizenEmail = request.get("citizenEmail");
        String type = request.get("type"); // "confirm" or "reject"
        String comment = request.get("comment");

        if (issueId == null || citizenEmail == null || type == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing parameters"));
        }

        Optional<Issue> optionalIssue = issueService.getIssueById(issueId);
        if (optionalIssue.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = optionalIssue.get();
        if (issue.getVerifications() == null) {
            issue.setVerifications(new ArrayList<>());
        }

        // Limit one vote per citizen
        boolean alreadyVoted = issue.getVerifications().stream()
                .anyMatch(v -> v.getCitizenEmail().equalsIgnoreCase(citizenEmail));
        if (alreadyVoted) {
            return ResponseEntity.badRequest().body(Map.of("error", "You have already voted on this municipal audit."));
        }

        Verification verification = Verification.builder()
                .citizenEmail(citizenEmail.toLowerCase())
                .type(type)
                .comment(comment)
                .timestamp(Instant.now().toString())
                .build();

        issue.getVerifications().add(verification);
        if ("confirm".equalsIgnoreCase(type)) {
            issue.setVerificationCount(issue.getVerificationCount() + 1);
        } else {
            issue.setRejectionCount(issue.getRejectionCount() + 1);
        }

        issueService.recalculatePriority(issue);
        issueService.saveIssue(issue);

        // Award points to verifier
        Optional<UserProfile> verifier = issueService.getUserByEmail(citizenEmail);
        if (verifier.isPresent()) {
            UserProfile user = verifier.get();
            user.setRewardPoints(user.getRewardPoints() + 5);
            if (!user.getAchievements().contains("Trust Verifier")) {
                user.getAchievements().add("Trust Verifier");
            }
            issueService.saveUser(user);
        }

        return ResponseEntity.ok(issue);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinIssue(@RequestBody Map<String, String> request) {
        String issueId = request.get("issueId");
        String citizenEmail = request.get("citizenEmail");
        String citizenName = request.get("citizenName");

        if (issueId == null || citizenEmail == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing parameters"));
        }

        Optional<Issue> optionalIssue = issueService.getIssueById(issueId);
        if (optionalIssue.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = optionalIssue.get();
        if (issue.getVerifications() == null) {
            issue.setVerifications(new ArrayList<>());
        }

        // Prevent duplication
        boolean alreadyJoined = issue.getVerifications().stream()
                .anyMatch(v -> v.getCitizenEmail().equalsIgnoreCase(citizenEmail));
        if (alreadyJoined) {
            return ResponseEntity.ok(issue);
        }

        Verification verification = Verification.builder()
                .citizenEmail(citizenEmail.toLowerCase())
                .type("confirm")
                .comment("Joined report tracker - affected by this community hazard.")
                .timestamp(Instant.now().toString())
                .build();

        issue.getVerifications().add(verification);
        issue.setVerificationCount(issue.getVerificationCount() + 1);
        issueService.recalculatePriority(issue);
        issueService.saveIssue(issue);

        // Award points
        Optional<UserProfile> participant = issueService.getUserByEmail(citizenEmail);
        if (participant.isPresent()) {
            UserProfile user = participant.get();
            user.setRewardPoints(user.getRewardPoints() + 10);
            issueService.saveUser(user);
        }

        return ResponseEntity.ok(issue);
    }

    @PostMapping("/resolve")
    public ResponseEntity<?> resolveIssue(@RequestBody Map<String, String> request) {
        String issueId = request.get("issueId");
        String resolvedNotes = request.get("resolvedNotes");
        String resolvedImageUrl = request.get("resolvedImageUrl");
        String officerEmail = request.get("officerEmail");

        if (issueId == null || resolvedNotes == null || resolvedImageUrl == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Resolution details are required."));
        }

        Optional<Issue> optionalIssue = issueService.getIssueById(issueId);
        if (optionalIssue.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = optionalIssue.get();
        issue.setStatus("Resolved");
        issue.setResolvedNotes(resolvedNotes);
        issue.setResolvedImageUrl(resolvedImageUrl);
        issue.setResolvedAt(Instant.now().toString());

        try {
            Instant start = Instant.parse(issue.getCreatedAt());
            long days = ChronoUnit.DAYS.between(start, Instant.now());
            issue.setResolutionTimeDays((int) Math.max(1, days));
        } catch (Exception e) {
            issue.setResolutionTimeDays(1);
        }

        issueService.saveIssue(issue);
        return ResponseEntity.ok(issue);
    }

    @PostMapping("/rate")
    public ResponseEntity<?> rateIssue(@RequestBody Map<String, Object> request) {
        String issueId = (String) request.get("issueId");
        Integer score = (Integer) request.get("score");

        if (issueId == null || score == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing rating parameters"));
        }

        Optional<Issue> optionalIssue = issueService.getIssueById(issueId);
        if (optionalIssue.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = optionalIssue.get();
        issue.setCitizenSatisfactionScore(score);
        issueService.saveIssue(issue);

        return ResponseEntity.ok(issue);
    }
}
