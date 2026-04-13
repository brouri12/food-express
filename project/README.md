# 🍽️ FoodExpress - Plateforme de Livraison avec Architecture Microservices

## 📋 Vue d'ensemble

FoodExpress est une plateforme moderne de livraison de repas construite avec React, TypeScript et Tailwind CSS, conçue pour s'intégrer avec une architecture backend microservices complète.

---

## ✨ Fonctionnalités Principales

### 🔐 Authentification (User Service)
- Connexion utilisateur (client/livreur/restaurateur)
- Inscription multi-rôle
- Gestion de profil complète
- Adresses de livraison multiples
- Moyens de paiement

### 🏪 Découverte de Restaurants (Restaurant Service + Rating Service)
- Recherche avancée avec filtres
- Navigation par catégories de cuisine
- Notes et avis utilisateurs intégrés
- Temps de livraison estimé
- Promotions mises en avant

### 📋 Commande de Repas (Menu Service + Order Service)
- Menu détaillé par catégories
- Indicateurs (populaire, végétarien)
- Gestion du panier
- Application de codes promo
- Validation de commande

### 🚚 Suivi de Livraison (Delivery Service)
- Carte interactive temps réel
- Position du livreur en direct
- Timeline détaillée du statut
- Contact livreur
- Temps d'arrivée estimé dynamique

### ⭐ Évaluation (Rating Service)
- Notes par étoiles (1-5)
- Commentaires détaillés
- Upload de photos
- Notation des plats individuels
- Avis marqués comme utiles

### 🔔 Notifications (Notification Service)
- Centre de notifications filtrable
- Catégories : commandes, promotions, livraison
- Préférences personnalisables
- Badges non-lus
- WebSocket ready pour temps réel

---

## 🏗️ Structure des Pages

```
/                      → Page d'accueil (Hero, promotions, catégories)
/login                 → Connexion
/signup                → Inscription
/profile               → Dashboard utilisateur
/restaurants           → Liste des restaurants avec filtres
/restaurant/:id        → Menu d'un restaurant
/cart                  → Panier et checkout
/delivery/:orderId     → Suivi de livraison
/ratings               → Évaluer les commandes
/notifications         → Centre de notifications
/*                     → Page 404
```

---

## 🎨 Design & UX

