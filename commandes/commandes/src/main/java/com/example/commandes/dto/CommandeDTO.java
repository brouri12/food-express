package com.example.commandes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private Long id;
    private String clientName;
    private String product;
    private Integer quantity;
    private Double price;
    private String status;
    private String qrCode; // Base64 encoded QR code image
}
