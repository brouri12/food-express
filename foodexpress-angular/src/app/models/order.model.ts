export interface OrderItem {
  id?: number;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface Order {
  id?: number;
  userId: string;
  clientName: string;
  restaurantId: string;
  restaurantName: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  promoCode?: string;
  discount?: number;
  qrCode?: string;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
  scheduledFor?: string;
  refundStatus?: string;
  refundReason?: string;
  refundAmount?: number;
}

export interface CreateOrderRequest {
  userId: string;
  clientName: string;
  restaurantId: string;
  restaurantName: string;
  deliveryAddress: string;
  items: OrderItem[];
  promoCode?: string;
  discount?: number;
  scheduledFor?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING:    '⏳ En attente',
  SCHEDULED:  '⏰ Planifiée',
  CONFIRMED:  '✅ Confirmée',
  PREPARING:  '👨‍🍳 En préparation',
  READY:      '📦 Prête',
  ON_THE_WAY: '🛵 En route',
  DELIVERED:  '🎉 Livrée',
  CANCELLED:  '❌ Annulée',
};
