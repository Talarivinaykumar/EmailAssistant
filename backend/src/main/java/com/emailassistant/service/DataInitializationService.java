package com.emailassistant.service;

import com.emailassistant.model.Email;
import com.emailassistant.model.Team;
import com.emailassistant.model.User;
import com.emailassistant.repository.TeamRepository;
import com.emailassistant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeData() {
        log.info("Initializing default data...");
        
        // Initialize teams if they don't exist
        initializeTeams();
        
        // Initialize users if they don't exist
        initializeUsers();
        
        log.info("Data initialization completed");
    }

    private void initializeTeams() {
        if (teamRepository.count() > 0) {
            log.info("Teams already exist, skipping initialization");
            return;
        }

        List<Team> defaultTeams = List.of(
            Team.builder()
                .name("billing-team")
                .description("Handles billing, refunds, and payment issues")
                .handledIntents(List.of(
                    Email.EmailIntent.REFUND_REQUEST,
                    Email.EmailIntent.BILLING_ISSUE
                ))
                .status(Team.TeamStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .totalEmailsHandled(0)
                .build(),
            
            Team.builder()
                .name("technical-team")
                .description("Handles technical support and bug reports")
                .handledIntents(List.of(
                    Email.EmailIntent.BUG_REPORT,
                    Email.EmailIntent.TECHNICAL_SUPPORT,
                    Email.EmailIntent.ACCOUNT_ACCESS
                ))
                .status(Team.TeamStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .totalEmailsHandled(0)
                .build(),
            
            Team.builder()
                .name("product-team")
                .description("Handles feature requests and product inquiries")
                .handledIntents(List.of(
                    Email.EmailIntent.FEATURE_REQUEST
                ))
                .status(Team.TeamStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .totalEmailsHandled(0)
                .build(),
            
            Team.builder()
                .name("support-team")
                .description("Handles general support and complaints")
                .handledIntents(List.of(
                    Email.EmailIntent.GENERAL_INQUIRY,
                    Email.EmailIntent.COMPLAINT
                ))
                .status(Team.TeamStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .totalEmailsHandled(0)
                .build()
        );

        for (Team team : defaultTeams) {
            teamRepository.save(team);
            log.info("Created team: {}", team.getName());
        }
    }

    private void initializeUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already exist, skipping initialization");
            return;
        }

        List<User> defaultUsers = List.of(
            User.builder()
                .email("admin@emailassistant.com")
                .firstName("Admin")
                .lastName("User")
                .displayName("Admin User")
                .role(User.UserRole.MANAGER)
                .status(User.UserStatus.ACTIVE)
                .teamIds(List.of("billing-team"))
                .expertise(List.of(Email.EmailIntent.BILLING_ISSUE, Email.EmailIntent.REFUND_REQUEST))
                .createdAt(LocalDateTime.now())
                .build(),
            
            User.builder()
                .email("tech@emailassistant.com")
                .firstName("Tech")
                .lastName("Support")
                .displayName("Tech Support")
                .role(User.UserRole.AGENT)
                .status(User.UserStatus.ACTIVE)
                .teamIds(List.of("technical-team"))
                .expertise(List.of(Email.EmailIntent.TECHNICAL_SUPPORT, Email.EmailIntent.BUG_REPORT))
                .createdAt(LocalDateTime.now())
                .build()
        );

        for (User user : defaultUsers) {
            userRepository.save(user);
            log.info("Created user: {}", user.getEmail());
        }
    }
}
