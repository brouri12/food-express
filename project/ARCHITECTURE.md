# 🍽️ FoodExpress - Plateforme de Livraison de Repas

Une plateforme moderne de livraison de repas avec une architecture microservices complète.

## 🏗️ Architecture Microservices

L'application est conçue pour communiquer avec les microservices suivants :

### 1. **User Service** 🔐
- **Endpoints utilisés** : 
  - `GET /api/users/me` - Profil utilisateur
  - `POST /api/auth/login` - Authentification
  - `POST /api/auth/register` - Inscription
  - `PUT /api/users/me` - Mise à jour du profil
  - `GET /api/users/me/addresses` - Adresses de livraison
  - `POST /api/users/me/addresses` - Ajouter une adresse
  - `GET /api/users/me/payment-methods` - Moyens de paiement

**Pages concernées** : Login, Signup, Profile

---

### 2. **Restaurant Service** 🏪
- **Endpoints utilisés** :
  - `GET /api/restaurants` - Liste des restaurants (avec filtres)
  - `GET /api/restaurants/:id` - Détails d'un restaurant
  - `GET /api/restaurants/featured` - Restaurants mis en avant
  - `GET /api/restaurants/new` - Nouveaux restaurants
  - `GET /api/categories` - Catégories de cuisine

**Pages concernées** : Home, Restaurants, RestaurantMenu

---

### 3. **Menu Service** 🍕
- **Endpoints utilisés** :
  - `GET /api/restaurants/:id/menu` - Menu complet d'un restaurant
  - `GET /api/menu-items/:id` - Détails d'un plat
  - `GET /api/restaurants/:id/menu/categories` - Catégories du menu

**Pages concernées** : RestaurantMenu

---

### 4. **Order Service** 🛒
- **Endpoints utilisés** :
  - `POST /api/orders` - Créer une commande
  - `GET /api/orders` - Historique des commandes
  - `GET /api/orders/:id` - Détails d'une commande
  - `PUT /api/orders/:id/status` - Mettre à jour le statut
  - `GET /api/orders/current` - Commande en cours

**Pages concernées** : Cart, Profile (Dashboard), DeliveryTracking

---

### 5. **Promotion & Offre Service** 🎉
- **Endpoints utilisés** :
  - `GET /api/promotions` - Liste des promotions actives
  - `POST /api/promotions/validate` - Valider un code promo
  - `GET /api/promotions/restaurant/:id` - Promotions d'un restaurant
  - `GET /api/promotions/featured` - Promotions mises en avant

**Pages concernées** : Home (bannières), Cart (codes promo), Restaurants

---

### 6. **Delivery Service** 🚚
- **Endpoints utilisés** :
  - `GET /api/deliveries/:orderId` - Suivi de livraison
  - `GET /api/deliveries/:orderId/location` - Position du livreur en temps réel
  - `GET /api/deliveries/:orderId/timeline` - Timeline de la livraison
  - `POST /api/deliveries/:orderId/contact` - Contacter le livreur

**Pages concernées** : DeliveryTracking

---

### 7. **Rating Service** ⭐
- **Endpoints utilisés** :
  - `GET /api/ratings/restaurant/:id` - Avis d'un restaurant
  - `POST /api/ratings` - Créer un avis
  - `GET /api/ratings/user/me` - Mes avis
  - `PUT /api/ratings/:id/helpful` - Marquer un avis utile
  - `GET /api/ratings/pending` - Commandes à évaluer

**Pages concernées** : RestaurantMenu (avis), Ratings, Home (notes des restaurants)

---

### 8. **Notification Service** 🔔
- **Endpoints utilisés** :
  - `GET /api/notifications` - Liste des notifications
  - `PUT /api/notifications/:id/read` - Marquer comme lu
  - `PUT /api/notifications/read-all` - Tout marquer comme lu
  - `DELETE /api/notifications/:id` - Supprimer une notification
  - `PUT /api/notifications/preferences` - Gérer les préférences
  - **WebSocket** : `/ws/notifications` - Notifications en temps réel

**Pages concernées** : Notifications, Layout (compteur)

---

## 📱 Pages de l'Application

