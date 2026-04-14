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

    private final RabbitTemplate ratingRabbitTemplate;

    public void publishRatingCreated(RatingResponseDTO rating) {
        try {
            log.info("🐇 [RABBITMQ] Envoi événement rating.created — restaurant={} note={}/5",
                    rating.getRestaurantId(), rating.getNote());
            ratingRabbitTemplate.convertAndSend(
                    RabbitMQConfig.RATING_EXCHANGE,
                    RabbitMQConfig.RATING_ROUTING_KEY,
                    rating
            );
            log.info("✅ [RABBITMQ] Événement publié avec succès !");
        } catch (Exception e) {
            log.error("❌ [RABBITMQ] Erreur publication : {}", e.getMessage());
            // Non bloquant — la création de l'avis continue
        }
    }
}
