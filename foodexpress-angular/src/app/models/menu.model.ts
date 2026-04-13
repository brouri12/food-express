export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;
  category: string;
  popular: boolean;
  vegetarian: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Menu {
  categories: MenuCategory[];
}
