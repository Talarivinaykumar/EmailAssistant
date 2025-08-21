package com.emailassistant.controller;

import com.emailassistant.model.Team;
import com.emailassistant.repository.TeamRepository;
import com.emailassistant.service.TeamAssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Team Management", description = "APIs for team management and assignment rules")
public class TeamController {

    private final TeamRepository teamRepository;
    private final TeamAssignmentService teamAssignmentService;

    @GetMapping
    @Operation(summary = "Get all teams", description = "Retrieve all teams")
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get team by ID", description = "Retrieve a specific team by its ID")
    public ResponseEntity<Team> getTeamById(@PathVariable String id) {
        Optional<Team> team = teamRepository.findById(id);
        return team.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get team by name", description = "Retrieve a team by its name")
    public ResponseEntity<Team> getTeamByName(@PathVariable String name) {
        Optional<Team> team = teamRepository.findByName(name);
        return team.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get teams by status", description = "Retrieve teams filtered by status")
    public ResponseEntity<List<Team>> getTeamsByStatus(@PathVariable String status) {
        try {
            Team.TeamStatus teamStatus = Team.TeamStatus.valueOf(status.toUpperCase());
            List<Team> teams = teamRepository.findByStatus(teamStatus);
            return ResponseEntity.ok(teams);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/manager/{managerId}")
    @Operation(summary = "Get teams by manager", description = "Retrieve teams managed by a specific user")
    public ResponseEntity<List<Team>> getTeamsByManager(@PathVariable String managerId) {
        List<Team> teams = teamRepository.findByManagerId(managerId);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/member/{memberId}")
    @Operation(summary = "Get teams by member", description = "Retrieve teams that include a specific member")
    public ResponseEntity<List<Team>> getTeamsByMember(@PathVariable String memberId) {
        List<Team> teams = teamRepository.findByMemberIdsContaining(memberId);
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    @Operation(summary = "Create team", description = "Create a new team")
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        team.setId(null); // Ensure new team
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        team.setStatus(Team.TeamStatus.ACTIVE);
        
        Team savedTeam = teamRepository.save(team);
        return ResponseEntity.ok(savedTeam);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update team", description = "Update an existing team")
    public ResponseEntity<Team> updateTeam(@PathVariable String id, @RequestBody Team team) {
        Optional<Team> existingTeam = teamRepository.findById(id);
        if (existingTeam.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        team.setId(id);
        team.setUpdatedAt(LocalDateTime.now());
        team.setCreatedAt(existingTeam.get().getCreatedAt());
        
        Team savedTeam = teamRepository.save(team);
        return ResponseEntity.ok(savedTeam);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete team", description = "Delete a team")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        if (!teamRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        teamRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assignment-rules")
    @Operation(summary = "Get assignment rules", description = "Get current team assignment rules")
    public ResponseEntity<Map<String, String>> getAssignmentRules() {
        Map<String, String> rules = teamAssignmentService.getAssignmentRules().entrySet().stream()
                .collect(java.util.stream.Collectors.toMap(
                        entry -> entry.getKey().name(),
                        Map.Entry::getValue
                ));
        return ResponseEntity.ok(rules);
    }

    @PutMapping("/assignment-rules/{intent}")
    @Operation(summary = "Update assignment rule", description = "Update team assignment rule for a specific intent")
    public ResponseEntity<Void> updateAssignmentRule(
            @PathVariable String intent,
            @RequestParam String teamName) {
        try {
            com.emailassistant.model.Email.EmailIntent emailIntent = 
                    com.emailassistant.model.Email.EmailIntent.valueOf(intent.toUpperCase());
            teamAssignmentService.updateAssignmentRule(emailIntent, teamName);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
