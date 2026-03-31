package com.foodexpress.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(
            ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(auth -> auth
                        // ── GET public — consultation libre ──
                        .pathMatchers(HttpMethod.GET, "/ratings/**").permitAll()
                        // ── Reste → token JWT obligatoire ──
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {})
                );
        return http.build();
    }
}