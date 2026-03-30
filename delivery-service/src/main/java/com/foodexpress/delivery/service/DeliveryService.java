package com.foodexpress.delivery.service;

import com.foodexpress.delivery.dto.DeliveryRequest;
import com.foodexpress.delivery.dto.DeliveryStatsDto;
import com.foodexpress.delivery.dto.LocationUpdateRequest;
import com.foodexpress.delivery.model.Delivery;
import com.foodexpress.delivery.model.DeliveryStatus;
import com.foodexpress.delivery.model.Driver;
import com.foodexpress.delivery.repository.DeliveryRepository;
import com.foodexpress.delivery.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Optional<Delivery> getDeliveryById(Long id) {
        return deliveryRepository.findById(id);
    }

    public Optional<Delivery> getDeliveryByOrderId(String orderId) {
        return deliveryRepository.findByOrderId(orderId);
    }

    public List<Delivery> getDeliveriesByCustomer(String customerId) {
        return deliveryRepository.findByCustomerId(customerId);
    }

    public List<Delivery> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status);
    }

    @Transactional
    public Delivery createDelivery(DeliveryRequest request) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setCustomerId(request.getCustomerId());
        delivery.setRestaurantId(request.getRestaurantId());
        delivery.setDeliveryAddress(request.getDeliveryAddress());
        delivery.setDeliveryLatitude(request.getDeliveryLatitude());
        delivery.setDeliveryLongitude(request.getDeliveryLongitude());
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setEstimatedMinutes(30);

        // Auto-assign available driver
        List<Driver> availableDrivers = driverRepository.findByAvailable(true);
        if (!availableDrivers.isEmpty()) {
            Driver driver = availableDrivers.get(0);
            delivery.setDriverId(String.valueOf(driver.getId()));
            delivery.setDriverName(driver.getName());
            delivery.setDriverPhone(driver.getPhone());
            delivery.setDriverVehicle(driver.getVehicle());
            delivery.setDriverRating(driver.getRating());
            delivery.setDriverAvatar(driver.getAvatar());
            driver.setAvailable(false);
            driverRepository.save(driver);
            delivery.setStatus(DeliveryStatus.CONFIRMED);
        }

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Optional<Delivery> updateStatus(Long id, DeliveryStatus status) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setStatus(status);
            if (status == DeliveryStatus.PICKED_UP) {
                delivery.setPickedUpAt(LocalDateTime.now());
            } else if (status == DeliveryStatus.DELIVERED) {
                delivery.setDeliveredAt(LocalDateTime.now());
                // Free up driver
                if (delivery.getDriverId() != null) {
                    driverRepository.findById(Long.parseLong(delivery.getDriverId()))
                        .ifPresent(d -> { d.setAvailable(true); driverRepository.save(d); });
                }
            }
            return deliveryRepository.save(delivery);
        });
    }

    @Transactional
    public Optional<Delivery> updateLocation(Long id, LocationUpdateRequest request) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setCurrentLatitude(request.getLatitude());
            delivery.setCurrentLongitude(request.getLongitude());
            return deliveryRepository.save(delivery);
        });
    }

    @Transactional
    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }

    public DeliveryStatsDto getStats() {
        long total = deliveryRepository.count();
        long pending = deliveryRepository.countByStatus(DeliveryStatus.PENDING);
        long active = deliveryRepository.countByStatus(DeliveryStatus.ON_THE_WAY)
                    + deliveryRepository.countByStatus(DeliveryStatus.PICKED_UP)
                    + deliveryRepository.countByStatus(DeliveryStatus.CONFIRMED)
                    + deliveryRepository.countByStatus(DeliveryStatus.PREPARING);
        long completed = deliveryRepository.countByStatus(DeliveryStatus.DELIVERED);
        long cancelled = deliveryRepository.countByStatus(DeliveryStatus.CANCELLED);
        long totalDrivers = driverRepository.count();
        long availableDrivers = driverRepository.findByAvailable(true).size();
        return new DeliveryStatsDto(total, pending, active, completed, cancelled, totalDrivers, availableDrivers);
    }

    // Driver CRUD
    public List<Driver> getAllDrivers() { return driverRepository.findAll(); }
    public Optional<Driver> getDriverById(Long id) { return driverRepository.findById(id); }
    public Driver saveDriver(Driver driver) { return driverRepository.save(driver); }
    public void deleteDriver(Long id) { driverRepository.deleteById(id); }
}
