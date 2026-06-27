package com.civiceye.backend.service;

import com.civiceye.backend.model.Issue;
import com.civiceye.backend.model.UserProfile;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.*;

@Service
public class IssueService {

    private static final String DB_FILE = "civiceye_db.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public synchronized List<Issue> getAllIssues() {
        return loadDB().getIssues();
    }

    public synchronized List<UserProfile> getAllUsers() {
        return loadDB().getUsers();
    }

    public synchronized Optional<UserProfile> getUserByEmail(String email) {
        return loadDB().getUsers().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public synchronized void saveUser(UserProfile user) {
        DatabaseState db = loadDB();
        db.getUsers().removeIf(u -> u.getEmail().equalsIgnoreCase(user.getEmail()));
        db.getUsers().add(user);
        saveDB(db);
    }

    public synchronized void saveIssue(Issue issue) {
        DatabaseState db = loadDB();
        db.getIssues().removeIf(i -> i.getId().equals(issue.getId()));
        db.getIssues().add(issue);
        saveDB(db);
    }

    public synchronized Optional<Issue> getIssueById(String id) {
        return loadDB().getIssues().stream()
                .filter(i -> i.getId().equals(id))
                .findFirst();
    }

    public double getDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371e3; // Earth's radius in meters
        double phi1 = lat1 * Math.PI / 180;
        double phi2 = lat2 * Math.PI / 180;
        double deltaPhi = (lat2 - lat1) * Math.PI / 180;
        double deltaLambda = (lon2 - lon1) * Math.PI / 180;

        double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                   Math.cos(phi1) * Math.cos(phi2) *
                   Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    public void recalculatePriority(Issue issue) {
        int severityScore = 10;
        if ("Critical".equals(issue.getSeverity())) severityScore = 40;
        else if ("High".equals(issue.getSeverity())) severityScore = 30;
        else if ("Medium".equals(issue.getSeverity())) severityScore = 20;

        int riskScore = 10;
        if (issue.getImpact() != null) {
            if ("Critical".equals(issue.getImpact().getRiskLevel())) riskScore = 40;
            else if ("High".equals(issue.getImpact().getRiskLevel())) riskScore = 30;
            else if ("Medium".equals(issue.getImpact().getRiskLevel())) riskScore = 20;
        }

        int popScore = 5;
        if (issue.getImpact() != null) {
            int pop = issue.getImpact().getPopulationAffected();
            if (pop > 1000) popScore = 20;
            else if (pop > 500) popScore = 15;
            else if (pop > 100) popScore = 10;
        }

        int verificationImpact = (int) (issue.getVerificationCount() * 1.5 - issue.getRejectionCount() * 3.0);
        int totalScore = Math.min(100, Math.max(0, severityScore + riskScore + popScore + verificationImpact));
        issue.setPriorityScore(totalScore);

        String nearbyString = (issue.getImpact() != null && issue.getImpact().getNearbyFacilities() != null && !issue.getImpact().getNearbyFacilities().isEmpty())
                ? " within proximity to " + issue.getImpact().getNearbyFacilities().get(0)
                : "";
        issue.setPriorityReason(String.format("%s severity issue coupled with a %s risk level%s. Priority index is reinforced by %d community verifications.",
                issue.getSeverity(),
                (issue.getImpact() != null) ? issue.getImpact().getRiskLevel().toLowerCase() : "medium",
                nearbyString,
                issue.getVerificationCount()
        ));
    }

    private DatabaseState loadDB() {
        try {
            File file = new File(DB_FILE);
            if (file.exists()) {
                return objectMapper.readValue(file, DatabaseState.class);
            }
        } catch (IOException e) {
            System.err.println("Error reading JSON database file, initializing fresh: " + e.getMessage());
        }
        return new DatabaseState(new ArrayList<>(), new ArrayList<>());
    }

    private void saveDB(DatabaseState db) {
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(DB_FILE), db);
        } catch (IOException e) {
            System.err.println("Error writing JSON database: " + e.getMessage());
        }
    }

    public static class DatabaseState {
        private List<Issue> issues;
        private List<UserProfile> users;

        public DatabaseState() {
            this.issues = new ArrayList<>();
            this.users = new ArrayList<>();
        }

        public DatabaseState(List<Issue> issues, List<UserProfile> users) {
            this.issues = issues != null ? issues : new ArrayList<>();
            this.users = users != null ? users : new ArrayList<>();
        }

        public List<Issue> getIssues() { return issues; }
        public void setIssues(List<Issue> issues) { this.issues = issues; }
        public List<UserProfile> getUsers() { return users; }
        public void setUsers(List<UserProfile> users) { this.users = users; }
    }
}
