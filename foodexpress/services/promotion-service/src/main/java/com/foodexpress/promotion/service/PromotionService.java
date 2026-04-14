package com.foodexpress.promotion.service;

import com.foodexpress.promotion.entity.Promotion;
import com.foodexpress.promotion.entity.PromoUsage;
import com.foodexpress.promotion.repository.PromotionRepository;
import com.foodexpress.promotion.repository.PromoUsageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromoUsageRepository promoUsageRepository;

    public List<Promotion> getAllActive() {
        return promotionRepository.findAllActive(LocalDate.now());
    }

    public List<Promotion> getActiveByRestaurant(String restaurantId) {
        return promotionRepository.findActiveByRestaurant(restaurantId, LocalDate.now());
    }

    // ── Promos Flash ──────────────────────────────────────────

    public List<Promotion> getFlashPromos() {
        return promotionRepository.findActiveFlashPromos(LocalDateTime.now());
    }

    // ── Parrainage ────────────────────────────────────────────

    /**
     * Génère un code de parrainage unique pour un utilisateur.
     * Le parrain et le filleul reçoivent chacun -10%.
     */
    @Transactional
    public Promotion generateReferralCode(String referrerId, String referrerName) {
        // Vérifier si un code existe déjà
        List<Promotion> existing = promotionRepository.findByReferrerIdAndReferralPromoTrue(referrerId);
        if (!existing.isEmpty()) return existing.get(0);

        String code = "REF-" + referrerName.toUpperCase().replaceAll("[^A-Z0-9]", "")
                      + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Promotion referral = Promotion.builder()
                .title("Parrainage de " + referrerName)
                .description("Code parrainage — -10% pour vous et votre filleul")
                .code(code)
                .type(Promotion.PromotionType.PERCENTAGE)
                .discountPercent(10)
                .validFrom(LocalDate.now())
                .validUntil(LocalDate.now().plusYears(1))
                .usageLimit(100)
                .maxUsagePerUser(1)
                .referralPromo(true)
                .referrerId(referrerId)
                .targetSegment("ALL")
                .active(true)
                .build();

        log.info("🎁 Code parrainage généré pour {} : {}", referrerName, code);
        return promotionRepository.save(referral);
    }

    public List<Promotion> getReferralCodes(String referrerId) {
        return promotionRepository.findByReferrerIdAndReferralPromoTrue(referrerId);
    }

    // ── Application code promo (avec plafond par user) ────────

    @Transactional
    public Map<String, Object> applyPromoCode(String code, BigDecimal orderAmount) {
        return applyPromoCodeForUser(code, orderAmount, null);
    }

    @Transactional
    public Map<String, Object> applyPromoCodeForUser(String code, BigDecimal orderAmount, String userId) {
        Promotion promo = promotionRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new IllegalArgumentException("Code promo invalide : " + code));

        LocalDate today = LocalDate.now();
        if (!promo.isActive() || today.isBefore(promo.getValidFrom()) || today.isAfter(promo.getValidUntil())) {
            throw new IllegalArgumentException("Code promo expiré ou inactif");
        }

        // Vérifier flash expirée
        if (promo.getFlashEndTime() != null && LocalDateTime.now().isAfter(promo.getFlashEndTime())) {
            throw new IllegalArgumentException("Promo flash expirée");
        }

        if (promo.getUsageCount() >= promo.getUsageLimit()) {
            throw new IllegalArgumentException("Code promo épuisé");
        }

        if (promo.getMinOrderAmount() != null && orderAmount.compareTo(promo.getMinOrderAmount()) < 0) {
            throw new IllegalArgumentException("Commande minimum requise : " + promo.getMinOrderAmount() + "€");
        }

        // Vérifier plafond par utilisateur
        if (userId != null && promo.getMaxUsagePerUser() != null) {
            PromoUsage usage = promoUsageRepository.findByPromoIdAndUserId(promo.getId(), userId).orElse(null);
            if (usage != null && usage.getUsageCount() >= promo.getMaxUsagePerUser()) {
                throw new IllegalArgumentException("Vous avez déjà utilisé ce code promo");
            }
            // Enregistrer l'utilisation
            if (usage == null) {
                promoUsageRepository.save(PromoUsage.builder()
                        .promoId(promo.getId()).userId(userId).usageCount(1).lastUsedAt(LocalDateTime.now()).build());
            } else {
                usage.setUsageCount(usage.getUsageCount() + 1);
                usage.setLastUsedAt(LocalDateTime.now());
                promoUsageRepository.save(usage);
            }
        }

        BigDecimal discount = calculateDiscount(promo, orderAmount);
        BigDecimal finalAmount = orderAmount.subtract(discount).max(BigDecimal.ZERO);

        promo.setUsageCount(promo.getUsageCount() + 1);
        promotionRepository.save(promo);

        return Map.of(
            "promoId", promo.getId(),
            "code", promo.getCode(),
            "type", promo.getType(),
            "originalAmount", orderAmount,
            "discount", discount,
            "finalAmount", finalAmount,
            "isReferral", promo.isReferralPromo(),
            "isFlash", promo.getFlashEndTime() != null
        );
    }

    private BigDecimal calculateDiscount(Promotion promo, BigDecimal orderAmount) {
        return switch (promo.getType()) {
            case PERCENTAGE -> orderAmount.multiply(BigDecimal.valueOf(promo.getDiscountPercent()))
                    .divide(BigDecimal.valueOf(100));
            case FIXED_AMOUNT -> promo.getDiscountAmount().min(orderAmount);
            case FREE_DELIVERY -> BigDecimal.valueOf(2.99);
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
            p.setImageUrl(updated.getImageUrl());
            p.setValidFrom(updated.getValidFrom());
            p.setValidUntil(updated.getValidUntil());
            p.setActive(updated.isActive());
            if (updated.getFlashEndTime() != null) p.setFlashEndTime(updated.getFlashEndTime());
            if (updated.getTargetSegment() != null) p.setTargetSegment(updated.getTargetSegment());
            if (updated.getMaxUsagePerUser() != null) p.setMaxUsagePerUser(updated.getMaxUsagePerUser());
            return promotionRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Promotion non trouvée : " + id));
    }

    public void delete(String id) {
        promotionRepository.deleteById(id);
    }
}
