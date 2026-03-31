package com.foodexpress.rating.repository;

import com.foodexpress.rating.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRestaurantId(Long restaurantId);

    List<Rating> findByMenuItemId(Long menuItemId);

    // Règle métier : un user ne note qu'une fois un restaurant
    Optional<Rating> findByUserIdAndRestaurantId(String userId, Long restaurantId);

    // Moyenne des notes d'un restaurant
    @Query("SELECT AVG(r.note) FROM Rating r WHERE r.restaurantId = :restaurantId")
    Double calculateAverageByRestaurantId(@Param("restaurantId") Long restaurantId);

    // Moyenne des notes d'un plat
    @Query("SELECT AVG(r.note) FROM Rating r WHERE r.menuItemId = :menuItemId")
    Double calculateAverageByMenuItemId(@Param("menuItemId") Long menuItemId);
}