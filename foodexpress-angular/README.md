# FoodExpress — Frontend Angular 17
### Reproduction fidèle du template React + Dashboard Admin

---

## Démarrage

```bash
cd foodexpress-angular
npm install
npm start          # http://localhost:4200
```

## Structure

```
src/app/
├── models/          # Interfaces TypeScript (Restaurant, MenuItem, Promotion...)
├── services/
│   ├── api.config.ts        # Tous les endpoints Spring Cloud Gateway
│   ├── auth.service.ts      # JWT + signals Angular
│   ├── restaurant.service.ts
│   ├── menu.service.ts
│   ├── promotion.service.ts
│   ├── delivery.service.ts
│   └── cart.service.ts      # Panier avec signals
├── interceptors/
│   └── auth.interceptor.ts  # Injecte Bearer token automatiquement
├── guards/
│   ├── authGuard            # Protège les routes privées
│   └── adminGuard           # Protège /admin
├── layout/
│   └── layout.component.ts  # Header + Bottom Nav mobile
├── shared/
│   ├── restaurant-card/
│   └── promo-carousel/
├── pages/
│   ├── home/                # Hero + Carousel + Catégories + Restaurants
│   ├── restaurants/         # Liste + Filtres + Recherche
│   ├── restaurant-menu/     # Menu groupé + filtres avancés + pagination + panier
│   ├── cart/                # Panier + Code promo (API promotion-service)
│   ├── login/               # Auth JWT (API user-service)
│   ├── signup/              # Inscription CLIENT/RESTAURATEUR/LIVREUR
│   ├── delivery-tracking/   # Suivi temps réel (API delivery-service)
│   └── admin/
│       ├── admin-layout/    # Sidebar collapsible
│       ├── admin-dashboard/ # Stats + État des micro-services
│       ├── admin-restaurants/ # CRUD restaurants
│       ├── admin-menus/     # CRUD plats
│       ├── admin-promotions/# CRUD promotions
│       ├── admin-deliveries/# Suivi + changement de statut
│       └── admin-users/     # Gestion utilisateurs + rôles
└── data/
    └── mock.data.ts         # Fallback si backend indisponible
```

## Connexion Admin

URL : http://localhost:4200/admin

Compte démo (fonctionne sans backend) :
- Email : `admin@foodexpress.com`
- Mot de passe : `admin123`

## Endpoints liés

| Page | Endpoint Spring Cloud |
|------|----------------------|
| Login | POST /api/auth/login |
| Signup | POST /api/auth/register |
| Home | GET /api/restaurants/promoted + /api/promotions/public |
| Restaurants | GET /api/restaurants + /api/restaurants/search |
| Menu | GET /api/menus/restaurant/{id} |
| Cart promo | POST /api/promotions/public/apply |
| Delivery | GET /api/delivery/order/{id} |
| Admin CRUD | POST/PUT/DELETE /api/restaurants/manage |
| Admin menus | POST/PUT/DELETE /api/menus/manage |
| Admin promos | POST/PUT/DELETE /api/promotions |

## Fallback Mock

Tous les services ont un `catchError(() => of(mockData))`.
L'app fonctionne entièrement sans backend grâce aux données mock.

## Menu UI (améliorations récentes)

- Recherche rapide + touche `Esc` pour effacer
- Filtres: disponibilité, végétarien, populaire, prix max + raccourcis prix
- Pagination par blocs de catégories
- Quantité par plat avant ajout panier + toast contextuel
- Cache menu côté service avec TTL et purge manuelle
