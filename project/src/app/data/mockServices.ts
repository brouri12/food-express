// Simulation des microservices avec données mock

// USER SERVICE
export const mockUsers = {
  currentUser: {
    id: "user-1",
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    phone: "+33 6 12 34 56 78",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    addresses: [
      { id: "addr-1", label: "Maison", address: "15 Rue de la Paix, 75002 Paris", isDefault: true },
      { id: "addr-2", label: "Bureau", address: "42 Avenue des Champs-Élysées, 75008 Paris", isDefault: false },
    ],
    paymentMethods: [
      { id: "pay-1", type: "card", last4: "4242", brand: "Visa", isDefault: true },
      { id: "pay-2", type: "card", last4: "5555", brand: "Mastercard", isDefault: false },
    ],
    preferences: {
      notifications: true,
      darkMode: false,
      language: "fr",
    }
  }
};

// RESTAURANT SERVICE
export const mockRestaurants = [
  {
    id: "rest-1",
    name: "Le Bistrot Parisien",
    cuisine: "Française",
    rating: 4.8,
    ratingCount: 1250,
    deliveryTime: "25-35",
    deliveryFee: 2.50,
    minOrder: 15,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    promoted: true,
    discount: 20,
    latitude: 48.8566,
    longitude: 2.3522,
    categories: ["Française", "Bistrot"],
    description: "Cuisine française authentique avec des produits frais",
  },
  {
    id: "rest-2",
    name: "Sushi Master",
    cuisine: "Japonaise",
    rating: 4.9,
    ratingCount: 890,
    deliveryTime: "30-40",
    deliveryFee: 3.00,
    minOrder: 20,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
    promoted: false,
    latitude: 48.8606,
    longitude: 2.3376,
    categories: ["Japonaise", "Sushi"],
    description: "Les meilleurs sushi de Paris",
  },
  {
    id: "rest-3",
    name: "Pizza Napoli",
    cuisine: "Italienne",
    rating: 4.6,
    ratingCount: 2100,
    deliveryTime: "20-30",
    deliveryFee: 1.99,
    minOrder: 12,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    promoted: true,
    discount: 15,
    latitude: 48.8584,
    longitude: 2.2945,
    categories: ["Italienne", "Pizza"],
    description: "Pizzas artisanales au feu de bois",
  },
  {
    id: "rest-4",
    name: "Le Burger King",
    cuisine: "Américaine",
    rating: 4.5,
    ratingCount: 3200,
    deliveryTime: "15-25",
    deliveryFee: 1.50,
    minOrder: 10,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    promoted: false,
    latitude: 48.8738,
    longitude: 2.2950,
    categories: ["Américaine", "Burgers"],
    description: "Burgers gourmands et généreux",
  },
  {
    id: "rest-5",
    name: "Saigon Street",
    cuisine: "Vietnamienne",
    rating: 4.7,
    ratingCount: 670,
    deliveryTime: "25-35",
    deliveryFee: 2.00,
    minOrder: 15,
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop",
    promoted: false,
    latitude: 48.8499,
    longitude: 2.3629,
    categories: ["Vietnamienne", "Asiatique"],
    description: "Cuisine vietnamienne traditionnelle",
  },
  {
    id: "rest-6",
    name: "Taj Mahal",
    cuisine: "Indienne",
    rating: 4.4,
    ratingCount: 980,
    deliveryTime: "30-40",
    deliveryFee: 2.50,
    minOrder: 18,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    promoted: true,
    discount: 25,
    latitude: 48.8411,
    longitude: 2.3522,
    categories: ["Indienne", "Curry"],
    description: "Spécialités indiennes épicées et savoureuses",
  },
];

