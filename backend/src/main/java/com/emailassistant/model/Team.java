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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "teams")
public class Team {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String name;
    
    private String description;
    private String managerId;
    private List<String> memberIds;
    private List<Email.EmailIntent> handledIntents;
    private TeamStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Performance metrics
    private Integer totalEmailsHandled;
    private Double averageResponseTime;
    private Double customerSatisfactionScore;
    
    public enum TeamStatus {
        ACTIVE,
        INACTIVE,
        ARCHIVED
    }
}
