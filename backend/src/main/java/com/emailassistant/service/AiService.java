package com.emailassistant.service;

import com.emailassistant.dto.AiReplyRequest;
import com.emailassistant.dto.AiReplyResponse;
import com.emailassistant.model.Email;
import java.util.List;

public interface AiService {
    
    /**
     * Analyze email content and detect intent
     */
    Email.IntentAnalysisResult analyzeIntent(String subject, String body);
    
    /**
     * Generate AI-powered reply for an email
     */
    AiReplyResponse generateReply(AiReplyRequest request, Email email);
    
    /**
     * Analyze email sentiment and urgency
     */
    Email.SentimentAnalysisResult analyzeSentiment(String content);
    
    /**
     * Provide tone and clarity feedback for a reply
     */
    List<AiReplyResponse.FeedbackItem> analyzeReplyQuality(String reply, String originalEmail);
}
