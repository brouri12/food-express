package com.foodexpress.rating.controller;

import com.foodexpress.rating.dto.RatingRequestDTO;
import com.foodexpress.rating.dto.RatingResponseDTO;
import com.foodexpress.rating.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // ── Résoudre userId : JWT si prod, ID fictif si dev ──
    private String resolveUserId(Jwt jwt) {
        if (jwt != null) {
            return jwt.getSubject();
        }
        return "dev-user-001"; // Mode dev sans Keycloak
    }

    // POST /ratings
    @PostMapping
    public ResponseEntity<RatingResponseDTO> createRating(
            @Valid @RequestBody RatingRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ratingService.createRating(dto, resolveUserId(jwt)));
    }

    // GET /ratings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<RatingResponseDTO> getRatingById(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingById(id));
    }

    // PUT /ratings/{id}
    @PutMapping("/{id}")
    public ResponseEntity<RatingResponseDTO> updateRating(
            @PathVariable Long id,
            @Valid @RequestBody RatingRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
                ratingService.updateRating(id, dto, resolveUserId(jwt)));
    }

    // DELETE /ratings/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        ratingService.deleteRating(id, resolveUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    // GET /ratings/restaurant/{restaurantId}
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByRestaurant(
            @PathVariable Long restaurantId) {
        return ResponseEntity.ok(
                ratingService.getRatingsByRestaurant(restaurantId));
    }

    // GET /ratings/restaurant/{restaurantId}/moyenne
    @GetMapping("/restaurant/{restaurantId}/moyenne")
    public ResponseEntity<Double> getAverageByRestaurant(
            @PathVariable Long restaurantId) {
        return ResponseEntity.ok(
                ratingService.getAverageByRestaurant(restaurantId));
    }

    // GET /ratings/menu/{menuItemId}
    @GetMapping("/menu/{menuItemId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByMenuItem(
            @PathVariable Long menuItemId) {
        return ResponseEntity.ok(
                ratingService.getRatingsByMenuItem(menuItemId));
    }
}