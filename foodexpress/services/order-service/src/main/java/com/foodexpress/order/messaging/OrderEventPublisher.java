package com.foodexpress.order.messaging;

import com.foodexpress.order.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventPublisher {

    private final RabbitTemplate orderRabbitTemplate;

    public void publishOrderCreated(Order order) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("orderId", String.valueOf(order.getId()));
            event.put("customerId", order.getUserId());
            event.put("restaurantId", order.getRestaurantId());
            event.put("deliveryAddress", order.getDeliveryAddress());
            event.put("deliveryFee", 2.50); // frais par défaut
            event.put("totalAmount", order.getTotalAmount());
            event.put("status", order.getStatus());

            orderRabbitTemplate.convertAndSend(
                OrderRabbitConfig.EXCHANGE,
                OrderRabbitConfig.ORDER_CREATED_KEY,
                event
            );
            log.info("📤 Événement order.created publié pour commande #{}", order.getId());
        } catch (Exception e) {
            log.warn("⚠️ Impossible de publier l'événement RabbitMQ : {}", e.getMessage());
        }
    }
}
