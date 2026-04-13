export const mockRestaurants = [
  { id: 'rest-1', name: 'Le Bistrot Parisien', cuisine: 'Française', rating: 4.8, ratingCount: 1250,
    deliveryTime: '25-35', deliveryFee: 2.50, minOrder: 15, promoted: true, discount: 20,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    categories: ['Française', 'Bistrot'], description: 'Cuisine française authentique', active: true },
  { id: 'rest-2', name: 'Sushi Master', cuisine: 'Japonaise', rating: 4.9, ratingCount: 890,
    deliveryTime: '30-40', deliveryFee: 3.00, minOrder: 20, promoted: false,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop',
    categories: ['Japonaise', 'Sushi'], description: 'Les meilleurs sushi de Paris', active: true },
  { id: 'rest-3', name: 'Pizza Napoli', cuisine: 'Italienne', rating: 4.6, ratingCount: 2100,
    deliveryTime: '20-30', deliveryFee: 1.99, minOrder: 12, promoted: true, discount: 15,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    categories: ['Italienne', 'Pizza'], description: 'Pizzas artisanales au feu de bois', active: true },
  { id: 'rest-4', name: 'Le Burger King', cuisine: 'Américaine', rating: 4.5, ratingCount: 3200,
    deliveryTime: '15-25', deliveryFee: 1.50, minOrder: 10, promoted: false,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    categories: ['Américaine', 'Burgers'], description: 'Burgers gourmands et généreux', active: true },
  { id: 'rest-5', name: 'Saigon Street', cuisine: 'Vietnamienne', rating: 4.7, ratingCount: 670,
    deliveryTime: '25-35', deliveryFee: 2.00, minOrder: 15, promoted: false,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop',
    categories: ['Vietnamienne', 'Asiatique'], description: 'Cuisine vietnamienne traditionnelle', active: true },
  { id: 'rest-6', name: 'Taj Mahal', cuisine: 'Indienne', rating: 4.4, ratingCount: 980,
    deliveryTime: '30-40', deliveryFee: 2.50, minOrder: 18, promoted: true, discount: 25,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    categories: ['Indienne', 'Curry'], description: 'Spécialités indiennes épicées', active: true },
];

export const mockCategories = [
  { id: 'cat-french', name: 'Française', icon: '🥖', count: 125 },
  { id: 'cat-italian', name: 'Italienne', icon: '🍕', count: 98 },
  { id: 'cat-asian', name: 'Asiatique', icon: '🍜', count: 156 },
  { id: 'cat-american', name: 'Américaine', icon: '🍔', count: 87 },
  { id: 'cat-indian', name: 'Indienne', icon: '🍛', count: 42 },
  { id: 'cat-japanese', name: 'Japonaise', icon: '🍣', count: 63 },
  { id: 'cat-healthy', name: 'Healthy', icon: '🥗', count: 54 },
  { id: 'cat-dessert', name: 'Desserts', icon: '🍰', count: 71 },
];

export const mockPromotions = [
  { id: 'promo-1', title: '-20% sur votre première commande', description: 'Code: BIENVENUE20',
    code: 'BIENVENUE20', discount: 20, type: 'percentage',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    validUntil: '2026-12-31', active: true },
  { id: 'promo-2', title: '1 pizza achetée = 1 offerte', description: 'Chez Pizza Napoli uniquement',
    restaurantId: 'rest-3', type: 'buy-one-get-one',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
    validUntil: '2026-12-31', active: true },
  { id: 'promo-3', title: 'Livraison gratuite dès 25€', description: 'Code: LIVRAISON0',
    code: 'LIVRAISON0', type: 'free-delivery', minOrderAmount: 25,
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=400&fit=crop',
    validUntil: '2026-12-31', active: true },
];

export const mockMenus: Record<string, any> = {
  'rest-1': {
    categories: [
      { id: 'cat-1', name: 'Entrées', items: [
        { id: 'item-1', name: "Soupe à l'oignon gratinée", description: 'Soupe traditionnelle française',
          price: 8.50, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop',
          popular: true, vegetarian: true, available: true },
        { id: 'item-2', name: 'Escargots de Bourgogne', description: '6 escargots au beurre persillé',
          price: 12.00, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=200&fit=crop',
          popular: false, vegetarian: false, available: true },
      ]},
      { id: 'cat-2', name: 'Plats', items: [
        { id: 'item-3', name: 'Bœuf Bourguignon', description: 'Bœuf mijoté au vin rouge',
          price: 18.90, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&h=200&fit=crop',
          popular: true, vegetarian: false, available: true },
        { id: 'item-4', name: 'Coq au vin', description: 'Poulet mijoté dans une sauce au vin rouge',
          price: 16.50, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
          popular: false, vegetarian: false, available: true },
      ]},
      { id: 'cat-3', name: 'Desserts', items: [
        { id: 'item-5', name: 'Crème Brûlée', description: 'Crème onctueuse caramélisée',
          price: 7.50, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop',
          popular: true, vegetarian: true, available: true },
      ]},
    ]
  },
  'rest-2': {
    categories: [
      { id: 'cat-4', name: 'Sushi', items: [
        { id: 'item-6', name: 'Assortiment Sushi 12 pièces', description: 'Saumon, thon, daurade, crevette',
          price: 22.90, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
          popular: true, vegetarian: false, available: true },
        { id: 'item-7', name: 'Maki Saumon Avocat', description: '8 pièces de maki',
          price: 9.90, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
          popular: true, vegetarian: false, available: true },
      ]},
    ]
  },
  'rest-3': {
    categories: [
      { id: 'cat-6', name: 'Pizzas', items: [
        { id: 'item-9', name: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic frais',
          price: 11.90, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
          popular: true, vegetarian: true, available: true },
        { id: 'item-10', name: 'Pizza Quattro Formaggi', description: '4 fromages italiens',
          price: 14.90, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
          popular: true, vegetarian: true, available: true },
      ]},
    ]
  },
};

export const mockDelivery = {
  orderId: 'order-2',
  estimatedMinutes: 15,
  status: 'ON_THE_WAY',
  driverName: 'Thomas Dubois',
  driverPhone: '+33 6 98 76 54 32',
  deliveryAddress: '15 Rue de la Paix, 75002 Paris',
  deliveryFee: 3.00,
  timeline: [
    { status: 'confirmed', label: 'Commande confirmée', time: '12:00', completed: true },
    { status: 'preparing', label: 'En préparation', time: '12:05', completed: true },
    { status: 'ready', label: 'Prête à être récupérée', time: '12:20', completed: true },
    { status: 'picked-up', label: 'Récupérée par le livreur', time: '12:25', completed: true },
    { status: 'on-the-way', label: 'En route', time: '12:30', completed: false },
    { status: 'delivered', label: 'Livrée', time: '', completed: false },
  ]
};
