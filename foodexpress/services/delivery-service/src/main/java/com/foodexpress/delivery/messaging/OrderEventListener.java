package com.foodexpress.delivery.messaging;

import com.foodexpress.delivery.entity.Delivery;
import com.foodexpress.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Écoute les événements RabbitMQ.
 * Quand une nouvelle commande est créée, ce listener crée automatiquement
 * une entrée de livraison avec le temps estimé (25-35 min).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryEventPublisher eventPublisher;

    @RabbitListener(queues = RabbitMQConfig.ORDER_CREATED_QUEUE)
    public void handleOrderCreated(Map<String, Object> orderEvent) {
        log.info("📦 Nouvelle commande reçue via RabbitMQ : {}", orderEvent.get("orderId"));

        try {
            Delivery delivery = Delivery.builder()
                    .orderId((String) orderEvent.get("orderId"))
                    .customerId((String) orderEvent.get("customerId"))
                    .restaurantId((String) orderEvent.get("restaurantId"))
                    .deliveryAddress((String) orderEvent.get("deliveryAddress"))
                    .deliveryFee(new BigDecimal(orderEvent.get("deliveryFee").toString()))
                    .estimatedMinutes(30) // 25-35 min, on prend 30 par défaut
                    .status(Delivery.DeliveryStatus.PENDING)
                    .build();

            deliveryRepository.save(delivery);
            log.info("✅ Livraison créée pour la commande {}", delivery.getOrderId());

            // Publier un événement de confirmation
            eventPublisher.publishDeliveryStatusUpdate(delivery.getOrderId(), "PENDING", 30);

        } catch (Exception e) {
            log.error("❌ Erreur lors du traitement de la commande : {}", e.getMessage());
        }
    }
}
