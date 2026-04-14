package com.foodexpress.rating.feign;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RestaurantClientFallback implements RestaurantClient {

    @Override
    public Object getRestaurantById(String id) {
        log.warn("⚠️ [FEIGN FALLBACK] Restaurant Service indisponible pour id={}", id);
        return null; // null = restaurant supposé existant en fallback
    }
}
