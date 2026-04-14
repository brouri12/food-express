package com.foodexpress.promotion.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "promo_usages",
       uniqueConstraints = @UniqueConstraint(columnNames = {"promo_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "promo_id", nullable = false)
    private String promoId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Builder.Default
    private Integer usageCount = 1;

    @CreationTimestamp
    private LocalDateTime firstUsedAt;

    private LocalDateTime lastUsedAt;
}
