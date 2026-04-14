package com.foodexpress.order.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {

    @NotBlank(message = "userId est obligatoire")
    private String userId;

    @NotBlank(message = "clientName est obligatoire")
    private String clientName;

    @NotBlank(message = "restaurantId est obligatoire")
    private String restaurantId;

    @NotBlank(message = "restaurantName est obligatoire")
    private String restaurantName;

    @NotBlank(message = "deliveryAddress est obligatoire")
    private String deliveryAddress;

    @NotEmpty(message = "La commande doit contenir au moins un article")
    private List<OrderItemDTO> items;

    private String promoCode;
    private Double discount;

    // Commande planifiée (optionnel) — ISO datetime ex: "2026-04-15T19:30:00"
    private java.time.LocalDateTime scheduledFor;
}
