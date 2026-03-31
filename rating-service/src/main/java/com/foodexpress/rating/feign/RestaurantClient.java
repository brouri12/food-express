package com.foodexpress.rating.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "restaurant-service",
        fallback = RestaurantClientFallback.class
)
public interface RestaurantClient {
    @GetMapping("/restaurants/{id}/exists")
    Boolean existsById(@PathVariable("id") Long id);
}