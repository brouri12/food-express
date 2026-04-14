package com.foodexpress.user.controller;

import com.foodexpress.user.entity.User;
import com.foodexpress.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "Gestion des profils utilisateurs")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Tous les utilisateurs (ADMIN)")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Utilisateurs par rôle (ADMIN)")
    public ResponseEntity<List<User>> getByRole(@PathVariable String role) {
        return ResponseEntity.ok(userRepository.findByRole(User.Role.valueOf(role.toUpperCase())));
    }

    @GetMapping("/me")
    @Operation(summary = "Mon profil (email en query param)")
    public ResponseEntity<User> getMyProfile(@RequestParam(required = false) String email) {
        if (email == null) return ResponseEntity.badRequest().build();
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Profil par ID")
    public ResponseEntity<User> getById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un profil")
    public ResponseEntity<User> update(@PathVariable String id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setPhone(updatedUser.getPhone());
            user.setAvatarUrl(updatedUser.getAvatarUrl());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }
}
