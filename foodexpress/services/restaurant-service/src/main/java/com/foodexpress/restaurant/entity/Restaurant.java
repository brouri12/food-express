package com.foodexpress.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String cuisine; // ex: Française, Italienne, Japonaise...

    @Column(nullable = true)
    private String ownerId; // référence vers user-service (optionnel depuis l'admin)

    private String imageUrl;
    private String address;
    private String city;
    private String phone;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private Double deliveryFee;

    @Column(nullable = false)
    private Integer minOrder;

    // Temps de livraison estimé ex: "25-35"
    private String deliveryTimeRange;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;

    @ElementCollection
    @CollectionTable(name = "restaurant_categories", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "category")
    @Builder.Default
    private List<String> categories = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean promoted = false;

    // ── Fonctionnalités avancées ──────────────────────────────

    // Rayon de livraison en km (null = illimité)
    private Double deliveryRadiusKm;

    // Badges : "Nouveau", "Populaire", "Éco-responsable", "Top Noté"
    @ElementCollection
    @CollectionTable(name = "restaurant_badges", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "badge")
    @Builder.Default
    private List<String> badges = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
