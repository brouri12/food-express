package com.foodexpress.restaurant.repository;

import com.foodexpress.restaurant.entity.OpeningHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpeningHoursRepository extends JpaRepository<OpeningHours, Long> {
    List<OpeningHours> findByRestaurantId(String restaurantId);
    Optional<OpeningHours> findByRestaurantIdAndDayOfWeek(String restaurantId, DayOfWeek day);
    void deleteByRestaurantId(String restaurantId);
}
