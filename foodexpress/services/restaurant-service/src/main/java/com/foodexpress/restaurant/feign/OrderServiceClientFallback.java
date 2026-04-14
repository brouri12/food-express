package com.foodexpress.restaurant.feign;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class OrderServiceClientFallback implements OrderServiceClient {

    @Override
    public List<Map<String, Object>> getOrdersByRestaurant(String restaurantId) {
        return List.of();
    }
}
