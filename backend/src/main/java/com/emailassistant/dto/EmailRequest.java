package com.emailassistant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequest {
    
    @NotBlank(message = "From email is required")
    @Email(message = "Invalid from email format")
    private String from;
    
    @NotBlank(message = "To email is required")
    @Email(message = "Invalid to email format")
    private String to;
    
    private String cc;
    private String bcc;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Body is required")
    private String body;
    
    private String htmlBody;
    private List<String> attachments;
    private String messageId;
}
