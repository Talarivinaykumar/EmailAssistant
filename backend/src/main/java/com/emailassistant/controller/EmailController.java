package com.emailassistant.controller;

import com.emailassistant.dto.AiReplyRequest;
import com.emailassistant.dto.AiReplyResponse;
import com.emailassistant.dto.EmailRequest;
import com.emailassistant.dto.EmailResponse;
import com.emailassistant.model.Email;
import com.emailassistant.service.AiService;
import com.emailassistant.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Email Management", description = "APIs for email processing and management")
public class EmailController {

    private final EmailService emailService;
    private final AiService aiService;



    @PostMapping
    @Operation(summary = "Process incoming email", description = "Process and store a new incoming email with AI analysis")
    public ResponseEntity<EmailResponse> processIncomingEmail(@Valid @RequestBody EmailRequest request) {
        log.info("Received email processing request from: {}", request.getFrom());
        EmailResponse response = emailService.processIncomingEmail(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all emails", description = "Retrieve emails with optional filtering")
    public ResponseEntity<List<EmailResponse>> getAllEmails(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String user,
            @RequestParam(required = false) String intent) {
        
        List<EmailResponse> emails = emailService.getAllEmails(status, team, user, intent);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get email by ID", description = "Retrieve a specific email by its ID")
    public ResponseEntity<EmailResponse> getEmailById(@PathVariable String id) {
        return emailService.getEmailById(id)
                .map(email -> ResponseEntity.ok(convertToEmailResponse(email)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get emails by status", description = "Retrieve emails filtered by status")
    public ResponseEntity<List<EmailResponse>> getEmailsByStatus(@PathVariable String status) {
        try {
            Email.EmailStatus emailStatus = Email.EmailStatus.valueOf(status.toUpperCase());
            List<EmailResponse> emails = emailService.getEmailsByStatus(emailStatus);
            return ResponseEntity.ok(emails);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/team/{teamId}")
    @Operation(summary = "Get emails by team", description = "Retrieve emails assigned to a specific team")
    public ResponseEntity<List<EmailResponse>> getEmailsByTeam(@PathVariable String teamId) {
        List<EmailResponse> emails = emailService.getEmailsByTeam(teamId);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get emails by user", description = "Retrieve emails assigned to a specific user")
    public ResponseEntity<List<EmailResponse>> getEmailsByUser(@PathVariable String userId) {
        List<EmailResponse> emails = emailService.getEmailsByUser(userId);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/priority/high")
    @Operation(summary = "Get high priority pending emails", description = "Retrieve high priority emails that are pending")
    public ResponseEntity<List<EmailResponse>> getHighPriorityPendingEmails() {
        List<EmailResponse> emails = emailService.getHighPriorityPendingEmails();
        return ResponseEntity.ok(emails);
    }

    @PutMapping("/{id}/assign/team/{teamId}")
    @Operation(summary = "Assign email to team", description = "Assign an email to a specific team")
    public ResponseEntity<EmailResponse> assignEmailToTeam(
            @PathVariable String id,
            @PathVariable String teamId) {
        try {
            EmailResponse response = emailService.assignEmailToTeam(id, teamId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/assign/user/{userId}")
    @Operation(summary = "Assign email to user", description = "Assign an email to a specific user")
    public ResponseEntity<EmailResponse> assignEmailToUser(
            @PathVariable String id,
            @PathVariable String userId) {
        try {
            EmailResponse response = emailService.assignEmailToUser(id, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status/{status}")
    @Operation(summary = "Update email status", description = "Update the status of an email")
    public ResponseEntity<EmailResponse> updateEmailStatus(
            @PathVariable String id,
            @PathVariable String status) {
        try {
            Email.EmailStatus emailStatus = Email.EmailStatus.valueOf(status.toUpperCase());
            EmailResponse response = emailService.updateEmailStatus(id, emailStatus);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/priority/{priority}")
    @Operation(summary = "Update email priority", description = "Update the priority of an email")
    public ResponseEntity<EmailResponse> updateEmailPriority(
            @PathVariable String id,
            @PathVariable String priority) {
        try {
            Email.Priority emailPriority = Email.Priority.valueOf(priority.toUpperCase());
            EmailResponse response = emailService.updateEmailPriority(id, emailPriority);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/notes")
    @Operation(summary = "Add note to email", description = "Add an internal note to an email")
    public ResponseEntity<EmailResponse> addNoteToEmail(
            @PathVariable String id,
            @RequestBody String note,
            @RequestParam(defaultValue = "system") String userId) {
        try {
            EmailResponse response = emailService.addNoteToEmail(id, note, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/reply")
    @Operation(summary = "Send reply to email", description = "Send a reply to an email")
    public ResponseEntity<EmailResponse> sendReply(
            @PathVariable String id,
            @RequestBody String reply,
            @RequestParam(defaultValue = "system") String userId) {
        try {
            EmailResponse response = emailService.sendReply(id, reply, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/ai/reply")
    @Operation(summary = "Generate AI reply", description = "Generate an AI-powered reply for an email")
    public ResponseEntity<AiReplyResponse> generateAiReply(@Valid @RequestBody AiReplyRequest request) {
        try {
            // First, get the email to pass to the AI service
            Email email = emailService.getEmailById(request.getEmailId()).orElse(null);
            if (email == null) {
                return ResponseEntity.notFound().build();
            }
            
            AiReplyResponse response = aiService.generateReply(request, email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error generating AI reply: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get email statistics", description = "Retrieve email processing statistics")
    public ResponseEntity<EmailService.EmailStatistics> getEmailStatistics() {
        EmailService.EmailStatistics statistics = emailService.getEmailStatistics();
        return ResponseEntity.ok(statistics);
    }
    //  public EmailController(EmailService emailService) {
    //     this.emailService = emailService;
    // }

    private EmailResponse convertToEmailResponse(Email email) {
        // This is a simplified conversion - in a real implementation, 
        // you would use the same logic as in EmailServiceImpl
        return EmailResponse.builder()
                .id(email.getId())
                .messageId(email.getMessageId())
                .from(email.getFrom())
                .to(email.getTo())
                .subject(email.getSubject())
                .body(email.getBody())
                .status(email.getStatus())
                .intent(email.getIntent())
                .intentConfidence(email.getIntentConfidence())
                .assignedTeam(email.getAssignedTeam())
                .assignedUser(email.getAssignedUser())
                .priority(email.getPriority())
                .receivedAt(email.getReceivedAt())
                .processedAt(email.getProcessedAt())
                .aiGeneratedReply(email.getAiGeneratedReply())
                .finalReply(email.getFinalReply())
                .build();
    }
}
