package com.civiceye.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Verification {
    private String citizenEmail;
    private String type; // "confirm" or "reject"
    private String comment;
    private String timestamp;
}
