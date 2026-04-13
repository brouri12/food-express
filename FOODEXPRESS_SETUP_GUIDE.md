# FoodExpress - Commandes Microservice Setup Guide

## 📋 Overview
This guide will help you set up and run the complete FoodExpress Commandes microservice with Angular frontend.

## 🏗️ Architecture
- **Backend**: Spring Boot (Java 17)
- **Frontend**: Angular 21
- **Service Discovery**: Netflix Eureka Server
- **API Gateway**: Spring Cloud Gateway
- **Database**: MySQL

## 📦 Prerequisites

### Required Software
1. **Java JDK 17 or higher**
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

2. **Maven** (or use included Maven wrapper)
   - Download: https://maven.apache.org/download.cgi
   - Verify: `mvn -version`

3. **Node.js 18+ and npm**
   - Download: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

4. **MySQL 8.0+**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`

5. **Angular CLI**
   ```bash
   npm install -g @angular/cli
   ```

## 🗄️ Database Setup

### 1. Start MySQL Server
Make sure MySQL is running on your machine.

### 2. Create Database
The application will auto-create the database, but you can create it manually:

```sql
CREATE DATABASE foodexpress_commandes;
```

### 3. Update Database Credentials
Edit `commandes/commandes/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

## 🚀 Running the Application

### Step 1: Start Eureka Server

```bash
cd EurekaServer
mvn spring-boot:run
```

Or in IntelliJ:
- Open `EurekaServer` folder
- Run `EurekaServerApplication.java`

**Verify**: Open http://localhost:8761 - You should see Eureka Dashboard

### Step 2: Start API Gateway

```bash
cd ApiGateway
mvn spring-boot:run
```

Or in IntelliJ:
- Open `ApiGateway` folder
- Run `ApiGatewayApplication.java`

**Verify**: Gateway should register with Eureka (check Eureka dashboard)

### Step 3: Start Commandes Service

```bash
cd commandes/commandes
mvnw.cmd spring-boot:run
```

Or in IntelliJ:
1. File → Open → Select `commandes/commandes` folder
2. Wait for Maven to download dependencies
3. Right-click `CommandesApplication.java` → Run

**Verify**: 
- Check Eureka dashboard - `COMMANDE-SERVICE` should appear
- Test endpoint: http://localhost:8081/commandes

### Step 4: Start Angular Frontend

```bash
cd my-app
npm install
ng serve
```

**Verify**: Open http://localhost:4200

## 🧪 Testing the Application

### 1. Test Backend Directly
```bash
# Get all commandes
curl http://localhost:8081/commandes

# Create a commande
curl -X POST http://localhost:8081/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Doe",
    "product": "Pizza Margherita",
    "quantity": 2,
    "price": 15.99,
    "status": "PENDING"
  }'
```

### 2. Test Through API Gateway
```bash
# Get all commandes via gateway
curl http://localhost:8080/commandes
```

### 3. Test Frontend
1. Open http://localhost:4200
2. Click "New Commande"
3. Fill in the form:
   - Client Name: John Doe
   - Product: Pizza Margherita
   - Quantity: 2
   - Price: 15.99
   - Status: PENDING
4. Click "Create"
5. Verify the commande appears in the list

## 📁 Project Structure

### Backend (Spring Boot)
```
commandes/commandes/
├── src/main/java/com/example/commandes/
│   ├── CommandesApplication.java       # Main application
│   ├── controller/
│   │   └── CommandeController.java     # REST endpoints
│   ├── service/
│   │   └── CommandeService.java        # Business logic
│   ├── repository/
│   │   └── CommandeRepository.java     # Data access
│   ├── entity/
│   │   └── Commande.java               # JPA entity
│   └── dto/
│       └── CommandeDTO.java            # Data transfer object
└── src/main/resources/
    └── application.properties          # Configuration
```

### Frontend (Angular)
```
my-app/src/app/
├── components/
│   ├── commandes-list/                 # List view
│   │   ├── commandes-list.component.ts
│   │   ├── commandes-list.component.html
│   │   └── commandes-list.component.css
│   └── commandes-form/                 # Create/Edit form
│       ├── commandes-form.component.ts
│       ├── commandes-form.component.html
│       └── commandes-form.component.css
├── services/
│   └── commande.service.ts             # HTTP service
├── models/
│   └── commande.model.ts               # TypeScript interface
└── app.routes.ts                       # Routing configuration
```

