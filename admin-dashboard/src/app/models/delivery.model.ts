export type DeliveryStatus =
  | 'PENDING' | 'CONFIRMED' | 'PREPARING'
  | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

export interface Delivery {
  id: number;
  orderId: string;
  customerId: string;
  restaurantId: string;
  deliveryAddress: string;
  status: DeliveryStatus;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  driverRating?: number;
  driverAvatar?: string;
  estimatedMinutes?: number;
  createdAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  vehicle?: string;
  rating: number;
  available: boolean;
}

export interface DeliveryStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  totalDrivers: number;
  availableDrivers: number;
}
