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
public class ImpactAssessment {
    private String riskLevel; // "Critical", "High", "Medium", "Low"
    private int accidentProbability; // 0 - 100
    private String environmentalImpact;
    private int populationAffected;
    private List<String> nearbyFacilities;
    private String explanation;
}
