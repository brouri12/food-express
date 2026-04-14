package com.foodexpress.menu.controller;

import com.foodexpress.menu.entity.MenuItem;
import com.foodexpress.menu.repository.MenuItemRepository;
import com.foodexpress.menu.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
@Tag(name = "Menus", description = "Gestion des plats et menus des restaurants")
public class MenuController {

    private final MenuItemRepository menuItemRepository;
    private final MenuService menuService;

    // ── Lecture ───────────────────────────────────────────────

    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Menus d'un restaurant groupés par catégorie (avec prix happy hour si actif)")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getByRestaurant(@PathVariable String restaurantId) {
        List<MenuItem> items = menuItemRepository.findByRestaurantIdAndAvailableTrue(restaurantId);
        Map<String, List<Map<String, Object>>> grouped = items.stream()
                .collect(Collectors.groupingBy(
                    MenuItem::getCategory,
                    Collectors.mapping(item -> enrichWithEffectivePrice(item), Collectors.toList())
                ));
        return ResponseEntity.ok(grouped);
    }

    private Map<String, Object> enrichWithEffectivePrice(MenuItem item) {
        java.math.BigDecimal effectivePrice = menuService.getEffectivePrice(item);
        boolean happyHourActive = !effectivePrice.equals(item.getPrice());
        Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", item.getId());
        map.put("restaurantId", item.getRestaurantId());
        map.put("name", item.getName());
        map.put("description", item.getDescription());
        map.put("price", effectivePrice);           // prix effectif (réduit si happy hour)
        map.put("originalPrice", item.getPrice());  // prix de base toujours présent
        map.put("imageUrl", item.getImageUrl());
        map.put("category", item.getCategory());
        map.put("popular", item.isPopular());
        map.put("vegetarian", item.isVegetarian());
        map.put("vegan", item.isVegan());
        map.put("glutenFree", item.isGlutenFree());
        map.put("available", item.isAvailable());
        map.put("happyHourActive", happyHourActive);
        map.put("happyHourDiscountPercent", item.getHappyHourDiscountPercent());
        if (happyHourActive && item.getHappyHourEnd() != null) {
            map.put("happyHourEnd", item.getHappyHourEnd().toString());
        }
        map.put("stockQuantity", item.getStockQuantity());
        return map;
    }

    @GetMapping("/restaurant/{restaurantId}/all")
    @Operation(summary = "Tous les plats d'un restaurant (y compris indisponibles)")
    public ResponseEntity<List<MenuItem>> getAllByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(menuItemRepository.findByRestaurantId(restaurantId));
    }

    @GetMapping("/restaurant/{restaurantId}/count")
    @Operation(summary = "Nombre de plats d'un restaurant")
    public ResponseEntity<Integer> countByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(menuItemRepository.countByRestaurantId(restaurantId));
    }

    @GetMapping("/restaurant/{restaurantId}/popular")
    @Operation(summary = "Plats populaires d'un restaurant")
    public ResponseEntity<List<MenuItem>> getPopular(@PathVariable String restaurantId) {
        return ResponseEntity.ok(menuItemRepository.findByRestaurantIdAndPopularTrue(restaurantId));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher un plat par nom ou description")
    public ResponseEntity<List<MenuItem>> search(@RequestParam String q) {
        return ResponseEntity.ok(menuItemRepository.searchByNameOrDescription(q));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un plat")
    public ResponseEntity<MenuItem> getById(@PathVariable String id) {
        return menuItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Prix dynamique ────────────────────────────────────────

    @GetMapping("/{id}/price")
    @Operation(summary = "Prix effectif d'un plat (avec happy hour si actif)")
    public ResponseEntity<Map<String, Object>> getEffectivePrice(@PathVariable String id) {
        return ResponseEntity.ok(menuService.getItemWithEffectivePrice(id));
    }

    // ── Stocks ────────────────────────────────────────────────

    @PatchMapping("/manage/{id}/stock")
    @Operation(summary = "Mettre à jour le stock d'un plat")
    public ResponseEntity<MenuItem> updateStock(
            @PathVariable String id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(menuService.updateStock(id, quantity));
    }

    @GetMapping("/restaurant/{restaurantId}/stock-alerts")
    @Operation(summary = "Alertes de stock bas pour un restaurant")
    public ResponseEntity<List<Map<String, Object>>> getStockAlerts(@PathVariable String restaurantId) {
        return ResponseEntity.ok(menuService.getLowStockAlerts(restaurantId));
    }

    // ── Import / Export CSV ───────────────────────────────────

    @GetMapping("/restaurant/{restaurantId}/export")
    @Operation(summary = "Exporter le menu en CSV")
    public ResponseEntity<String> exportCsv(@PathVariable String restaurantId) {
        String csv = menuService.exportToCsv(restaurantId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=menu-" + restaurantId + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @PostMapping("/restaurant/{restaurantId}/import")
    @Operation(summary = "Importer des plats depuis un CSV")
    public ResponseEntity<List<MenuItem>> importCsv(
            @PathVariable String restaurantId,
            @RequestBody String csvContent) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(menuService.importFromCsv(restaurantId, csvContent));
    }

    // ── CRUD ──────────────────────────────────────────────────

    @PostMapping("/manage")
    @Operation(summary = "Ajouter un plat (RESTAURATEUR)")
    public ResponseEntity<MenuItem> create(@RequestBody MenuItem item) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuItemRepository.save(item));
    }

    @PutMapping("/manage/{id}")
    @Operation(summary = "Modifier un plat (RESTAURATEUR)")
    public ResponseEntity<MenuItem> update(@PathVariable String id, @RequestBody MenuItem updated) {
        return menuItemRepository.findById(id).map(item -> {
            item.setName(updated.getName());
            item.setDescription(updated.getDescription());
            item.setPrice(updated.getPrice());
            item.setImageUrl(updated.getImageUrl());
            item.setCategory(updated.getCategory());
            item.setPopular(updated.isPopular());
            item.setVegetarian(updated.isVegetarian());
            item.setVegan(updated.isVegan());
            item.setGlutenFree(updated.isGlutenFree());
            item.setAvailable(updated.isAvailable());
            // Stocks
            if (updated.getStockQuantity() != null) item.setStockQuantity(updated.getStockQuantity());
            if (updated.getStockAlertThreshold() != null) item.setStockAlertThreshold(updated.getStockAlertThreshold());
            // Options
            if (updated.getOptionsJson() != null) item.setOptionsJson(updated.getOptionsJson());
            // Happy Hour
            item.setHappyHourDiscountPercent(updated.getHappyHourDiscountPercent());
            item.setHappyHourStart(updated.getHappyHourStart());
            item.setHappyHourEnd(updated.getHappyHourEnd());
            return ResponseEntity.ok(menuItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/manage/{id}")
    @Operation(summary = "Supprimer un plat (RESTAURATEUR)")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        menuItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
