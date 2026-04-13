package com.foodexpress.menu.controller;

import com.foodexpress.menu.entity.MenuItem;
import com.foodexpress.menu.repository.MenuItemRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Menus d'un restaurant groupés par catégorie")
    public ResponseEntity<Map<String, List<MenuItem>>> getByRestaurant(@PathVariable String restaurantId) {
        List<MenuItem> items = menuItemRepository.findByRestaurantIdAndAvailableTrue(restaurantId);
        Map<String, List<MenuItem>> grouped = items.stream()
                .collect(Collectors.groupingBy(MenuItem::getCategory));
        return ResponseEntity.ok(grouped);
    }

    @GetMapping("/restaurant/{restaurantId}/count")
    @Operation(summary = "Nombre de plats d'un restaurant (utilisé par restaurant-service via Feign)")
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
            item.setAvailable(updated.isAvailable());
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
