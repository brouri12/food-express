package com.foodexpress.menu.service;

import com.foodexpress.menu.entity.MenuItem;
import com.foodexpress.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    // ── Prix dynamique (Happy Hour) ───────────────────────────

    /**
     * Retourne le prix effectif d'un plat selon l'heure actuelle.
     * Si happy hour actif → applique la réduction.
     */
    public BigDecimal getEffectivePrice(MenuItem item) {
        if (item.getHappyHourDiscountPercent() == null
                || item.getHappyHourStart() == null
                || item.getHappyHourEnd() == null) {
            return item.getPrice();
        }
        LocalTime now = ZonedDateTime.now(ZoneId.of("Europe/Paris")).toLocalTime();
        boolean inHappyHour = !now.isBefore(item.getHappyHourStart())
                && !now.isAfter(item.getHappyHourEnd());
        if (!inHappyHour) return item.getPrice();

        BigDecimal discount = item.getPrice()
                .multiply(BigDecimal.valueOf(item.getHappyHourDiscountPercent()))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return item.getPrice().subtract(discount).setScale(2, RoundingMode.HALF_UP);
    }

    public Map<String, Object> getItemWithEffectivePrice(String id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé : " + id));
        BigDecimal effectivePrice = getEffectivePrice(item);
        boolean happyHourActive = !effectivePrice.equals(item.getPrice());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("item", item);
        result.put("effectivePrice", effectivePrice);
        result.put("happyHourActive", happyHourActive);
        if (happyHourActive) {
            result.put("originalPrice", item.getPrice());
            result.put("discountPercent", item.getHappyHourDiscountPercent());
            result.put("happyHourEnd", item.getHappyHourEnd().toString());
        }
        return result;
    }

    // ── Gestion des stocks ────────────────────────────────────

    public MenuItem updateStock(String id, int quantity) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé : " + id));
        item.setStockQuantity(quantity);
        // Auto-désactiver si rupture
        if (quantity == 0) {
            item.setAvailable(false);
            log.warn("⚠️ Rupture de stock pour : {} ({})", item.getName(), id);
        } else {
            item.setAvailable(true);
        }
        return menuItemRepository.save(item);
    }

    public List<Map<String, Object>> getLowStockAlerts(String restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .filter(i -> i.getStockQuantity() != null
                        && i.getStockQuantity() <= (i.getStockAlertThreshold() != null ? i.getStockAlertThreshold() : 5))
                .map(i -> {
                    Map<String, Object> alert = new LinkedHashMap<>();
                    alert.put("id", i.getId());
                    alert.put("name", i.getName());
                    alert.put("stock", i.getStockQuantity());
                    alert.put("threshold", i.getStockAlertThreshold());
                    alert.put("critical", i.getStockQuantity() == 0);
                    return alert;
                })
                .collect(Collectors.toList());
    }

    // ── Export CSV ────────────────────────────────────────────

    public String exportToCsv(String restaurantId) {
        List<MenuItem> items = menuItemRepository.findByRestaurantId(restaurantId);
        StringBuilder sb = new StringBuilder();
        sb.append("id,name,category,price,description,vegetarian,vegan,glutenFree,popular,available,stockQuantity\n");
        for (MenuItem i : items) {
            sb.append(String.join(",",
                    safe(i.getId()),
                    safe(i.getName()),
                    safe(i.getCategory()),
                    i.getPrice().toPlainString(),
                    safe(i.getDescription()),
                    String.valueOf(i.isVegetarian()),
                    String.valueOf(i.isVegan()),
                    String.valueOf(i.isGlutenFree()),
                    String.valueOf(i.isPopular()),
                    String.valueOf(i.isAvailable()),
                    i.getStockQuantity() != null ? i.getStockQuantity().toString() : ""
            )).append("\n");
        }
        return sb.toString();
    }

    // ── Import CSV ────────────────────────────────────────────

    public List<MenuItem> importFromCsv(String restaurantId, String csvContent) {
        List<MenuItem> imported = new ArrayList<>();
        String[] lines = csvContent.split("\n");
        // Skip header
        for (int i = 1; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;
            try {
                String[] cols = line.split(",", -1);
                MenuItem item = MenuItem.builder()
                        .restaurantId(restaurantId)
                        .name(cols[1])
                        .category(cols[2])
                        .price(new BigDecimal(cols[3]))
                        .description(cols.length > 4 ? cols[4] : "")
                        .vegetarian(cols.length > 5 && Boolean.parseBoolean(cols[5]))
                        .vegan(cols.length > 6 && Boolean.parseBoolean(cols[6]))
                        .glutenFree(cols.length > 7 && Boolean.parseBoolean(cols[7]))
                        .popular(cols.length > 8 && Boolean.parseBoolean(cols[8]))
                        .available(cols.length <= 9 || Boolean.parseBoolean(cols[9]))
                        .build();
                imported.add(menuItemRepository.save(item));
            } catch (Exception e) {
                log.warn("Ligne CSV ignorée (erreur) : {}", line);
            }
        }
        return imported;
    }

    private String safe(String s) {
        if (s == null) return "";
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }
}
