package com.foodexpress.rating.config;

import org.springframework.context.annotation.Configuration;

/**
 * Sécurité gérée par l'API Gateway.
 * Le rating-service est accessible sans authentification directe.
 * Spring Security Web n'est pas inclus dans les dépendances.
 */
@Configuration
public class SecurityConfig {
    // Pas de Spring Security Web — la Gateway gère le CORS et l'auth
}
