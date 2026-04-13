# FoodExpress Microservices Architecture - Complete Explanation

## 🏗️ Complete Architecture Overview

```
                    ┌──────────────────────────────────────────┐
                    │     Config Server (Port 8888)            │
                    │  - Centralized Configuration Management  │
                    │  - Provides configs to all services      │
                    │  - Native file system storage            │
                    └──────────────┬───────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │ Fetches Configuration       │
                    │ (on startup)                │
                    ↓                             ↓
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │   Eureka Server           │   │   API Gateway             │
    │   (Port 8761)             │   │   (Port 8088)             │
    │ - Service Registry        │   │ - Single Entry Point      │
    │ - Service Discovery       │   │ - Routes Requests         │
    │ - Health Monitoring       │   │ - Load Balancing          │
    └──────────┬────────────────┘   └──────────┬────────────────┘
               │                               │
               │ ◄─────────────────────────────┤
               │   Registers & Discovers       │
               │   Services                    │
               │                               │
               │                               │ HTTP Requests
               │                               │ from Angular
               │                               ↑
               │                    ┌──────────┴────────────┐
               │                    │   Angular Frontend    │
               │                    │   (Port 4200)         │
               │                    │ - User Interface      │
               │                    │ - HTTP Client         │
               │                    └───────────────────────┘
               │
               │ Registration
               │ & Heartbeat
               ↓
    ┌───────────────────────────┐
    │  Commandes Service        │
    │  (Port 8081)              │
    │ - Business Logic          │
    │ - REST API                │
    │ - Database Access         │
    └──────────┬────────────────┘
               │
               │ JDBC Connection
               ↓
    ┌───────────────────────────┐
    │  MySQL Database           │
    │  (Port 3306)              │
    │ - foodexpress_commandes   │
    │ - Persistent Storage      │
    └───────────────────────────┘
```

### Architecture Components Summary

| Component | Port | Role | Dependencies |
|-----------|------|------|--------------|
| Config Server | 8888 | Configuration Management | None (starts first) |
| Eureka Server | 8761 | Service Registry | Config Server |
| API Gateway | 8088 | API Gateway & Router | Config Server, Eureka |
| Commandes Service | 8081 | Business Microservice | Config Server, Eureka, MySQL |
| Angular App | 4200 | Frontend UI | API Gateway |
| MySQL Database | 3306 | Data Persistence | None |

---

## ⚙️ Part 1: Config Server - Centralized Configuration Management

### What is Config Server?

Config Server is a **centralized configuration management system** for distributed applications. Instead of having configuration files scattered across multiple microservices, Config Server provides a single source of truth for all application configurations.

### Why Do We Need Config Server?

**Without Config Server** (Traditional Approach):
```
Commandes Service → application.properties (database config, eureka URL, etc.)
API Gateway → application.properties (routes, eureka URL, etc.)
Eureka Server → application.properties (server config)
```

**Problems**:
- Configuration duplicated across services
- Hard to manage in multiple environments (dev, test, prod)
- Need to rebuild/redeploy to change configuration
- No version control for configurations
- Difficult to maintain consistency

**With Config Server** (Centralized Approach):
```
Config Server (8888)
    ├── commande-service.properties
    ├── api-gateway.properties
    └── eureka-server.properties
         ↓
All services fetch their config from Config Server on startup
```

**Benefits**:
- Single source of truth
- Change config without rebuilding services
- Version control for configurations
- Environment-specific configurations (dev/prod)
- Consistent configuration across all services

### How Config Server Works

#### Architecture Flow

```
1. Config Server Starts (Port 8888)
   ↓
2. Loads configuration files from:
   ConfigServer/src/main/resources/config/
   ├── commande-service.properties
   ├── api-gateway.properties
   └── eureka-server.properties
   ↓
3. Exposes configurations via REST API:
   http://localhost:8888/{application-name}/{profile}
   ↓
4. Services fetch their config on startup:
   - Commandes Service → http://localhost:8888/commande-service/default
   - API Gateway → http://localhost:8888/api-gateway/default
```

### Config Server Configuration

**File**: `ConfigServer/src/main/java/tn/esprit/configserver/ConfigServerApplication.java`

```java
@SpringBootApplication
@EnableConfigServer  // ← This makes it a Config Server
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

**Key Annotation**: `@EnableConfigServer`
- Activates Config Server functionality
- Exposes REST API for configurations
- Manages configuration files

**File**: `ConfigServer/src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8888
spring.application.name=config-server

# Native Profile (file system storage)
spring.profiles.active=native
spring.cloud.config.server.native.search-locations=classpath:/config
```

**Explanation**:
- `server.port=8888`: Config Server runs on port 8888
- `spring.profiles.active=native`: Use local file system (not Git)
- `search-locations=classpath:/config`: Configuration files location

### Configuration Files Structure

**Directory Structure**:
```
ConfigServer/src/main/resources/config/
├── commande-service.properties    ← Commandes Service config
├── api-gateway.properties         ← API Gateway config
└── eureka-server.properties       ← Eureka Server config
```

**File**: `config/commande-service.properties`

```properties
# Application Identity
spring.application.name=commande-service
server.port=8081

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/foodexpress_commandes?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Eureka Client Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.instance.prefer-ip-address=true
```

**File**: `config/api-gateway.properties`

```properties
# Application Identity
spring.application.name=api-gateway
server.port=8088

# Eureka Client Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true

# Gateway Configuration
spring.cloud.gateway.discovery.locator.enabled=false
```

### How Services Connect to Config Server

#### Step 1: Add Config Client Dependency

**File**: `commandes/commandes/pom.xml`

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

This dependency allows services to fetch configuration from Config Server.

#### Step 2: Create Bootstrap Properties

**File**: `commandes/commandes/src/main/resources/bootstrap.properties`

```properties
# Config Server Connection
spring.cloud.config.uri=http://localhost:8888
spring.application.name=commande-service
```

**Why bootstrap.properties?**
- Loaded BEFORE application.properties
- Ensures Config Server connection is established first
- Application name tells Config Server which config file to load

#### Step 3: Spring Boot 3.x Configuration Import

**File**: `commandes/commandes/src/main/resources/application.properties`

```properties
# Config Server Import (Spring Boot 3.x)
spring.config.import=optional:configserver:http://localhost:8888
```

**Explanation**:
- `spring.config.import`: New way to import external configuration in Spring Boot 3.x
- `optional:`: Service can start even if Config Server is down (fallback to local config)
- `configserver:http://localhost:8888`: Config Server URL

**Important**: Without `optional:`, service will fail if Config Server is not running!

### Configuration Loading Process

When Commandes Service starts:

```
Step 1: Application Startup
   ↓
Step 2: Load bootstrap.properties
   - spring.application.name=commande-service
   - spring.cloud.config.uri=http://localhost:8888
   ↓
Step 3: Connect to Config Server
   - HTTP GET http://localhost:8888/commande-service/default
   ↓
Step 4: Config Server Responds
   {
     "name": "commande-service",
     "profiles": ["default"],
     "propertySources": [
       {
         "name": "classpath:/config/commande-service.properties",
         "source": {
           "server.port": "8081",
           "spring.datasource.url": "jdbc:mysql://...",
           ...
         }
       }
     ]
   }
   ↓
Step 5: Service Applies Configuration
   - Sets server.port=8081
   - Configures database connection
   - Configures Eureka connection
   ↓
Step 6: Service Starts with Fetched Configuration
```

### Testing Config Server

#### Test 1: Check Config Server is Running

```bash
curl http://localhost:8888/actuator/health
```

Response:
```json
{
  "status": "UP"
}
```

#### Test 2: Fetch Commandes Service Configuration

```bash
curl http://localhost:8888/commande-service/default
```

