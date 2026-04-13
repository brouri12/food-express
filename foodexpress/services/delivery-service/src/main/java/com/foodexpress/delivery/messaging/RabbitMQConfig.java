package com.foodexpress.delivery.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration RabbitMQ pour la communication asynchrone.
 *
 * Flux :
 *   order-service → [order.created] → delivery-service (crée une livraison)
 *   delivery-service → [delivery.status.updated] → notification-service
 */
@Configuration
public class RabbitMQConfig {

    // Exchange principal FoodExpress
    public static final String EXCHANGE = "foodexpress.exchange";

    // Queues
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";
    public static final String DELIVERY_STATUS_QUEUE = "delivery.status.queue";

    // Routing keys
    public static final String ORDER_CREATED_KEY = "order.created";
    public static final String DELIVERY_STATUS_KEY = "delivery.status.updated";

    @Bean
    public TopicExchange foodExpressExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue orderCreatedQueue() {
        return QueueBuilder.durable(ORDER_CREATED_QUEUE).build();
    }

    @Bean
    public Queue deliveryStatusQueue() {
        return QueueBuilder.durable(DELIVERY_STATUS_QUEUE).build();
    }

    @Bean
    public Binding orderCreatedBinding() {
        return BindingBuilder.bind(orderCreatedQueue())
                .to(foodExpressExchange())
                .with(ORDER_CREATED_KEY);
    }

    @Bean
    public Binding deliveryStatusBinding() {
        return BindingBuilder.bind(deliveryStatusQueue())
                .to(foodExpressExchange())
                .with(DELIVERY_STATUS_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
