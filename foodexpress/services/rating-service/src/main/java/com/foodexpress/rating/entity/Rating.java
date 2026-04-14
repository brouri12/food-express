package com.foodexpress.rating.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // restaurantId est un UUID String dans notre projet
    @NotBlank(message = "restaurantId est obligatoire")
    @Column(nullable = false)
    private String restaurantId;

    // Optionnel : avis sur un plat spécifique
    @Column(nullable = true)
    private String menuItemId;

    @NotBlank(message = "userId est obligatoire")
    @Column(nullable = false)
    private String userId;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    @Column(nullable = false)
    private Integer note;

    @Size(max = 500, message = "Le commentaire ne peut pas dépasser 500 caractères")
    @Column(length = 500)
    private String commentaire;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
    }
}
