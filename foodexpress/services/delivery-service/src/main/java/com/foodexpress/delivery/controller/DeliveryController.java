package com.foodexpress.delivery.controller;

import com.foodexpress.delivery.entity.Delivery;
import com.foodexpress.delivery.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
@Tag(name = "Livraison", description = "Suivi et gestion des livraisons")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping
    @Operation(summary = "Lister toutes les livraisons (ADMIN)")
    public ResponseEntity<List<Delivery>> getAll() {
        return ResponseEntity.ok(deliveryService.findAll());
    }

    @GetMapping("/pending")
    @Operation(summary = "Lister les livraisons en attente (LIVREUR)")
    public ResponseEntity<List<Delivery>> getPending() {
        return ResponseEntity.ok(deliveryService.findByStatus(Delivery.DeliveryStatus.PENDING));
    }

    @GetMapping("/my")
    @Operation(summary = "Mes livraisons assignées (LIVREUR)")
    public ResponseEntity<List<Delivery>> getMyDeliveries(@RequestParam String driverId) {
        return ResponseEntity.ok(deliveryService.findByDriverId(driverId));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Suivi d'une livraison par numéro de commande")
    public ResponseEntity<Delivery> getByOrder(@PathVariable String orderId) {
        return deliveryService.findByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calculate")
    @Operation(summary = "Calculer les frais et temps de livraison estimé (25-35 min)",
               description = "Utilise la formule de Haversine pour calculer la distance GPS")
    public ResponseEntity<Map<String, Object>> calculate(
            @RequestParam double restaurantLat,
            @RequestParam double restaurantLng,
            @RequestParam double deliveryLat,
            @RequestParam double deliveryLng) {
        return ResponseEntity.ok(
            deliveryService.calculateDelivery(restaurantLat, restaurantLng, deliveryLat, deliveryLng)
        );
    }

    @PutMapping("/manage/{orderId}/status")
    @Operation(summary = "Mettre à jour le statut d'une livraison (LIVREUR)")
    public ResponseEntity<Delivery> updateStatus(
            @PathVariable String orderId,
            @RequestParam Delivery.DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.updateStatus(orderId, status));
    }

    @PutMapping("/manage/{orderId}/assign")
    @Operation(summary = "Assigner un livreur à une commande (LIVREUR)")
    public ResponseEntity<Delivery> assignDriver(
            @PathVariable String orderId,
            @RequestParam String driverId,
            @RequestParam String driverName,
            @RequestParam String driverPhone) {
        return ResponseEntity.ok(deliveryService.assignDriver(orderId, driverId, driverName, driverPhone));
    }

    // ── Position GPS ──────────────────────────────────────────

    @PatchMapping("/manage/{orderId}/position")
    @Operation(summary = "Mettre à jour la position GPS du livreur")
    public ResponseEntity<Delivery> updatePosition(
            @PathVariable String orderId,
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(deliveryService.updatePosition(orderId, lat, lng));
    }

    // ── Notation livreur ──────────────────────────────────────

    @PostMapping("/order/{orderId}/rate")
    @Operation(summary = "Noter le livreur après livraison (CLIENT)")
    public ResponseEntity<Delivery> rateDriver(
            @PathVariable String orderId,
            @RequestParam int rating,
            @RequestParam(required = false, defaultValue = "") String comment) {
        return ResponseEntity.ok(deliveryService.rateDriver(orderId, rating, comment));
    }

    @GetMapping("/driver/{driverId}/ratings")
    @Operation(summary = "Statistiques de notation d'un livreur")
    public ResponseEntity<Map<String, Object>> getDriverRatings(@PathVariable String driverId) {
        return ResponseEntity.ok(deliveryService.getDriverRatingStats(driverId));
    }

    // ── Revenus livreur ───────────────────────────────────────

    @GetMapping("/driver/{driverId}/earnings")
    @Operation(summary = "Revenus d'un livreur (total + semaine)")
    public ResponseEntity<Map<String, Object>> getDriverEarnings(@PathVariable String driverId) {
        return ResponseEntity.ok(deliveryService.getDriverEarnings(driverId));
    }

    // ── Optimisation tournée ──────────────────────────────────

    @GetMapping("/route/optimized")
    @Operation(summary = "Livraisons PENDING triées par distance depuis la position du livreur")
    public ResponseEntity<List<Delivery>> getOptimizedRoute(
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(deliveryService.getOptimizedRoute(lat, lng));
    }
}
