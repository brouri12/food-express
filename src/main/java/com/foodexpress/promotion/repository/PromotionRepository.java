package com.foodexpress.promotion.repository;

import com.foodexpress.promotion.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, String> {

    Optional<Promotion> findByCodeIgnoreCase(String code);

    @Query("SELECT p FROM Promotion p WHERE p.active = true AND p.validFrom <= :today AND p.validUntil >= :today")
    List<Promotion> findAllActive(LocalDate today);

    @Query("SELECT p FROM Promotion p WHERE p.active = true AND p.validFrom <= :today AND p.validUntil >= :today " +
           "AND (p.restaurantId IS NULL OR p.restaurantId = :restaurantId)")
    List<Promotion> findActiveByRestaurant(String restaurantId, LocalDate today);
}
