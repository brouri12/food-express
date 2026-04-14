package com.foodexpress.order.controller;

import com.foodexpress.order.dto.OrderRequestDTO;
import com.foodexpress.order.dto.OrderResponseDTO;
import com.foodexpress.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Gestion des commandes FoodExpress")
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders
    @PostMapping
    @Operation(summary = "Créer une commande (génère un QR code)")
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(dto));
    }

    // GET /api/orders
    @GetMapping
    @Operation(summary = "Toutes les commandes (admin)")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    @Operation(summary = "Commande par ID")
    public ResponseEntity<OrderResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // GET /api/orders/user/{userId}
    @GetMapping("/user/{userId}")
    @Operation(summary = "Commandes d'un utilisateur")
    public ResponseEntity<List<OrderResponseDTO>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    // GET /api/orders/restaurant/{restaurantId}
    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Commandes d'un restaurant")
    public ResponseEntity<List<OrderResponseDTO>> getByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(orderService.getOrdersByRestaurant(restaurantId));
    }

    // PATCH /api/orders/{id}/status
    @PatchMapping("/{id}/status")
    @Operation(summary = "Mettre à jour le statut d'une commande")
    public ResponseEntity<OrderResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status")));
    }

    // PUT /api/orders/{id}
    @PutMapping("/{id}")
    @Operation(summary = "Modifier une commande")
    public ResponseEntity<OrderResponseDTO> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequestDTO dto) {
        return ResponseEntity.ok(orderService.updateOrder(id, dto));
    }

    // DELETE /api/orders/{id}
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une commande")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/orders/{id}/qrcode — retourne l'image PNG du QR code
    @GetMapping(value = "/{id}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "QR code image PNG d'une commande")
    public ResponseEntity<byte[]> getQRCode(@PathVariable Long id) {
        byte[] bytes = orderService.getQRCodeBytes(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=order-" + id + ".png")
                .body(bytes);
    }

    // ── Commandes planifiées ──────────────────────────────────

    @GetMapping("/user/{userId}/scheduled")
    @Operation(summary = "Commandes planifiées d'un utilisateur")
    public ResponseEntity<List<OrderResponseDTO>> getScheduled(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getScheduledOrders(userId));
    }

    // ── Remboursements ────────────────────────────────────────

    @PostMapping("/{id}/refund")
    @Operation(summary = "Demander un remboursement")
    public ResponseEntity<OrderResponseDTO> requestRefund(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.requestRefund(id, body.get("reason")));
    }

    @PatchMapping("/{id}/refund/process")
    @Operation(summary = "Traiter une demande de remboursement (ADMIN)")
    public ResponseEntity<OrderResponseDTO> processRefund(
            @PathVariable Long id,
            @RequestParam boolean approved,
            @RequestParam(required = false) Double amount) {
        return ResponseEntity.ok(orderService.processRefund(id, approved, amount));
    }

    @GetMapping("/refunds/pending")
    @Operation(summary = "Remboursements en attente (ADMIN)")
    public ResponseEntity<List<OrderResponseDTO>> getPendingRefunds() {
        return ResponseEntity.ok(orderService.getPendingRefunds());
    }

    // ── Statistiques utilisateur ──────────────────────────────

    @GetMapping("/user/{userId}/stats")
    @Operation(summary = "Statistiques de commandes d'un utilisateur")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getUserStats(userId));
    }
}
