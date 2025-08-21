package com.emailassistant.service;

import com.emailassistant.dto.EmailRequest;
import com.emailassistant.dto.EmailResponse;
import com.emailassistant.model.Email;

import java.util.List;
import java.util.Optional;

public interface EmailService {
    
    /**
     * Process and store a new incoming email
     */
    EmailResponse processIncomingEmail(EmailRequest request);
    
    /**
     * Get email by ID
     */
    Optional<Email> getEmailById(String id);
    
    /**
     * Get all emails with optional filtering
     */
    List<EmailResponse> getAllEmails(String status, String team, String user, String intent);
    
    /**
     * Assign email to a team
     */
    EmailResponse assignEmailToTeam(String emailId, String teamId);
    
    /**
     * Assign email to a user
     */
    EmailResponse assignEmailToUser(String emailId, String userId);
    
    /**
     * Update email status
     */
    EmailResponse updateEmailStatus(String emailId, Email.EmailStatus status);
    
    /**
     * Get emails by status
     */
    List<EmailResponse> getEmailsByStatus(Email.EmailStatus status);
    
    /**
     * Get emails by team
     */
    List<EmailResponse> getEmailsByTeam(String teamId);
    
    /**
     * Get emails by user
     */
    List<EmailResponse> getEmailsByUser(String userId);
    
    /**
     * Get high priority pending emails
     */
    List<EmailResponse> getHighPriorityPendingEmails();
    
    /**
     * Get email statistics
     */
    EmailStatistics getEmailStatistics();
    
    /**
     * Add note to email
     */
    EmailResponse addNoteToEmail(String emailId, String note, String userId);
    
    /**
     * Update email priority
     */
    EmailResponse updateEmailPriority(String emailId, Email.Priority priority);
    
    /**
     * Send reply to email
     */
    EmailResponse sendReply(String emailId, String reply, String userId);
    
    /**
     * Get email statistics
     */
    interface EmailStatistics {
        long getTotalEmails();
        long getPendingEmails();
        long getResolvedEmails();
        long getEmailsByIntent(Email.EmailIntent intent);
        long getEmailsByStatus(Email.EmailStatus status);
        double getAverageResponseTime();


    //       Map<Email.EmailIntent, Long> getIntentDistribution();
    // Map<Email.EmailStatus, Long> getStatusDistribution();
    }


}
