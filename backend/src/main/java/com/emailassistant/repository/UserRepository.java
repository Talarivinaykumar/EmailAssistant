package com.emailassistant.repository;

import com.emailassistant.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByStatus(User.UserStatus status);
    
    List<User> findByTeamIdsContaining(String teamId);
    
    List<User> findByExpertiseContaining(com.emailassistant.model.Email.EmailIntent intent);
    
    List<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status);
}