### Pages Publiques
- **/** - Page d'accueil avec hero, promotions, restaurants recommandés
- **/login** - Connexion utilisateur
- **/signup** - Inscription (client/livreur/restaurateur)

### Pages Authentifiées
- **/profile** - Dashboard utilisateur avec statistiques
- **/restaurants** - Liste des restaurants avec filtres avancés
- **/restaurant/:id** - Menu d'un restaurant avec catégories
- **/cart** - Panier et validation de commande
- **/delivery/:orderId** - Suivi de livraison en temps réel
- **/ratings** - Évaluation des commandes
- **/notifications** - Centre de notifications

---

## 🎨 Design System

### Palette de Couleurs
- **Primary** : Orange (#f97316) à Rouge (#dc2626)
- **Accent** : Dégradés chauds
- **Success** : Vert (#10b981)
- **Warning** : Orange (#f59e0b)
- **Error** : Rouge (#ef4444)

### Composants Réutilisables
- `RestaurantCard` - Carte restaurant avec note et temps de livraison
- `MenuItemCard` - Carte plat avec bouton d'ajout au panier
- `Layout` - Navigation principale avec header et bottom bar mobile
- `Skeletons` - États de chargement

---

## 🔄 Flux de Données

### Exemple : Commander un Repas

1. **Home** → `Restaurant Service` → Liste des restaurants
2. **Click Restaurant** → `Menu Service` → Menu complet
3. **Add to Cart** → LocalStorage (cart temporaire)
4. **Checkout** → `Order Service` → Création commande
5. **Apply Promo** → `Promotion Service` → Validation code promo
6. **Confirm Order** → `Delivery Service` → Assignation livreur
7. **Track Delivery** → `Delivery Service` (WebSocket) → Position temps réel
8. **Delivered** → `Notification Service` → Notification push
9. **Rate Order** → `Rating Service` → Création avis

---

## 🛠️ Technologies Utilisées

- **React 18** avec TypeScript
- **React Router 7** (Data mode) pour le routing
- **Tailwind CSS v4** pour le styling
- **Motion** (ex-Framer Motion) pour les animations
- **Lucide React** pour les icônes
- **LocalStorage** pour le panier (simulation)

---

## 📊 Indicateurs de Microservices

Dans l'interface, vous verrez des badges comme :
```
API: Restaurant Service
API: Order Service + Rating Service
```

Ces badges montrent quels microservices seraient appelés sur chaque page/composant dans une implémentation réelle.

---

## 🚀 Fonctionnalités Clés

### ✅ Implémentées (Frontend)
- ✅ Recherche et filtrage de restaurants
- ✅ Navigation par catégories de cuisine
- ✅ Gestion du panier avec LocalStorage
- ✅ Application de codes promo
- ✅ Suivi de livraison simulé avec carte
- ✅ Système de notation et avis
- ✅ Centre de notifications avec filtres
- ✅ Profil utilisateur complet
- ✅ Responsive mobile-first
- ✅ Animations et transitions fluides

### 🔮 Prêt pour Intégration Backend
- 🔌 Structure API clairement définie
- 🔌 États de chargement (Skeletons)
- 🔌 Gestion d'erreurs
- 🔌 WebSocket ready (notifications, tracking)

---

## 📝 Notes pour l'Intégration Backend

### Configuration requise
```typescript
// .env.local
VITE_API_URL=https://api.foodexpress.com
VITE_WS_URL=wss://api.foodexpress.com/ws
```

### Service Client Axios (exemple)
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🎯 Prochaines Étapes

1. **Intégrer les vrais endpoints API** des microservices
2. **Implémenter WebSockets** pour le tracking temps réel
3. **Ajouter authentification JWT** complète
4. **Intégrer un système de paiement** (Stripe, PayPal)
5. **Ajouter des tests** unitaires et d'intégration
6. **Optimiser les performances** (lazy loading, code splitting)
7. **Implémenter le mode sombre** complet
8. **Ajouter la géolocalisation** pour les adresses

---

## 📞 Support

Pour toute question sur l'architecture ou l'intégration des microservices, consultez la documentation de chaque service.

---

**Développé avec ❤️ par l'équipe FoodExpress**
