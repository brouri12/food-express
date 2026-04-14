package com.foodexpress.promotion.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(unique = true)
    private String code; // ex: BIENVENUE20, LIVRAISON0

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromotionType type;

    // Pourcentage de réduction (ex: 20 pour -20%)
    private Integer discountPercent;

    // Montant fixe de réduction
    private BigDecimal discountAmount;

    // Commande minimum pour activer la promo
    private BigDecimal minOrderAmount;

    // Null = applicable à tous les restaurants
    private String restaurantId;

    private String imageUrl;

    @Column(nullable = false)
    private LocalDate validFrom;

    @Column(nullable = false)
    private LocalDate validUntil;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer usageLimit = 1000;

    @Column(nullable = false)
    @Builder.Default
    private Integer usageCount = 0;

    // ── Plafond par utilisateur ───────────────────────────────
    @Builder.Default
    private Integer maxUsagePerUser = 1; // max utilisations par utilisateur (null = illimité)

    // ── Promo Flash ───────────────────────────────────────────
    // Si non null → promo flash avec heure de fin précise
    private LocalDateTime flashEndTime;

    // ── Ciblage ───────────────────────────────────────────────
    // "NEW_USER" | "INACTIVE_30" | "ALL" (null = ALL)
    private String targetSegment;

    // ── Parrainage ────────────────────────────────────────────
    @Builder.Default
    private boolean referralPromo = false; // true = code de parrainage
    private String referrerId; // userId du parrain

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum PromotionType {
        PERCENTAGE,       // -X%
        FIXED_AMOUNT,     // -X€
        FREE_DELIVERY,    // Livraison gratuite
        BUY_ONE_GET_ONE   // 1 acheté = 1 offert
    }
}
