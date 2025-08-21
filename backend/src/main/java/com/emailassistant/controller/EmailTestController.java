package com.emailassistant.controller;

import com.emailassistant.model.Email;
import com.emailassistant.service.AiService;
import com.emailassistant.service.TeamAssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Test Endpoints", description = "Test endpoints for debugging")
public class EmailTestController {

    private final AiService aiService;
    private final TeamAssignmentService teamAssignmentService;

    @PostMapping("/analyze-intent")
    @Operation(summary = "Test intent analysis", description = "Test the AI intent analysis with sample text")
    public ResponseEntity<Map<String, Object>> testIntentAnalysis(
            @RequestParam String subject,
            @RequestParam String body) {
        
        try {
            log.info("Testing intent analysis with subject: '{}' and body: '{}'", subject, body);
            
            Email.IntentAnalysisResult result = aiService.analyzeIntent(subject, body);
            
            Map<String, Object> response = new HashMap<>();
            response.put("intent", result.getIntent());
            response.put("confidence", result.getConfidence());
            response.put("reasoning", result.getReasoning());
            response.put("success", true);
            
            log.info("Intent analysis test completed: {}", result.getIntent());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error in intent analysis test: {}", e.getMessage(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("intent", "UNKNOWN");
            response.put("confidence", 0.0);
            
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/analyze-sentiment")
    @Operation(summary = "Test sentiment analysis", description = "Test the AI sentiment analysis with sample text")
    public ResponseEntity<Map<String, Object>> testSentimentAnalysis(
            @RequestParam String content) {
        
        try {
            log.info("Testing sentiment analysis with content: '{}'", content);
            
            Email.SentimentAnalysisResult result = aiService.analyzeSentiment(content);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sentiment", result.getSentiment());
            response.put("score", result.getScore());
            response.put("urgency", result.getUrgency());
            response.put("language", result.getLanguage());
            response.put("customerTier", result.getCustomerTier());
            response.put("success", true);
            
            log.info("Sentiment analysis test completed: {} (urgency: {})", result.getSentiment(), result.getUrgency());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error in sentiment analysis test: {}", e.getMessage(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("sentiment", "neutral");
            response.put("score", 0.0);
            response.put("urgency", "low");
            
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/test-team-assignment")
    @Operation(summary = "Test team assignment", description = "Test team assignment with a specific intent")
    public ResponseEntity<Map<String, Object>> testTeamAssignment(
            @RequestParam String intent) {
        
        try {
            log.info("Testing team assignment with intent: {}", intent);
            
            Email.EmailIntent emailIntent;
            try {
                emailIntent = Email.EmailIntent.valueOf(intent.toUpperCase());
            } catch (IllegalArgumentException e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "Invalid intent: " + intent);
                response.put("validIntents", Email.EmailIntent.values());
                return ResponseEntity.ok(response);
            }
            
            String assignedTeam = teamAssignmentService.assignTeam(emailIntent);
            
            Map<String, Object> response = new HashMap<>();
            response.put("intent", emailIntent);
            response.put("assignedTeam", assignedTeam);
            response.put("success", true);
            
            log.info("Team assignment test completed: {} -> {}", emailIntent, assignedTeam);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error in team assignment test: {}", e.getMessage(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("intent", intent);
            
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the AI service is working")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        response.put("service", "Email Assistant AI Service");
        
        return ResponseEntity.ok(response);
    }
}
