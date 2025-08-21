package com.emailassistant.repository;

import com.emailassistant.model.Email;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailRepository extends MongoRepository<Email, String> {
    
    Optional<Email> findByMessageId(String messageId);
    
    List<Email> findByStatus(Email.EmailStatus status);
    
    List<Email> findByIntent(Email.EmailIntent intent);
    
    List<Email> findByAssignedTeam(String teamId);
    
    List<Email> findByAssignedUser(String userId);
    
    List<Email> findByReceivedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("{'status': ?0, 'assignedTeam': ?1}")
    List<Email> findByStatusAndAssignedTeam(Email.EmailStatus status, String teamId);
    
    @Query("{'status': ?0, 'assignedUser': ?1}")
    List<Email> findByStatusAndAssignedUser(Email.EmailStatus status, String userId);
    
    @Query("{'priority': ?0, 'status': {$in: ['RECEIVED', 'ASSIGNED', 'IN_PROGRESS']}}")
    List<Email> findHighPriorityPendingEmails(Email.Priority priority);
    
    @Query("{'receivedAt': {$gte: ?0}, 'status': {$in: ['RECEIVED', 'ASSIGNED']}}")
    List<Email> findPendingEmailsSince(LocalDateTime since);
    
    @Query("{'assignedUser': ?0, 'status': {$in: ['ASSIGNED', 'IN_PROGRESS']}}")
    List<Email> findActiveEmailsByUser(String userId);
    
    @Query("{'assignedTeam': ?0, 'status': {$in: ['ASSIGNED', 'IN_PROGRESS']}}")
    List<Email> findActiveEmailsByTeam(String teamId);
    
    long countByStatus(Email.EmailStatus status);
    
    long countByIntent(Email.EmailIntent intent);
    
    long countByAssignedTeam(String teamId);
    
    long countByAssignedUser(String userId);


    @Query("SELECT e.intent, COUNT(e) FROM Email e GROUP BY e.intent")
List<Object[]> countEmailsByIntentRaw();

@Query("SELECT AVG(TIMESTAMPDIFF(SECOND, e.createdAt, e.resolvedAt)) FROM Email e WHERE e.resolvedAt IS NOT NULL")
Double calculateAverageResponseTime();

}
