export interface Promotion {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount?: number;
  discountPercent?: number;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY' | 'BUY_ONE_GET_ONE' | 'percentage' | 'free-delivery' | 'buy-one-get-one';
  image?: string;       // alias used in templates
  imageUrl?: string;    // actual backend field
  validFrom?: string;
  validUntil: string;
  restaurantId?: string;
  active?: boolean;
  minOrderAmount?: number;
}

export interface PromoApplyResult {
  promoId: string;
  code: string;
  type: string;
  originalAmount: number;
  discount: number;
  finalAmount: number;
}
