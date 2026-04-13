# Postman Testing Guide - FoodExpress Commandes API

## API Gateway URL
**Base URL**: `http://localhost:8088`

All requests go through the API Gateway on port 8088.

---

## 1️⃣ GET All Commandes

**Method**: `GET`  
**URL**: `http://localhost:8088/commandes`  
**Headers**: None required

**Expected Response** (200 OK):
```json
[
  {
    "id": 1,
    "clientName": "John Doe",
    "product": "Pizza Margherita",
    "quantity": 2,
    "price": 15.99,
    "status": "PENDING"
  },
  {
    "id": 2,
    "clientName": "Jane Smith",
    "product": "Burger",
    "quantity": 1,
    "price": 12.50,
    "status": "CONFIRMED"
  }
]
```

---

## 2️⃣ GET Commande by ID

**Method**: `GET`  
**URL**: `http://localhost:8088/commandes/1`  
**Headers**: None required

**Expected Response** (200 OK):
```json
{
  "id": 1,
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 2,
  "price": 15.99,
  "status": "PENDING"
}
```

**If not found** (404 Not Found):
```
(empty response)
```

---

## 3️⃣ CREATE New Commande

**Method**: `POST`  
**URL**: `http://localhost:8088/commandes`  
**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "clientName": "Alice Johnson",
  "product": "Pasta Carbonara",
  "quantity": 1,
  "price": 18.50,
  "status": "PENDING"
}
```

**Expected Response** (201 Created):
```json
{
  "id": 3,
  "clientName": "Alice Johnson",
  "product": "Pasta Carbonara",
  "quantity": 1,
  "price": 18.50,
  "status": "PENDING"
}
```

---

## 4️⃣ UPDATE Commande

**Method**: `PUT`  
**URL**: `http://localhost:8088/commandes/3`  
**Headers**:
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
  "clientName": "Alice Johnson",
  "product": "Pasta Carbonara",
  "quantity": 2,
  "price": 37.00,
  "status": "CONFIRMED"
}
```

**Expected Response** (200 OK):
```json
{
  "id": 3,
  "clientName": "Alice Johnson",
  "product": "Pasta Carbonara",
  "quantity": 2,
  "price": 37.00,
  "status": "CONFIRMED"
}
```

---

## 5️⃣ DELETE Commande

**Method**: `DELETE`  
**URL**: `http://localhost:8088/commandes/3`  
**Headers**: None required

**Expected Response** (204 No Content):
```
(empty response)
```

---

## 📋 Postman Collection Setup

### Create a New Collection

1. Open Postman
2. Click "New" → "Collection"
3. Name it: "FoodExpress - Commandes API"
4. Save

### Add Requests to Collection

For each endpoint above:

1. Click "Add Request"
2. Set the method (GET, POST, PUT, DELETE)
3. Enter the URL
4. For POST/PUT: Go to "Body" tab → Select "raw" → Select "JSON"
5. Paste the JSON body
6. Click "Save"

---

## 🧪 Test Scenarios

### Scenario 1: Complete CRUD Flow

1. **GET all** → Should return existing orders
2. **POST new** → Create order with ID 10
3. **GET by ID** → Get order 10
4. **PUT update** → Update order 10 status to "DELIVERED"
5. **GET by ID** → Verify changes
6. **DELETE** → Delete order 10
7. **GET by ID** → Should return 404

### Scenario 2: Validation Tests

**Test 1**: Create with missing fields
```json
{
  "clientName": "Test"
}
```
Expected: 400 Bad Request or 500 Internal Server Error

**Test 2**: Update non-existent order
- PUT to `/commandes/99999`
- Expected: 404 Not Found

**Test 3**: Invalid data types
```json
{
  "clientName": "Test",
  "product": "Pizza",
  "quantity": "abc",
  "price": "invalid",
  "status": "PENDING"
}
```
Expected: 400 Bad Request

---

## 🎯 Status Codes Reference

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | GET, PUT successful |
| 201 | Created | POST successful |
| 204 | No Content | DELETE successful |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Backend error |
| 503 | Service Unavailable | Service not registered with Eureka |

---

## 🔍 Troubleshooting

### Error: "Could not get any response"
**Problem**: Can't connect to API Gateway

**Solutions**:
1. Check Gateway is running (IntelliJ)
2. Verify URL: `http://localhost:8088`
3. Check Eureka dashboard: http://localhost:8761

### Error: 404 Not Found
**Problem**: Route not configured

**Solutions**:
1. Restart API Gateway
2. Check route in GatewayConfig.java
3. Wait 30 seconds for Eureka registration

### Error: 503 Service Unavailable
**Problem**: Commandes Service not registered

**Solutions**:
1. Check Commandes Service is running
2. Check Eureka dashboard
3. Wait 30 seconds for registration

---

## 📊 Sample Test Data

```json
{
  "clientName": "Bob Wilson",
  "product": "Caesar Salad",
  "quantity": 1,
  "price": 9.99,
  "status": "PENDING"
}
```

```json
{
  "clientName": "Emma Davis",
  "product": "Grilled Salmon",
  "quantity": 2,
  "price": 45.00,
  "status": "CONFIRMED"
}
```

```json
{
  "clientName": "Michael Brown",
  "product": "Chocolate Cake",
  "quantity": 3,
  "price": 21.00,
  "status": "DELIVERED"
}
```

---

**Happy Testing!** 🚀
