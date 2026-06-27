package com.civiceye.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Issue {
    private String id;
    private String title;
    private String description;
    private String category;
    private String severity; // "Critical" | "High" | "Medium" | "Low"
    private int confidenceScore;
    private String department;
    private String status; // "Reported" | "In Progress" | "Resolved"
    private String imageUrl;
    private String resolvedImageUrl;
    private String resolvedNotes;
    private String resolvedAt;
    private Integer resolutionTimeDays;
    private GPSLocation gps;
    private String reporterEmail;
    private String reporterName;
    private int verificationCount;
    private int rejectionCount;
    private List<Verification> verifications;
    private ImpactAssessment impact;
    private int priorityScore;
    private String priorityReason;
    private ResolutionRecommendation resolution;
    private String createdAt;
    private Integer citizenSatisfactionScore;
}
