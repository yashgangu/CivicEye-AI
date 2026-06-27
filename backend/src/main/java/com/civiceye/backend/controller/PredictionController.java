package com.civiceye.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    @GetMapping
    public ResponseEntity<?> getRiskPredictions() {
        // High fidelity AI risk analytics simulation
        List<Map<String, Object>> predictions = new ArrayList<>();

        Map<String, Object> p1 = new HashMap<>();
        p1.put("id", "pred-101");
        p1.put("title", "Asphalt Fatigue & Subsidence Warning");
        p1.put("category", "Pothole");
        p1.put("riskIndex", 88);
        p1.put("reason", "Correlating historical high temperature spikes with heavy ward bus frequency. Intersections here show a 14% soil shear increase, indicating immediate pothole formation risk.");
        p1.put("targetDate", Instant.now().plus(14, ChronoUnit.DAYS).toString());
        p1.put("gps", Map.of(
            "lat", 37.7749,
            "lng", -122.4194,
            "address", "450 Mission Street, Ward 2"
        ));
        predictions.add(p1);

        Map<String, Object> p2 = new HashMap<>();
        p2.put("id", "pred-102");
        p2.put("title", "High-Stress Mainline Joint Leaking Forecast");
        p2.put("category", "Water Leakage");
        p2.put("riskIndex", 82);
        p2.put("reason", "Water pressure sensor arrays indicated a persistent 4-bar surge loop during peak evening hours. Coupled with 40-year old cast iron piping, we expect joint failure within 21 days.");
        p2.put("targetDate", Instant.now().plus(21, ChronoUnit.DAYS).toString());
        p2.put("gps", Map.of(
            "lat", 37.7833,
            "lng", -122.4167,
            "address", "Corner of O'Farrell & Taylor, Ward 4"
        ));
        predictions.add(p2);

        Map<String, Object> p3 = new HashMap<>();
        p3.put("id", "pred-103");
        p3.put("title", "Photo-Sensor Array Twilight Failure Risk");
        p3.put("category", "Broken Streetlight");
        p3.put("riskIndex", 71);
        p3.put("reason", "Twilight automatic brightness relays on these nodes have logged intermittent shutoff delays of up to 45 minutes, forecasting physical relay burnout.");
        p3.put("targetDate", Instant.now().plus(28, ChronoUnit.DAYS).toString());
        p3.put("gps", Map.of(
            "lat", 37.7699,
            "lng", -122.4468,
            "address", "110 Haight Street, Ward 5"
        ));
        predictions.add(p3);

        return ResponseEntity.ok(predictions);
    }
}
