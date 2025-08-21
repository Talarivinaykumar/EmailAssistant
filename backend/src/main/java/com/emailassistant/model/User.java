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
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String firstName;
    private String lastName;
    private String displayName;
    private String avatar;
    private UserRole role;
    private UserStatus status;
    private List<String> teamIds;
    private List<Email.EmailIntent> expertise;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    
    // Performance metrics
    private Integer totalEmailsHandled;
    private Double averageResponseTime;
    private Double customerSatisfactionScore;
    private Integer currentWorkload;
    
    public enum UserRole {
        ADMIN,
        MANAGER,
        AGENT,
        VIEWER
    }
    
    public enum UserStatus {
        ACTIVE,
        INACTIVE,
        BUSY,
        OFFLINE
    }
}
