# Spring Cloud Config Server Setup Guide

## What is Config Server?

Config Server centralizes all microservices configurations in one place. Instead of each service having its own `application.properties`, they all fetch their configuration from the Config Server.

## Benefits

- ✅ Centralized configuration management
- ✅ Change configs without rebuilding services
- ✅ Environment-specific configurations (dev, prod)
- ✅ Version control for configurations
- ✅ Dynamic configuration updates

## Architecture

```
Config Server (8888)
    ↓ provides configs to
    ├── Eureka Server (8761)
    ├── API Gateway (8088)
    └── Commandes Service (8081)
```

## Setup Steps

### 1. Config Server is Ready!

I've created the Config Server with:
- Port: 8888
- Configuration files in: `ConfigServer/src/main/resources/config/`

### 2. Start Config Server

In IntelliJ:
1. Open `ConfigServer/src/main/java/tn/esprit/configserver/ConfigServerApplication.java`
2. Right-click → Run
3. Wait for: "Started ConfigServerApplication"

### 3. Verify Config Server

Open browser: http://localhost:8888/commande-service/default

You should see the configuration for commande-service.

## Configuration Files Created

### For Eureka Server
File: `config/eureka-server.properties`
- Port: 8761
- Self-registration: disabled

### For API Gateway  
File: `config/api-gateway.properties`
- Port: 8088
- Eureka connection
- Gateway settings

### For Commandes Service
File: `config/commande-service.properties`
- Port: 8081
- MySQL connection
- JPA settings
- Eureka connection

## How to Use Config Server

### Option 1: Keep Current Setup (Recommended for Now)

Your services work fine with local `application.properties`. 
Config Server is optional and can be added later.

### Option 2: Migrate to Config Server

To make services use Config Server:

1. Add dependency to each service's `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

2. Create `bootstrap.properties` in each service:
```properties
spring.application.name=commande-service
spring.cloud.config.uri=http://localhost:8888
```

3. Remove local `application.properties`

4. Start Config Server FIRST, then other services

## Startup Order (with Config Server)

1. **Config Server** (port 8888)
2. **Eureka Server** (port 8761)  
3. **API Gateway** (port 8088)
4. **Commandes Service** (port 8081)

## Testing Config Server

### Test 1: Get Commande Service Config
```bash
curl http://localhost:8888/commande-service/default
```

### Test 2: Get API Gateway Config
```bash
curl http://localhost:8888/api-gateway/default
```

### Test 3: Get Eureka Config
```bash
curl http://localhost:8888/eureka-server/default
```

## Current vs Config Server

### Current Setup (What You Have Now)
```
Each service has its own application.properties
✅ Simple
✅ Works great for development
❌ Hard to manage many services
```

### With Config Server
```
All configs in Config Server
✅ Centralized management
✅ Easy to update
✅ Production-ready
❌ More complex
❌ One more service to run
```

## Recommendation

**For now, keep your current setup!** It's working perfectly.

Config Server is useful when you have:
- Many microservices (10+)
- Multiple environments (dev, staging, prod)
- Need to change configs without redeploying

You can add it later when needed.

## If You Want to Try Config Server

1. Start Config Server
2. Keep your current `application.properties` files
3. Services will still work normally
4. Config Server is ready when you need it

---

**Config Server is created and ready, but optional for now!** 🚀
