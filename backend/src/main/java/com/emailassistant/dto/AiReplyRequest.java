package com.emailassistant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiReplyRequest {
    
    @NotBlank(message = "Email ID is required")
    private String emailId;
    
    private String tone; // professional, friendly, formal, casual
    private String style; // concise, detailed, empathetic
    private String additionalContext;
    private Boolean includeToneFeedback;
    private Boolean includeClarityFeedback;
}
