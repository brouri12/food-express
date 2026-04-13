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
import java.util.Map;
import java.util.Optional;

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

    /**
     * Calcule les frais de livraison et le temps estimé selon la distance.
     * Distance calculée via formule de Haversine.
     */
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

        if (newStatus == Delivery.DeliveryStatus.PICKED_UP) {
            delivery.setPickedUpAt(LocalDateTime.now());
        } else if (newStatus == Delivery.DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }

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

    /**
     * Formule de Haversine pour calculer la distance entre deux coordonnées GPS.
     */
    private double haversineDistance(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371; // Rayon de la Terre en km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
