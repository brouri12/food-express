package com.foodexpress.order.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;
    private String menuItemId;
    private String menuItemName;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
}
