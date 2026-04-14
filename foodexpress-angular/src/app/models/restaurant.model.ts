export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryTimeRange?: string;
  deliveryFee: number;
  minOrder: number;
  image?: string;
  imageUrl?: string;
  promoted: boolean;
  discount?: number;
  categories: string[];
  latitude?: number;
  longitude?: number;
  active?: boolean;
  ownerId?: string;
  address?: string;
  city?: string;
  phone?: string;
  badges?: string[];
  deliveryRadiusKm?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count?: number;
}
