package com.foodexpress.promotion.controller;

import com.foodexpress.promotion.entity.Promotion;
import com.foodexpress.promotion.service.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@Tag(name = "Promotions", description = "Gestion des offres spéciales et codes promo")
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping("/public")
    @Operation(summary = "Toutes les promotions actives (public)")
    public ResponseEntity<List<Promotion>> getAllActive() {
        return ResponseEntity.ok(promotionService.getAllActive());
    }

    @GetMapping("/public/restaurant/{restaurantId}")
    @Operation(summary = "Promotions actives pour un restaurant")
    public ResponseEntity<List<Promotion>> getByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(promotionService.getActiveByRestaurant(restaurantId));
    }

    @PostMapping("/public/apply")
    @Operation(summary = "Appliquer un code promo",
               description = "Valide le code et calcule la réduction. userId optionnel pour vérifier le plafond par user.")
    public ResponseEntity<Map<String, Object>> applyCode(
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount,
            @RequestParam(required = false) String userId) {
        return ResponseEntity.ok(promotionService.applyPromoCodeForUser(code, orderAmount, userId));
    }

    // ── Promos Flash ──────────────────────────────────────────

    @GetMapping("/public/flash")
    @Operation(summary = "Promotions flash actives (compte à rebours)")
    public ResponseEntity<List<Promotion>> getFlashPromos() {
        return ResponseEntity.ok(promotionService.getFlashPromos());
    }

    // ── Parrainage ────────────────────────────────────────────

    @PostMapping("/referral/generate")
    @Operation(summary = "Générer un code de parrainage pour un utilisateur")
    public ResponseEntity<Promotion> generateReferral(
            @RequestParam String userId,
            @RequestParam String userName) {
        return ResponseEntity.ok(promotionService.generateReferralCode(userId, userName));
    }

    @GetMapping("/referral/{userId}")
    @Operation(summary = "Codes de parrainage d'un utilisateur")
    public ResponseEntity<List<Promotion>> getReferralCodes(@PathVariable String userId) {
        return ResponseEntity.ok(promotionService.getReferralCodes(userId));
    }

    @PostMapping
    @Operation(summary = "Créer une promotion (ADMIN)")
    public ResponseEntity<Promotion> create(@RequestBody Promotion promotion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.create(promotion));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une promotion (ADMIN)")
    public ResponseEntity<Promotion> update(@PathVariable String id, @RequestBody Promotion promotion) {
        return ResponseEntity.ok(promotionService.update(id, promotion));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une promotion (ADMIN)")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
