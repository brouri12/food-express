package com.foodexpress.delivery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeliveryRequest {
    @NotBlank
    private String orderId;
    @NotBlank
    private String customerId;
    @NotBlank
    private String restaurantId;
    @NotBlank
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
}
