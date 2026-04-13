package com.foodexpress.delivery.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Publie des événements de livraison vers RabbitMQ.
 * Les autres services (notification-service) peuvent s'abonner.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishDeliveryStatusUpdate(String orderId, String status, Integer estimatedMinutes) {
        Map<String, Object> event = Map.of(
            "orderId", orderId,
            "status", status,
            "estimatedMinutes", estimatedMinutes
        );

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,
            RabbitMQConfig.DELIVERY_STATUS_KEY,
            event
        );

        log.info("📡 Événement publié : livraison {} → statut {}", orderId, status);
    }
}
