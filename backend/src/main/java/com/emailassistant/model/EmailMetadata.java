package com.emailassistant.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "email_metadata")
public class EmailMetadata {
    
    private String emailId;
    private String language;
    private String sentiment;
    private Double sentimentScore;
    private String urgency;
    private String customerTier;
    private Map<String, Object> aiAnalysis;
    private Map<String, Object> customFields;
    private String processingTime;
    private String aiModelUsed;
    private String aiModelVersion;
}