Response:
```json
{
  "name": "commande-service",
  "profiles": ["default"],
  "propertySources": [
    {
      "name": "classpath:/config/commande-service.properties",
      "source": {
        "spring.application.name": "commande-service",
        "server.port": "8081",
        "spring.datasource.url": "jdbc:mysql://localhost:3306/foodexpress_commandes?createDatabaseIfNotExist=true",
        ...
      }
    }
  ]
}
```

#### Test 3: Check Service Logs

When starting Commandes Service, look for:
```
Fetching config from server at : http://localhost:8888
Located environment: name=commande-service, profiles=[default], label=null
Located property source: [BootstrapPropertySource {name='bootstrap'}]
```

### Configuration Refresh (Advanced)

Config Server supports dynamic configuration refresh without restarting services:

1. Change configuration in Config Server
2. Call refresh endpoint on service:
   ```bash
   curl -X POST http://localhost:8081/actuator/refresh
   ```
3. Service reloads configuration without restart!

**Note**: Requires `@RefreshScope` annotation on beans that need refresh.

### Environment-Specific Configurations

Config Server supports multiple environments:

```
config/
├── commande-service.properties          ← Default (all environments)
├── commande-service-dev.properties      ← Development
├── commande-service-prod.properties     ← Production
└── commande-service-test.properties     ← Testing
```

Activate profile:
```properties
spring.profiles.active=prod
```

Service will load:
1. `commande-service.properties` (base)
2. `commande-service-prod.properties` (overrides base)

### Config Server Benefits in FoodExpress

1. **Centralized Management**
   - All configurations in one place
   - Easy to see what's configured where

2. **Consistency**
   - Eureka URL defined once, used by all services
   - Database credentials managed centrally

3. **Environment Management**
   - Easy to switch between dev/test/prod
   - No code changes needed

4. **Version Control**
   - Configuration changes tracked in Git
   - Easy rollback if something breaks

5. **Security**
   - Sensitive data (passwords) in one place
   - Can encrypt sensitive properties

6. **Dynamic Updates**
   - Change configuration without rebuilding
   - Refresh without full restart

---

## 📡 Part 2: Eureka Server - The Service Registry

### What is Eureka Server?

Eureka Server is a **service registry** - think of it as a phone book for microservices. Instead of hardcoding IP addresses and ports, services register themselves with Eureka, and other services can discover them dynamically.

### How Eureka Server Works

1. **Startup**: Eureka Server starts on port 8761
2. **Waiting**: It waits for microservices to register
3. **Registry**: Maintains a list of all registered services
4. **Health Checks**: Monitors if services are alive via heartbeats

### Eureka Server Configuration

**File**: `EurekaServer/src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8761

# Eureka Server Settings
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

**Explanation**:
- `server.port=8761`: Eureka runs on port 8761 (default)
- `register-with-eureka=false`: Eureka doesn't register with itself
- `fetch-registry=false`: Eureka doesn't fetch registry from itself

**File**: `EurekaServer/src/main/java/tn/esprit/eureka/EurekaServerApplication.java`

```java
@SpringBootApplication
@EnableEurekaServer  // ← This makes it a Eureka Server
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

**Key Annotation**: `@EnableEurekaServer`
- Activates Eureka Server functionality
- Starts the service registry
- Exposes dashboard at http://localhost:8761

---

## 🚪 Part 3: API Gateway Connection to Eureka

### What is API Gateway?

The API Gateway is the **single entry point** for all client requests. It acts as a reverse proxy that:
- Routes requests to appropriate microservices
- Load balances between multiple instances
- Provides a unified API to clients

### How API Gateway Connects to Eureka

#### Step 1: API Gateway Registers as Eureka Client

**File**: `ApiGateway/pom.xml`

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

This dependency allows the Gateway to communicate with Eureka.

**File**: `ApiGateway/src/main/resources/application.properties`

```properties
# Application Name (how it appears in Eureka)
spring.application.name=api-gateway

# Server Port
server.port=8080

# Eureka Client Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
```

**Explanation**:
- `spring.application.name=api-gateway`: Service name in Eureka registry
- `server.port=8080`: Gateway listens on port 8080
- `eureka.client.service-url.defaultZone`: **WHERE TO FIND EUREKA SERVER**
- `register-with-eureka=true`: Gateway registers itself with Eureka
- `fetch-registry=true`: Gateway downloads the list of all services from Eureka

#### Step 2: Gateway Discovers Services via Eureka

**File**: `ApiGateway/src/main/java/tn/esprit/gateway/GatewayConfig.java`

```java
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("commande-service", r -> r
                        .path("/commandes/**")
                        .uri("lb://COMMANDE-SERVICE"))  // ← Load-balanced URI
                .build();
    }
}
```

**Key Concept**: `lb://COMMANDE-SERVICE`

- `lb://` = **Load Balancer protocol**
- `COMMANDE-SERVICE` = **Service name in Eureka** (not IP address!)

**How it works**:
1. Request comes to Gateway: `http://localhost:8080/commandes`
2. Gateway checks route: "This matches `/commandes/**`"
3. Gateway asks Eureka: "Where is `COMMANDE-SERVICE`?"
4. Eureka responds: "It's at `localhost:8081`"
5. Gateway forwards request: `http://localhost:8081/commandes`

### The Magic of Service Discovery

**Without Eureka** (hardcoded):
```java
.uri("http://localhost:8081")  // ❌ Hardcoded - breaks if service moves
```

**With Eureka** (dynamic):
```java
.uri("lb://COMMANDE-SERVICE")  // ✅ Dynamic - Eureka provides the location
```

**Benefits**:
- Service can run on any port/IP
- Multiple instances can run (load balancing)
- Services can be added/removed dynamically
- No configuration changes needed

---

## 🛒 Part 4: Commandes Service Connection to Eureka

### What is Commandes Service?

The Commandes Service is a **business microservice** that handles order management for FoodExpress. It provides:
- CRUD operations for orders (Create, Read, Update, Delete)
- Order validation and business logic
- Database persistence
- **Automatic QR code generation** for each order
- RESTful API endpoints

### Commandes Service Features

1. **Order Management**: Full CRUD operations
2. **Database Integration**: MySQL with JPA/Hibernate
3. **Service Discovery**: Registers with Eureka
4. **QR Code Generation**: Automatic QR code for each order
5. **Transaction Management**: @Transactional for data consistency

### How Commandes Service Registers with Eureka

#### Step 1: Add Eureka Client Dependency

**File**: `commandes/commandes/pom.xml`

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

#### Step 2: Configure Eureka Connection

**File**: `commandes/commandes/src/main/resources/application.properties`

```properties
# Application Name (MUST match what Gateway uses)
spring.application.name=commande-service

# Server Port
server.port=8081

# Eureka Client Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.instance.prefer-ip-address=true
```

**Explanation**:
- `spring.application.name=commande-service`: **CRITICAL** - This name is used by Gateway
- `server.port=8081`: Service runs on port 8081
- `eureka.client.service-url.defaultZone`: **WHERE TO FIND EUREKA**
- `register-with-eureka=true`: **Register this service with Eureka**
- `fetch-registry=true`: Download list of other services
- `prefer-ip-address=true`: Use IP instead of hostname

#### Step 3: Enable Discovery Client

**File**: `commandes/commandes/src/main/java/com/example/commandes/CommandesApplication.java`

```java
@SpringBootApplication
@EnableDiscoveryClient  // ← This enables Eureka registration
public class CommandesApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommandesApplication.class, args);
    }
}
```

**Key Annotation**: `@EnableDiscoveryClient`
- Tells Spring Boot to register with Eureka
- Sends heartbeat every 30 seconds
- Updates Eureka if service goes down

