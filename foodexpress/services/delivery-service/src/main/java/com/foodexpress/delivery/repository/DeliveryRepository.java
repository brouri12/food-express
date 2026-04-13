package com.foodexpress.delivery.repository;

import com.foodexpress.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, String> {
    Optional<Delivery> findByOrderId(String orderId);
    List<Delivery> findByDriverId(String driverId);
    List<Delivery> findByCustomerId(String customerId);
    List<Delivery> findByStatus(Delivery.DeliveryStatus status);
}
