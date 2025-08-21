package com.emailassistant.repository;

import com.emailassistant.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {
    
    Optional<Team> findByName(String name);
    
    List<Team> findByStatus(Team.TeamStatus status);
    
    List<Team> findByManagerId(String managerId);
    
    List<Team> findByMemberIdsContaining(String memberId);
    
    List<Team> findByHandledIntentsContaining(com.emailassistant.model.Email.EmailIntent intent);
}
