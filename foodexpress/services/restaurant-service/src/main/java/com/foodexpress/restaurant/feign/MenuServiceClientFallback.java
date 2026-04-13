package com.foodexpress.restaurant.feign;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

@Component
public class MenuServiceClientFallback implements MenuServiceClient {

    @Override
    public Map<String, Object> getMenusByRestaurant(String restaurantId) {
        return Collections.emptyMap();
    }

    @Override
    public Integer countMenuItemsByRestaurant(String restaurantId) {
        return 0;
    }
}
