// Base URL de l'API Gateway Spring Cloud
// En dev local : http://localhost:8080
// En Docker    : http://api-gateway:8080
export const API_BASE = 'http://localhost:8080';

export const API = {
  // User Service
  AUTH_LOGIN:    `${API_BASE}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE}/api/auth/register`,
  USER_ME:       `${API_BASE}/api/users/me`,

  // Restaurant Service
  RESTAURANTS:          `${API_BASE}/api/restaurants`,
  RESTAURANTS_PROMOTED: `${API_BASE}/api/restaurants/promoted`,
  RESTAURANTS_SEARCH:   `${API_BASE}/api/restaurants/search`,
  RESTAURANT_BY_ID:     (id: string) => `${API_BASE}/api/restaurants/${id}`,
  RESTAURANT_WITH_MENUS:(id: string) => `${API_BASE}/api/restaurants/${id}/with-menus`,
  RESTAURANTS_CATEGORY: (cat: string) => `${API_BASE}/api/restaurants/category/${cat}`,
  RESTAURANTS_MANAGE:   `${API_BASE}/api/restaurants/manage`,

  // Menu Service
  MENUS_BY_RESTAURANT:  (id: string) => `${API_BASE}/api/menus/restaurant/${id}`,
  MENUS_POPULAR:        (id: string) => `${API_BASE}/api/menus/restaurant/${id}/popular`,
  MENUS_SEARCH:         `${API_BASE}/api/menus/search`,
  MENUS_MANAGE:         `${API_BASE}/api/menus/manage`,
  MENU_BY_ID:           (id: string) => `${API_BASE}/api/menus/${id}`,

  // Promotion Service
  PROMOTIONS_PUBLIC:    `${API_BASE}/api/promotions/public`,
  PROMOTIONS_APPLY:     `${API_BASE}/api/promotions/public/apply`,
  PROMOTIONS_MANAGE:    `${API_BASE}/api/promotions`,

  // Delivery Service
  DELIVERY_BY_ORDER:    (orderId: string) => `${API_BASE}/api/delivery/order/${orderId}`,
  DELIVERY_CALCULATE:   `${API_BASE}/api/delivery/calculate`,
  DELIVERY_STATUS:      (orderId: string) => `${API_BASE}/api/delivery/manage/${orderId}/status`,
  DELIVERY_ASSIGN:      (orderId: string) => `${API_BASE}/api/delivery/manage/${orderId}/assign`,
};
