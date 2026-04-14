package com.foodexpress.restaurant.service;

import com.foodexpress.restaurant.entity.OpeningHours;
import com.foodexpress.restaurant.entity.Restaurant;
import com.foodexpress.restaurant.feign.MenuServiceClient;
import com.foodexpress.restaurant.feign.OrderServiceClient;
import com.foodexpress.restaurant.repository.OpeningHoursRepository;
import com.foodexpress.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final OpeningHoursRepository openingHoursRepository;
    private final MenuServiceClient menuServiceClient;
    private final OrderServiceClient orderServiceClient;

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
        autoAssignBadges(restaurant);
        return restaurantRepository.save(restaurant);
    }

    public Restaurant update(String id, Restaurant updated) {
        return restaurantRepository.findById(id).map(r -> {
            if (updated.getName() != null) r.setName(updated.getName());
            if (updated.getDescription() != null) r.setDescription(updated.getDescription());
            if (updated.getCuisine() != null) r.setCuisine(updated.getCuisine());
            if (updated.getImageUrl() != null) r.setImageUrl(updated.getImageUrl());
            if (updated.getAddress() != null) r.setAddress(updated.getAddress());
            if (updated.getCity() != null) r.setCity(updated.getCity());
            if (updated.getPhone() != null) r.setPhone(updated.getPhone());
            if (updated.getDeliveryFee() != null) r.setDeliveryFee(updated.getDeliveryFee());
            if (updated.getMinOrder() != null) r.setMinOrder(updated.getMinOrder());
            if (updated.getDeliveryTimeRange() != null) r.setDeliveryTimeRange(updated.getDeliveryTimeRange());
            if (updated.getCategories() != null) r.setCategories(updated.getCategories());
            if (updated.getOwnerId() != null) r.setOwnerId(updated.getOwnerId());
            if (updated.getDeliveryRadiusKm() != null) r.setDeliveryRadiusKm(updated.getDeliveryRadiusKm());
            if (updated.getBadges() != null) r.setBadges(updated.getBadges());
            r.setActive(updated.isActive());
            r.setPromoted(updated.isPromoted());
            autoAssignBadges(r);
            return restaurantRepository.save(r);
        }).orElseThrow(() -> new RuntimeException("Restaurant non trouvé : " + id));
    }

    public void delete(String id) {
        openingHoursRepository.deleteByRestaurantId(id);
        restaurantRepository.deleteById(id);
    }

    // ── Horaires d'ouverture ──────────────────────────────────

    public List<OpeningHours> getOpeningHours(String restaurantId) {
        return openingHoursRepository.findByRestaurantId(restaurantId);
    }

    @Transactional
    public List<OpeningHours> saveOpeningHours(String restaurantId, List<OpeningHours> hours) {
        openingHoursRepository.deleteByRestaurantId(restaurantId);
        hours.forEach(h -> h.setRestaurantId(restaurantId));
        return openingHoursRepository.saveAll(hours);
    }

    public Map<String, Object> isOpenNow(String restaurantId) {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Europe/Paris"));
        DayOfWeek today = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        Optional<OpeningHours> hours = openingHoursRepository
                .findByRestaurantIdAndDayOfWeek(restaurantId, today);

        if (hours.isEmpty()) {
            return Map.of("open", false, "reason", "Horaires non définis");
        }
        OpeningHours h = hours.get();
        if (h.isClosed()) {
            return Map.of("open", false, "reason", "Fermé aujourd'hui");
        }
        boolean open = !currentTime.isBefore(h.getOpenTime()) && !currentTime.isAfter(h.getCloseTime());
        return Map.of(
            "open", open,
            "openTime", h.getOpenTime().toString(),
            "closeTime", h.getCloseTime().toString(),
            "reason", open ? "Ouvert" : "Hors horaires"
        );
    }

    // ── Statistiques ──────────────────────────────────────────

    public Map<String, Object> getStats(String restaurantId) {
        List<Map<String, Object>> orders = orderServiceClient.getOrdersByRestaurant(restaurantId);

        long totalOrders = orders.size();
        double totalRevenue = orders.stream()
            .mapToDouble(o -> o.get("totalAmount") instanceof Number n ? n.doubleValue() : 0)
            .sum();
        long delivered = orders.stream()
            .filter(o -> "DELIVERED".equals(o.get("status"))).count();
        long cancelled = orders.stream()
            .filter(o -> "CANCELLED".equals(o.get("status"))).count();

        // Plats les plus commandés (depuis les items)
        Map<String, Long> itemCounts = new HashMap<>();
        orders.forEach(o -> {
            Object items = o.get("items");
            if (items instanceof List<?> list) {
                list.forEach(item -> {
                    if (item instanceof Map<?, ?> m) {
                        String name = (String) m.get("menuItemName");
                        Long qty = m.get("quantity") instanceof Number n ? n.longValue() : 1L;
                        if (name != null) itemCounts.merge(name, qty, Long::sum);
                    }
                });
            }
        });

        List<Map<String, Object>> topItems = itemCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(5)
            .map(e -> Map.<String, Object>of("name", e.getKey(), "count", e.getValue()))
            .collect(Collectors.toList());

        return Map.of(
            "totalOrders", totalOrders,
            "totalRevenue", Math.round(totalRevenue * 100.0) / 100.0,
            "deliveredOrders", delivered,
            "cancelledOrders", cancelled,
            "completionRate", totalOrders > 0 ? Math.round((delivered * 100.0 / totalOrders) * 10) / 10.0 : 0,
            "topItems", topItems
        );
    }

    // ── Zone de livraison ─────────────────────────────────────

    public Map<String, Object> checkDeliveryZone(String restaurantId, double lat, double lng) {
        Restaurant r = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant non trouvé"));

        if (r.getLatitude() == null || r.getLongitude() == null) {
            return Map.of("inZone", true, "reason", "Coordonnées restaurant non définies");
        }
        if (r.getDeliveryRadiusKm() == null) {
            return Map.of("inZone", true, "reason", "Livraison illimitée");
        }

        double distance = haversine(r.getLatitude(), r.getLongitude(), lat, lng);
        boolean inZone = distance <= r.getDeliveryRadiusKm();
        return Map.of(
            "inZone", inZone,
            "distanceKm", Math.round(distance * 100.0) / 100.0,
            "radiusKm", r.getDeliveryRadiusKm(),
            "reason", inZone ? "Dans la zone" : "Hors zone de livraison"
        );
    }

    // ── Badges automatiques ───────────────────────────────────

    private void autoAssignBadges(Restaurant r) {
        List<String> badges = new ArrayList<>(r.getBadges() != null ? r.getBadges() : List.of());
        // Nouveau : créé récemment (géré à la création)
        if (!badges.contains("Nouveau") && r.getCreatedAt() == null) {
            badges.add("Nouveau");
        }
        // Top Noté
        if (r.getRating() >= 4.5 && r.getRatingCount() >= 50 && !badges.contains("Top Noté")) {
            badges.add("Top Noté");
        }
        // Populaire
        if (r.getRatingCount() >= 500 && !badges.contains("Populaire")) {
            badges.add("Populaire");
        }
        r.setBadges(badges);
    }

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng/2) * Math.sin(dLng/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    public Map<String, Object> getRestaurantWithMenus(String id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant non trouvé : " + id));
        Map<String, Object> menus = menuServiceClient.getMenusByRestaurant(id);
        return Map.of("restaurant", restaurant, "menus", menus);
    }
}
