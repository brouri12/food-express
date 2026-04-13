package com.foodexpress.gateway.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.ArrayList;
import java.util.List;

/**
 * Agrège la documentation Swagger de tous les micro-services via la Gateway.
 * Accessible sur : http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    @Lazy(false)
    public List<GroupedOpenApi> apis(RouteDefinitionLocator locator) {
        List<GroupedOpenApi> groups = new ArrayList<>();
        List<RouteDefinition> definitions = locator.getRouteDefinitions().collectList().block();
        if (definitions != null) {
            definitions.stream()
                    .filter(def -> def.getId().matches(".*-service"))
                    .forEach(def -> {
                        String name = def.getId();
                        groups.add(GroupedOpenApi.builder()
                                .pathsToMatch("/" + name + "/**")
                                .group(name)
                                .build());
                    });
        }
        return groups;
    }
}
