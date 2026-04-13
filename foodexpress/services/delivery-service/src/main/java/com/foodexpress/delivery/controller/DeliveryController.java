package com.foodexpress.delivery.controller;

import com.foodexpress.delivery.entity.Delivery;
import com.foodexpress.delivery.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
@Tag(name = "Livraison", description = "Suivi et gestion des livraisons")
public class DeliveryController {

    private final DeliveryService deliveryService;

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
}