// MENU SERVICE
export const mockMenus: Record<string, any> = {
  "rest-1": {
    categories: [
      {
        id: "cat-1",
        name: "Entrées",
        items: [
          {
            id: "item-1",
            name: "Soupe à l'oignon gratinée",
            description: "Soupe traditionnelle française avec croûtons et fromage fondu",
            price: 8.50,
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
            popular: true,
            vegetarian: true,
            available: true,
          },
          {
            id: "item-2",
            name: "Escargots de Bourgogne",
            description: "6 escargots au beurre persillé",
            price: 12.00,
            image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=200&fit=crop",
            popular: false,
            vegetarian: false,
            available: true,
          },
        ]
      },
      {
        id: "cat-2",
        name: "Plats",
        items: [
          {
            id: "item-3",
            name: "Bœuf Bourguignon",
            description: "Bœuf mijoté au vin rouge avec légumes et pommes de terre",
            price: 18.90,
            image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&h=200&fit=crop",
            popular: true,
            vegetarian: false,
            available: true,
          },
          {
            id: "item-4",
            name: "Coq au vin",
            description: "Poulet mijoté dans une sauce au vin rouge",
            price: 16.50,
            image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop",
            popular: false,
            vegetarian: false,
            available: true,
          },
        ]
      },
      {
        id: "cat-3",
        name: "Desserts",
        items: [
          {
            id: "item-5",
            name: "Crème Brûlée",
            description: "Crème onctueuse caramélisée",
            price: 7.50,
            image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop",
            popular: true,
            vegetarian: true,
            available: true,
          },
        ]
      },
    ]
  },
  "rest-2": {
    categories: [
      {
        id: "cat-4",
        name: "Sushi",
        items: [
          {
            id: "item-6",
            name: "Assortiment Sushi 12 pièces",
            description: "Saumon, thon, daurade, crevette",
            price: 22.90,
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
            popular: true,
            vegetarian: false,
            available: true,
          },
          {
            id: "item-7",
            name: "Maki Saumon Avocat",
            description: "8 pièces de maki au saumon et avocat",
            price: 9.90,
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
            popular: true,
            vegetarian: false,
            available: true,
          },
        ]
      },
      {
        id: "cat-5",
        name: "Sashimi",
        items: [
          {
            id: "item-8",
            name: "Sashimi Saumon",
            description: "12 tranches de saumon frais",
            price: 18.90,
            image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop",
            popular: false,
            vegetarian: false,
            available: true,
          },
        ]
      },
    ]
  },
  "rest-3": {
    categories: [
      {
        id: "cat-6",
        name: "Pizzas",
        items: [
          {
            id: "item-9",
            name: "Pizza Margherita",
            description: "Tomate, mozzarella, basilic frais",
            price: 11.90,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop",
            popular: true,
            vegetarian: true,
            available: true,
          },
          {
            id: "item-10",
            name: "Pizza Quattro Formaggi",
            description: "4 fromages italiens",
            price: 14.90,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
            popular: true,
            vegetarian: true,
            available: true,
          },
        ]
      },
    ]
  },
};

// PROMOTION SERVICE
export const mockPromotions = [
  {
    id: "promo-1",
    title: "-20% sur votre première commande",
    description: "Code: BIENVENUE20",
    code: "BIENVENUE20",
    discount: 20,
    type: "percentage",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
    validUntil: "2026-03-15",
  },
  {
    id: "promo-2",
    title: "1 pizza achetée = 1 offerte",
    description: "Chez Pizza Napoli uniquement",
    restaurantId: "rest-3",
    type: "buy-one-get-one",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop",
    validUntil: "2026-02-28",
  },
  {
    id: "promo-3",
    title: "Livraison gratuite dès 25€",
    description: "Code: LIVRAISON0",
    code: "LIVRAISON0",
    type: "free-delivery",
    minOrder: 25,
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=400&fit=crop",
    validUntil: "2026-02-20",
  },
];

// ORDER SERVICE
export const mockOrders = [
  {
    id: "order-1",
    restaurantId: "rest-1",
    restaurantName: "Le Bistrot Parisien",
    status: "delivered",
    items: [
      { menuItemId: "item-1", name: "Soupe à l'oignon", quantity: 1, price: 8.50 },
      { menuItemId: "item-3", name: "Bœuf Bourguignon", quantity: 1, price: 18.90 },
    ],
    subtotal: 27.40,
    deliveryFee: 2.50,
    total: 29.90,
    orderDate: "2026-02-12T18:30:00",
    deliveredAt: "2026-02-12T19:15:00",
    address: "15 Rue de la Paix, 75002 Paris",
    rated: true,
  },
  {
    id: "order-2",
    restaurantId: "rest-2",
    restaurantName: "Sushi Master",
    status: "in-progress",
    items: [
      { menuItemId: "item-6", name: "Assortiment Sushi", quantity: 1, price: 22.90 },
    ],
    subtotal: 22.90,
    deliveryFee: 3.00,
    total: 25.90,
    orderDate: "2026-02-15T12:00:00",
    address: "15 Rue de la Paix, 75002 Paris",
    rated: false,
  },
];

