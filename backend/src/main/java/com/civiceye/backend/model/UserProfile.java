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
public class UserProfile {
    private String email;
    private String name;
    private String role; // "citizen" | "authority" | "admin"
    private String avatar;
    private int rewardPoints;
    private List<String> achievements;
}
// 
