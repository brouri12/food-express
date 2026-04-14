package com.foodexpress.order.repository;

import com.foodexpress.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(String restaurantId);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    // Commandes planifiées prêtes à être traitées
    @Query("SELECT o FROM Order o WHERE o.scheduledFor IS NOT NULL AND o.scheduledFor <= :now AND o.status = 'SCHEDULED'")
    List<Order> findScheduledOrdersDue(@Param("now") LocalDateTime now);

    // Commandes annulées éligibles au remboursement
    List<Order> findByRefundStatus(String refundStatus);
}
