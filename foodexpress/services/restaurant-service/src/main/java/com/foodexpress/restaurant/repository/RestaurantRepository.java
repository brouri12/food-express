package com.foodexpress.restaurant.repository;

import com.foodexpress.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, String> {

    List<Restaurant> findByActiveTrue();

    List<Restaurant> findByActiveTrueAndPromotedTrue();

    @Query("SELECT r FROM Restaurant r WHERE r.active = true AND :category MEMBER OF r.categories")
    List<Restaurant> findByCategory(@Param("category") String category);

    @Query("SELECT r FROM Restaurant r WHERE r.active = true AND " +
           "(LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Restaurant> searchByNameOrDescription(@Param("query") String query);

    List<Restaurant> findByOwnerId(String ownerId);
}
