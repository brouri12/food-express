package com.foodexpress.rating.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // ══════════════════════════════════════════
    // PROFIL DEV — Tout est permis, pas de JWT
    // ══════════════════════════════════════════
    @Bean
    @Profile("dev")
    public SecurityFilterChain devFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ── Swagger ──
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs"
                        ).permitAll()
                        // ── Tout le reste permis en dev ──
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    // ══════════════════════════════════════════
    // PROFIL PROD — Keycloak JWT obligatoire
    // ══════════════════════════════════════════
    @Bean
    @Profile("prod")
    public SecurityFilterChain prodFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ── Swagger toujours accessible ──
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs"
                        ).permitAll()
                        // ── GET public ──
                        .requestMatchers(HttpMethod.GET, "/ratings/**").permitAll()
                        // ── Reste → authentifié ──
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );
        return http.build();
    }

    // Convertit les rôles Keycloak → Spring Security
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess == null || !realmAccess.containsKey("roles")) {
                return List.of();
            }
            @SuppressWarnings("unchecked")
            Collection<String> roles =
                    (Collection<String>) realmAccess.get("roles");
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority(
                            "ROLE_" + role.toUpperCase()))
                    .collect(Collectors.toList());
        });
        return converter;
    }
}