### Commandes Service Architecture Layers

The Commandes Service follows a clean layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Controller Layer                      │
│  CommandeController.java                                 │
│  - REST endpoints (@RestController)                      │
│  - Request/Response handling                             │
│  - Logging                                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│  CommandeService.java + QRCodeService.java               │
│  - Business logic                                        │
│  - Transaction management (@Transactional)               │
│  - QR code generation                                    │
│  - DTO ↔ Entity conversion                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Repository Layer                      │
│  CommandeRepository.java                                 │
│  - Database operations (JpaRepository)                   │
│  - CRUD methods                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Database Layer                        │
│  MySQL - foodexpress_commandes                           │
│  - Persistent storage                                    │
│  - Table: commandes                                      │
└─────────────────────────────────────────────────────────┘
```

### QR Code Generation Feature

When a new order is created, the system automatically generates a QR code containing order details.

**QR Code Content**:
```
ORDER ID: 1
Client: John Doe
Product: Pizza Margherita
Quantity: 2
Price: 15.99 EUR
```

**Implementation**:

**QRCodeService.java**:
```java
@Service
public class QRCodeService {
    
    public String generateCommandeQRCode(Long id, String client, 
                                         String product, Integer qty, Double price) {
        // Creates QR code with order details
        // Returns Base64 encoded PNG image
        String qrData = String.format(
            "ORDER ID: %d\nClient: %s\nProduct: %s\nQuantity: %d\nPrice: %.2f EUR",
            id, client, product, qty, price
        );
        return generateQRCode(qrData);
    }
}
```

**QR Code Generation Flow**:
```
1. User creates order via POST /commandes
   ↓
2. CommandeService saves order to database (gets ID)
   ↓
3. QRCodeService generates QR code with order details
   ↓
4. QR code stored as Base64 string in database
   ↓
5. Response includes qrCode field
   ↓
6. QR code can be downloaded as PNG: GET /commandes/{id}/qrcode
```

**Technology Used**:
- **ZXing Library** (Google's QR code library)
- QR code size: 300x300 pixels
- Format: PNG image
- Storage: Base64 encoded string in database

**API Endpoints for QR Code**:
- `POST /commandes` → Creates order + generates QR code
- `GET /commandes/{id}` → Returns order with QR code (Base64)
- `GET /commandes/{id}/qrcode` → Downloads QR code as PNG image

---

## 🔄 Part 5: Complete Request Flow - Step by Step (With Config Server)

Let's trace a complete request from Angular to the database, including how Config Server fits in:

### Phase 1: System Startup (Configuration Loading)

#### Step 1: Config Server Starts
```
Config Server starts on port 8888
Loads configuration files from:
  - config/commande-service.properties
  - config/api-gateway.properties
  - config/eureka-server.properties
Exposes REST API for configurations
```

#### Step 2: Eureka Server Starts
```
Eureka Server starts
Fetches configuration from Config Server (optional)
Starts on port 8761
Waits for service registrations
```

#### Step 3: API Gateway Starts
```
1. Gateway application starts
2. Loads bootstrap.properties
   - spring.application.name=api-gateway
   - spring.cloud.config.uri=http://localhost:8888
3. Connects to Config Server
   - GET http://localhost:8888/api-gateway/default
4. Receives configuration:
   - server.port=8088
   - eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
5. Applies configuration
6. Registers with Eureka Server
   - POST http://localhost:8761/eureka/apps/API-GATEWAY
7. Starts listening on port 8088
```

**Gateway Logs**:
```
Fetching config from server at : http://localhost:8888
Located environment: name=api-gateway, profiles=[default]
Registering application API-GATEWAY with eureka
Registered with Eureka Server at http://localhost:8761/eureka/
Tomcat started on port(s): 8088 (http)
```

#### Step 4: Commandes Service Starts
```
1. Commandes Service application starts
2. Loads bootstrap.properties
   - spring.application.name=commande-service
   - spring.cloud.config.uri=http://localhost:8888
3. Connects to Config Server
   - GET http://localhost:8888/commande-service/default
4. Receives configuration:
   - server.port=8081
   - Database connection details
   - Eureka connection details
5. Applies configuration
6. Connects to MySQL database
   - Creates database if not exists
   - Creates/updates tables
7. Registers with Eureka Server
   - POST http://localhost:8761/eureka/apps/COMMANDE-SERVICE
8. Starts listening on port 8081
```

**Commandes Service Logs**:
```
Fetching config from server at : http://localhost:8888
Located environment: name=commande-service, profiles=[default]
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Hibernate: create table if not exists commande (...)
Registering application COMMANDE-SERVICE with eureka
Registered with Eureka Server at http://localhost:8761/eureka/
Tomcat started on port(s): 8081 (http)
```

#### Step 5: Service Discovery Synchronization
```
Gateway queries Eureka every 30 seconds:
  - "Give me list of all services"
Eureka responds:
  - COMMANDE-SERVICE: localhost:8081 (UP)
Gateway caches service locations
```

### Phase 2: Runtime Request Flow

#### Scenario: User Creates a New Order

**Step 1: User Interaction**
```
User fills form in Angular:
  - Client Name: "John Doe"
  - Product: "Pizza Margherita"
  - Quantity: 2
  - Price: 15.99
  - Status: "PENDING"

User clicks "Create Order" button
```

**Step 2: Angular HTTP Request**
```typescript
// Angular Service (commande.service.ts)
createCommande(commande: Commande): Observable<Commande> {
  return this.http.post<Commande>(
    'http://localhost:8088/commandes',  // ← API Gateway URL
    commande
  );
}
```

**HTTP Request**:
```
POST http://localhost:8088/commandes
Content-Type: application/json

{
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 2,
  "price": 15.99,
  "status": "PENDING"
}
```

**Step 3: API Gateway Receives Request**
```
Gateway receives: POST http://localhost:8088/commandes
Gateway checks routes in GatewayConfig.java:

.route("commande-service", r -> r
    .path("/commandes/**")        // ← Matches!
    .uri("lb://COMMANDE-SERVICE")) // ← Use this service
```

**Step 4: Gateway Queries Eureka**
```
Gateway: "Where is COMMANDE-SERVICE?"

Gateway checks local cache first:
  - Cache hit: COMMANDE-SERVICE → localhost:8081
  - Cache miss: Query Eureka

Eureka responds:
{
  "application": {
    "name": "COMMANDE-SERVICE",
    "instance": [{
      "instanceId": "localhost:commande-service:8081",
      "hostName": "localhost",
      "app": "COMMANDE-SERVICE",
      "ipAddr": "192.168.1.100",
      "status": "UP",
      "port": {"$": 8081, "@enabled": "true"},
      "healthCheckUrl": "http://localhost:8081/actuator/health"
    }]
  }
}
```

**Step 5: Gateway Forwards Request**
```
Gateway forwards to: POST http://localhost:8081/commandes
Headers preserved:
  - Content-Type: application/json
  - Origin: http://localhost:4200
