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

    List<Rating> findByRestaurantId(String restaurantId);

    List<Rating> findByMenuItemId(String menuItemId);

    // Un user ne note qu'une fois un restaurant
    Optional<Rating> findByUserIdAndRestaurantId(String userId, String restaurantId);

    // Moyenne des notes d'un restaurant
    @Query("SELECT AVG(r.note) FROM Rating r WHERE r.restaurantId = :restaurantId")
    Double calculateAverageByRestaurantId(@Param("restaurantId") String restaurantId);

    // Nombre d'avis d'un restaurant
    long countByRestaurantId(String restaurantId);
}
