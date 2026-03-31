import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem, MenuCategory, MenuStats } from '../../models/menu.model';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p class="text-gray-600 mt-2">Manage menu items and categories across all restaurants</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" *ngIf="stats">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <span class="text-2xl">🍽️</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Items</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalItems }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <span class="text-2xl">📂</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Categories</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalCategories }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <span class="text-2xl">✅</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Available</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.availableItems }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <span class="text-2xl">❌</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Unavailable</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.unavailableItems }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8">
          <button
            (click)="activeTab = 'items'"
            [class]="activeTab === 'items' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Menu Items ({{ menuItems.length }})
          </button>
          <button
            (click)="activeTab = 'categories'"
            [class]="activeTab === 'categories' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Categories ({{ categories.length }})
          </button>
        </nav>
      </div>

      <!-- Menu Items Tab -->
      <div *ngIf="activeTab === 'items'">
        <!-- Actions Bar -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search menu items..."
              [(ngModel)]="searchTerm"
              (input)="filterItems()"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <select
              [(ngModel)]="selectedCategoryFilter"
              (change)="filterItems()"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <button
            (click)="openItemModal()"
            class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <span class="text-lg">+</span>
            Add Menu Item
          </button>
        </div>

        <!-- Menu Items Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let item of filteredItems" class="bg-white rounded-lg shadow-sm border overflow-hidden">
            <!-- Item Image -->
            <div class="h-48 bg-gray-200 relative">
              <img
                *ngIf="item.imageUrl"
                [src]="item.imageUrl"
                [alt]="item.name"
                class="w-full h-full object-cover"
              />
              <div *ngIf="!item.imageUrl" class="flex items-center justify-center h-full text-gray-400">
                <span class="text-4xl">🍽️</span>
              </div>
              <!-- Availability Badge -->
              <div class="absolute top-2 right-2">
                <span
                  [class]="item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ item.available ? 'Available' : 'Unavailable' }}
                </span>
              </div>
            </div>

            <!-- Item Details -->
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                <span class="text-lg font-bold text-orange-600">\${{ item.price }}</span>
              </div>
              <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ item.description }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{{ item.categoryName }}</span>
                <span>{{ item.restaurantName }}</span>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between">
                <button
                  (click)="toggleItemAvailability(item)"
                  [class]="item.available ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'"
                  class="text-sm font-medium"
                >
                  {{ item.available ? 'Mark Unavailable' : 'Mark Available' }}
                </button>
                <div class="flex items-center space-x-2">
                  <button
                    (click)="editItem(item)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    (click)="deleteItem(item)"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredItems.length === 0" class="text-center py-12">
          <span class="text-6xl text-gray-300">🍽️</span>
          <h3 class="text-lg font-medium text-gray-900 mt-4">No menu items found</h3>
          <p class="text-gray-500 mt-2">Get started by adding your first menu item.</p>
          <button
            (click)="openItemModal()"
            class="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Add Menu Item
          </button>
        </div>
      </div>

      <!-- Categories Tab -->
      <div *ngIf="activeTab === 'categories'">
        <!-- Actions Bar -->
        <div class="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            [(ngModel)]="categorySearchTerm"
            (input)="filterCategories()"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            (click)="openCategoryModal()"
            class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <span class="text-lg">+</span>
            Add Category
          </button>
        </div>

        <!-- Categories Table -->
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let category of filteredCategories">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                    <div class="text-sm text-gray-500">{{ category.description }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ category.restaurantName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ category.displayOrder }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    [class]="category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ category.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    (click)="editCategory(category)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    (click)="deleteCategory(category)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredCategories.length === 0" class="text-center py-12">
          <span class="text-6xl text-gray-300">📂</span>
          <h3 class="text-lg font-medium text-gray-900 mt-4">No categories found</h3>
          <p class="text-gray-500 mt-2">Get started by adding your first category.</p>
          <button
            (click)="openCategoryModal()"
            class="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>

    <!-- Item Modal -->
    <div *ngIf="showItemModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingItem ? 'Edit Menu Item' : 'Add Menu Item' }}
        </h3>
        
        <form (ngSubmit)="saveItem()" #itemForm="ngForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              [(ngModel)]="currentItem.name"
              name="name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              [(ngModel)]="currentItem.description"
              name="description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              [(ngModel)]="currentItem.price"
              name="price"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              [(ngModel)]="currentItem.categoryId"
              name="categoryId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              [(ngModel)]="currentItem.imageUrl"
              name="imageUrl"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div class="mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="currentItem.available"
                name="available"
                class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Available</span>
            </label>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              (click)="closeItemModal()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!itemForm.form.valid"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-gray-400"
            >
              {{ editingItem ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category Modal -->
    <div *ngIf="showCategoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingCategory ? 'Edit Category' : 'Add Category' }}
        </h3>
        
        <form (ngSubmit)="saveCategory()" #categoryForm="ngForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              [(ngModel)]="currentCategory.name"
              name="name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              [(ngModel)]="currentCategory.description"
              name="description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
            <input
              type="number"
              [(ngModel)]="currentCategory.displayOrder"
              name="displayOrder"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div class="mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="currentCategory.active"
                name="active"
                class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              (click)="closeCategoryModal()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!categoryForm.form.valid"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-gray-400"
            >
              {{ editingCategory ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MenuComponent implements OnInit {
  activeTab: 'items' | 'categories' = 'items';
  
  // Data
  menuItems: MenuItem[] = [];
  categories: MenuCategory[] = [];
  stats: MenuStats | null = null;
  
  // Filtered data
  filteredItems: MenuItem[] = [];
  filteredCategories: MenuCategory[] = [];
  
  // Search and filters
  searchTerm: string = '';
  categorySearchTerm: string = '';
  selectedCategoryFilter: string = '';
  
  // Modals
  showItemModal: boolean = false;
  showCategoryModal: boolean = false;
  editingItem: boolean = false;
  editingCategory: boolean = false;
  
  // Current editing objects
  currentItem: MenuItem = this.getEmptyItem();
  currentCategory: MenuCategory = this.getEmptyCategory();

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load menu items (using mock data for now)
    this.menuService.getMockMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.filterItems();
      },
      error: (error) => console.error('Error loading menu items:', error)
    });

    // Load categories (using mock data for now)
    this.menuService.getMockMenuCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterCategories();
      },
      error: (error) => console.error('Error loading categories:', error)
    });

    // Load stats (using mock data for now)
    this.menuService.getMockMenuStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => console.error('Error loading stats:', error)
    });
  }

  // Filtering
  filterItems() {
    this.filteredItems = this.menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategoryFilter || 
                             item.categoryId.toString() === this.selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }

  filterCategories() {
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(this.categorySearchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(this.categorySearchTerm.toLowerCase())
    );
  }

  // Item management
  openItemModal() {
    this.currentItem = this.getEmptyItem();
    this.editingItem = false;
    this.showItemModal = true;
  }

  editItem(item: MenuItem) {
    this.currentItem = { ...item };
    this.editingItem = true;
    this.showItemModal = true;
  }

  closeItemModal() {
    this.showItemModal = false;
    this.currentItem = this.getEmptyItem();
  }

  saveItem() {
    if (this.editingItem) {
      // Update existing item
      const index = this.menuItems.findIndex(item => item.id === this.currentItem.id);
      if (index !== -1) {
        this.menuItems[index] = { ...this.currentItem };
      }
    } else {
      // Add new item
      this.currentItem.id = Math.max(...this.menuItems.map(i => i.id || 0)) + 1;
      this.currentItem.restaurantId = 1; // Default restaurant
      this.menuItems.push({ ...this.currentItem });
    }
    
    this.filterItems();
    this.closeItemModal();
  }

  deleteItem(item: MenuItem) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.menuItems = this.menuItems.filter(i => i.id !== item.id);
      this.filterItems();
    }
  }

  toggleItemAvailability(item: MenuItem) {
    const index = this.menuItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.menuItems[index].available = !this.menuItems[index].available;
      this.filterItems();
    }
  }

  // Category management
  openCategoryModal() {
    this.currentCategory = this.getEmptyCategory();
    this.editingCategory = false;
    this.showCategoryModal = true;
  }

  editCategory(category: MenuCategory) {
    this.currentCategory = { ...category };
    this.editingCategory = true;
    this.showCategoryModal = true;
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
    this.currentCategory = this.getEmptyCategory();
  }

  saveCategory() {
    if (this.editingCategory) {
      // Update existing category
      const index = this.categories.findIndex(cat => cat.id === this.currentCategory.id);
      if (index !== -1) {
        this.categories[index] = { ...this.currentCategory };
      }
    } else {
      // Add new category
      this.currentCategory.id = Math.max(...this.categories.map(c => c.id || 0)) + 1;
      this.currentCategory.restaurantId = 1; // Default restaurant
      this.categories.push({ ...this.currentCategory });
    }
    
    this.filterCategories();
    this.closeCategoryModal();
  }

  deleteCategory(category: MenuCategory) {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categories = this.categories.filter(c => c.id !== category.id);
      this.filterCategories();
    }
  }

  // Helper methods
  private getEmptyItem(): MenuItem {
    return {
      name: '',
      description: '',
      price: 0,
      available: true,
      categoryId: 0,
      restaurantId: 1
    };
  }

  private getEmptyCategory(): MenuCategory {
    return {
      name: '',
      description: '',
      restaurantId: 1,
      displayOrder: 1,
      active: true
    };
  }
}