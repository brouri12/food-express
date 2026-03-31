package com.foodexpress.rating.messaging;




import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;  // ← ligne 6
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
        return new Queue(RATING_QUEUE, true); // durable
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
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}