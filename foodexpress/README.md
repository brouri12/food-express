# FoodExpress — Architecture Micro-services Spring Cloud
### Cours ESPRIT — Séances 1 à 10

---

## Structure du projet

```
foodexpress/
├── infrastructure/
│   ├── eureka-server/      # Annuaire de services (port 8761)
│   ├── config-server/      # Config centralisée (port 8888)
│   └── api-gateway/        # Point d'entrée + JWT Keycloak (port 8080)
├── services/
│   ├── user-service/       # Auth + profils (port 8081)
│   ├── restaurant-service/ # Restaurants + Feign (port 8082)
│   ├── menu-service/       # Plats + menus (port 8083)
│   ├── promotion-service/  # Codes promo (port 8084)
│   └── delivery-service/   # Livraisons + RabbitMQ (port 8085)
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/
└── docker-compose.yml
```

---

## Démarrage rapide

```bash
# 1. Builder tous les services
cd foodexpress
mvn clean package -DskipTests  # dans chaque service

# 2. Lancer toute la stack
docker-compose up -d

# 3. Vérifier que tout tourne
docker-compose ps
```

## URLs importantes

| Service       | URL                                      |
|---------------|------------------------------------------|
| Eureka        | http://localhost:8761                    |
| API Gateway   | http://localhost:8080                    |
| Swagger UI    | http://localhost:8080/swagger-ui.html    |
| Keycloak      | http://localhost:8180 (admin/admin)      |
| RabbitMQ UI   | http://localhost:15672 (guest/guest)     |
| Prometheus    | http://localhost:9090                    |
| Grafana       | http://localhost:3000 (admin/admin)      |

---

## Configuration Keycloak

1. Ouvrir http://localhost:8180
2. Créer un realm `foodexpress`
3. Créer les rôles : `CLIENT`, `RESTAURATEUR`, `LIVREUR`, `ADMIN`
4. Créer un client `foodexpress-app` (type: public)
5. Créer des utilisateurs de test avec les rôles appropriés

---

## Communication entre services

### Synchrone (OpenFeign)
`restaurant-service` → `menu-service`
```
GET /api/restaurants/{id}/with-menus
  └─ Feign → GET /api/menus/restaurant/{id}
```

### Asynchrone (RabbitMQ)
```
order-service ──[order.created]──► delivery-service
delivery-service ──[delivery.status.updated]──► notification-service
```

Exchange : `foodexpress.exchange` (Topic)

---

## Codes promo disponibles

| Code          | Type       | Réduction              |
|---------------|------------|------------------------|
| BIENVENUE20   | PERCENTAGE | -20% première commande |
| LIVRAISON0    | FREE_DELIVERY | Livraison gratuite  |

Test via API :
```
POST /api/promotions/public/apply?code=BIENVENUE20&orderAmount=50.00
```

---

## Rafraîchissement config à chaud (Actuator)

```bash
# Après modification d'un fichier dans config-repo/
curl -X POST http://localhost:8081/actuator/refresh
```

---

## Monitoring

- Prometheus scrape toutes les 15s les endpoints `/actuator/prometheus`
- Grafana : importer le dashboard Spring Boot (ID: 11378) depuis grafana.com