Body forwarded as-is
```

**Step 6: Commandes Service Receives Request**
```java
// CommandeController.java
@PostMapping
public ResponseEntity<CommandeDTO> createCommande(@RequestBody CommandeDTO commandeDTO) {
    log.info("Creating new commande: {}", commandeDTO);
    CommandeDTO created = commandeService.createCommande(commandeDTO);
    log.info("Commande created with ID: {}", created.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

**Controller Logs**:
```
Creating new commande: CommandeDTO(clientName=John Doe, product=Pizza Margherita, ...)
```

**Step 7: Service Layer Processing**
```java
// CommandeService.java
@Transactional
public CommandeDTO createCommande(CommandeDTO commandeDTO) {
    // Convert DTO to Entity
    Commande commande = new Commande();
    commande.setClientName(commandeDTO.getClientName());
    commande.setProduct(commandeDTO.getProduct());
    commande.setQuantity(commandeDTO.getQuantity());
    commande.setPrice(commandeDTO.getPrice());
    commande.setStatus(commandeDTO.getStatus());
    
    // Save to database (generates ID)
    Commande saved = commandeRepository.save(commande);
    
    // Generate QR code with order details
    String qrCode = qrCodeService.generateCommandeQRCode(
        saved.getId(),
        saved.getClientName(),
        saved.getProduct(),
        saved.getQuantity(),
        saved.getPrice()
    );
    
    // Update order with QR code
    saved.setQrCode(qrCode);
    saved = commandeRepository.save(saved);
    
    return convertToDTO(saved);
}
```

**Step 8: QR Code Generation**
```java
// QRCodeService.java
public String generateCommandeQRCode(...) {
    // Create QR code data
    String qrData = "ORDER ID: 1\nClient: John Doe\nProduct: Pizza Margherita...";
    
    // Generate QR code image (300x300 pixels)
    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 300, 300);
    
    // Convert to PNG image
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
    
    // Encode as Base64 string
    byte[] qrCodeBytes = outputStream.toByteArray();
    return Base64.getEncoder().encodeToString(qrCodeBytes);
}
```

**QR Code Content**:
```
ORDER ID: 1
Client: John Doe
Product: Pizza Margherita
Quantity: 2
Price: 15.99 EUR
```

**Step 9: Database Interaction**
```sql
-- First INSERT: Save order without QR code
INSERT INTO commandes (client_name, product, quantity, price, status)
VALUES ('John Doe', 'Pizza Margherita', 2, 15.99, 'PENDING');
-- Returns generated ID: id = 1

-- Second UPDATE: Save QR code
UPDATE commandes 
SET qr_code = 'iVBORw0KGgoAAAANSUhEUgAAASw...' 
WHERE id = 1;
```

**Service Logs**:
```
Hibernate: insert into commandes (client_name, price, product, quantity, status) values (?, ?, ?, ?, ?)
Hibernate: update commandes set qr_code=? where id=?
Commande created with ID: 1
QR code generated and saved
```

**Step 10: Response Flows Back**
```
Commandes Service → API Gateway → Angular

Response:
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 2,
  "price": 15.99,
  "status": "PENDING",
  "qrCode": "iVBORw0KGgoAAAANSUhEUgAAASw... (Base64 encoded PNG image)"
}
```

**Step 11: Angular Updates UI**
```typescript
// commandes-form.component.ts
this.commandeService.createCommande(this.commande).subscribe({
  next: (response) => {
    console.log('Order created successfully:', response);
    this.router.navigate(['/commandes']);  // Navigate to list
  },
  error: (error) => {
    console.error('Error creating order:', error);
  }
});
```

### Complete Flow Diagram

```
┌─────────────┐
│   Angular   │ 1. POST /commandes
│  (Port 4200)│────────────────────┐
└─────────────┘                    │
                                   ↓
                        ┌──────────────────────┐
                        │   API Gateway        │
                        │   (Port 8088)        │
                        └──────────┬───────────┘
                                   │
                        2. Query: Where is      
                           COMMANDE-SERVICE?    
                                   │
                                   ↓
                        ┌──────────────────────┐
                        │  Eureka Server       │
                        │  (Port 8761)         │
                        └──────────┬───────────┘
                                   │
                        3. Response: localhost:8081
                                   │
                                   ↓
                        ┌──────────────────────┐
                        │  API Gateway         │
                        │  forwards to 8081    │
                        └──────────┬───────────┘
                                   │
                        4. POST localhost:8081/commandes
                                   │
                                   ↓
                        ┌──────────────────────┐
                        │ Commandes Service    │
                        │ (Port 8081)          │
                        └──────────┬───────────┘
                                   │
                        5. INSERT INTO commandes
                           (saves order)
                                   │
                                   ↓
                        ┌──────────────────────┐
                        │  MySQL Database      │
                        │  (Port 3306)         │
                        └──────────────────────┘
                                   │
                        6. Returns ID = 1
                                   │
                                   ↓
                        ┌──────────────────────┐
                        │ QRCodeService        │
                        │ generates QR code    │
                        └──────────┬───────────┘
                                   │
                        7. QR code (Base64)
                                   │
                                   ↓
                        ┌──────────────────────┐
                        │  MySQL Database      │
                        │  UPDATE qr_code      │
                        └──────────────────────┘
```

### Configuration Role in Request Flow

**Config Server's Role**:
- Provides port numbers (8088, 8081, 8761)
- Provides Eureka URL to all services
- Provides database connection details
- Ensures consistent configuration

**Without Config Server**:
- Each service would have its own application.properties
- Changing Eureka URL requires updating all services
- Risk of configuration mismatch
- Harder to manage multiple environments

**With Config Server**:
- Change Eureka URL in one place
- All services fetch updated configuration
- Consistent configuration guaranteed
- Easy environment management

---

## 🔄 Part 6: Complete Request Flow - Step by Step

Let's trace a request from Angular to the database (simplified version):

### Scenario: User clicks "Get All Commandes"

#### Step 1: Angular Makes HTTP Request
```typescript
// Angular Service
this.http.get('http://localhost:8080/commandes')
```
- Angular sends GET request to API Gateway
- Port 8080 = Gateway

#### Step 2: API Gateway Receives Request
```
Incoming Request: GET http://localhost:8080/commandes
```

Gateway checks its routes:
```java
.route("commande-service", r -> r
    .path("/commandes/**")        // ← Matches!
    .uri("lb://COMMANDE-SERVICE")) // ← Use this service
```

#### Step 3: Gateway Queries Eureka
```
Gateway: "Hey Eureka, where is COMMANDE-SERVICE?"
Eureka: "COMMANDE-SERVICE is at localhost:8081"
```

Eureka's internal registry:
```
Service Name: COMMANDE-SERVICE
Instance ID: localhost:commande-service:8081
Status: UP
IP Address: 192.168.1.100
Port: 8081
```

#### Step 4: Gateway Forwards Request
```
Gateway forwards: GET http://localhost:8081/commandes
```

#### Step 5: Commandes Service Processes Request
```java
@GetMapping
public ResponseEntity<List<CommandeDTO>> getAllCommandes() {
    List<CommandeDTO> commandes = commandeService.getAllCommandes();
    return ResponseEntity.ok(commandes);
}
```

#### Step 6: Response Flows Back
```
Commandes Service → API Gateway → Angular
```

```

---

## 📱 Part 6: QR Code Generation Feature

### What is the QR Code Feature?

Every order created in FoodExpress automatically gets a unique QR code containing the order details. This QR code can be:
- Scanned by customers to verify their order
- Used for order tracking
- Printed on receipts
- Shared digitally

### How QR Code Generation Works

#### Technology Stack

**Library**: Google ZXing (Zebra Crossing)
- Industry-standard QR code library
- Supports multiple barcode formats
- High-quality image generation

**Dependencies** (pom.xml):
```xml
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.5.3</version>
</dependency>
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.5.3</version>
</dependency>
```

#### QR Code Generation Process

**Step-by-Step Flow**:

```
1. User creates order
   ↓
2. Order saved to database (ID generated)
   ↓
3. QRCodeService.generateCommandeQRCode() called
   ↓
4. QR code data formatted:
   "ORDER ID: 1
    Client: John Doe
    Product: Pizza Margherita
    Quantity: 2
    Price: 15.99 EUR"
   ↓
5. ZXing generates QR code image (300x300 pixels)
   ↓
6. Image converted to PNG format
   ↓
7. PNG encoded as Base64 string
   ↓
8. Base64 string saved to database (qr_code column)
   ↓
9. Order returned with QR code included
```

#### QRCodeService Implementation

**File**: `QRCodeService.java`

```java
@Service
public class QRCodeService {
    
    public String generateCommandeQRCode(Long id, String client, 
                                         String product, Integer qty, Double price) {
        // Format order data
        String qrData = String.format(
            "ORDER ID: %d\nClient: %s\nProduct: %s\nQuantity: %d\nPrice: %.2f EUR",
            id, client, product, qty, price
        );
        
        // Generate QR code
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 300, 300);
        
        // Convert to PNG image
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        
        // Encode as Base64
        byte[] qrCodeBytes = outputStream.toByteArray();
        return Base64.getEncoder().encodeToString(qrCodeBytes);
    }
}
```

**Key Parameters**:
- **Size**: 300x300 pixels (good for scanning)
- **Format**: PNG (lossless, good quality)
- **Encoding**: Base64 (easy to store in database and transmit via JSON)

#### Database Schema Update

**Commande Entity**:
```java
@Entity
@Table(name = "commandes")
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String clientName;
    private String product;
    private Integer quantity;
    private Double price;
    private String status;
    
    @Column(length = 1000)
    private String qrCode;  // ← New field for Base64 QR code
}
```

**Database Column**:
```sql
qr_code VARCHAR(1000)
-- Stores Base64 encoded PNG image
-- Typical size: 500-800 characters
```

#### API Endpoints for QR Code

**1. Create Order (includes QR code)**:
```
POST /commandes
Response includes qrCode field with Base64 string
```

**2. Get Order (includes QR code)**:
```
GET /commandes/{id}
Response includes qrCode field with Base64 string
```

**3. Download QR Code as Image**:
```
GET /commandes/{id}/qrcode
Returns PNG image file (can be saved/displayed)
```

#### QR Code Content Format

When you scan the QR code, you see:
```
ORDER ID: 1
Client: John Doe
Product: Pizza Margherita
Quantity: 2
Price: 15.99 EUR
```

**Why this format?**
- Human-readable
- Contains all essential order info
- Easy to verify
- Can be used for order lookup

### QR Code Use Cases

1. **Customer Verification**:
   - Customer receives QR code via email/SMS
   - Shows QR code at pickup
   - Staff scans to verify order

2. **Order Tracking**:
   - QR code links to order status
   - Customer scans to check delivery status

3. **Receipt Integration**:
   - Print QR code on receipt
   - Customer can scan for order history

4. **Mobile App Integration**:
   - Display QR code in mobile app
   - Scan at restaurant/delivery point

### Testing QR Code Feature

#### Test 1: Create Order and Get QR Code

**Postman Request**:
```
POST http://localhost:8088/commandes
Content-Type: application/json

