package com.foodexpress.promotion.repository;

import com.foodexpress.promotion.entity.PromoUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromoUsageRepository extends JpaRepository<PromoUsage, Long> {
    Optional<PromoUsage> findByPromoIdAndUserId(String promoId, String userId);
    int countByPromoId(String promoId);
}
