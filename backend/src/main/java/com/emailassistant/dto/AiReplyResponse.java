// 



package com.emailassistant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiReplyResponse {
    
    private String emailId;
    private String generatedReply;
    private String tone;
    private String style;
    private List<FeedbackItem> toneFeedback;
    private List<FeedbackItem> clarityFeedback;
    private Double confidenceScore;
    private String modelUsed;
    private Long processingTimeMs;
    private String assignedTo;  // Added field for team member assignment
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeedbackItem {
        private String category;
        private String suggestion;
        private String reason;
        private String severity; // low, medium, high
    }
}
