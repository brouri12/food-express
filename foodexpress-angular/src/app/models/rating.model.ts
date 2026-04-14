export interface Rating {
  id?: number;
  restaurantId: string;
  menuItemId?: string;
  userId: string;
  note: number;       // 1-5 ⭐
  commentaire?: string;
  dateCreation?: string;
}

export interface CreateRatingRequest {
  restaurantId: string;
  menuItemId?: string;
  note: number;
  commentaire?: string;
}

export interface RatingAverage {
  average: number;
  count: number;
  restaurantId: string;
}
