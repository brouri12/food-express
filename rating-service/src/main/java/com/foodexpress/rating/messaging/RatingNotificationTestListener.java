package com.foodexpress.rating.messaging;

import com.foodexpress.rating.dto.RatingResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@Profile("dev")
public class RatingNotificationTestListener {

    @RabbitListener(queues = RabbitMQConfig.RATING_QUEUE)
    public void receiveRatingEvent(RatingResponseDTO rating) {
        log.info("════════════════════════════════════════════════");
        log.info("📩 [NOTIFICATION SERVICE] Message reçu !");
        log.info("   ➤ Rating ID      : {}", rating.getId());
        log.info("   ➤ Restaurant ID  : {}", rating.getRestaurantId());
        log.info("   ➤ Note           : {}/5", rating.getNote());
        log.info("   ➤ Commentaire    : {}", rating.getCommentaire());
        log.info("   ➤ User ID        : {}", rating.getUserId());
        log.info("   ➤ Date création  : {}", rating.getDateCreation());
        log.info("   → ACTION : Email de confirmation envoyé ! 📧");
        log.info("   → ACTION : SMS de notification envoyé ! 📱");
        log.info("════════════════════════════════════════════════");
    }
}