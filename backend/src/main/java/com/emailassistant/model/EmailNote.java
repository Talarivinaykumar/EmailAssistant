package com.emailassistant.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "email_notes")
public class EmailNote {
    
    private String id;
    private String emailId;
    private String userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private NoteType type;
    
    public enum NoteType {
        INTERNAL_NOTE,
        CUSTOMER_COMMENT,
        SYSTEM_NOTE,
        ASSIGNMENT_NOTE
    }
}
