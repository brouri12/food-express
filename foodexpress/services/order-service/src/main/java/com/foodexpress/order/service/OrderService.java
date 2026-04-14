package com.foodexpress.order.service;

import com.foodexpress.order.dto.OrderItemDTO;
import com.foodexpress.order.dto.OrderRequestDTO;
import com.foodexpress.order.dto.OrderResponseDTO;
import com.foodexpress.order.entity.Order;
import com.foodexpress.order.entity.OrderItem;
import com.foodexpress.order.messaging.OrderEventPublisher;
import com.foodexpress.order.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final QRCodeService qrCodeService;
    private final OrderEventPublisher eventPublisher;

    // ── CRÉER une commande ──────────────────────────────────────
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        // Calculer le total
        double total = dto.getItems().stream()
                .mapToDouble(i -> i.getUnitPrice() * i.getQuantity())
                .sum();
        double discount = dto.getDiscount() != null ? dto.getDiscount() : 0.0;
        double finalTotal = Math.max(0, total - discount);

        Order order = Order.builder()
                .userId(dto.getUserId())
                .clientName(dto.getClientName())
                .restaurantId(dto.getRestaurantId())
                .restaurantName(dto.getRestaurantName())
                .deliveryAddress(dto.getDeliveryAddress())
                .status(dto.getScheduledFor() != null ? "SCHEDULED" : "PENDING")
                .totalAmount(finalTotal)
                .promoCode(dto.getPromoCode())
                .discount(discount)
                .scheduledFor(dto.getScheduledFor())
                .build();

        // Sauvegarder pour obtenir l'ID
        Order saved = orderRepository.save(order);

        // Ajouter les articles
        if (dto.getItems() != null) {
            List<OrderItem> items = dto.getItems().stream().map(i ->
                OrderItem.builder()
                    .order(saved)
                    .menuItemId(i.getMenuItemId())
                    .menuItemName(i.getMenuItemName())
                    .quantity(i.getQuantity())
                    .unitPrice(i.getUnitPrice())
                    .build()
            ).collect(Collectors.toList());
            saved.setItems(items);
        }

        // Générer le QR code
        String qr = qrCodeService.generateOrderQRCode(
                saved.getId(), saved.getClientName(),
                saved.getRestaurantName(), saved.getTotalAmount(), saved.getStatus());
        saved.setQrCode(qr);

        Order result = orderRepository.save(saved);
        log.info("✅ Commande #{} créée pour {} — {}€", result.getId(), result.getClientName(), result.getTotalAmount());

        // Publier l'événement RabbitMQ → delivery-service crée automatiquement une livraison
        eventPublisher.publishOrderCreated(result);

        return toDTO(result);
    }

    // ── OBTENIR toutes les commandes ────────────────────────────
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── OBTENIR une commande par ID ─────────────────────────────
    public OrderResponseDTO getOrderById(Long id) {
        return toDTO(findOrThrow(id));
    }

    // ── COMMANDES d'un utilisateur ──────────────────────────────
    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── COMMANDES d'un restaurant ───────────────────────────────
    public List<OrderResponseDTO> getOrdersByRestaurant(String restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── METTRE À JOUR le statut ─────────────────────────────────
    public OrderResponseDTO updateStatus(Long id, String status) {
        Order order = findOrThrow(id);
        order.setStatus(status);
        return toDTO(orderRepository.save(order));
    }

    // ── METTRE À JOUR une commande ──────────────────────────────
    public OrderResponseDTO updateOrder(Long id, OrderRequestDTO dto) {
        Order order = findOrThrow(id);
        order.setDeliveryAddress(dto.getDeliveryAddress());
        if (dto.getDiscount() != null) order.setDiscount(dto.getDiscount());
        if (dto.getPromoCode() != null) order.setPromoCode(dto.getPromoCode());
        return toDTO(orderRepository.save(order));
    }

    // ── SUPPRIMER une commande ──────────────────────────────────
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Commande introuvable : " + id);
        }
        orderRepository.deleteById(id);
    }

    // ── QR CODE image bytes ─────────────────────────────────────
    public byte[] getQRCodeBytes(Long id) {
        Order order = findOrThrow(id);
        if (order.getQrCode() == null) throw new EntityNotFoundException("QR code absent pour commande " + id);
        return java.util.Base64.getDecoder().decode(order.getQrCode());
    }

    // ── Commandes planifiées ─────────────────────────────────────
    public List<OrderResponseDTO> getScheduledOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(o -> "SCHEDULED".equals(o.getStatus()))
                .map(this::toDTO).collect(Collectors.toList());
    }

    /** Tâche planifiée : toutes les minutes, active les commandes dont l'heure est arrivée */
    @Scheduled(fixedRate = 60000)
    public void processScheduledOrders() {
        List<Order> due = orderRepository.findScheduledOrdersDue(LocalDateTime.now());
        for (Order o : due) {
            o.setStatus("PENDING");
            orderRepository.save(o);
            eventPublisher.publishOrderCreated(o);
            log.info("⏰ Commande planifiée #{} activée", o.getId());
        }
    }

    // ── Remboursement ─────────────────────────────────────────────
    public OrderResponseDTO requestRefund(Long id, String reason) {
        Order order = findOrThrow(id);
        if (!"CANCELLED".equals(order.getStatus()) && !"DELIVERED".equals(order.getStatus())) {
            throw new IllegalStateException("Remboursement possible uniquement pour commandes annulées ou livrées");
        }
        if (order.getRefundStatus() != null) {
            throw new IllegalStateException("Une demande de remboursement existe déjà");
        }
        order.setRefundStatus("REQUESTED");
        order.setRefundReason(reason);
        order.setRefundRequestedAt(LocalDateTime.now());
        order.setRefundAmount(order.getTotalAmount()); // remboursement total par défaut
        log.info("💰 Demande de remboursement pour commande #{} — raison: {}", id, reason);
        return toDTO(orderRepository.save(order));
    }

    public OrderResponseDTO processRefund(Long id, boolean approved, Double amount) {
        Order order = findOrThrow(id);
        if (!"REQUESTED".equals(order.getRefundStatus())) {
            throw new IllegalStateException("Aucune demande de remboursement en attente");
        }
        order.setRefundStatus(approved ? "APPROVED" : "REJECTED");
        order.setRefundProcessedAt(LocalDateTime.now());
        if (approved && amount != null) order.setRefundAmount(amount);
        log.info("💰 Remboursement {} pour commande #{} — {}€",
                approved ? "approuvé" : "rejeté", id, order.getRefundAmount());
        return toDTO(orderRepository.save(order));
    }

    public List<OrderResponseDTO> getPendingRefunds() {
        return orderRepository.findByRefundStatus("REQUESTED")
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Statistiques utilisateur ──────────────────────────────────
    public Map<String, Object> getUserStats(String userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long total = orders.size();
        long delivered = orders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count();
        double totalSpent = orders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .mapToDouble(Order::getTotalAmount).sum();
        return Map.of(
            "totalOrders", total,
            "deliveredOrders", delivered,
            "totalSpent", Math.round(totalSpent * 100.0) / 100.0,
            "averageOrder", delivered > 0 ? Math.round((totalSpent / delivered) * 100.0) / 100.0 : 0
        );
    }

    // ── Helpers ─────────────────────────────────────────────────
    private Order findOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Commande introuvable : " + id));
    }

    private OrderResponseDTO toDTO(Order o) {
        List<OrderItemDTO> items = o.getItems() == null ? List.of() :
            o.getItems().stream().map(i -> OrderItemDTO.builder()
                .id(i.getId())
                .menuItemId(i.getMenuItemId())
                .menuItemName(i.getMenuItemName())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .subtotal(i.getSubtotal())
                .build()
            ).collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(o.getId())
                .userId(o.getUserId())
                .clientName(o.getClientName())
                .restaurantId(o.getRestaurantId())
                .restaurantName(o.getRestaurantName())
                .deliveryAddress(o.getDeliveryAddress())
                .status(o.getStatus())
                .totalAmount(o.getTotalAmount())
                .promoCode(o.getPromoCode())
                .discount(o.getDiscount())
                .qrCode(o.getQrCode())
                .scheduledFor(o.getScheduledFor())
                .refundStatus(o.getRefundStatus())
                .refundReason(o.getRefundReason())
                .refundAmount(o.getRefundAmount())
                .items(items)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}
