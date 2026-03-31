package com.foodexpress.rating.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingRequestDTO {

    @NotNull(message = "restaurantId est obligatoire")
    private Long restaurantId;

    private Long menuItemId; // optionnel

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    private Integer note;

    @Size(max = 500, message = "Le commentaire ne peut pas dépasser 500 caractères")
    private String commentaire;
}