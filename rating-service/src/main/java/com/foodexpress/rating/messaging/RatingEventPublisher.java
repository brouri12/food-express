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
            log.info("════════════════════════════════════════════════");
            log.info("🐇 [RABBITMQ PUBLISHER] Envoi du message...");
            log.info("   Exchange   : {}", RabbitMQConfig.RATING_EXCHANGE);
            log.info("   RoutingKey : {}", RabbitMQConfig.RATING_ROUTING_KEY);
            log.info("   Queue      : {}", RabbitMQConfig.RATING_QUEUE);
            log.info("   Rating ID  : {}", rating.getId());
            log.info("   Restaurant : {}", rating.getRestaurantId());
            log.info("   Note       : {}/5", rating.getNote());
            log.info("   User ID    : {}", rating.getUserId());

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.RATING_EXCHANGE,
                    RabbitMQConfig.RATING_ROUTING_KEY,
                    rating
            );

            log.info("✅ [RABBITMQ PUBLISHER] Message publié avec succès !");
            log.info("════════════════════════════════════════════════");

        } catch (Exception e) {
            log.error("════════════════════════════════════════════════");
            log.error("❌ [RABBITMQ PUBLISHER] Erreur publication : {}", e.getMessage());
            log.error("════════════════════════════════════════════════");
        }
    }
}