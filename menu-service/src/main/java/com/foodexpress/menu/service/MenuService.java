package com.foodexpress.menu.service;

import com.foodexpress.menu.dto.MenuDto;
import com.foodexpress.menu.model.MenuCategory;
import com.foodexpress.menu.model.MenuItem;
import com.foodexpress.menu.repository.MenuCategoryRepository;
import com.foodexpress.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;

    public MenuDto getMenuByRestaurant(Long restaurantId) {
        List<MenuCategory> categories = categoryRepository.findByRestaurantIdOrderByDisplayOrder(restaurantId);
        return new MenuDto(restaurantId, categories);
    }

    public List<MenuItem> getItemsByRestaurant(Long restaurantId) {
        return itemRepository.findByRestaurantId(restaurantId);
    }

    public List<MenuItem> getPopularItems(Long restaurantId) {
        return itemRepository.findByRestaurantIdAndPopularTrue(restaurantId);
    }

    public Optional<MenuItem> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    @Transactional
    public MenuCategory saveCategory(MenuCategory category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @Transactional
    public MenuItem saveItem(MenuItem item) {
        return itemRepository.save(item);
    }

    @Transactional
    public Optional<MenuItem> updateItem(Long id, MenuItem item) {
        return itemRepository.findById(id).map(existing -> {
            item.setId(id);
            return itemRepository.save(item);
        });
    }

    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }
}
