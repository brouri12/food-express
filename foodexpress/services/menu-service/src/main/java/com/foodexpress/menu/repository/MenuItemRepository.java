package com.foodexpress.menu.repository;

import com.foodexpress.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, String> {

    List<MenuItem> findByRestaurantId(String restaurantId);

    List<MenuItem> findByRestaurantIdAndAvailableTrue(String restaurantId);

    List<MenuItem> findByRestaurantIdAndCategory(String restaurantId, String category);

    Integer countByRestaurantId(String restaurantId);

    @Query("SELECT m FROM MenuItem m WHERE m.available = true AND " +
           "(LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<MenuItem> searchByNameOrDescription(@Param("query") String query);

    List<MenuItem> findByRestaurantIdAndPopularTrue(String restaurantId);
}
