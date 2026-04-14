package com.foodexpress.menu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String restaurantId;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String imageUrl;

    @Column(nullable = false)
    private String category;

    @Builder.Default
    private boolean popular = false;

    @Builder.Default
    private boolean vegetarian = false;

    @Builder.Default
    private boolean vegan = false;

    @Builder.Default
    private boolean glutenFree = false;

    @Builder.Default
    private boolean available = true;

    // ── Gestion des stocks ────────────────────────────────────
    // null = illimité, 0 = rupture
    private Integer stockQuantity;

    @Builder.Default
    private Integer stockAlertThreshold = 5; // alerte si stock <= seuil

    // ── Options / Suppléments ─────────────────────────────────
    // JSON stocké : [{"name":"Sauce BBQ","price":0.50},{"name":"Extra fromage","price":1.00}]
    @Column(length = 2000)
    private String optionsJson;

    // ── Prix dynamique (Happy Hour) ───────────────────────────
    // Réduction en % applicable entre happyHourStart et happyHourEnd
    private Integer happyHourDiscountPercent;
    private LocalTime happyHourStart;
    private LocalTime happyHourEnd;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
