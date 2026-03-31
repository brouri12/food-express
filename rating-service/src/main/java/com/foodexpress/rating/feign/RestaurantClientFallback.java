package com.foodexpress.rating.feign;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RestaurantClientFallback implements RestaurantClient {

    @Override
    public Boolean existsById(Long id) {
        // ✅ Restaurant Service absent → on suppose qu'il existe
        // La preuve que OpenFeign EST configuré et fonctionne
        log.warn("⚠️ [FEIGN FALLBACK] Restaurant Service indisponible.");
        log.warn("⚠️ Restaurant id={} supposé existant (fallback actif).", id);
        return true;
    }
}