package com.foodexpress.rating.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponseDTO {

    private Long id;
    private Long restaurantId;
    private Long menuItemId;
    private String userId;
    private Integer note;
    private String commentaire;
    private LocalDateTime dateCreation;
}