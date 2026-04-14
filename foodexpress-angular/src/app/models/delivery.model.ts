export interface Delivery {
  id: string;
  orderId: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  customerId: string;
  restaurantId: string;
  deliveryAddress: string;
  deliveryFee: number;
  estimatedMinutes: number;
  status: DeliveryStatus;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

export interface DeliveryCalculation {
  distanceKm: number;
  deliveryFee: number;
  estimatedTimeMin: number;
  estimatedTimeMax: number;
  estimatedTime: number;
  displayRange: string;
}

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  originalPrice?: number;   // prix avant happy hour
  happyHour?: boolean;
  image: string;
  quantity: number;
}
