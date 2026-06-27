package com.civiceye.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResolutionRecommendation {
    private String suggestedResolution;
    private String estimatedCost;
    private String estimatedCompletionTime;
    private String requiredWorkforce;
}