## 🔧 Configuration Files

### Backend Configuration
**File**: `commandes/commandes/src/main/resources/application.properties`
```properties
# Service name for Eureka
spring.application.name=commande-service

# Server port
server.port=8081

# MySQL connection
spring.datasource.url=jdbc:mysql://localhost:3306/foodexpress_commandes?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root

# Eureka configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

### API Gateway Routes
**File**: `ApiGateway/src/main/java/tn/esprit/gateway/GatewayConfig.java`
```java
.route("commande-service", r -> r
    .path("/commandes/**")
    .uri("lb://COMMANDE-SERVICE"))
```

## 🌐 API Endpoints

### Through API Gateway (http://localhost:8080)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /commandes | Get all commandes |
| GET | /commandes/{id} | Get commande by ID |
| POST | /commandes | Create new commande |
| PUT | /commandes/{id} | Update commande |
| DELETE | /commandes/{id} | Delete commande |

### Direct Service (http://localhost:8081)
Same endpoints as above, but accessed directly without gateway.

## 🎨 Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| / | Redirect to /commandes | Home redirect |
| /commandes | CommandesListComponent | List all commandes |
| /commandes/new | CommandesFormComponent | Create new commande |
| /commandes/edit/:id | CommandesFormComponent | Edit existing commande |

## 🐛 Troubleshooting

### Issue: Service not registering with Eureka
**Solution**: 
- Ensure Eureka Server is running first
- Check `eureka.client.service-url.defaultZone` in application.properties
- Wait 30 seconds for registration

### Issue: CORS errors in browser
**Solution**: 
- Backend has `@CrossOrigin(origins = "*")` on controller
- Check browser console for specific error
- Verify API Gateway CORS configuration

### Issue: Cannot connect to MySQL
**Solution**:
- Verify MySQL is running: `mysql -u root -p`
- Check username/password in application.properties
- Ensure database exists or `createDatabaseIfNotExist=true` is set

### Issue: Port already in use
**Solution**:
- Eureka: Change port in `EurekaServer/src/main/resources/application.properties`
- Gateway: Change port in `ApiGateway/src/main/resources/application.properties`
- Commandes: Change `server.port` in commandes application.properties
- Angular: Run `ng serve --port 4201`

### Issue: Maven dependencies not downloading
**Solution**:
```bash
cd commandes/commandes
mvnw.cmd clean install -U
```

### Issue: Angular compilation errors
**Solution**:
```bash
cd my-app
rm -rf node_modules package-lock.json
npm install
```

## 📊 Default Ports

| Service | Port |
|---------|------|
| Eureka Server | 8761 |
| API Gateway | 8080 |
| Commandes Service | 8081 |
| Angular Frontend | 4200 |
| MySQL | 3306 |

## ✅ Verification Checklist

- [ ] Java 17+ installed
- [ ] MySQL running
- [ ] Node.js and npm installed
- [ ] Eureka Server running (http://localhost:8761)
- [ ] API Gateway running and registered with Eureka
- [ ] Commandes Service running and registered with Eureka
- [ ] Angular app running (http://localhost:4200)
- [ ] Can create/read/update/delete commandes through UI

## 🎯 Next Steps

1. **Add Authentication**: Implement Spring Security and JWT
2. **Add Validation**: Use Bean Validation annotations
3. **Add Pagination**: Implement paginated endpoints
4. **Add Search**: Add search/filter functionality
5. **Add Tests**: Write unit and integration tests
6. **Docker**: Containerize all services
7. **CI/CD**: Set up automated deployment

## 📝 Notes

- The backend uses DTOs to separate API layer from database entities
- CORS is enabled for development (restrict in production)
- Database schema is auto-created by Hibernate
- All services must register with Eureka before Gateway can route to them
- Frontend communicates ONLY through API Gateway (port 8080)

## 🆘 Support

If you encounter issues:
1. Check all services are running
2. Verify Eureka dashboard shows all services
3. Check application logs for errors
4. Ensure database connection is working
5. Test endpoints with curl/Postman before using UI

---

**Created for FoodExpress Microservices Project**
