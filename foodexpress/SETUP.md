# FoodExpress — Guide de Setup Complet

## Prérequis

| Outil | Version min | Vérification |
|-------|-------------|--------------|
| Docker Desktop | 24+ | `docker --version` |
| Docker Compose | 2.20+ | `docker compose version` |
| Java JDK | 17+ | `java -version` |
| Node.js | 18+ | `node --version` |

---

## Démarrage en 3 commandes

```bash
cd foodexpress

# Rendre le script exécutable (Linux/Mac)
chmod +x start.sh

# Démarrer toute la stack
./start.sh all

# Windows PowerShell
docker-compose up -d
```

---

## Ordre de démarrage automatique

```
PostgreSQL ──────────────────────────────────────────┐
PostgreSQL Keycloak ──────────────────────────────┐  │
RabbitMQ ────────────────────────────────────┐    │  │
                                             ↓    ↓  ↓
                                          Keycloak  Eureka
                                             ↓       ↓
                                          Config Server
                                             ↓
                                          API Gateway
                                             ↓
                              ┌──────────────────────────┐
                              ↓    ↓    ↓    ↓    ↓
                           user resto menu promo delivery
```

---

## Keycloak — Configuration automatique

Le realm `foodexpress` est importé automatiquement au démarrage depuis :
`setup/keycloak/foodexpress-realm.json`

### Comptes créés automatiquement

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| ADMIN | admin@foodexpress.com | admin123 |
| CLIENT | client@foodexpress.com | client123 |
| RESTAURATEUR | resto@foodexpress.com | resto123 |
| LIVREUR | livreur@foodexpress.com | livreur123 |

### Obtenir un token JWT

```bash
# Login via Keycloak (production)
curl -X POST http://localhost:8180/realms/foodexpress/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=foodexpress-app" \
  -d "username=admin@foodexpress.com" \
  -d "password=admin123"

# Login via user-service (JWT maison)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foodexpress.com","password":"admin123"}'
```

---

## Bases de données

Un seul conteneur PostgreSQL héberge toutes les bases :

| Base | Service | Port |
|------|---------|------|
| `userdb` | user-service | 5432 |
| `restaurantdb` | restaurant-service | 5432 |
| `menudb` | menu-service | 5432 |
| `promotiondb` | promotion-service | 5432 |
| `deliverydb` | delivery-service | 5432 |
| `keycloakdb` | Keycloak | 5432 (conteneur séparé) |

### Accès pgAdmin

URL : http://localhost:5050  
Email : `admin@fe.com`  
Mot de passe : `admin`

Les serveurs sont pré-configurés dans `setup/pgadmin/servers.json`.  
Mot de passe PostgreSQL : `foodexpress123`

### Connexion directe

```bash
# Se connecter à userdb
docker exec -it fe-postgres psql -U foodexpress -d userdb

# Lister les tables
\dt

# Voir les utilisateurs
SELECT id, email, role FROM users;
```

---

## RabbitMQ

URL Management : http://localhost:15672  
Login : `guest` / `guest`

### Queues créées automatiquement par delivery-service

| Queue | Exchange | Routing Key |
|-------|----------|-------------|
| `order.created.queue` | `foodexpress.exchange` | `order.created` |
| `delivery.status.queue` | `foodexpress.exchange` | `delivery.status.updated` |

### Tester l'envoi d'un message

```bash
# Simuler une nouvelle commande (delivery-service l'écoute)
curl -u guest:guest -X POST http://localhost:15672/api/exchanges/%2F/foodexpress.exchange/publish \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {},
    "routing_key": "order.created",
    "payload": "{\"orderId\":\"test-001\",\"customerId\":\"user-client-001\",\"restaurantId\":\"rest-001\",\"deliveryAddress\":\"15 Rue de la Paix\",\"deliveryFee\":2.50}",
    "payload_encoding": "string"
  }'
```

---

## Monitoring

### Prometheus
URL : http://localhost:9090  
Targets : http://localhost:9090/targets

### Grafana
URL : http://localhost:3000  
Login : `admin` / `admin`

Dashboard pré-configuré : **FoodExpress — Micro-services Overview**

Pour importer le dashboard Spring Boot officiel :
1. Grafana → Dashboards → Import
2. ID : `11378` (Spring Boot 2.1 Statistics)

---

## Commandes utiles

```bash
# Voir les logs d'un service
./start.sh logs user-service

# Statut de tous les conteneurs
./start.sh status

# Redémarrer un service
docker-compose restart restaurant-service

# Rebuild un service après modification du code
docker-compose up -d --build user-service

# Arrêter sans supprimer les données
./start.sh stop

# Tout supprimer (données incluses)
./start.sh clean
```

---

## Tester les APIs

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foodexpress.com","password":"admin123"}' | jq -r .token)

# 2. Lister les restaurants
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/restaurants

# 3. Appliquer un code promo
curl -X POST "http://localhost:8080/api/promotions/public/apply?code=BIENVENUE20&orderAmount=50"

# 4. Calculer les frais de livraison
curl "http://localhost:8080/api/delivery/calculate?restaurantLat=48.8606&restaurantLng=2.3376&deliveryLat=48.8566&deliveryLng=2.3522"
```
