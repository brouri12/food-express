# QR Code Feature - Testing Guide

## 🎯 What Was Added

When you create a new order (commande), the system automatically generates a QR code containing:
- Order ID
- Client Name
- Product
- Quantity
- Price

The QR code is stored as a Base64 encoded string in the database and can be retrieved as an image.

---

## 🚀 How to Test with Postman

### Test 1: Create Order with QR Code

**Request**:
```
POST http://localhost:8088/commandes
```

**Headers**:
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 2,
  "price": 15.99,
  "status": "PENDING"
}
```

**Expected Response** (201 Created):
```json
{
  "id": 1,
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 2,
  "price": 15.99,
  "status": "PENDING",
  "qrCode": "iVBORw0KGgoAAAANSUhEUgAA... (very long Base64 string)"
}
```

**What to check**:
- ✅ Status code is 201 Created
- ✅ Response includes `id` (auto-generated)
- ✅ Response includes `qrCode` field with Base64 string
- ✅ QR code string starts with "iVBORw0KGgo" (PNG signature in Base64)

---

### Test 2: Get Order with QR Code

**Request**:
```
GET http://localhost:8088/commandes/1
```

**Expected Response** (200 OK):
```json
{
  "id": 1,
  "clientName": "John Doe",
  "product": "Pizza Margherita",
  "quantity": 2,
  "price": 15.99,
  "status": "PENDING",
  "qrCode": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

---

### Test 3: Download QR Code as Image

**Request**:
```
GET http://localhost:8088/commandes/1/qrcode
```

**Expected Response** (200 OK):
- Content-Type: `image/png`
- Body: PNG image file

**In Postman**:
1. Send the request
2. Click "Send and Download" button
3. Save as `qrcode-1.png`
4. Open the image - you should see a QR code!

**Or view in Postman**:
1. Send the request
2. Click "Visualize" tab
3. You should see the QR code image

---

### Test 4: Scan QR Code

**Steps**:
1. Download QR code image from Test 3
2. Use your phone's camera or QR code scanner app
3. Scan the QR code

**Expected Result**:
```
ORDER ID: 1
Client: John Doe
Product: Pizza Margherita
Quantity: 2
Price: 15.99 EUR
```

---

## 📱 Testing QR Code Content

### Option 1: Online QR Code Reader

1. Download QR code image: `GET http://localhost:8088/commandes/1/qrcode`
2. Go to: https://webqr.com/
3. Upload the image
4. See the decoded text

### Option 2: Phone Camera

1. Download QR code image
2. Display on your computer screen
3. Scan with phone camera
4. See order details

---

## 🧪 Complete Postman Test Collection

### Collection: FoodExpress - QR Code Tests

#### 1. Create Order with QR Code
```
POST http://localhost:8088/commandes
Body:
{
  "clientName": "Alice Smith",
  "product": "Burger Deluxe",
  "quantity": 3,
  "price": 24.50,
  "status": "PENDING"
}
```

#### 2. Get All Orders (with QR codes)
```
GET http://localhost:8088/commandes
```

#### 3. Get Single Order (with QR code)
```
GET http://localhost:8088/commandes/1
```

#### 4. Download QR Code Image
```
GET http://localhost:8088/commandes/1/qrcode
```

#### 5. Create Multiple Orders
```
POST http://localhost:8088/commandes
Body:
{
  "clientName": "Bob Johnson",
  "product": "Pasta Carbonara",
  "quantity": 1,
  "price": 12.99,
  "status": "PENDING"
}
```

#### 6. Get QR Code for Second Order
```
GET http://localhost:8088/commandes/2/qrcode
```

---

## 🔍 What to Verify

### In Database

Connect to MySQL and check:
```sql
USE foodexpress_commandes;
SELECT id, client_name, product, LEFT(qr_code, 50) as qr_preview FROM commandes;
```

**Expected**:
```
+----+-------------+------------------+----------------------------------------------------+
| id | client_name | product          | qr_preview                                         |
+----+-------------+------------------+----------------------------------------------------+
|  1 | John Doe    | Pizza Margherita | iVBORw0KGgoAAAANSUhEUgAAASw...                   |
+----+-------------+------------------+----------------------------------------------------+
```

### In Postman Response

**Check JSON response includes**:
```json
{
  "qrCode": "iVBORw0KGgoAAAANSUhEUgAAASw..."
}
```

**QR code string should**:
- Start with "iVBORw0KGgo" (PNG signature)
- Be very long (500-1000+ characters)
- Be Base64 encoded

---

## 🎨 Using QR Code in Angular (Future)

When you want to display QR codes in Angular:

```typescript
// In component
<img [src]="'data:image/png;base64,' + commande.qrCode" alt="QR Code" />
```

Or download button:
```typescript
downloadQRCode(commande: Commande) {
  const link = document.createElement('a');
  link.href = `data:image/png;base64,${commande.qrCode}`;
  link.download = `order-${commande.id}-qrcode.png`;
  link.click();
}
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| POST | `/commandes` | Create order + generate QR | JSON with qrCode field |
| GET | `/commandes` | Get all orders | JSON array with qrCode fields |
| GET | `/commandes/{id}` | Get single order | JSON with qrCode field |
| GET | `/commandes/{id}/qrcode` | Download QR as image | PNG image file |
| PUT | `/commandes/{id}` | Update order | JSON (QR code unchanged) |
| DELETE | `/commandes/{id}` | Delete order | 204 No Content |

---

## 🧪 Postman Test Scripts

### Test: Verify QR Code is Generated

Add this to your POST request "Tests" tab:

```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has qrCode field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('qrCode');
});

