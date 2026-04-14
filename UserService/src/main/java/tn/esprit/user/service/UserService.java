package tn.esprit.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.user.dto.RegisterRequest;
import tn.esprit.user.dto.UpdateUserRequest;
import tn.esprit.user.entity.User;
import tn.esprit.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }

        String keycloakId = keycloakService.createKeycloakUser(request);

        User user = new User();
        user.setKeycloak_id(keycloakId);
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setTelephone(request.getTelephone());
        user.setSpecialite(request.getSpecialite());
        user.setExperience(request.getExperience());
        user.setDisponibilite(request.getDisponibilite());
        user.setNiveau_actuel(request.getNiveau_actuel());
        user.setStatut_etudiant(request.getStatut_etudiant());
        user.setPoste(request.getPoste());
        user.setEnabled(true);
        user.setDate_creation(LocalDateTime.now());

        User saved = userRepository.save(user);
        log.info("Registered user: {}", saved.getUsername());
        return saved;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        if (request.getNom() != null) user.setNom(request.getNom());
        if (request.getPrenom() != null) user.setPrenom(request.getPrenom());
        if (request.getTelephone() != null) user.setTelephone(request.getTelephone());
        if (request.getSpecialite() != null) user.setSpecialite(request.getSpecialite());
        if (request.getExperience() != null) user.setExperience(request.getExperience());
        if (request.getDisponibilite() != null) user.setDisponibilite(request.getDisponibilite());
        if (request.getNiveau_actuel() != null) user.setNiveau_actuel(request.getNiveau_actuel());
        if (request.getStatut_etudiant() != null) user.setStatut_etudiant(request.getStatut_etudiant());
        if (request.getPoste() != null) user.setPoste(request.getPoste());

        User updated = userRepository.save(user);
        log.info("Updated user: {}", updated.getUsername());
        return updated;
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        keycloakService.deleteKeycloakUser(user.getKeycloak_id());
        userRepository.delete(user);
        log.info("Deleted user: {}", user.getUsername());
    }

    @Transactional
    public void updateLastLogin(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setLast_login(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}
