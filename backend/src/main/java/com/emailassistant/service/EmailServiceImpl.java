package com.emailassistant.service;

import com.emailassistant.dto.EmailRequest;
import com.emailassistant.dto.EmailResponse;
import com.emailassistant.model.Email;
import com.emailassistant.model.EmailNote;
import com.emailassistant.model.EmailMetadata;
import com.emailassistant.model.Team;
import com.emailassistant.model.User;
import com.emailassistant.repository.EmailRepository;
import com.emailassistant.repository.TeamRepository;
import com.emailassistant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final EmailRepository emailRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final AiService aiService;
    private final TeamAssignmentService teamAssignmentService;

    @Override
    @Transactional
    public EmailResponse processIncomingEmail(EmailRequest request) {
        log.info("Processing incoming email from: {}", request.getFrom());
        
        // Check if email already exists
        if (request.getMessageId() != null) {
            Optional<Email> existingEmail = emailRepository.findByMessageId(request.getMessageId());
            if (existingEmail.isPresent()) {
                log.warn("Email with message ID {} already exists", request.getMessageId());
                return convertToEmailResponse(existingEmail.get());
            }
        }
        
        // Create new email entity
        Email email = Email.builder()
                .messageId(request.getMessageId() != null ? request.getMessageId() : UUID.randomUUID().toString())
                .from(request.getFrom())
                .to(request.getTo())
                .cc(request.getCc())
                .bcc(request.getBcc())
                .subject(request.getSubject())
                .body(request.getBody())
                .htmlBody(request.getHtmlBody())
                .attachments(request.getAttachments())
                .status(Email.EmailStatus.RECEIVED)
                .receivedAt(LocalDateTime.now())
                .priority(Email.Priority.MEDIUM)
                .build();
        
        // Save email
        email = emailRepository.save(email);
        log.info("Email saved with ID: {}", email.getId());
        
        // Process email asynchronously
        processEmailAsync(email);
        
        return convertToEmailResponse(email);
    }

    @Override
    public Optional<Email> getEmailById(String id) {
        return emailRepository.findById(id);
    }

    @Override
    public List<EmailResponse> getAllEmails(String status, String team, String user, String intent) {
        List<Email> emails;
        
        if (status != null && !status.trim().isEmpty()) {
            try {
                emails = emailRepository.findByStatus(Email.EmailStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status value: {}, returning all emails", status);
                emails = emailRepository.findAll();
            }
        } else if (team != null && !team.trim().isEmpty()) {
            emails = emailRepository.findByAssignedTeam(team);
        } else if (user != null && !user.trim().isEmpty()) {
            emails = emailRepository.findByAssignedUser(user);
        } else if (intent != null && !intent.trim().isEmpty()) {
            try {
                emails = emailRepository.findByIntent(Email.EmailIntent.valueOf(intent.toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid intent value: {}, returning all emails", intent);
                emails = emailRepository.findAll();
            }
        } else {
            emails = emailRepository.findAll();
        }
        
        return emails.stream()
                .map(this::convertToEmailResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmailResponse assignEmailToTeam(String emailId, String teamId) {
        Optional<Email> emailOpt = emailRepository.findById(emailId);
        if (emailOpt.isEmpty()) {
            throw new RuntimeException("Email not found: " + emailId);
        }
        
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if (teamOpt.isEmpty()) {
            throw new RuntimeException("Team not found: " + teamId);
        }
        
        Email email = emailOpt.get();
        email.setAssignedTeam(teamId);
        email.setStatus(Email.EmailStatus.ASSIGNED);
        email.setAssignedAt(LocalDateTime.now());
        
        email = emailRepository.save(email);
        
        // Add assignment note
        addNoteToEmail(emailId, "Email assigned to team: " + teamOpt.get().getName(), "system");
        
        return convertToEmailResponse(email);
    }

    @Override
    @Transactional
    public EmailResponse assignEmailToUser(String emailId, String userId) {
        Optional<Email> emailOpt = emailRepository.findById(emailId);
        if (emailOpt.isEmpty()) {
            throw new RuntimeException("Email not found: " + emailId);
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + userId);
        }
        
        Email email = emailOpt.get();
        email.setAssignedUser(userId);
        email.setStatus(Email.EmailStatus.ASSIGNED);
        email.setAssignedAt(LocalDateTime.now());
        
        email = emailRepository.save(email);
        
        // Add assignment note
        addNoteToEmail(emailId, "Email assigned to user: " + userOpt.get().getDisplayName(), "system");
        
        return convertToEmailResponse(email);
    }

    @Override
    @Transactional
    public EmailResponse updateEmailStatus(String emailId, Email.EmailStatus status) {
        Optional<Email> emailOpt = emailRepository.findById(emailId);
        if (emailOpt.isEmpty()) {
            throw new RuntimeException("Email not found: " + emailId);
        }
        
        Email email = emailOpt.get();
        email.setStatus(status);
        
        if (status == Email.EmailStatus.RESPONDED) {
            email.setRespondedAt(LocalDateTime.now());
        }
        
        email = emailRepository.save(email);
        
        return convertToEmailResponse(email);
    }

    @Override
    public List<EmailResponse> getEmailsByStatus(Email.EmailStatus status) {
        return emailRepository.findByStatus(status)
                .stream()
                .map(this::convertToEmailResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmailResponse> getEmailsByTeam(String teamId) {
        return emailRepository.findByAssignedTeam(teamId)
                .stream()
                .map(this::convertToEmailResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmailResponse> getEmailsByUser(String userId) {
        return emailRepository.findByAssignedUser(userId)
                .stream()
                .map(this::convertToEmailResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmailResponse> getHighPriorityPendingEmails() {
        return emailRepository.findHighPriorityPendingEmails(Email.Priority.HIGH)
                .stream()
                .map(this::convertToEmailResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EmailStatistics getEmailStatistics() {
        return new EmailStatistics() {
            @Override
            public long getTotalEmails() {
                return emailRepository.count();
            }
            
            @Override
            public long getPendingEmails() {
                return emailRepository.countByStatus(Email.EmailStatus.RECEIVED) +
                       emailRepository.countByStatus(Email.EmailStatus.ASSIGNED) +
                       emailRepository.countByStatus(Email.EmailStatus.IN_PROGRESS);
            }
            
            @Override
            public long getResolvedEmails() {
                return emailRepository.countByStatus(Email.EmailStatus.RESPONDED) +
                       emailRepository.countByStatus(Email.EmailStatus.CLOSED);
            }
            
            @Override
            public long getEmailsByIntent(Email.EmailIntent intent) {
                return emailRepository.countByIntent(intent);
            }
            
            @Override
            public long getEmailsByStatus(Email.EmailStatus status) {
                return emailRepository.countByStatus(status);
            }
            
            @Override
            public double getAverageResponseTime() {
                // This would require additional calculation logic
                return 0.0;
            }
        };
    }

    @Override
    @Transactional
    public EmailResponse addNoteToEmail(String emailId, String note, String userId) {
        Optional<Email> emailOpt = emailRepository.findById(emailId);
        if (emailOpt.isEmpty()) {
            throw new RuntimeException("Email not found: " + emailId);
        }
        
        Email email = emailOpt.get();
        
        EmailNote emailNote = EmailNote.builder()
                .id(UUID.randomUUID().toString())
                .emailId(emailId)
                .userId(userId)
                .content(note)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .type(EmailNote.NoteType.INTERNAL_NOTE)
                .build();
        
        if (email.getNotes() == null) {
            email.setNotes(List.of(emailNote));
        } else {
            email.getNotes().add(emailNote);
        }
        
        email = emailRepository.save(email);
        
        return convertToEmailResponse(email);
    }

    @Override
    @Transactional
    public EmailResponse updateEmailPriority(String emailId, Email.Priority priority) {
        Optional<Email> emailOpt = emailRepository.findById(emailId);
        if (emailOpt.isEmpty()) {
            throw new RuntimeException("Email not found: " + emailId);
        }
        
        Email email = emailOpt.get();
        email.setPriority(priority);
        email = emailRepository.save(email);
        
        return convertToEmailResponse(email);
    }

    @Override
    @Transactional
    public EmailResponse sendReply(String emailId, String reply, String userId) {
        Optional<Email> emailOpt = emailRepository.findById(emailId);
        if (emailOpt.isEmpty()) {
            throw new RuntimeException("Email not found: " + emailId);
        }
        
        Email email = emailOpt.get();
        email.setFinalReply(reply);
        email.setStatus(Email.EmailStatus.RESPONDED);
        email.setRespondedAt(LocalDateTime.now());
        
        email = emailRepository.save(email);
        
        // Add reply note
        addNoteToEmail(emailId, "Reply sent: " + reply.substring(0, Math.min(100, reply.length())) + "...", userId);
        
        return convertToEmailResponse(email);
    }

    private void processEmailAsync(Email email) {
        // This would typically be done asynchronously
        try {
            log.info("Starting to process email {} from: {}", email.getId(), email.getFrom());
            
            // Update status to processing
            email.setStatus(Email.EmailStatus.PROCESSING);
            email.setProcessedAt(LocalDateTime.now());
            emailRepository.save(email);
            
            // Analyze intent
            log.info("Analyzing intent for email: {}", email.getId());
            Email.IntentAnalysisResult intentResult = aiService.analyzeIntent(email.getSubject(), email.getBody());
            email.setIntent(intentResult.getIntent());
            email.setIntentConfidence(intentResult.getConfidence());
            log.info("Intent analysis completed for email {}: {} (confidence: {})", 
                    email.getId(), intentResult.getIntent(), intentResult.getConfidence());
            
            // Analyze sentiment
            log.info("Analyzing sentiment for email: {}", email.getId());
            Email.SentimentAnalysisResult sentimentResult = aiService.analyzeSentiment(email.getBody());
            log.info("Sentiment analysis completed for email {}: {} (urgency: {})", 
                    email.getId(), sentimentResult.getSentiment(), sentimentResult.getUrgency());
            
            // Create metadata
            EmailMetadata metadata = EmailMetadata.builder()
                    .emailId(email.getId())
                    .language(sentimentResult.getLanguage())
                    .sentiment(sentimentResult.getSentiment())
                    .sentimentScore(sentimentResult.getScore())
                    .urgency(sentimentResult.getUrgency())
                    .customerTier(sentimentResult.getCustomerTier())
                    .aiModelUsed("gpt-4")
                    .aiModelVersion("1.0")
                    .build();
            email.setMetadata(metadata);
            
            // Determine priority based on sentiment and urgency
            Email.Priority priority = determinePriority(sentimentResult);
            email.setPriority(priority);
            log.info("Priority determined for email {}: {}", email.getId(), priority);
            
            // Auto-assign to team
            log.info("Attempting to assign team for email {} with intent: {}", email.getId(), email.getIntent());
            String assignedTeam = teamAssignmentService.assignTeam(email.getIntent());
            if (assignedTeam != null) {
                email.setAssignedTeam(assignedTeam);
                email.setStatus(Email.EmailStatus.ASSIGNED);
                email.setAssignedAt(LocalDateTime.now());
                log.info("Email {} assigned to team: {}", email.getId(), assignedTeam);
            } else {
                email.setStatus(Email.EmailStatus.INTENT_DETECTED);
                log.warn("No team assigned for email {} with intent: {}", email.getId(), email.getIntent());
            }
            
            emailRepository.save(email);
            
            log.info("Email {} processed successfully. Intent: {}, Team: {}, Status: {}", 
                    email.getId(), email.getIntent(), email.getAssignedTeam(), email.getStatus());
                    
        } catch (Exception e) {
            log.error("Error processing email {}: {}", email.getId(), e.getMessage(), e);
            email.setStatus(Email.EmailStatus.RECEIVED);
            emailRepository.save(email);
        }
    }

    private Email.Priority determinePriority(Email.SentimentAnalysisResult sentimentResult) {
        if ("urgent".equals(sentimentResult.getUrgency()) || 
            ("negative".equals(sentimentResult.getSentiment()) && sentimentResult.getScore() < -0.5)) {
            return Email.Priority.URGENT;
        } else if ("high".equals(sentimentResult.getUrgency()) || 
                   "negative".equals(sentimentResult.getSentiment())) {
            return Email.Priority.HIGH;
        } else if ("medium".equals(sentimentResult.getUrgency())) {
            return Email.Priority.MEDIUM;
        } else {
            return Email.Priority.LOW;
        }
    }

    private EmailResponse convertToEmailResponse(Email email) {
        EmailResponse.EmailMetadataResponse metadataResponse = null;
        if (email.getMetadata() != null) {
            metadataResponse = EmailResponse.EmailMetadataResponse.builder()
                    .language(email.getMetadata().getLanguage())
                    .sentiment(email.getMetadata().getSentiment())
                    .sentimentScore(email.getMetadata().getSentimentScore())
                    .urgency(email.getMetadata().getUrgency())
                    .customerTier(email.getMetadata().getCustomerTier())
                    .processingTime(email.getMetadata().getProcessingTime())
                    .build();
        }
        
        return EmailResponse.builder()
                .id(email.getId())
                .messageId(email.getMessageId())
                .from(email.getFrom())
                .to(email.getTo())
                .subject(email.getSubject())
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
                .metadata(metadataResponse)
                .build();
    }
}
