package com.foodexpress.restaurant.controller;

import com.foodexpress.restaurant.entity.OpeningHours;
import com.foodexpress.restaurant.entity.Restaurant;
import com.foodexpress.restaurant.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurants", description = "Gestion et recherche des restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "Lister tous les restaurants actifs")
    public ResponseEntity<List<Restaurant>> getAll() {
        return ResponseEntity.ok(restaurantService.getAllActive());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un restaurant")
    public ResponseEntity<Restaurant> getById(@PathVariable String id) {
        return restaurantService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/with-menus")
    @Operation(summary = "Restaurant avec ses menus (via Feign → menu-service)")
    public ResponseEntity<Map<String, Object>> getWithMenus(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantWithMenus(id));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Filtrer par catégorie")
    public ResponseEntity<List<Restaurant>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(restaurantService.findByCategory(category));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher un restaurant")
    public ResponseEntity<List<Restaurant>> search(@RequestParam String q) {
        return ResponseEntity.ok(restaurantService.search(q));
    }

    @GetMapping("/promoted")
    @Operation(summary = "Restaurants mis en avant")
    public ResponseEntity<List<Restaurant>> getPromoted() {
        return ResponseEntity.ok(restaurantService.getPromoted());
    }

    // ── Horaires d'ouverture ──────────────────────────────────

    @GetMapping("/{id}/opening-hours")
    @Operation(summary = "Horaires d'ouverture d'un restaurant")
    public ResponseEntity<List<OpeningHours>> getOpeningHours(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getOpeningHours(id));
    }

    @PutMapping("/{id}/opening-hours")
    @Operation(summary = "Définir les horaires d'ouverture (remplace tout)")
    public ResponseEntity<List<OpeningHours>> saveOpeningHours(
            @PathVariable String id,
            @RequestBody List<OpeningHours> hours) {
        return ResponseEntity.ok(restaurantService.saveOpeningHours(id, hours));
    }

    @GetMapping("/{id}/is-open")
    @Operation(summary = "Vérifier si le restaurant est ouvert maintenant")
    public ResponseEntity<Map<String, Object>> isOpenNow(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.isOpenNow(id));
    }

    // ── Zone de livraison ─────────────────────────────────────

    @GetMapping("/{id}/delivery-zone")
    @Operation(summary = "Vérifier si une adresse est dans la zone de livraison")
    public ResponseEntity<Map<String, Object>> checkDeliveryZone(
            @PathVariable String id,
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(restaurantService.checkDeliveryZone(id, lat, lng));
    }

    // ── Statistiques ──────────────────────────────────────────

    @GetMapping("/{id}/stats")
    @Operation(summary = "Statistiques du restaurant (CA, commandes, top plats)")
    public ResponseEntity<Map<String, Object>> getStats(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getStats(id));
    }

    // ── CRUD ──────────────────────────────────────────────────

    @PostMapping("/manage")
    @Operation(summary = "Créer un restaurant")
    public ResponseEntity<Restaurant> create(@RequestBody Restaurant restaurant) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.create(restaurant));
    }

    @PutMapping("/manage/{id}")
    @Operation(summary = "Modifier un restaurant")
    public ResponseEntity<Restaurant> update(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.update(id, restaurant));
    }

    @DeleteMapping("/manage/{id}")
    @Operation(summary = "Supprimer un restaurant")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        restaurantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