### Palette de Couleurs
- **Primary**: Dégradé Orange (#f97316) → Rouge (#dc2626)
- **Backgrounds**: Gris clair (#f9fafb)
- **Success**: Vert (#10b981)
- **Warning**: Orange (#f59e0b)

### Responsive Design
- **Mobile First**: Bottom navigation bar
- **Tablet**: Layout adapté
- **Desktop**: Navigation header complète

### Animations
- Transitions fluides avec Motion
- Hover effects sur les cartes
- Loading skeletons
- Micro-interactions

---

## 🔌 Intégration Microservices

Chaque page affiche clairement quels microservices seraient appelés :

```typescript
// Exemple HomePage
- Restaurant Service → Liste des restaurants
- Promotion Service → Bannières promotionnelles
- Rating Service → Notes des restaurants
```

### Badges Visibles
Sur chaque page, vous verrez des badges comme :
```
🔌 API: Restaurant Service
🔌 API: Order Service + Rating Service
```

---

## 📊 Données Mock

Toutes les données sont simulées dans `/src/app/data/mockServices.ts` :

```typescript
- mockUsers         → Utilisateurs
- mockRestaurants   → Restaurants
- mockMenus         → Menus par restaurant
- mockOrders        → Commandes
- mockPromotions    → Codes promo et offres
- mockDelivery      → Tracking de livraison
- mockRatings       → Avis et notes
- mockNotifications → Notifications
- mockCategories    → Catégories de cuisine
```

---

## 🚀 Prêt pour Production

### Backend Integration
L'application est structurée pour faciliter l'intégration :

1. **API Calls** : Tous les appels API sont identifiés
2. **Loading States** : Skeletons prêts
3. **Error Handling** : Structure en place
4. **WebSocket** : Ready pour notifications/tracking temps réel

### Configuration
```bash
# .env.local
VITE_API_URL=https://api.foodexpress.com
VITE_WS_URL=wss://api.foodexpress.com/ws
```

---

## 📦 Composants Réutilisables

```typescript
<RestaurantCard />      // Carte restaurant
<MenuItemCard />        // Carte plat
<Layout />              // Navigation principale
<ServiceBadge />        // Badge microservice
<LoadingSpinner />      // Indicateur de chargement
<RestaurantCardSkeleton /> // État de chargement
```

---

## 🎯 Fonctionnalités Avancées

### ✅ Implémentées
- [x] Système de panier avec LocalStorage
- [x] Filtres avancés de restaurants
- [x] Application de codes promo
- [x] Timeline de livraison
- [x] Système de notation complet
- [x] Gestion des notifications
- [x] Profil utilisateur multi-onglets
- [x] Responsive mobile/desktop
- [x] Animations fluides

### 🔮 Prêt pour
- [ ] Intégration API REST
- [ ] Authentification JWT
- [ ] WebSocket pour temps réel
- [ ] Paiement Stripe/PayPal
- [ ] Géolocalisation
- [ ] Upload d'images
- [ ] Mode sombre complet
- [ ] i18n (internationalisation)

---

## 🛠️ Technologies

- **React 18.3.1** - UI Framework
- **TypeScript** - Type Safety
- **React Router 7** - Navigation (Data mode)
- **Tailwind CSS 4** - Styling
- **Motion** - Animations
- **Lucide React** - Icônes
- **Vite** - Build Tool

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture technique détaillée
- **[GUIDE_UTILISATEUR.md](./GUIDE_UTILISATEUR.md)** - Guide utilisateur complet

---

## 🎓 Points d'Attention

### Microservices Visibles
Chaque interaction montre quel(s) microservice(s) seraient appelé(s) :
- Page d'accueil : Restaurant + Promotion + Rating Services
- Menu restaurant : Menu + Rating Services
- Panier : Order + Promotion Services
- Tracking : Delivery Service
- etc.

### Architecture Scalable
- Séparation claire des responsabilités
- Services indépendants et découplés
- Prêt pour Kubernetes/Docker
- API Gateway ready

---

## 🚀 Démarrer l'Application

```bash
# L'application est déjà configurée et prête
# Naviguez simplement dans l'interface
```

### Navigation Rapide
1. **Accueil** → Découvrez les restaurants et promotions
2. **Restaurants** → Filtrez et recherchez
3. **Menu** → Ajoutez au panier
4. **Panier** → Appliquez un code promo et validez
5. **Tracking** → Suivez votre livraison
6. **Profil** → Gérez vos informations

---

## 🎨 Captures Clés

### Design Highlights
- 🎨 Hero avec recherche proéminente
- 🎡 Carrousel de promotions automatique
- 🎯 Catégories visuelles avec emojis
- ⭐ Notes intégrées partout
- 🗺️ Carte de tracking animée
- 📱 Navigation mobile intuitive

---

## 💡 Innovations

1. **Badges Microservices** : Visibilité claire de l'architecture
2. **Mock Services Complets** : Démonstration réaliste
3. **Design Chaleureux** : Couleurs appétissantes (orange/rouge)
4. **Mobile First** : Navigation bottom bar optimisée
5. **États Visuels** : Skeletons, loading, erreurs
6. **Documentation Bilingue** : Technique + Utilisateur

---

## 🔥 Points Forts

- ✅ **100% Responsive** - Mobile, Tablet, Desktop
- ✅ **8 Microservices** clairement identifiés
- ✅ **11 Pages** complètes et fonctionnelles
- ✅ **Design Moderne** avec animations
- ✅ **Architecture Professionnelle** prête pour production
- ✅ **Documentation Complète** en français
- ✅ **Expérience Utilisateur** optimisée

---

**Développé avec passion pour démontrer une architecture microservices complète** 🚀

Version 1.0.0 - Février 2026
