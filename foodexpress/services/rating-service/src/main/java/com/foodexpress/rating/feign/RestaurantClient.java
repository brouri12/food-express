package com.foodexpress.rating.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Client Feign vers restaurant-service.
 * Vérifie qu'un restaurant existe avant de créer un avis.
 */
@FeignClient(name = "restaurant-service", fallback = RestaurantClientFallback.class)
public interface RestaurantClient {

    @GetMapping("/api/restaurants/{id}")
    Object getRestaurantById(@PathVariable("id") String id);
}
