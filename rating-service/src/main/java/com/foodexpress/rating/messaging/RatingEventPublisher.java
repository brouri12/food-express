package com.foodexpress.rating.messaging;

import com.foodexpress.rating.dto.RatingResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishRatingCreated(RatingResponseDTO rating) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.RATING_EXCHANGE,
                    RabbitMQConfig.RATING_ROUTING_KEY,
                    rating
            );
            log.info("✅ [RABBITMQ] Événement publié — rating id={}, restaurant={}",
                    rating.getId(), rating.getRestaurantId());
        } catch (Exception e) {
            // Ne bloque pas la création de l'avis
            log.error("❌ [RABBITMQ] Erreur de publication : {}", e.getMessage());
        }
    }
}