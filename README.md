# 🍕 FoodExpress - Microservices Architecture

A complete microservices-based food ordering system built with Spring Boot, Spring Cloud, Angular, and Docker.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributors](#contributors)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  Angular App    │  Port 4200
│  (Frontend)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  API Gateway    │  Port 8088
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Eureka Server   │  Port 8761
│ (Discovery)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Config Server   │  Port 8888
│ (Configuration) │
└─────────────────┘
         │
         ↓
┌─────────────────┐
│ Commandes       │  Port 8081
│ Service         │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ MySQL Database  │  Port 3306
└─────────────────┘
```

---

## ✨ Features

### Microservices
- ✅ **Config Server**: Centralized configuration management
- ✅ **Eureka Server**: Service discovery and registration
- ✅ **API Gateway**: Single entry point with routing and load balancing
- ✅ **Commandes Service**: Order management with full CRUD operations

### Business Features
- ✅ **Order Management**: Create, read, update, delete orders
- ✅ **QR Code Generation**: Automatic QR code for each order
- ✅ **Real-time Status**: Order status tracking
- ✅ **Service Discovery**: Dynamic service registration

### Technical Features
- ✅ **Docker Support**: Containerized deployment
- ✅ **RESTful API**: Clean REST endpoints
- ✅ **Database Integration**: MySQL with JPA/Hibernate
- ✅ **Modern UI**: Angular with Tailwind CSS
- ✅ **CORS Configuration**: Cross-origin support
- ✅ **Transaction Management**: @Transactional support

---

## 🛠️ Technologies

### Backend
- **Java 17**
- **Spring Boot 3.2.3**
- **Spring Cloud 2023.0.0**
  - Spring Cloud Config
  - Spring Cloud Netflix Eureka
  - Spring Cloud Gateway
- **Spring Data JPA**
- **MySQL 8.0**
- **Lombok**
- **ZXing** (QR Code generation)

### Frontend
- **Angular 21.x**
- **TypeScript**
- **Tailwind CSS**
- **Material Symbols Icons**

### DevOps
- **Docker**
- **Maven**
- **Git**

---

## 📁 Project Structure

```
food-express/
├── ApiGateway/                 # API Gateway service
│   ├── src/
│   └── pom.xml
├── ConfigServer/               # Config Server
│   ├── src/
│   │   └── main/resources/config/
│   │       ├── api-gateway.properties
│   │       ├── commande-service.properties
│   │       └── eureka-server.properties
│   └── pom.xml
├── EurekaServer/               # Eureka Discovery Server
│   ├── src/
│   └── pom.xml
├── commandes/commandes/        # Commandes Microservice
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/example/commandes/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── entity/
│   │       │       └── dto/
│   │       └── resources/
│   ├── Dockerfile
│   └── pom.xml
├── my-app/                     # Angular Frontend
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       └── services/
│   └── package.json
└── README.md
```

---

## 📦 Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **MySQL 8.0**
- **Docker Desktop** (optional, for containerized deployment)
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/brouri12/food-express.git
cd food-express
```

### 2. Setup MySQL Database

```sql
CREATE DATABASE foodexpress_commandes;
```

### 3. Start Services (in order)

#### Step 1: Start Config Server
```bash
cd ConfigServer
mvn spring-boot:run
```
Verify: http://localhost:8888/actuator/health

#### Step 2: Start Eureka Server
```bash
cd EurekaServer
mvn spring-boot:run
```
Verify: http://localhost:8761

#### Step 3: Start API Gateway
```bash
cd ApiGateway
mvn spring-boot:run
```
Verify: http://localhost:8088/actuator/health

#### Step 4: Start Commandes Service
```bash
cd commandes/commandes
mvn spring-boot:run
```
Verify: http://localhost:8081/commandes

#### Step 5: Start Angular Frontend
```bash
cd my-app
npm install
ng serve
```
Verify: http://localhost:4200

---

## 🐳 Running with Docker

### Build Docker Image

```bash
cd commandes/commandes
docker build -t foodexpress-commandes:latest .
```

### Run Container

```bash
docker run -d --name commandes-service -p 8081:8081 \
  -e spring.datasource.url=jdbc:mysql://host.docker.internal:3306/foodexpress_commandes?createDatabaseIfNotExist=true \
  -e eureka.client.service-url.defaultZone=http://host.docker.internal:8761/eureka/ \
  foodexpress-commandes:latest
```

### View Logs

```bash
docker logs -f commandes-service
```

### Stop Container

```bash
docker stop commandes-service
docker rm commandes-service
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8088  (via API Gateway)
```

### Endpoints

#### Get All Orders
```http
GET /commandes
```

**Response:**
```json
[
  {
    "id": 1,
    "clientName": "John Doe",
    "product": "Pizza Margherita",
    "quantity": 2,
    "price": 15.99,
    "status": "PENDING",
    "qrCode": "iVBORw0KGgoAAAANSUhEUgAA..."
  }
]
```

#### Get Order by ID
```http
GET /commandes/{id}
```

#### Create Order
```http
POST /commandes
Content-Type: application/json

{
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 2,
  "price": 15.99,
  "status": "PENDING"
}
```

**Response:** Order object with auto-generated QR code

#### Update Order
```http
PUT /commandes/{id}
Content-Type: application/json

{
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 3,
  "price": 23.99,
  "status": "CONFIRMED"
}
```

#### Delete Order
```http
DELETE /commandes/{id}
```

#### Download QR Code
```http
GET /commandes/{id}/qrcode
```

**Response:** PNG image file

---

## 🧪 Testing

### Using Postman

1. Import the collection from `POSTMAN_API_TESTS.md`
2. Set base URL: `http://localhost:8088`
3. Test all endpoints

### Using cURL

**Create Order:**
```bash
curl -X POST http://localhost:8088/commandes \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Alice","product":"Burger","quantity":1,"price":12.99,"status":"PENDING"}'
```

**Get All Orders:**
```bash
curl http://localhost:8088/commandes
```

**Download QR Code:**
```bash
curl http://localhost:8088/commandes/1/qrcode --output qrcode.png
```

---

## 🔧 Configuration

### Ports

| Service | Port | URL |
|---------|------|-----|
| Config Server | 8888 | http://localhost:8888 |
| Eureka Server | 8761 | http://localhost:8761 |
| API Gateway | 8088 | http://localhost:8088 |
| Commandes Service | 8081 | http://localhost:8081 |
| Angular Frontend | 4200 | http://localhost:4200 |
| MySQL Database | 3306 | localhost:3306 |

### Database Configuration

**File:** `ConfigServer/src/main/resources/config/commande-service.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/foodexpress_commandes?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

---

## 📚 Documentation

- [Microservices Architecture Explained](MICROSERVICES_ARCHITECTURE_EXPLAINED.md)
- [Config Server Setup](CONFIG_SERVER_SETUP.md)
- [Docker Guide](DOCKER_GUIDE_COMMANDES.md)
- [QR Code Testing Guide](QR_CODE_TESTING_GUIDE.md)
- [Postman API Tests](POSTMAN_API_TESTS.md)

---

## 🐛 Troubleshooting

### Service won't start
- Check if all prerequisites are installed
- Verify MySQL is running
- Check if ports are available
- Start services in correct order

### Can't connect to Config Server
- Ensure Config Server is running on port 8888
- Check `application.properties` has correct Config Server URL

### Service not appearing in Eureka
- Wait 30 seconds for registration
- Check Eureka URL in configuration
- Verify `@EnableDiscoveryClient` annotation

### Docker container issues
- Use `host.docker.internal` instead of `localhost`
- Ensure Config Server, Eureka, MySQL are running on host
- Check container logs: `docker logs -f commandes-service`

---

## 🤝 Contributors

- **Jasser** - Backend Development, Microservices Architecture, Docker
- **Team** - Frontend Development, Testing

---

## 📄 License

This project is developed for educational purposes.

---

## 🎯 Future Enhancements

- [ ] Add authentication and authorization (Spring Security)
- [ ] Implement API rate limiting
- [ ] Add monitoring with Spring Boot Actuator
- [ ] Implement distributed tracing (Zipkin)
- [ ] Add more microservices (Users, Payments, Delivery)
- [ ] Implement event-driven architecture (Kafka/RabbitMQ)
- [ ] Add CI/CD pipeline
- [ ] Deploy to cloud (AWS/Azure/GCP)

---

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Spring Boot and Angular**
