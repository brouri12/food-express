# 🍕 FoodExpress — Plateforme de livraison de repas

Architecture micro-services Spring Cloud + Frontend Angular 17  
Projet ESPRIT — Séances 1 à 10

---

## Structure du projet

```
webfinal/
├── foodexpress/              # Backend Spring Cloud
│   ├── infrastructure/
│   │   ├── eureka-server/    # Annuaire de services (port 8761)
│   │   ├── config-server/    # Config centralisée (port 8888)
│   │   └── api-gateway/      # Point d'entrée + CORS (port 8080)
│   ├── services/
│   │   ├── user-service/     # Auth JWT (port 8081)
│   │   ├── restaurant-service/ # Restaurants + Feign (port 8082)
│   │   ├── menu-service/     # Menus (port 8083)
│   │   ├── promotion-service/ # Codes promo (port 8084)
│   │   └── delivery-service/ # Livraisons + RabbitMQ (port 8085)
│   ├── setup/
│   │   ├── db/               # Scripts SQL d'initialisation
│   │   ├── keycloak/         # Realm foodexpress auto-importé
│   │   └── rabbitmq/         # Config RabbitMQ
│   ├── monitoring/           # Prometheus + Grafana
│   ├── docker-compose.yml    # Stack complète
│   └── SETUP.md              # Guide de démarrage
│
├── foodexpress-angular/      # Frontend Angular 17
│   ├── src/app/
│   │   ├── pages/            # Home, Restaurants, Cart, Admin...
│   │   ├── services/         # API services avec fallback mock
│   │   ├── models/           # Interfaces TypeScript
│   │   └── guards/           # Auth + Admin guards
│   └── README.md
│
└── project/                  # Template React original (référence design)
```

---

## Démarrage rapide

### Backend (Docker)
```bash
cd foodexpress
docker-compose up -d
```

### Frontend (Angular)
```bash
cd foodexpress-angular
npm install
npx ng serve
# → http://localhost:4200
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend Angular | http://localhost:4200 |
| API Gateway | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Eureka | http://localhost:8761 |
| Keycloak | http://localhost:8180 (admin/admin) |
| RabbitMQ | http://localhost:15672 (guest/guest) |
| Grafana | http://localhost:3000 (admin/admin) |
| pgAdmin | http://localhost:5050 (admin@fe.com/admin) |

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@foodexpress.com | admin123 |
| Client | client@foodexpress.com | client123 |
| Restaurateur | resto@foodexpress.com | resto123 |
| Livreur | livreur@foodexpress.com | livreur123 |

---

## Résultats des tests endpoints (24/24 OK)

```
[OK] POST /api/auth/register + login
[OK] GET/POST/PUT/DELETE /api/restaurants
[OK] GET /api/restaurants/with-menus (Feign → menu-service)
[OK] GET /api/menus/restaurant + popular + search
[OK] GET /api/promotions/public
[OK] POST /api/promotions/apply (BIENVENUE20, LIVRAISON0)
[OK] GET /api/delivery/calculate (Haversine)
[OK] GET /api/delivery/order
[OK] CRUD complet restaurants, menus, promotions
```

---

## Technologies

**Backend:** Spring Boot 3.2, Spring Cloud 2023, PostgreSQL 15, RabbitMQ 3.12, Keycloak 23  
**Frontend:** Angular 17, TailwindCSS 3, TypeScript 5.4  
**DevOps:** Docker, Docker Compose, Prometheus, Grafana
