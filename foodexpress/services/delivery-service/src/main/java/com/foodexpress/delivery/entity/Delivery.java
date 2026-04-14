package com.foodexpress.delivery.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String orderId;

    private String driverId;
    private String driverName;
    private String driverPhone;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String restaurantId;

    // Adresse de livraison
    @Column(nullable = false)
    private String deliveryAddress;

    private Double restaurantLat;
    private Double restaurantLng;
    private Double deliveryLat;
    private Double deliveryLng;

    // Position actuelle du livreur
    private Double currentLat;
    private Double currentLng;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    // Temps estimé en minutes (ex: 30)
    private Integer estimatedMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.PENDING;

    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    // ── Notation livreur ──────────────────────────────────────
    // Note donnée par le client après livraison (1-5)
    private Integer driverRating;
    private String  driverRatingComment;
    private LocalDateTime ratedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum DeliveryStatus {
        PENDING,      // En attente d'un livreur
        ASSIGNED,     // Livreur assigné
        PICKED_UP,    // Commande récupérée au restaurant
        ON_THE_WAY,   // En route
        DELIVERED,    // Livrée
        CANCELLED     // Annulée
    }
}
