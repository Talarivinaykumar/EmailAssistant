package com.emailassistant.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "emails")
public class Email {
    
    @Id
    private String id;
    
    @Indexed
    private String messageId;
    
    private String from;
    private String to;
    private String cc;
    private String bcc;
    private String subject;
    private String body;
    private String htmlBody;
    
    @Indexed
    private EmailStatus status;
    
    @Indexed
    private EmailIntent intent;
    
    private Double intentConfidence;
    
    @Indexed
    private String assignedTeam;
    
    @Indexed
    private String assignedUser;
    
    private Priority priority;
    
    private List<String> attachments;
    
    private LocalDateTime receivedAt;
    private LocalDateTime processedAt;
    private LocalDateTime assignedAt;
    private LocalDateTime respondedAt;
    
    private String aiGeneratedReply;
    private String finalReply;
    
    private List<EmailNote> notes;
    
    private EmailMetadata metadata;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class IntentAnalysisResult {
        private EmailIntent intent;
        private Double confidence;
        private String reasoning;
        private Map<String, Double> intentScores;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SentimentAnalysisResult {
        private String sentiment; // positive, negative, neutral
        private Double score;
        private String urgency; // low, medium, high, urgent
        private String language;
        private String customerTier;
    }
    
    public enum EmailStatus {
        RECEIVED,
        PROCESSING,
        INTENT_DETECTED,
        ASSIGNED,
        IN_PROGRESS,
        RESPONDED,
        CLOSED,
        ESCALATED
    }
    
    public enum EmailIntent {
        REFUND_REQUEST,
        BUG_REPORT,
        FEATURE_REQUEST,
        GENERAL_INQUIRY,
        BILLING_ISSUE,
        TECHNICAL_SUPPORT,
        COMPLAINT,
        ACCOUNT_ACCESS,
        UNKNOWN
    }
    
    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }
}
