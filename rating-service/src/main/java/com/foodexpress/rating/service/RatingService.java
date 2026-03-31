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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RestaurantClient restaurantClient;
    private final RatingEventPublisher ratingEventPublisher;

    // ─────────────────────────────────────────
    // CRÉER un avis
    // ─────────────────────────────────────────
    public RatingResponseDTO createRating(RatingRequestDTO dto, String userId) {

        // 🔗 OPENFEIGN — vérifier que le restaurant existe
        // Si Restaurant Service absent → fallback retourne true automatiquement
        try {
            Boolean exists = restaurantClient.existsById(dto.getRestaurantId());
            if (exists == null || !exists) {
                throw new EntityNotFoundException(
                        "Restaurant introuvable avec l'id : " + dto.getRestaurantId());
            }
        } catch (feign.FeignException e) {
            log.error("❌ Erreur OpenFeign : {}", e.getMessage());
            throw new EntityNotFoundException(
                    "Restaurant introuvable avec l'id : " + dto.getRestaurantId());
        }

        // 🔒 RÈGLE MÉTIER — un user ne peut noter qu'une seule fois
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
        RatingResponseDTO response = toResponseDTO(saved);

        // 🐇 RABBITMQ — publier l'événement
        // Si RabbitMQ absent → erreur loguée, création non bloquée
        ratingEventPublisher.publishRatingCreated(response);

        return response;
    }

    // ─────────────────────────────────────────
    // OBTENIR un avis par ID
    // ─────────────────────────────────────────
    public RatingResponseDTO getRatingById(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Avis introuvable avec l'id : " + id));
        return toResponseDTO(rating);
    }

    // ─────────────────────────────────────────
    // MODIFIER un avis
    // ─────────────────────────────────────────
    public RatingResponseDTO updateRating(Long id, RatingRequestDTO dto, String userId) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Avis introuvable avec l'id : " + id));

        // Seul l'auteur peut modifier
        if (!rating.getUserId().equals(userId)) {
            throw new SecurityException(
                    "Vous n'êtes pas autorisé à modifier cet avis.");
        }

        rating.setNote(dto.getNote());
        rating.setCommentaire(dto.getCommentaire());

        return toResponseDTO(ratingRepository.save(rating));
    }

    // ─────────────────────────────────────────
    // SUPPRIMER un avis
    // ─────────────────────────────────────────
    public void deleteRating(Long id, String userId) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Avis introuvable avec l'id : " + id));

        // Seul l'auteur peut supprimer
        if (!rating.getUserId().equals(userId)) {
            throw new SecurityException(
                    "Vous n'êtes pas autorisé à supprimer cet avis.");
        }

        ratingRepository.deleteById(id);
    }

    // ─────────────────────────────────────────
    // TOUS les avis d'un restaurant
    // ─────────────────────────────────────────
    public List<RatingResponseDTO> getRatingsByRestaurant(Long restaurantId) {
        return ratingRepository.findByRestaurantId(restaurantId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    // ─────────────────────────────────────────
    // MOYENNE des notes d'un restaurant
    // ─────────────────────────────────────────
    public Double getAverageByRestaurant(Long restaurantId) {
        Double avg = ratingRepository.calculateAverageByRestaurantId(restaurantId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    // ─────────────────────────────────────────
    // TOUS les avis d'un plat
    // ─────────────────────────────────────────
    public List<RatingResponseDTO> getRatingsByMenuItem(Long menuItemId) {
        return ratingRepository.findByMenuItemId(menuItemId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    // ─────────────────────────────────────────
    // Mapper Entity → DTO
    // ─────────────────────────────────────────
    private RatingResponseDTO toResponseDTO(Rating rating) {
        return RatingResponseDTO.builder()
                .id(rating.getId())
                .restaurantId(rating.getRestaurantId())
                .menuItemId(rating.getMenuItemId())
                .userId(rating.getUserId())
                .note(rating.getNote())
                .commentaire(rating.getCommentaire())
                .dateCreation(rating.getDateCreation())
                .build();
    }
}