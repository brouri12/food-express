package com.foodexpress.order.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence vers user-service (UUID)
    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String clientName;

    // Référence vers restaurant-service (UUID)
    @Column(nullable = false)
    private String restaurantId;

    @Column(nullable = false)
    private String restaurantName;

    // Adresse de livraison
    @Column(nullable = false)
    private String deliveryAddress;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    @Column(nullable = false)
    private Double totalAmount;

    // Code promo appliqué (optionnel)
    private String promoCode;
    private Double discount;

    // QR Code Base64 généré à la création
    @Column(length = 5000)
    private String qrCode;

    // ── Commande planifiée ────────────────────────────────────
    // null = immédiate, sinon heure souhaitée de livraison
    private LocalDateTime scheduledFor;

    // ── Remboursement ─────────────────────────────────────────
    private String refundStatus;   // null | REQUESTED | APPROVED | REJECTED
    private String refundReason;
    private LocalDateTime refundRequestedAt;
    private LocalDateTime refundProcessedAt;
    private Double refundAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private java.util.List<OrderItem> items = new java.util.ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING, CONFIRMED, PREPARING, READY, ON_THE_WAY, DELIVERED, CANCELLED
    }
}
