package com.foodexpress.restaurant.service;

import com.foodexpress.restaurant.entity.Restaurant;
import com.foodexpress.restaurant.feign.MenuServiceClient;
import com.foodexpress.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuServiceClient menuServiceClient;

    public List<Restaurant> getAllActive() {
        return restaurantRepository.findByActiveTrue();
    }

    public Optional<Restaurant> findById(String id) {
        return restaurantRepository.findById(id);
    }

    public List<Restaurant> findByCategory(String category) {
        return restaurantRepository.findByCategory(category);
    }

    public List<Restaurant> search(String query) {
        return restaurantRepository.searchByNameOrDescription(query);
    }

    public List<Restaurant> getPromoted() {
        return restaurantRepository.findByActiveTrueAndPromotedTrue();
    }

    public Restaurant create(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant update(String id, Restaurant updated) {
        return restaurantRepository.findById(id).map(r -> {
            r.setName(updated.getName());
            r.setDescription(updated.getDescription());
            r.setImageUrl(updated.getImageUrl());
            r.setAddress(updated.getAddress());
            r.setCity(updated.getCity());
            r.setPhone(updated.getPhone());
            r.setDeliveryFee(updated.getDeliveryFee());
            r.setMinOrder(updated.getMinOrder());
            r.setDeliveryTimeRange(updated.getDeliveryTimeRange());
            r.setCategories(updated.getCategories());
            return restaurantRepository.save(r);
        }).orElseThrow(() -> new RuntimeException("Restaurant non trouvé : " + id));
    }

    public void delete(String id) {
        restaurantRepository.deleteById(id);
    }

    /**
     * Récupère les infos d'un restaurant avec ses menus via Feign (communication synchrone).
     */
    public Map<String, Object> getRestaurantWithMenus(String id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant non trouvé : " + id));
        Map<String, Object> menus = menuServiceClient.getMenusByRestaurant(id);
        return Map.of("restaurant", restaurant, "menus", menus);
    }
}
