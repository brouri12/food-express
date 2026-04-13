export interface Rating {
  id?: number;
  restaurantId: number;
  menuItemId?: number;
  userId: string;
  note: number;  // 1-5 ⭐
  commentaire?: string;
  dateCreation?: string;
}

export interface CreateRatingRequest {
  restaurantId: number;
  menuItemId?: number;
  note: number;
  commentaire?: string;
}

export interface RatingAverage {
  average: number;
}
