package com.foodexpress.restaurant.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "order-service", fallback = OrderServiceClientFallback.class)
public interface OrderServiceClient {

    @GetMapping("/api/orders/restaurant/{restaurantId}")
    List<Map<String, Object>> getOrdersByRestaurant(@PathVariable String restaurantId);
}
