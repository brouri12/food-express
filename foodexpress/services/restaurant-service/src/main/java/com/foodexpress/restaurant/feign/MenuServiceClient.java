package com.foodexpress.restaurant.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

/**
 * Client Feign pour communication synchrone avec le menu-service.
 * Le menu-service retourne Map<String, List<MenuItem>> (groupé par catégorie).
 */
@FeignClient(name = "menu-service", fallback = MenuServiceClientFallback.class)
public interface MenuServiceClient {

    @GetMapping("/api/menus/restaurant/{restaurantId}")
    Map<String, Object> getMenusByRestaurant(@PathVariable("restaurantId") String restaurantId);

    @GetMapping("/api/menus/restaurant/{restaurantId}/count")
    Integer countMenuItemsByRestaurant(@PathVariable("restaurantId") String restaurantId);
}
