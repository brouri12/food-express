package com.foodexpress.restaurant.controller;

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
    @Operation(summary = "Filtrer par catégorie (Française, Italienne, Asiatique...)")
    public ResponseEntity<List<Restaurant>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(restaurantService.findByCategory(category));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher un restaurant par nom ou description")
    public ResponseEntity<List<Restaurant>> search(@RequestParam String q) {
        return ResponseEntity.ok(restaurantService.search(q));
    }

    @GetMapping("/promoted")
    @Operation(summary = "Restaurants mis en avant")
    public ResponseEntity<List<Restaurant>> getPromoted() {
        return ResponseEntity.ok(restaurantService.getPromoted());
    }

    @PostMapping("/manage")
    @Operation(summary = "Créer un restaurant (RESTAURATEUR)")
    public ResponseEntity<Restaurant> create(@RequestBody Restaurant restaurant) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.create(restaurant));
    }

    @PutMapping("/manage/{id}")
    @Operation(summary = "Modifier un restaurant (RESTAURATEUR)")
    public ResponseEntity<Restaurant> update(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.update(id, restaurant));
    }

    @DeleteMapping("/manage/{id}")
    @Operation(summary = "Supprimer un restaurant (RESTAURATEUR)")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        restaurantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
