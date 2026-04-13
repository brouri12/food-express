# Using Config Server - Complete Setup Guide

## ✅ What I've Done

1. Added Config Client dependency to:
   - Commandes Service
   - API Gateway

2. Created `bootstrap.properties` for each service
   - Points to Config Server (port 8888)
   - Loads configuration BEFORE application starts

3. Centralized all configurations in Config Server

## 🚀 How to Start Everything

### IMPORTANT: Start in This Order!

#### 1. Start Config Server (FIRST!)
```
Open: ConfigServer/src/main/java/tn/esprit/configserver/ConfigServerApplication.java
Right-click → Run
Wait for: "Started ConfigServerApplication in X seconds"
```

**Verify**: http://localhost:8888/commande-service/default

#### 2. Start Eureka Server
```
Open: EurekaServer/src/main/java/tn/esprit/eureka/EurekaServerApplication.java
Right-click → Run
Wait for: "Started EurekaServerApplication"
```

**Verify**: http://localhost:8761

#### 3. Start API Gateway
```
Open: ApiGateway/src/main/java/tn/esprit/gateway/ApiGatewayApplication.java
Right-click → Run
Wait for: "Started ApiGatewayApplication"
```

Should see in logs:
```
Fetching config from server at: http://localhost:8888
Located environment: name=api-gateway
```

#### 4. Start Commandes Service
```
Open: commandes/commandes/src/main/java/com/example/commandes/CommandesApplication.java
Right-click → Run
Wait for: "Started CommandesApplication"
```

Should see in logs:
```
Fetching config from server at: http://localhost:8888
Located environment: name=commande-service
```

#### 5. Wait 30 Seconds
For Eureka registration to complete

#### 6. Start Angular
```bash
cd my-app
ng serve
```

## 📋 Startup Order Summary

```
1. Config Server (8888)  ← MUST BE FIRST!
   ↓
2. Eureka Server (8761)
   ↓
3. API Gateway (8088)
   ↓
4. Commandes Service (8081)
   ↓
5. Angular (4200)
```

## 🔍 Verify Config Server is Working

### Test 1: Check Config Server
```bash
curl http://localhost:8888/commande-service/default
```

Should return JSON with all commande-service properties.

### Test 2: Check Service Logs
When starting Commandes Service, look for:
```
Fetching config from server at : http://localhost:8888
Located environment: name=commande-service, profiles=[default]
```

### Test 3: Check Eureka
Open: http://localhost:8761

Should see:
- API-GATEWAY
- COMMANDE-SERVICE

## 📁 Configuration Files Location

All configurations are now in:
```
ConfigServer/src/main/resources/config/
├── api-gateway.properties
├── commande-service.properties
└── eureka-server.properties
```

## 🔧 How to Change Configuration

### Example: Change Commandes Service Port

1. Open: `ConfigServer/src/main/resources/config/commande-service.properties`
2. Change: `server.port=8081` to `server.port=8082`
3. Save file
4. Restart Commandes Service
5. It will fetch new config from Config Server!

No need to change anything in the Commandes Service itself!

## ⚠️ Troubleshooting

### Error: "Could not locate PropertySource"
**Problem**: Config Server not running

**Solution**:
1. Start Config Server FIRST
2. Wait for it to fully start
3. Then start other services

### Error: "Connection refused to localhost:8888"
**Problem**: Config Server not accessible

**Solution**:
1. Check Config Server is running
2. Check port 8888 is not blocked
3. Verify `bootstrap.properties` has correct URI

### Service Won't Start
**Problem**: Can't fetch configuration

**Solution**:
1. Start Config Server first
2. Check Config Server logs for errors
3. Verify configuration file exists in `config/` folder

## 🎯 Benefits You Get

1. **Centralized Configuration**
   - All configs in one place
   - Easy to manage

2. **Dynamic Updates**
   - Change config without rebuilding
   - Just restart the service

3. **Environment Management**
   - Easy to have dev/prod configs
   - Switch with profiles

4. **Version Control**
   - Track configuration changes
   - Rollback if needed

## 📊 Current Setup

### Before (Local Config)
```
Each service → Own application.properties
```

### After (Config Server)
```
Config Server (8888)
    ↓ provides configs
    ├── API Gateway (8088)
    └── Commandes Service (8081)
```

## ✅ Checklist

Before starting services:

- [ ] Config Server running on 8888
- [ ] Can access http://localhost:8888/commande-service/default
- [ ] Eureka Server running on 8761
- [ ] Services have `bootstrap.properties`
- [ ] Services have Config Client dependency

## 🚨 Important Notes

1. **Always start Config Server FIRST!**
2. Services will fail if Config Server is not running
3. Wait for each service to fully start before starting the next
4. Check logs for "Fetching config from server" message

---

**You're now using Spring Cloud Config Server!** 🎉