{
  "clientName": "Alice Smith",
  "product": "Burger Deluxe",
  "quantity": 3,
  "price": 24.50,
  "status": "PENDING"
}
```

**Response**:
```json
{
  "id": 1,
  "clientName": "Alice Smith",
  "product": "Burger Deluxe",
  "quantity": 3,
  "price": 24.50,
  "status": "PENDING",
  "qrCode": "iVBORw0KGgoAAAANSUhEUgAAASw..."
}
```

#### Test 2: Download QR Code Image

**Postman Request**:
```
GET http://localhost:8088/commandes/1/qrcode
```

**In Postman**:
1. Click "Send and Download"
2. Save as `qrcode-1.png`
3. Open image file
4. Scan with phone camera

**Expected**: Phone displays order details

#### Test 3: Verify in Database

```sql
USE foodexpress_commandes;
SELECT id, client_name, product, 
       SUBSTRING(qr_code, 1, 50) as qr_preview,
       LENGTH(qr_code) as qr_length
FROM commandes;
```

**Expected**:
```
+----+-------------+------------------+----------------------------------------------------+------------+
| id | client_name | product          | qr_preview                                         | qr_length  |
+----+-------------+------------------+----------------------------------------------------+------------+
|  1 | Alice Smith | Burger Deluxe    | iVBORw0KGgoAAAANSUhEUgAAASw...                   | 756        |
+----+-------------+------------------+----------------------------------------------------+------------+
```

### QR Code Performance Considerations

**Generation Time**: ~50-100ms per QR code
- Fast enough for real-time generation
- No noticeable delay for users

**Storage Size**: ~500-800 characters (Base64)
- Minimal database impact
- Can store thousands of QR codes easily

**Image Quality**: 300x300 pixels
- High enough for reliable scanning
- Small enough for efficient storage

### Future Enhancements

1. **Dynamic QR Codes**:
   - Link to order tracking page
   - Update status in real-time

2. **Customization**:
   - Add company logo to QR code
   - Custom colors
   - Different sizes

3. **Security**:
   - Encrypt QR code data
   - Add expiration time
   - One-time use codes

4. **Analytics**:
   - Track QR code scans
   - Monitor usage patterns

---

## 🔍 Part 7: How Services Stay Connected

### Registration Process

When Commandes Service starts:

1. **Startup**: Service starts on port 8081
2. **Registration**: Sends registration to Eureka
   ```
   POST http://localhost:8761/eureka/apps/COMMANDE-SERVICE
   {
     "instance": {
       "hostName": "localhost",
       "app": "COMMANDE-SERVICE",
       "ipAddr": "192.168.1.100",
       "port": 8081,
       "status": "UP"
     }
   }
   ```
3. **Confirmation**: Eureka adds service to registry
4. **Heartbeat**: Service sends heartbeat every 30 seconds
   ```
   PUT http://localhost:8761/eureka/apps/COMMANDE-SERVICE/localhost:8081
   ```

### Heartbeat Mechanism

```
Time 0s:   Service registers with Eureka
Time 30s:  Service sends heartbeat ❤️
Time 60s:  Service sends heartbeat ❤️
Time 90s:  Service sends heartbeat ❤️
```

If heartbeat stops:
```
Time 120s: No heartbeat received
Time 150s: Eureka marks service as DOWN
Time 180s: Eureka removes service from registry
```

### Service Discovery by Gateway

When Gateway needs to call a service:

1. **Cache Check**: Gateway checks its local cache
2. **Cache Miss**: If not in cache, query Eureka
3. **Eureka Response**: Eureka returns service location
4. **Cache Update**: Gateway caches the location
5. **Request**: Gateway forwards request to service

**Cache Refresh**: Every 30 seconds, Gateway refreshes its cache from Eureka

---

## 🔐 Part 8: Important Configuration Details

### Service Name Matching

**CRITICAL**: The service name must match exactly!

**In Commandes Service** (`application.properties`):
```properties
spring.application.name=commande-service
```

**In API Gateway** (`GatewayConfig.java`):
```java
.uri("lb://COMMANDE-SERVICE")  // ← Must match (case-insensitive)
```

Eureka converts to uppercase: `commande-service` → `COMMANDE-SERVICE`

### Load Balancing

If you run multiple instances:

```
Instance 1: localhost:8081
Instance 2: localhost:8082
Instance 3: localhost:8083
```

Gateway automatically load balances:
```
Request 1 → Instance 1 (8081)
Request 2 → Instance 2 (8082)
Request 3 → Instance 3 (8083)
Request 4 → Instance 1 (8081)  // Round-robin
```

---

## 🚀 Part 9: Startup Sequence (Critical Order)

### Why Startup Order Matters

In a microservices architecture with Config Server, services have dependencies on each other. Starting them in the wrong order will cause failures.

### Correct Startup Sequence

```
1. Config Server (Port 8888)
   ↓ Must start FIRST
   ↓ Provides configurations to all other services
   ↓
