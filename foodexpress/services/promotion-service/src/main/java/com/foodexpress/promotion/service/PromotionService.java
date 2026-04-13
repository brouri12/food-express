package com.foodexpress.promotion.service;

import com.foodexpress.promotion.entity.Promotion;
import com.foodexpress.promotion.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<Promotion> getAllActive() {
        return promotionRepository.findAllActive(LocalDate.now());
    }

    public List<Promotion> getActiveByRestaurant(String restaurantId) {
        return promotionRepository.findActiveByRestaurant(restaurantId, LocalDate.now());
    }

    /**
     * Valide un code promo et calcule la réduction sur un montant donné.
     * Retourne le détail de la réduction appliquée.
     */
    public Map<String, Object> applyPromoCode(String code, BigDecimal orderAmount) {
        Promotion promo = promotionRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new IllegalArgumentException("Code promo invalide : " + code));

        LocalDate today = LocalDate.now();
        if (!promo.isActive() || today.isBefore(promo.getValidFrom()) || today.isAfter(promo.getValidUntil())) {
            throw new IllegalArgumentException("Code promo expiré ou inactif");
        }

        if (promo.getUsageCount() >= promo.getUsageLimit()) {
            throw new IllegalArgumentException("Code promo épuisé");
        }

        if (promo.getMinOrderAmount() != null && orderAmount.compareTo(promo.getMinOrderAmount()) < 0) {
            throw new IllegalArgumentException(
                "Commande minimum requise : " + promo.getMinOrderAmount() + "€");
        }

        BigDecimal discount = calculateDiscount(promo, orderAmount);
        BigDecimal finalAmount = orderAmount.subtract(discount).max(BigDecimal.ZERO);

        // Incrémenter le compteur d'utilisation
        promo.setUsageCount(promo.getUsageCount() + 1);
        promotionRepository.save(promo);

        return Map.of(
            "promoId", promo.getId(),
            "code", promo.getCode(),
            "type", promo.getType(),
            "originalAmount", orderAmount,
            "discount", discount,
            "finalAmount", finalAmount
        );
    }

    private BigDecimal calculateDiscount(Promotion promo, BigDecimal orderAmount) {
        return switch (promo.getType()) {
            case PERCENTAGE -> orderAmount.multiply(BigDecimal.valueOf(promo.getDiscountPercent()))
                    .divide(BigDecimal.valueOf(100));
            case FIXED_AMOUNT -> promo.getDiscountAmount().min(orderAmount);
            case FREE_DELIVERY -> BigDecimal.valueOf(2.99); // frais de livraison standard
            case BUY_ONE_GET_ONE -> orderAmount.divide(BigDecimal.valueOf(2));
        };
    }

    public Promotion create(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public Promotion update(String id, Promotion updated) {
        return promotionRepository.findById(id).map(p -> {
            p.setTitle(updated.getTitle());
            p.setDescription(updated.getDescription());
            p.setCode(updated.getCode());
            p.setType(updated.getType());
            p.setDiscountPercent(updated.getDiscountPercent());
            p.setDiscountAmount(updated.getDiscountAmount());
            p.setMinOrderAmount(updated.getMinOrderAmount());
            p.setValidFrom(updated.getValidFrom());
            p.setValidUntil(updated.getValidUntil());
            p.setActive(updated.isActive());
            return promotionRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Promotion non trouvée : " + id));
    }

    public void delete(String id) {
        promotionRepository.deleteById(id);
    }
}
