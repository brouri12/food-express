package com.foodexpress.order.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long id;
    private String userId;
    private String clientName;
    private String restaurantId;
    private String restaurantName;
    private String deliveryAddress;
    private String status;
    private Double totalAmount;
    private String promoCode;
    private Double discount;
    private String qrCode;
    private List<OrderItemDTO> items;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime scheduledFor;

    private String refundStatus;
    private String refundReason;
    private Double refundAmount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime updatedAt;
}