2. Eureka Server (Port 8761)
   ↓ Fetches config from Config Server (optional)
   ↓ Must be running before services register
   ↓
3. API Gateway (Port 8088)
   ↓ Fetches config from Config Server
   ↓ Registers with Eureka
   ↓ Must be running before accepting requests
   ↓
4. Commandes Service (Port 8081)
   ↓ Fetches config from Config Server
   ↓ Registers with Eureka
   ↓ Discovered by Gateway
   ↓
5. Wait 30 seconds for Eureka registration
   ↓
6. Angular Frontend (Port 4200)
   ↓ Can now make requests through Gateway
```

### Detailed Startup Steps

#### Step 1: Start Config Server

**Command** (IntelliJ):
```
Open: ConfigServer/src/main/java/tn/esprit/configserver/ConfigServerApplication.java
Right-click → Run
```

**Wait for**:
```
Started ConfigServerApplication in 3.456 seconds
```

**Verify**:
```bash
curl http://localhost:8888/actuator/health
# Should return: {"status":"UP"}
```

**What happens**:
- Config Server loads all .properties files from config/ folder
- Exposes REST API on port 8888
- Ready to serve configurations

#### Step 2: Start Eureka Server

**Command** (IntelliJ):
```
Open: EurekaServer/src/main/java/tn/esprit/eureka/EurekaServerApplication.java
Right-click → Run
```

**Wait for**:
```
Started EurekaServerApplication in 4.123 seconds
```

**Verify**:
```
Open browser: http://localhost:8761
Should see Eureka dashboard (no services registered yet)
```

**What happens**:
- Eureka Server starts
- Initializes service registry (empty)
- Waits for service registrations

#### Step 3: Start API Gateway

**Command** (IntelliJ):
```
Open: ApiGateway/src/main/java/tn/esprit/gateway/ApiGatewayApplication.java
Right-click → Run
```

**Watch logs for**:
```
Fetching config from server at : http://localhost:8888
Located environment: name=api-gateway, profiles=[default]
Registering application API-GATEWAY with eureka
Tomcat started on port(s): 8088 (http)
Started ApiGatewayApplication in 5.678 seconds
```

**Verify**:
```
Open browser: http://localhost:8761
Should see: API-GATEWAY (1 instance) - UP
```

**What happens**:
1. Gateway connects to Config Server
2. Fetches api-gateway.properties
3. Applies configuration (port 8088, Eureka URL)
4. Registers with Eureka
5. Starts accepting requests

#### Step 4: Start Commandes Service

**Command** (IntelliJ):
```
Open: commandes/commandes/src/main/java/com/example/commandes/CommandesApplication.java
Right-click → Run
```

**Watch logs for**:
```
Fetching config from server at : http://localhost:8888
Located environment: name=commande-service, profiles=[default]
HikariPool-1 - Starting...
Hibernate: create table if not exists commande (...)
Registering application COMMANDE-SERVICE with eureka
Tomcat started on port(s): 8081 (http)
Started CommandesApplication in 6.789 seconds
```

**Verify**:
```
Open browser: http://localhost:8761
Should see:
  - API-GATEWAY (1 instance) - UP
  - COMMANDE-SERVICE (1 instance) - UP
```

**What happens**:
1. Service connects to Config Server
2. Fetches commande-service.properties
3. Applies configuration (port 8081, database, Eureka URL)
4. Connects to MySQL database
5. Creates/updates database tables
6. Registers with Eureka
7. Starts accepting requests

#### Step 5: Wait for Service Discovery

**Wait**: 30 seconds

**Why**: 
- Eureka updates registry every 30 seconds
- Gateway refreshes service cache every 30 seconds
- Ensures Gateway knows about Commandes Service

**Verify**:
```bash
# Test direct access to Commandes Service
curl http://localhost:8081/commandes

# Test through API Gateway
curl http://localhost:8088/commandes

# Both should return the same data
```

#### Step 6: Start Angular Frontend

**Command**:
```bash
cd my-app
ng serve
```

**Wait for**:
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

**Verify**:
```
Open browser: http://localhost:4200
Navigate to Orders page
Should see list of orders (or empty list)
```

### What Happens If You Start in Wrong Order?

#### Scenario 1: Start Gateway Before Config Server

**Error**:
```
Could not locate PropertySource: I/O error on GET request for 
"http://localhost:8888/api-gateway/default": Connection refused
```

**Why**: Gateway tries to fetch configuration but Config Server is not running

**Solution**: Start Config Server first

#### Scenario 2: Start Commandes Service Before Eureka

**Error**:
```
DiscoveryClient_COMMANDE-SERVICE - was unable to send heartbeat!
com.netflix.discovery.shared.transport.TransportException: 
Cannot execute request on any known server
```

**Why**: Service tries to register with Eureka but Eureka is not running

**Solution**: Start Eureka before services

#### Scenario 3: Start Angular Before Gateway

**Error** (in browser console):
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Why**: Angular tries to call Gateway but Gateway is not running

**Solution**: Start Gateway before Angular

### Startup Checklist

Before starting services, verify:

- [ ] MySQL is running on port 3306
- [ ] No other applications using ports 8888, 8761, 8088, 8081, 4200
- [ ] All services have correct dependencies in pom.xml
- [ ] All configuration files exist in Config Server

### Startup Summary

| Order | Service | Port | Depends On | Wait Time |
|-------|---------|------|------------|-----------|
| 1 | Config Server | 8888 | None | 3-5 seconds |
| 2 | Eureka Server | 8761 | Config Server (optional) | 4-6 seconds |
| 3 | API Gateway | 8088 | Config Server, Eureka | 5-7 seconds |
| 4 | Commandes Service | 8081 | Config Server, Eureka, MySQL | 6-8 seconds |
| 5 | Wait | - | - | 30 seconds |
| 6 | Angular | 4200 | API Gateway | 10-15 seconds |

**Total startup time**: ~1-2 minutes

---

## 🧪 Part 10: Verification Steps

### 1. Check Config Server

Open: http://localhost:8888/actuator/health

Expected response:
```json
{
  "status": "UP"
}
```

Test configuration fetch:
```bash
curl http://localhost:8888/commande-service/default
```

Should return JSON with all commande-service properties.

### 2. Check Eureka Dashboard

Open: http://localhost:8761

### 2. Check Eureka Dashboard

Open: http://localhost:8761

You should see:
```
Application          AMIs        Availability Zones    Status
API-GATEWAY          n/a (1)     (1)                   UP (1) - localhost:api-gateway:8088
COMMANDE-SERVICE     n/a (1)     (1)                   UP (1) - localhost:commande-service:8081
```

### 3. Test Direct Service Access

```bash
# Direct to Commandes Service (bypassing Gateway)
curl http://localhost:8081/commandes
```

### 3. Test Direct Service Access

```bash
# Direct to Commandes Service (bypassing Gateway)
curl http://localhost:8081/commandes
```

### 4. Test Through Gateway

```bash
# Through API Gateway (proper way)
curl http://localhost:8080/commandes
```

### 4. Test Through Gateway

```bash
# Through API Gateway (proper way)
curl http://localhost:8088/commandes
```

Both should return the same data!

### 5. Check Gateway Routes

```bash
# Get all Gateway routes
curl http://localhost:8080/actuator/gateway/routes
```

---

## 🚨 Part 11: Common Issues & Solutions

### Issue 1: Config Server Connection Failed

**Symptoms**: 
```
Could not locate PropertySource
Connection refused: http://localhost:8888
```

**Causes**:
- Config Server not running
- Wrong Config Server URL in bootstrap.properties
- Port 8888 blocked by firewall

**Solution**:
1. Start Config Server first
2. Verify it's running: `curl http://localhost:8888/actuator/health`
3. Check bootstrap.properties:
   ```properties
   spring.cloud.config.uri=http://localhost:8888
   ```
