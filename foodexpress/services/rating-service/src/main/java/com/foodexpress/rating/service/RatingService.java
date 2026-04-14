package com.foodexpress.rating.service;

import com.foodexpress.rating.dto.RatingRequestDTO;
import com.foodexpress.rating.dto.RatingResponseDTO;
import com.foodexpress.rating.entity.Rating;
import com.foodexpress.rating.feign.RestaurantClient;
import com.foodexpress.rating.messaging.RatingEventPublisher;
import com.foodexpress.rating.repository.RatingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RestaurantClient restaurantClient;
    private final RatingEventPublisher ratingEventPublisher;

    // ── CRÉER un avis ──────────────────────────────────────────
    public RatingResponseDTO createRating(RatingRequestDTO dto, String userId) {

        // 🔗 OPENFEIGN — vérifier que le restaurant existe
        log.info("🔗 [FEIGN] Vérification restaurant id={}", dto.getRestaurantId());
        try {
            Object restaurant = restaurantClient.getRestaurantById(dto.getRestaurantId());
            if (restaurant == null) {
                log.warn("⚠️ [FEIGN] Restaurant {} non trouvé (fallback actif)", dto.getRestaurantId());
            } else {
                log.info("✅ [FEIGN] Restaurant {} confirmé", dto.getRestaurantId());
            }
        } catch (Exception e) {
            log.error("❌ [FEIGN] Erreur appel restaurant-service : {}", e.getMessage());
        }

        // 🔒 Un user ne peut noter qu'une seule fois
        ratingRepository.findByUserIdAndRestaurantId(userId, dto.getRestaurantId())
                .ifPresent(r -> {
                    throw new IllegalStateException(
                            "Vous avez déjà noté ce restaurant. Utilisez la modification.");
                });

        Rating rating = Rating.builder()
                .restaurantId(dto.getRestaurantId())
                .menuItemId(dto.getMenuItemId())
                .userId(userId)
                .note(dto.getNote())
                .commentaire(dto.getCommentaire())
                .build();

        Rating saved = ratingRepository.save(rating);
        RatingResponseDTO response = toDTO(saved);

        // 🐇 RABBITMQ — publier l'événement (non bloquant)
        ratingEventPublisher.publishRatingCreated(response);

        return response;
    }

    // ── OBTENIR un avis par ID ──────────────────────────────────
    public RatingResponseDTO getRatingById(Long id) {
        return toDTO(ratingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable : " + id)));
    }

    // ── MODIFIER un avis ────────────────────────────────────────
    public RatingResponseDTO updateRating(Long id, RatingRequestDTO dto, String userId) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable : " + id));
        if (!rating.getUserId().equals(userId)) {
            throw new SecurityException("Vous n'êtes pas autorisé à modifier cet avis.");
        }
        rating.setNote(dto.getNote());
        rating.setCommentaire(dto.getCommentaire());
        return toDTO(ratingRepository.save(rating));
    }

    // ── SUPPRIMER un avis (par l'auteur) ───────────────────────
    public void deleteRating(Long id, String userId) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable : " + id));
        if (!rating.getUserId().equals(userId)) {
            throw new SecurityException("Vous n'êtes pas autorisé à supprimer cet avis.");
        }
        ratingRepository.deleteById(id);
    }

    // ── SUPPRIMER un avis (par l'admin, sans vérification) ─────
    public void deleteRatingAdmin(Long id) {
        if (!ratingRepository.existsById(id)) {
            throw new EntityNotFoundException("Avis introuvable : " + id);
        }
        ratingRepository.deleteById(id);
    }

    // ── TOUS les avis d'un restaurant ───────────────────────────
    public List<RatingResponseDTO> getRatingsByRestaurant(String restaurantId) {
        return ratingRepository.findByRestaurantId(restaurantId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── MOYENNE des notes d'un restaurant ───────────────────────
    public Map<String, Object> getAverageByRestaurant(String restaurantId) {
        Double avg = ratingRepository.calculateAverageByRestaurantId(restaurantId);
        long count = ratingRepository.countByRestaurantId(restaurantId);
        double rounded = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
        return Map.of("average", rounded, "count", count, "restaurantId", restaurantId);
    }

    // ── Mapper Entity → DTO ─────────────────────────────────────
    private RatingResponseDTO toDTO(Rating r) {
        return RatingResponseDTO.builder()
                .id(r.getId())
                .restaurantId(r.getRestaurantId())
                .menuItemId(r.getMenuItemId())
                .userId(r.getUserId())
                .note(r.getNote())
                .commentaire(r.getCommentaire())
                .dateCreation(r.getDateCreation())
                .build();
    }
}
