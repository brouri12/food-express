# Promotion Service — FoodExpress

Microservice de gestion des promotions et codes promo de la plateforme FoodExpress.
Construit avec Spring Boot 3.2 / Java 17 / PostgreSQL.

---

## Stack technique

- Java 17 + Spring Boot 3.2
- Spring Data JPA + PostgreSQL
- Spring Cloud (Eureka Client, Config Client)
- Springdoc OpenAPI (Swagger UI)
- Micrometer + Prometheus
- Docker / Docker Compose
- Lombok

---

## Lancer le service

### Standalone (sans la stack complète)

```bash
docker-compose up -d
```

Le service démarre sur `http://localhost:8084`
Swagger UI disponible sur `http://localhost:8084/swagger-ui.html`

### Dans la stack FoodExpress complète

```bash
# depuis le dossier foodexpress/
docker-compose up -d
```

---

## Structure du projet

```
promotion-service/
├── src/main/java/com/foodexpress/promotion/
│   ├── PromotionServiceApplication.java   # point d'entrée Spring Boot
│   ├── controller/
│   │   └── PromotionController.java       # endpoints REST
│   ├── service/
│   │   └── PromotionService.java          # logique métier
│   ├── repository/
│   │   └── PromotionRepository.java       # accès base de données
│   └── entity/
│       └── Promotion.java                 # entité JPA
├── src/main/resources/
│   └── application.yml                    # configuration
├── Dockerfile                             # build multi-stage
├── docker-compose.yml                     # stack standalone
└── pom.xml                                # dépendances Maven
```

---

## Endpoints API

| Méthode | URL | Description | Auth |
|---------|-----|-------------|------|
| GET | `/api/promotions/public` | Toutes les promotions actives | Non |
| GET | `/api/promotions/public/restaurant/{id}` | Promos actives d'un restaurant | Non |
| POST | `/api/promotions/public/apply` | Appliquer un code promo | Non |
| POST | `/api/promotions` | Créer une promotion | ADMIN |
| PUT | `/api/promotions/{id}` | Modifier une promotion | ADMIN |
| DELETE | `/api/promotions/{id}` | Supprimer une promotion | ADMIN |

### Exemple — Appliquer un code promo

```
POST /api/promotions/public/apply?code=BIENVENUE20&orderAmount=50.00
```

Réponse :
```json
{
  "promoId": "a3f2-bc12-...",
  "code": "BIENVENUE20",
  "type": "PERCENTAGE",
  "originalAmount": 50.00,
  "discount": 10.00,
  "finalAmount": 40.00
}
```

### Exemple — Créer une promotion

```json
POST /api/promotions
{
  "title": "Bienvenue -20%",
  "code": "BIENVENUE20",
  "type": "PERCENTAGE",
  "discountPercent": 20,
  "minOrderAmount": 15.00,
  "validFrom": "2026-01-01",
  "validUntil": "2026-12-31",
  "active": true
}
```

---

## Types de promotions

| Type | Description | Champ requis |
|------|-------------|--------------|
| `PERCENTAGE` | Réduction en % sur le total | `discountPercent` |
| `FIXED_AMOUNT` | Réduction d'un montant fixe en € | `discountAmount` |
| `FREE_DELIVERY` | Livraison gratuite (2.99€ offerts) | — |
| `BUY_ONE_GET_ONE` | 1 acheté = 1 offert (50% de réduction) | — |

---

## Configuration

### Variables d'environnement

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `SERVER_PORT` | `8084` | Port du service |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/promotiondb` | URL PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | `foodexpress` | Utilisateur DB |
| `SPRING_DATASOURCE_PASSWORD` | `foodexpress123` | Mot de passe DB |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://eureka-server:8761/eureka/` | Registre Eureka |

### Base de données

```
Host     : localhost
Port     : 5432
Database : promotiondb
Username : foodexpress
Password : foodexpress123
```

---

## Monitoring

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | État du service |
| `/actuator/prometheus` | Métriques Prometheus |
| `/actuator/metrics` | Métriques détaillées |

Prometheus scrape `/actuator/prometheus` toutes les 15 secondes.
Les métriques sont visualisables dans Grafana sur `http://localhost:3000`.

---

## Ports de la stack complète

| Service | Port |
|---------|------|
| **Promotion Service** | **8084** |
| API Gateway | 8080 |
| Eureka Dashboard | 8761 |
| Config Server | 8888 |
| Prometheus | 9090 |
| Grafana | 3000 |
| pgAdmin | 5050 |

---

## Auteur

Rahma — FoodExpress / ESPRIT
