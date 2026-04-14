package com.foodexpress.rating.controller;

import com.foodexpress.rating.dto.RatingRequestDTO;
import com.foodexpress.rating.dto.RatingResponseDTO;
import com.foodexpress.rating.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@Tag(name = "Ratings", description = "Gestion des avis et notes des restaurants")
public class RatingController {

    private final RatingService ratingService;

    private String resolveUserId(String userId) {
        return userId != null ? userId : "dev-user-001";
    }

    // POST /api/ratings
    @PostMapping
    @Operation(summary = "Créer un avis")
    public ResponseEntity<RatingResponseDTO> createRating(
            @Valid @RequestBody RatingRequestDTO dto,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ratingService.createRating(dto, resolveUserId(userId)));
    }

    // GET /api/ratings/{id}
    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un avis par ID")
    public ResponseEntity<RatingResponseDTO> getRatingById(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingById(id));
    }

    // PUT /api/ratings/{id}
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un avis")
    public ResponseEntity<RatingResponseDTO> updateRating(
            @PathVariable Long id,
            @Valid @RequestBody RatingRequestDTO dto,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(ratingService.updateRating(id, dto, resolveUserId(userId)));
    }

    // DELETE /api/ratings/{id}
    // X-Admin: true → suppression admin sans vérification d'ownership
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un avis (auteur ou admin)")
    public ResponseEntity<Void> deleteRating(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-Admin", required = false) String adminHeader) {
        if ("true".equals(adminHeader)) {
            ratingService.deleteRatingAdmin(id);
        } else {
            ratingService.deleteRating(id, resolveUserId(userId));
        }
        return ResponseEntity.noContent().build();
    }

    // GET /api/ratings/restaurant/{restaurantId}
    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Tous les avis d'un restaurant")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByRestaurant(
            @PathVariable String restaurantId) {
        return ResponseEntity.ok(ratingService.getRatingsByRestaurant(restaurantId));
    }

    // GET /api/ratings/restaurant/{restaurantId}/moyenne
    @GetMapping("/restaurant/{restaurantId}/moyenne")
    @Operation(summary = "Moyenne des notes d'un restaurant")
    public ResponseEntity<Map<String, Object>> getAverageByRestaurant(
            @PathVariable String restaurantId) {
        return ResponseEntity.ok(ratingService.getAverageByRestaurant(restaurantId));
    }
}
