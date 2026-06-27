package com.civiceye.backend.service;

import com.civiceye.backend.model.ImpactAssessment;
import com.civiceye.backend.model.ResolutionRecommendation;
import com.civiceye.backend.model.Issue;
import com.civiceye.backend.model.GPSLocation;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class GeminiService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public Map<String, Object> analyzeIssue(String imageUrl, String description, GPSLocation gps) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            System.out.println("[Gemini Service Java] No API key detected. Initiating simulation fallback.");
            return generateSimulationFallback(description);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            
            // Build the prompt matching our strict node schema instructions
            String prompt = String.format(
                "You are the CivicEye AI Smart City Assessment Engine. Analyze this reported community issue:\n" +
                "Description: \"%s\"\n" +
                "Location Details: Lat %f, Lng %f\n\n" +
                "Respond STRICTLY in a JSON object with the following keys and types:\n" +
                "{\n" +
                "  \"category\": \"One of: Pothole, Water Leakage, Garbage Dump, Broken Streetlight, Fallen Electric Pole, Damaged Public Infrastructure\",\n" +
                "  \"severity\": \"One of: Critical, High, Medium, Low\",\n" +
                "  \"confidenceScore\": 85, // integer 50-100\n" +
                "  \"department\": \"One of: Roads & Transportation, Water & Sanitation, Waste Management, Public Works, Power & Electricity\",\n" +
                "  \"impact\": {\n" +
                "    \"riskLevel\": \"One of: Critical, High, Medium, Low\",\n" +
                "    \"accidentProbability\": 65, // percentage integer\n" +
                "    \"environmentalImpact\": \"description of pollution or landscape impact\",\n" +
                "    \"populationAffected\": 1200, // integer count\n" +
                "    \"nearbyFacilities\": [\"Facility Name (0.1km)\"],\n" +
                "    \"explanation\": \"comprehensive justification\"\n" +
                "  },\n" +
                "  \"resolution\": {\n" +
                "    \"suggestedResolution\": \"repair instructions\",\n" +
                "    \"estimatedCost\": \"$1,200\",\n" +
                "    \"estimatedCompletionTime\": \"24 Hours\",\n" +
                "    \"requiredWorkforce\": \"3 Techs\"\n" +
                "  }\n" +
                "}", description, gps.getLat(), gps.getLng()
            );

            // Construct Gemini Request JSON
            Map<String, Object> textPart = Map.of("text", prompt);
            List<Map<String, Object>> parts = new ArrayList<>();
            parts.add(textPart);

            // Embed optional base64 image data
            if (imageUrl != null && imageUrl.startsWith("data:image")) {
                try {
                    String[] partsSplit = imageUrl.split(",");
                    if (partsSplit.length == 2) {
                        String base64Data = partsSplit[1];
                        String mimeType = partsSplit[0].split(";")[0].split(":")[1];
                        Map<String, Object> inlineData = Map.of(
                            "inlineData", Map.of("data", base64Data, "mimeType", mimeType)
                        );
                        parts.add(inlineData);
                    }
                } catch (Exception ex) {
                    System.err.println("Failed parsing inline image payload: " + ex.getMessage());
                }
            }

            Map<String, Object> content = Map.of("parts", parts);
            Map<String, Object> requestBody = Map.of("contents", List.of(content));

            String requestBodyJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                Map<String, Object> responseMap = objectMapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
                    if (contentObj != null) {
                        List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentObj.get("parts");
                        if (partsList != null && !partsList.isEmpty()) {
                            String textResponse = (String) partsList.get(0).get("text");
                            // Clean markdown fences if Gemini added them
                            textResponse = textResponse.replaceAll("```json", "").replaceAll("```", "").trim();
                            return objectMapper.readValue(textResponse, Map.class);
                        }
                    }
                }
            }
            
            System.err.println("[Gemini Java] Status Code: " + response.statusCode() + " - fallback invoked.");
        } catch (Exception e) {
            System.err.println("[Gemini Service Java Error] " + e.getMessage());
        }

        return generateSimulationFallback(description);
    }

    public String generateCopilotAdvisory(String message, List<Map<String, String>> history, List<Issue> activeIssues) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "📋 [Sandbox Mode Advisory] To support active containment, I recommend dispatching " +
                   "Road Crews to Ward 4 and flushing the water line break on Main Street immediately. " +
                   "Priority metrics indicate heavy congestion hazards.";
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            
            StringBuilder context = new StringBuilder();
            context.append("You are the Municipality Copilot, advising City Director Sarah Jenkins. Here is the active municipal issue catalog:\n");
            for (Issue issue : activeIssues) {
                context.append(String.format("- ID: %s | Title: %s | Category: %s | Severity: %s | Location: %s | Priority Score: %d\n",
                    issue.getId(), issue.getTitle(), issue.getCategory(), issue.getSeverity(), issue.getGps().getAddress(), issue.getPriorityScore()));
            }
            context.append("\nUser message: ").append(message).append("\nProvide brief, hyper-specific strategic planning suggestions.");

            Map<String, Object> textPart = Map.of("text", context.toString());
            Map<String, Object> content = Map.of("parts", List.of(textPart));
            Map<String, Object> requestBody = Map.of("contents", List.of(content));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                Map<String, Object> responseMap = objectMapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
                    if (contentObj != null) {
                        List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentObj.get("parts");
                        if (partsList != null && !partsList.isEmpty()) {
                            return (String) partsList.get(0).get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[Copilot Service Java Error] " + e.getMessage());
        }

        return "📋 Active queues look stable. Dispatch a cleanup task force to Sector B to address Waste and Garbage buildup.";
    }

    private Map<String, Object> generateSimulationFallback(String description) {
        String descLower = description.toLowerCase();
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> impact = new HashMap<>();
        Map<String, Object> resolution = new HashMap<>();

        if (descLower.contains("pothole") || descLower.contains("road") || descLower.contains("street")) {
            result.put("category", "Pothole");
            result.put("severity", "High");
            result.put("confidenceScore", 96);
            result.put("department", "Roads & Transportation");

            impact.put("riskLevel", "High");
            impact.put("accidentProbability", 75);
            impact.put("environmentalImpact", "Soil erosion adjacent to pavement borders.");
            impact.put("populationAffected", 1500);
            impact.put("nearbyFacilities", Arrays.asList("Subway Station (0.15km)", "Pedestrian Path (0.05km)"));
            impact.put("explanation", "High traffic density increases wheel strike failure rates.");

            resolution.put("suggestedResolution", "Excavate pavement section, lay binder courses, hot-asphalt seal, and roll smooth.");
            resolution.put("estimatedCost", "$1,100");
            resolution.put("estimatedCompletionTime", "24 Hours");
            resolution.put("requiredWorkforce", "3 Asphalt Technicians");
        } else if (descLower.contains("water") || descLower.contains("leak") || descLower.contains("burst")) {
            result.put("category", "Water Leakage");
            result.put("severity", "Critical");
            result.put("confidenceScore", 94);
            result.put("department", "Water & Sanitation");

            impact.put("riskLevel", "Critical");
            impact.put("accidentProbability", 60);
            impact.put("environmentalImpact", "Potential local water table pollution and pavement washing.");
            impact.put("populationAffected", 2800);
            impact.put("nearbyFacilities", Arrays.asList("Local Clinic (0.2km)", "High School (0.4km)"));
            impact.put("explanation", "Pressurized sub-surface failure requires immediate valve isolation.");

            resolution.put("suggestedResolution", "Engage pressure clamp, isolate joint fracture, install high-tensile wrap, verify pressure readings.");
            resolution.put("estimatedCost", "$3,400");
            resolution.put("estimatedCompletionTime", "12 Hours");
            resolution.put("requiredWorkforce", "3 Hydraulic Engineers");
        } else {
            result.put("category", "Damaged Public Infrastructure");
            result.put("severity", "Medium");
            result.put("confidenceScore", 82);
            result.put("department", "Public Works");

            impact.put("riskLevel", "Medium");
            impact.put("accidentProbability", 30);
            impact.put("environmentalImpact", "Obstruction of public spaces.");
            impact.put("populationAffected", 450);
            impact.put("nearbyFacilities", Arrays.asList("Public Park (0.1km)"));
            impact.put("explanation", "Requires typical field repair dispatch.");

            resolution.put("suggestedResolution", "Schedule team evaluation and perform structural reinforcement.");
            resolution.put("estimatedCost", "$650");
            resolution.put("estimatedCompletionTime", "48 Hours");
            resolution.put("requiredWorkforce", "2 Maintenance Crew");
        }

        result.put("impact", impact);
        result.put("resolution", resolution);
        return result;
    }
}
