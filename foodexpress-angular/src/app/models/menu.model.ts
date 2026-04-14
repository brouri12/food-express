export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;       // prix de base avant happy hour
  imageUrl?: string;
  image?: string;
  category: string;
  popular: boolean;
  vegetarian: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  available: boolean;
  happyHourActive?: boolean;
  happyHourDiscountPercent?: number;
  happyHourEnd?: string;
  stockQuantity?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Menu {
  categories: MenuCategory[];
}
