package com.foodexpress.delivery.service;

import com.foodexpress.delivery.entity.Delivery;
import com.foodexpress.delivery.messaging.DeliveryEventPublisher;
import com.foodexpress.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryEventPublisher eventPublisher;

    @Value("${delivery.base-fee:1.99}")
    private double baseFee;

    @Value("${delivery.fee-per-km:0.50}")
    private double feePerKm;

    @Value("${delivery.estimated-time-min:25}")
    private int estimatedTimeMin;

    @Value("${delivery.estimated-time-max:35}")
    private int estimatedTimeMax;

    public Optional<Delivery> findByOrderId(String orderId) {
        return deliveryRepository.findByOrderId(orderId);
    }

    public List<Delivery> findAll() {
        return deliveryRepository.findAll();
    }

    public List<Delivery> findByStatus(Delivery.DeliveryStatus status) {
        return deliveryRepository.findByStatus(status);
    }

    public List<Delivery> findByDriverId(String driverId) {
        return deliveryRepository.findByDriverId(driverId);
    }

    public Map<String, Object> calculateDelivery(double restaurantLat, double restaurantLng,
                                                  double deliveryLat, double deliveryLng) {
        double distanceKm = haversineDistance(restaurantLat, restaurantLng, deliveryLat, deliveryLng);
        double fee = baseFee + (distanceKm * feePerKm);
        int estimatedTime = estimatedTimeMin + (int) (distanceKm * 2);
        estimatedTime = Math.min(estimatedTime, estimatedTimeMax);

        return Map.of(
            "distanceKm", BigDecimal.valueOf(distanceKm).setScale(2, RoundingMode.HALF_UP),
            "deliveryFee", BigDecimal.valueOf(fee).setScale(2, RoundingMode.HALF_UP),
            "estimatedTimeMin", estimatedTimeMin,
            "estimatedTimeMax", estimatedTimeMax,
            "estimatedTime", estimatedTime,
            "displayRange", estimatedTimeMin + "-" + estimatedTimeMax + " min"
        );
    }

    public Delivery updateStatus(String orderId, Delivery.DeliveryStatus newStatus) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée pour la commande : " + orderId));
        delivery.setStatus(newStatus);
        if (newStatus == Delivery.DeliveryStatus.PICKED_UP) delivery.setPickedUpAt(LocalDateTime.now());
        else if (newStatus == Delivery.DeliveryStatus.DELIVERED) delivery.setDeliveredAt(LocalDateTime.now());
        delivery = deliveryRepository.save(delivery);
        eventPublisher.publishDeliveryStatusUpdate(orderId, newStatus.name(), delivery.getEstimatedMinutes());
        return delivery;
    }

    public Delivery assignDriver(String orderId, String driverId, String driverName, String driverPhone) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée : " + orderId));
        delivery.setDriverId(driverId);
        delivery.setDriverName(driverName);
        delivery.setDriverPhone(driverPhone);
        delivery.setStatus(Delivery.DeliveryStatus.ASSIGNED);
        return deliveryRepository.save(delivery);
    }

    // ── Mise à jour position GPS ──────────────────────────────

    public Delivery updatePosition(String orderId, double lat, double lng) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée : " + orderId));
        delivery.setCurrentLat(lat);
        delivery.setCurrentLng(lng);
        return deliveryRepository.save(delivery);
    }

    // ── Notation livreur ──────────────────────────────────────

    public Delivery rateDriver(String orderId, int rating, String comment) {
        if (rating < 1 || rating > 5) throw new IllegalArgumentException("Note entre 1 et 5");
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée : " + orderId));
        if (delivery.getStatus() != Delivery.DeliveryStatus.DELIVERED) {
            throw new IllegalStateException("Notation possible uniquement après livraison");
        }
        if (delivery.getDriverRating() != null) {
            throw new IllegalStateException("Livreur déjà noté pour cette livraison");
        }
        delivery.setDriverRating(rating);
        delivery.setDriverRatingComment(comment);
        delivery.setRatedAt(LocalDateTime.now());
        return deliveryRepository.save(delivery);
    }

    public Map<String, Object> getDriverRatingStats(String driverId) {
        List<Delivery> rated = deliveryRepository.findByDriverId(driverId).stream()
                .filter(d -> d.getDriverRating() != null)
                .collect(Collectors.toList());
        if (rated.isEmpty()) return Map.of("average", 0, "count", 0, "ratings", List.of());
        double avg = rated.stream().mapToInt(Delivery::getDriverRating).average().orElse(0);
        List<Map<String, Object>> ratings = rated.stream()
                .map(d -> Map.<String, Object>of(
                    "orderId", d.getOrderId(),
                    "rating", d.getDriverRating(),
                    "comment", d.getDriverRatingComment() != null ? d.getDriverRatingComment() : "",
                    "date", d.getRatedAt() != null ? d.getRatedAt().toString() : ""
                ))
                .collect(Collectors.toList());
        return Map.of(
            "driverId", driverId,
            "average", BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP),
            "count", rated.size(),
            "ratings", ratings
        );
    }

    // ── Revenus livreur ───────────────────────────────────────

    public Map<String, Object> getDriverEarnings(String driverId) {
        List<Delivery> delivered = deliveryRepository.findByDriverId(driverId).stream()
                .filter(d -> d.getStatus() == Delivery.DeliveryStatus.DELIVERED)
                .collect(Collectors.toList());
        double total = delivered.stream()
                .mapToDouble(d -> d.getDeliveryFee() != null ? d.getDeliveryFee().doubleValue() : 0)
                .sum();
        // Revenus par semaine (7 derniers jours)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        double weekEarnings = delivered.stream()
                .filter(d -> d.getDeliveredAt() != null && d.getDeliveredAt().isAfter(weekAgo))
                .mapToDouble(d -> d.getDeliveryFee() != null ? d.getDeliveryFee().doubleValue() : 0)
                .sum();
        return Map.of(
            "driverId", driverId,
            "totalDeliveries", delivered.size(),
            "totalEarnings", BigDecimal.valueOf(total).setScale(2, RoundingMode.HALF_UP),
            "weekEarnings", BigDecimal.valueOf(weekEarnings).setScale(2, RoundingMode.HALF_UP),
            "averagePerDelivery", delivered.isEmpty() ? 0 :
                BigDecimal.valueOf(total / delivered.size()).setScale(2, RoundingMode.HALF_UP)
        );
    }

    // ── Optimisation de tournée ───────────────────────────────
    // Trie les livraisons PENDING par distance croissante depuis la position du livreur

    public List<Delivery> getOptimizedRoute(double driverLat, double driverLng) {
        List<Delivery> pending = deliveryRepository.findByStatus(Delivery.DeliveryStatus.PENDING);
        // Trier par distance depuis la position du livreur (restaurant le plus proche en premier)
        return pending.stream()
                .sorted(Comparator.comparingDouble(d -> {
                    if (d.getRestaurantLat() != null && d.getRestaurantLng() != null) {
                        return haversineDistance(driverLat, driverLng, d.getRestaurantLat(), d.getRestaurantLng());
                    }
                    return Double.MAX_VALUE; // sans coordonnées → en dernier
                }))
                .collect(Collectors.toList());
    }

    private double haversineDistance(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