pm.test("QR code is not empty", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.qrCode).to.not.be.empty;
});

pm.test("QR code is Base64 encoded PNG", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.qrCode).to.match(/^iVBORw0KGgo/);
});

// Save order ID for next requests
pm.environment.set("orderId", pm.response.json().id);
```

### Test: Verify QR Code Image Download

Add this to your GET `/commandes/{id}/qrcode` request "Tests" tab:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Content-Type is image/png", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.equal("image/png");
});

pm.test("Response body is not empty", function () {
    pm.expect(pm.response.stream).to.not.be.empty;
});
```

---

## 🚨 Troubleshooting

### Issue 1: QR Code Field is Null

**Symptoms**: Response has `"qrCode": null`

**Causes**:
- QR code generation failed
- Database column too small

**Solution**:
1. Check service logs for errors
2. Verify `qr_code` column in database:
   ```sql
   DESCRIBE commandes;
   -- qr_code should be VARCHAR(1000) or TEXT
   ```

### Issue 2: Can't Download QR Code Image

**Symptoms**: 404 Not Found on `/commandes/{id}/qrcode`

**Causes**:
- Order doesn't exist
- QR code is null

**Solution**:
1. Verify order exists: `GET /commandes/{id}`
2. Check if qrCode field has value
3. Check service logs

### Issue 3: QR Code Too Large for Database

**Symptoms**: 
```
Data too long for column 'qr_code'
```

**Solution**:
Change column type to TEXT:
```sql
ALTER TABLE commandes MODIFY COLUMN qr_code TEXT;
```

Or in entity:
```java
@Column(columnDefinition = "TEXT")
private String qrCode;
```

---

## 🎯 Quick Test Checklist

- [ ] Config Server running (8888)
- [ ] Eureka Server running (8761)
- [ ] API Gateway running (8088)
- [ ] Commandes Service running (8081)
- [ ] MySQL running (3306)
- [ ] Create order via Postman
- [ ] Verify qrCode field in response
- [ ] Download QR code image
- [ ] Scan QR code with phone
- [ ] Verify order details in QR code

---

**Created for FoodExpress Microservices Project**
**Feature**: Automatic QR Code Generation for Orders
