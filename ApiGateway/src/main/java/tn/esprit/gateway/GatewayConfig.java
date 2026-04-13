package tn.esprit.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(GatewayConfig.class);
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        logger.info("Configuring Gateway Routes...");
        
        RouteLocator routes = builder.routes()
                // Route for Commandes Service
                .route("commande-service", r -> {
                    logger.info("Registering route: /commandes/** -> lb://COMMANDE-SERVICE");
                    return r.path("/commandes/**")
                            .uri("lb://COMMANDE-SERVICE");
                })
                .build();
        
        logger.info("Gateway Routes configured successfully");
        return routes;
    }
}

