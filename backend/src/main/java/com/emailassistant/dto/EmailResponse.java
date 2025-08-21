package com.emailassistant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.emailassistant.model.Email;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailResponse {
    
    private String id;
    private String messageId;
    private String from;
    private String to;
    private String subject;
    private String body;
    private Email.EmailStatus status;
    private Email.EmailIntent intent;
    private Double intentConfidence;
    private String assignedTeam;
    private String assignedUser;
    private Email.Priority priority;
    private LocalDateTime receivedAt;
    private LocalDateTime processedAt;
    private String aiGeneratedReply;
    private String finalReply;
    private EmailMetadataResponse metadata;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmailMetadataResponse {
        private String language;
        private String sentiment;
        private Double sentimentScore;
        private String urgency;
        private String customerTier;
        private String processingTime;
    }
}