4. Check application.properties:
   ```properties
   spring.config.import=optional:configserver:http://localhost:8888
   ```

### Issue 2: Service Not Appearing in Eureka

**Symptoms**: Service starts but doesn't show in Eureka dashboard

**Causes**:
- Eureka Server not running
- Wrong Eureka URL in `application.properties`
- Missing `@EnableDiscoveryClient` annotation
- Firewall blocking port 8761

**Solution**:
```properties
# Check this URL is correct
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

### Issue 2: Service Not Appearing in Eureka

**Symptoms**: Service starts but doesn't show in Eureka dashboard

**Causes**:
- Eureka Server not running
- Wrong Eureka URL in configuration
- Missing `@EnableDiscoveryClient` annotation
- Firewall blocking port 8761

**Solution**:
```properties
# Check this URL is correct (in Config Server or local config)
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

Verify annotation:
```java
@SpringBootApplication
@EnableDiscoveryClient  // ← Must have this
public class CommandesApplication { ... }
```

### Issue 3: Gateway Can't Find Service

**Symptoms**: 
```
503 Service Unavailable
No instances available for COMMANDE-SERVICE
```

**Causes**:
- Service name mismatch
- Service not registered with Eureka
- Service is DOWN

**Solution**:
1. Check Eureka dashboard - is service UP?
2. Verify service name matches exactly
3. Wait 30 seconds for registration to complete

### Issue 3: Gateway Can't Find Service

**Symptoms**: 
```
503 Service Unavailable
No instances available for COMMANDE-SERVICE
```

**Causes**:
- Service name mismatch
- Service not registered with Eureka
- Service is DOWN
- Gateway cache not refreshed

**Solution**:
1. Check Eureka dashboard - is service UP?
2. Verify service name matches exactly:
   - Config: `spring.application.name=commande-service`
   - Gateway: `lb://COMMANDE-SERVICE` (case-insensitive)
3. Wait 30 seconds for registration to complete
4. Restart Gateway to refresh cache

### Issue 4: Gateway Returns 404

**Symptoms**: Gateway returns 404 but direct service access works

**Causes**:
- Route path doesn't match
- Missing route configuration

**Solution**:
```java
// Check route path matches your request
.route("commande-service", r -> r
    .path("/commandes/**")  // ← Must match request path
    .uri("lb://COMMANDE-SERVICE"))
```

### Issue 4: Gateway Returns 404

**Symptoms**: Gateway returns 404 but direct service access works

**Causes**:
- Route path doesn't match
- Missing route configuration

**Solution**:
```java
// Check route path matches your request
.route("commande-service", r -> r
    .path("/commandes/**")  // ← Must match request path
    .uri("lb://COMMANDE-SERVICE"))
```

### Issue 5: Database Connection Failed

**Symptoms**:
```
Communications link failure
The last packet sent successfully to the server was 0 milliseconds ago
```

**Causes**:
- MySQL not running
- Wrong database credentials
- Database doesn't exist

**Solution**:
1. Start MySQL service
2. Check credentials in Config Server:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=
   ```
3. Verify database URL:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/foodexpress_commandes?createDatabaseIfNotExist=true
   ```

### Issue 6: Port Already in Use

**Symptoms**:
```
Port 8088 was already in use
```

**Causes**:
- Another application using the port
- Previous instance still running

**Solution**:
1. Find process using port:
   ```bash
   # Windows
   netstat -ano | findstr :8088
   
   # Kill process
   taskkill /PID <process_id> /F
   ```
2. Or change port in Config Server configuration

### Issue 7: CORS Error in Angular

**Symptoms** (browser console):
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes**:
- CORS not configured in Gateway or Service
- Wrong origin in CORS configuration

**Solution**:
Verify CORS configuration in Gateway:
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        // ...
    }
}
```

---

## 📊 Part 12: Architecture Benefits

### 1. Centralized Configuration (Config Server)
- All configurations in one place
- Change config without rebuilding services
- Environment-specific configurations (dev/prod)
- Version control for configurations
- Consistent configuration across all services

### 2. Dynamic Service Discovery (Eureka)
- No hardcoded IPs or ports
- Services can move freely
- Automatic failover

### 2. Dynamic Service Discovery (Eureka)
- No hardcoded IPs or ports
- Services can move freely
- Automatic failover
- Health monitoring

### 3. Load Balancing (Gateway)
- Distribute load across instances
- Automatic health checks
- Remove unhealthy instances

### 3. Load Balancing (Gateway)
- Distribute load across instances
- Automatic health checks
- Remove unhealthy instances
- Round-robin distribution

### 4. Centralized Routing (Gateway)
- Single entry point for clients
- Easy to add authentication
- Centralized logging

### 4. Centralized Routing (Gateway)
- Single entry point for clients
- Easy to add authentication
- Centralized logging
- Request/response transformation

### 5. Scalability
- Add more instances easily
- No client configuration changes
- Horizontal scaling

### 5. Scalability
- Add more instances easily
- No client configuration changes
- Horizontal scaling
- Independent service scaling

### 6. Resilience
- Service failures don't break system
- Automatic retry logic
- Circuit breaker patterns

### 6. Resilience
- Service failures don't break system
- Automatic retry logic
- Circuit breaker patterns
- Graceful degradation

### 7. Maintainability
- Clear separation of concerns
- Easy to update individual services
- Independent deployment
- Simplified debugging

---

## 🎯 Part 13: Key Takeaways

1. **Config Server** = Centralized configuration management
2. **Eureka Server** = Service registry (phone book)
3. **API Gateway** = Entry point + router
4. **Commandes Service** = Business logic microservice
5. **Angular** = User interface
6. **MySQL** = Data persistence

**Connection Flow**:
```
Config Server → Provides configs to all services
                      ↓
Commandes Service → Registers with → Eureka Server
                                          ↓
API Gateway → Discovers services from → Eureka Server
                                          ↓
Angular → Calls → API Gateway → Routes to → Commandes Service → MySQL
```

**Critical Configuration**:
- Config Server must start FIRST
- All services must point to same Eureka URL
- Service names must match in Gateway routes
- All services must have unique ports
- Use `optional:configserver:` for Spring Boot 3.x

**The Magic**:
- No hardcoded URLs (thanks to Eureka)
- Centralized configuration (thanks to Config Server)
- Dynamic service discovery
- Automatic load balancing
- Self-healing architecture

**Startup Order** (CRITICAL):
```
1. Config Server (8888)
2. Eureka Server (8761)
3. API Gateway (8088)
4. Commandes Service (8081)
5. Wait 30 seconds
6. Angular (4200)
```

---

## 📈 Part 14: Scaling the Architecture

### Adding More Microservices

To add a new microservice (e.g., Users Service):

1. **Create configuration in Config Server**:
   ```properties
   # config/users-service.properties
   spring.application.name=users-service
   server.port=8082
   eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
   ```

2. **Add Eureka Client to service**:
   ```java
   @SpringBootApplication
   @EnableDiscoveryClient
   public class UsersServiceApplication { ... }
   ```

3. **Add route in API Gateway**:
   ```java
   .route("users-service", r -> r
       .path("/users/**")
       .uri("lb://USERS-SERVICE"))
   ```

4. **Start service** - it automatically:
   - Fetches config from Config Server
   - Registers with Eureka
   - Becomes discoverable by Gateway

### Running Multiple Instances

To run multiple instances of Commandes Service:

**Instance 1**:
```properties
server.port=8081
eureka.instance.instance-id=${spring.application.name}:8081
```

**Instance 2**:
```properties
server.port=8082
eureka.instance.instance-id=${spring.application.name}:8082
```

**Instance 3**:
```properties
server.port=8083
eureka.instance.instance-id=${spring.application.name}:8083
```

Gateway automatically load balances:
```
Request 1 → Instance 1 (8081)
Request 2 → Instance 2 (8082)
Request 3 → Instance 3 (8083)
Request 4 → Instance 1 (8081)  // Round-robin
```

### Environment-Specific Configurations

**Development** (config/commande-service-dev.properties):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/foodexpress_dev
logging.level.root=DEBUG
```

