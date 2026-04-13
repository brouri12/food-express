package com.foodexpress.rating.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String RATING_QUEUE       = "rating.created.queue";
    public static final String RATING_EXCHANGE    = "rating.exchange";
    public static final String RATING_ROUTING_KEY = "rating.created";

    @Bean
    public Queue ratingQueue() {
        return new Queue(RATING_QUEUE, true);
    }

    @Bean
    public DirectExchange ratingExchange() {
        return new DirectExchange(RATING_EXCHANGE);
    }

    @Bean
    public Binding ratingBinding(Queue ratingQueue,
                                 DirectExchange ratingExchange) {
        return BindingBuilder
                .bind(ratingQueue)
                .to(ratingExchange)
                .with(RATING_ROUTING_KEY);
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // ← Support LocalDateTime
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        // ← Utilise notre ObjectMapper configuré
        return new Jackson2JsonMessageConverter(objectMapper());
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}