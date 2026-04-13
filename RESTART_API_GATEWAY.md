# Restart API Gateway - Step by Step

## What I Fixed:

1. ✅ Changed Gateway port from 8888 to 8080
2. ✅ Added logging to Gateway routes
3. ✅ Changed Angular back to use Gateway (port 8080)

## Now You Need To:

### Step 1: Stop API Gateway in IntelliJ

1. Find the API Gateway run tab in IntelliJ (bottom panel)
2. Click the red square (Stop) button
3. Wait until you see "Process finished"

### Step 2: Restart API Gateway

1. In IntelliJ, navigate to: `ApiGateway/src/main/java/tn/esprit/gateway/ApiGatewayApplication.java`
2. Right-click on the file → Run 'ApiGatewayApplication'
3. Wait for the console to show: "Started ApiGatewayApplication"

### Step 3: Check the Logs

In IntelliJ console, you should see:
```
Configuring Gateway Routes...
Registering route: /commandes/** -> lb://COMMANDE-SERVICE
Gateway Routes configured successfully
Started ApiGatewayApplication in X.XXX seconds
```

### Step 4: Wait 30 Seconds

This is important for Eureka registration!

### Step 5: Verify in Eureka

Open: http://localhost:8761

You should see:
- API-GATEWAY (Status: UP)
- COMMANDE-SERVICE (Status: UP)

### Step 6: Test Gateway with curl

Open Command Prompt:
```bash
curl http://localhost:8080/commandes
```

Expected: `[]` or list of orders

### Step 7: Test in Angular

1. Refresh Angular page: http://localhost:4200
2. Try creating a new order
3. It should work through the Gateway now!

## Verification

After creating an order, check IntelliJ console:

**API Gateway logs:**
```
Routing request to: lb://COMMANDE-SERVICE
```

**Commandes Service logs:**
```
POST /commandes - Creating new commande
Commande created successfully with id: X
```

## If It Still Doesn't Work

Try this test:
```bash
curl -X POST http://localhost:8080/commandes -H "Content-Type: application/json" -d "{\"clientName\":\"Test\",\"product\":\"Pizza\",\"quantity\":1,\"price\":10.50,\"status\":\"PENDING\"}"
```

If this works but Angular doesn't, the problem is in Angular.
If this doesn't work, check IntelliJ Gateway logs for errors.

---

**Summary**: Stop Gateway → Restart Gateway → Wait 30s → Test!
