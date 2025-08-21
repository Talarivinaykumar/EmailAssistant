package com.emailassistant.service;

import com.emailassistant.model.Email;
import com.emailassistant.model.Team;
import com.emailassistant.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamAssignmentService {

    private final TeamRepository teamRepository;
    
    @Value("${team.assignment.rules.REFUND_REQUEST:billing-team}")
    private String refundRequestTeam;
    
    @Value("${team.assignment.rules.BUG_REPORT:technical-team}")
    private String bugReportTeam;
    
    @Value("${team.assignment.rules.FEATURE_REQUEST:product-team}")
    private String featureRequestTeam;
    
    @Value("${team.assignment.rules.GENERAL_INQUIRY:support-team}")
    private String generalInquiryTeam;
    
    @Value("${team.assignment.rules.BILLING_ISSUE:billing-team}")
    private String billingIssueTeam;
    
    @Value("${team.assignment.rules.TECHNICAL_SUPPORT:technical-team}")
    private String technicalSupportTeam;
    
    @Value("${team.assignment.rules.COMPLAINT:support-team}")
    private String complaintTeam;
    
    @Value("${team.assignment.rules.ACCOUNT_ACCESS:technical-team}")
    private String accountAccessTeam;

    /**
     * Assign team based on email intent
     */
    public String assignTeam(Email.EmailIntent intent) {
        if (intent == null) {
            log.warn("Email intent is null, cannot assign team");
            return null;
        }
        
        // First try to find team by intent mapping
        String teamName = getTeamNameForIntent(intent);
        if (teamName != null) {
            Optional<Team> team = teamRepository.findByName(teamName);
            if (team.isPresent()) {
                log.info("Assigned email with intent {} to team: {}", intent, teamName);
                return team.get().getId();
            }
        }
        
        // If no team found by name, try to find by handled intents
        log.info("No team found by name mapping for intent: {}, trying to find by handled intents", intent);
        return getBestAvailableTeam(intent);
    }

    /**
     * Get the best available team for an intent
     */
    public String getBestAvailableTeam(Email.EmailIntent intent) {
        List<Team> availableTeams = teamRepository.findByHandledIntentsContaining(intent);
        
        if (availableTeams.isEmpty()) {
            log.warn("No teams available for intent: {}", intent);
            return null;
        }
        
        // Find team with lowest workload
        Team bestTeam = availableTeams.stream()
                .filter(team -> team.getStatus() == Team.TeamStatus.ACTIVE)
                .min((t1, t2) -> {
                    int workload1 = t1.getTotalEmailsHandled() != null ? t1.getTotalEmailsHandled() : 0;
                    int workload2 = t2.getTotalEmailsHandled() != null ? t2.getTotalEmailsHandled() : 0;
                    return Integer.compare(workload1, workload2);
                })
                .orElse(null);
        
        return bestTeam != null ? bestTeam.getId() : null;
    }

    /**
     * Get team assignment rules
     */
    public Map<Email.EmailIntent, String> getAssignmentRules() {
        Map<Email.EmailIntent, String> rules = new HashMap<>();
        rules.put(Email.EmailIntent.REFUND_REQUEST, refundRequestTeam);
        rules.put(Email.EmailIntent.BUG_REPORT, bugReportTeam);
        rules.put(Email.EmailIntent.FEATURE_REQUEST, featureRequestTeam);
        rules.put(Email.EmailIntent.GENERAL_INQUIRY, generalInquiryTeam);
        rules.put(Email.EmailIntent.BILLING_ISSUE, billingIssueTeam);
        rules.put(Email.EmailIntent.TECHNICAL_SUPPORT, technicalSupportTeam);
        rules.put(Email.EmailIntent.COMPLAINT, complaintTeam);
        rules.put(Email.EmailIntent.ACCOUNT_ACCESS, accountAccessTeam);
        return rules;
    }

    /**
     * Update assignment rules
     */
    public void updateAssignmentRule(Email.EmailIntent intent, String teamName) {
        switch (intent) {
            case REFUND_REQUEST:
                refundRequestTeam = teamName;
                break;
            case BUG_REPORT:
                bugReportTeam = teamName;
                break;
            case FEATURE_REQUEST:
                featureRequestTeam = teamName;
                break;
            case GENERAL_INQUIRY:
                generalInquiryTeam = teamName;
                break;
            case BILLING_ISSUE:
                billingIssueTeam = teamName;
                break;
            case TECHNICAL_SUPPORT:
                technicalSupportTeam = teamName;
                break;
            case COMPLAINT:
                complaintTeam = teamName;
                break;
            case ACCOUNT_ACCESS:
                accountAccessTeam = teamName;
                break;
            default:
                log.warn("Unknown intent for assignment rule update: {}", intent);
        }
        
        log.info("Updated assignment rule: {} -> {}", intent, teamName);
    }

    private String getTeamNameForIntent(Email.EmailIntent intent) {
        return switch (intent) {
            case REFUND_REQUEST -> refundRequestTeam;
            case BUG_REPORT -> bugReportTeam;
            case FEATURE_REQUEST -> featureRequestTeam;
            case GENERAL_INQUIRY -> generalInquiryTeam;
            case BILLING_ISSUE -> billingIssueTeam;
            case TECHNICAL_SUPPORT -> technicalSupportTeam;
            case COMPLAINT -> complaintTeam;
            case ACCOUNT_ACCESS -> accountAccessTeam;
            case UNKNOWN -> null;
        };
    }
}