**Production** (config/commande-service-prod.properties):
```properties
spring.datasource.url=jdbc:mysql://prod-server:3306/foodexpress_prod
logging.level.root=WARN
```

Activate profile:
```properties
spring.profiles.active=prod
```

---

## 🔒 Part 15: Security Considerations

### Current Setup (Development)

Currently, the architecture is open for development:
- No authentication required
- All endpoints publicly accessible
- CORS allows all origins

### Production Recommendations

1. **Add Authentication to Gateway**:
   ```java
   // JWT token validation
   // OAuth2 integration
   // API key validation
   ```

2. **Secure Config Server**:
   ```properties
   # Encrypt sensitive properties
   spring.cloud.config.server.encrypt.enabled=true
   ```

3. **Secure Eureka Dashboard**:
   ```properties
   # Add basic authentication
   spring.security.user.name=admin
   spring.security.user.password=secret
   ```

4. **HTTPS for All Services**:
   ```properties
   server.ssl.enabled=true
   server.ssl.key-store=classpath:keystore.p12
   ```

5. **Database Security**:
   ```properties
   # Use strong passwords
   # Encrypt connections
   spring.datasource.password=${DB_PASSWORD}
   ```

---

## 📚 Part 16: Further Learning

- [Spring Cloud Config](https://spring.io/projects/spring-cloud-config)
- [Spring Cloud Netflix Eureka](https://spring.io/projects/spring-cloud-netflix)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [Microservices Patterns](https://microservices.io/patterns/index.html)
- [12-Factor App Methodology](https://12factor.net/)

---

## 📝 Part 17: Quick Reference

### Ports Summary

| Service | Port | URL |
|---------|------|-----|
| Config Server | 8888 | http://localhost:8888 |
| Eureka Server | 8761 | http://localhost:8761 |
| API Gateway | 8088 | http://localhost:8088 |
| Commandes Service | 8081 | http://localhost:8081 |
| Angular | 4200 | http://localhost:4200 |
| MySQL | 3306 | localhost:3306 |

### Important URLs

| Purpose | URL |
|---------|-----|
| Config Server Health | http://localhost:8888/actuator/health |
| Fetch Commandes Config | http://localhost:8888/commande-service/default |
| Eureka Dashboard | http://localhost:8761 |
| Gateway Health | http://localhost:8088/actuator/health |
| Commandes API (Direct) | http://localhost:8081/commandes |
| Commandes API (Gateway) | http://localhost:8088/commandes |
| Download QR Code | http://localhost:8088/commandes/{id}/qrcode |
| Angular App | http://localhost:4200 |

### API Endpoints (Commandes Service)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/commandes` | Get all orders | JSON array with qrCode fields |
| GET | `/commandes/{id}` | Get single order | JSON with qrCode field |
| POST | `/commandes` | Create order + generate QR | JSON with qrCode (Base64) |
| PUT | `/commandes/{id}` | Update order | JSON (QR unchanged) |
| DELETE | `/commandes/{id}` | Delete order | 204 No Content |
| GET | `/commandes/{id}/qrcode` | Download QR as PNG image | PNG image file |

**Note**: All endpoints accessible through API Gateway at `http://localhost:8088`

### Configuration Files

| Service | Config Location |
|---------|----------------|
| Config Server | `ConfigServer/src/main/resources/application.properties` |
| Commandes Config | `ConfigServer/src/main/resources/config/commande-service.properties` |
| Gateway Config | `ConfigServer/src/main/resources/config/api-gateway.properties` |
| Eureka Config | `ConfigServer/src/main/resources/config/eureka-server.properties` |
| Commandes Bootstrap | `commandes/commandes/src/main/resources/bootstrap.properties` |
| Gateway Bootstrap | `ApiGateway/src/main/resources/bootstrap.properties` |

### Key Annotations

| Annotation | Purpose | Used In |
|------------|---------|---------|
| `@EnableConfigServer` | Enable Config Server | ConfigServerApplication |
| `@EnableEurekaServer` | Enable Eureka Server | EurekaServerApplication |
| `@EnableDiscoveryClient` | Register with Eureka | Gateway, Commandes Service |
| `@SpringBootApplication` | Main Spring Boot app | All applications |
| `@RestController` | REST API controller | CommandeController |
| `@Service` | Service layer | CommandeService, QRCodeService |
| `@Repository` | Data access layer | CommandeRepository |
| `@Entity` | JPA entity | Commande |
| `@Transactional` | Transaction management | CommandeService methods |

### Common Commands

```bash
# Check if port is in use (Windows)
netstat -ano | findstr :8088

# Kill process by PID (Windows)
taskkill /PID <process_id> /F

# Test Config Server
curl http://localhost:8888/commande-service/default

# Test Eureka
curl http://localhost:8761/eureka/apps

# Test Gateway
curl http://localhost:8088/commandes

# Test Commandes Service
curl http://localhost:8081/commandes

# Create order via Gateway (with QR code generation)
curl -X POST http://localhost:8088/commandes \
  -H "Content-Type: application/json" \
  -d '{"clientName":"John","product":"Pizza","quantity":2,"price":15.99,"status":"PENDING"}'

# Download QR code as image
curl http://localhost:8088/commandes/1/qrcode --output qrcode-1.png
```
  -H "Content-Type: application/json" \
  -d '{"clientName":"John","product":"Pizza","quantity":2,"price":15.99,"status":"PENDING"}'
```

### Troubleshooting Checklist

- [ ] Config Server running on 8888
- [ ] Eureka Server running on 8761
- [ ] MySQL running on 3306
- [ ] All services registered in Eureka
- [ ] Gateway can reach Eureka
- [ ] Services can reach Config Server
- [ ] No port conflicts
- [ ] CORS configured correctly
- [ ] Database credentials correct
- [ ] Waited 30 seconds after startup
- [ ] ZXing library downloaded (for QR codes)
- [ ] QR code field exists in database

---

## 🎨 Part 18: Technology Stack Summary

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.2.3 | Application framework |
| Spring Cloud Config | 2023.0.0 | Configuration management |
| Spring Cloud Netflix Eureka | 2023.0.0 | Service discovery |
| Spring Cloud Gateway | 2023.0.0 | API Gateway |
| Spring Data JPA | 3.2.3 | Database access |
| MySQL | 8.0 | Database |
| Lombok | Latest | Reduce boilerplate code |
| ZXing | 3.5.3 | QR code generation |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.x | Frontend framework |
| TypeScript | Latest | Type-safe JavaScript |
| Tailwind CSS | 3.x | Styling |
| Material Symbols | Latest | Icons |

### Architecture Patterns

| Pattern | Implementation | Benefit |
|---------|----------------|---------|
| Microservices | Separate services | Scalability, independence |
| Service Discovery | Eureka | Dynamic service location |
| API Gateway | Spring Cloud Gateway | Single entry point |
| Config Server | Spring Cloud Config | Centralized configuration |
| Repository Pattern | JpaRepository | Clean data access |
| DTO Pattern | CommandeDTO | API layer separation |
| Layered Architecture | Controller→Service→Repository | Separation of concerns |

---

**Created for FoodExpress Microservices Project**

**Last Updated**: March 31, 2026

**Architecture Version**: 2.1 (with Config Server + QR Code Generation)
