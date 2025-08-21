package com.emailassistant.controller;

import com.emailassistant.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for user management")
public class UserController {

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get the currently authenticated user")
    public ResponseEntity<User> getCurrentUser() {
        // For now, return a mock user. In a real implementation, this would get the user from the security context
        User mockUser = User.builder()
                .id("current-user")
                .email("user@example.com")
                .firstName("John")
                .lastName("Doe")
                .displayName("John Doe")
                .role(User.UserRole.AGENT)
                .status(User.UserStatus.ACTIVE)
                .teamIds(List.of("team-1"))
                .expertise(List.of())
                .createdAt(LocalDateTime.now())
                .build();
        
        return ResponseEntity.ok(mockUser);
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve all users in the system")
    public ResponseEntity<List<User>> getAllUsers() {
        // For now, return a mock list. In a real implementation, this would query the database
        List<User> mockUsers = List.of(
            User.builder()
                .id("user-1")
                .email("john@example.com")
                .firstName("John")
                .lastName("Doe")
                .displayName("John Doe")
                .role(User.UserRole.AGENT)
                .status(User.UserStatus.ACTIVE)
                .teamIds(List.of("team-1"))
                .expertise(List.of())
                .createdAt(LocalDateTime.now())
                .build(),
            User.builder()
                .id("user-2")
                .email("jane@example.com")
                .firstName("Jane")
                .lastName("Smith")
                .displayName("Jane Smith")
                .role(User.UserRole.MANAGER)
                .status(User.UserStatus.ACTIVE)
                .teamIds(List.of("team-1"))
                .expertise(List.of())
                .createdAt(LocalDateTime.now())
                .build()
        );
        
        return ResponseEntity.ok(mockUsers);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve a specific user by their ID")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        // For now, return a mock user. In a real implementation, this would query the database
        User mockUser = User.builder()
                .id(id)
                .email("user@example.com")
                .firstName("John")
                .lastName("Doe")
                .displayName("John Doe")
                .role(User.UserRole.AGENT)
                .status(User.UserStatus.ACTIVE)
                .teamIds(List.of("team-1"))
                .expertise(List.of())
                .createdAt(LocalDateTime.now())
                .build();
        
        return ResponseEntity.ok(mockUser);
    }
}