// DELIVERY SERVICE
export const mockDelivery = {
  currentDelivery: {
    orderId: "order-2",
    driver: {
      id: "driver-1",
      name: "Thomas Dubois",
      phone: "+33 6 98 76 54 32",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      rating: 4.9,
      vehicle: "Scooter",
    },
    status: "on-the-way",
    estimatedTime: 15,
    currentLocation: {
      latitude: 48.8606,
      longitude: 2.3376,
    },
    restaurantLocation: {
      latitude: 48.8606,
      longitude: 2.3376,
    },
    deliveryLocation: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    timeline: [
      { status: "confirmed", label: "Commande confirmée", time: "12:00", completed: true },
      { status: "preparing", label: "En préparation", time: "12:05", completed: true },
      { status: "ready", label: "Prête à être récupérée", time: "12:20", completed: true },
      { status: "picked-up", label: "Récupérée par le livreur", time: "12:25", completed: true },
      { status: "on-the-way", label: "En route", time: "12:30", completed: false },
      { status: "delivered", label: "Livrée", time: "", completed: false },
    ]
  }
};

// RATING SERVICE
export const mockRatings = [
  {
    id: "rating-1",
    userId: "user-1",
    userName: "Sophie Martin",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    restaurantId: "rest-1",
    orderId: "order-1",
    rating: 5,
    comment: "Excellent ! Le bœuf bourguignon était délicieux et la livraison rapide.",
    photos: [
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&h=200&fit=crop",
    ],
    date: "2026-02-12T19:30:00",
    helpful: 12,
  },
  {
    id: "rating-2",
    userId: "user-2",
    userName: "Marc Dupont",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    restaurantId: "rest-1",
    rating: 4,
    comment: "Très bon restaurant, juste un peu cher.",
    date: "2026-02-10T20:00:00",
    helpful: 8,
  },
];

// NOTIFICATION SERVICE
export const mockNotifications = [
  {
    id: "notif-1",
    type: "order",
    title: "Votre commande est en route !",
    message: "Thomas arrive dans 15 minutes avec votre commande Sushi Master",
    time: "Il y a 5 min",
    read: false,
    icon: "truck",
  },
  {
    id: "notif-2",
    type: "promotion",
    title: "Nouvelle offre disponible !",
    message: "-20% chez Le Bistrot Parisien aujourd'hui",
    time: "Il y a 2 heures",
    read: false,
    icon: "tag",
  },
  {
    id: "notif-3",
    type: "delivery",
    title: "Commande livrée",
    message: "Votre commande du Bistrot Parisien a été livrée",
    time: "Hier",
    read: true,
    icon: "check-circle",
  },
  {
    id: "notif-4",
    type: "rating",
    title: "Notez votre expérience",
    message: "Comment était votre commande du Bistrot Parisien ?",
    time: "Hier",
    read: true,
    icon: "star",
  },
  {
    id: "notif-5",
    type: "promotion",
    title: "Livraison gratuite ce weekend",
    message: "Profitez de la livraison gratuite sur toutes vos commandes",
    time: "Il y a 2 jours",
    read: true,
    icon: "gift",
  },
];

// CATEGORIES
export const mockCategories = [
  { id: "cat-french", name: "Française", icon: "🥖", count: 125 },
  { id: "cat-italian", name: "Italienne", icon: "🍕", count: 98 },
  { id: "cat-asian", name: "Asiatique", icon: "🍜", count: 156 },
  { id: "cat-american", name: "Américaine", icon: "🍔", count: 87 },
  { id: "cat-indian", name: "Indienne", icon: "🍛", count: 42 },
  { id: "cat-japanese", name: "Japonaise", icon: "🍣", count: 63 },
  { id: "cat-healthy", name: "Healthy", icon: "🥗", count: 54 },
  { id: "cat-dessert", name: "Desserts", icon: "🍰", count: 71 },
];
