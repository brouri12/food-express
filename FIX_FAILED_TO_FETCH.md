# Fix "Failed to Fetch" Error

## The Problem

"Failed to fetch" means Angular can't connect to the backend. This happens when:
1. API Gateway is not running
2. API Gateway route is not configured
3. API Gateway wasn't restarted after configuration changes
4. Network/firewall blocking the connection

## Solution - Step by Step

### Step 1: Verify API Gateway is Running

Check IntelliJ - is the API Gateway running?

Look for this in the console:
```
Started ApiGatewayApplication in X.XXX seconds
```

If NOT running, start it.

### Step 2: RESTART API Gateway

**IMPORTANT**: Even if it's running, you MUST restart it to pick up the route changes!

In IntelliJ:
1. Click the red square (Stop) button for API Gateway
2. Wait until it fully stops
3. Right-click `ApiGatewayApplication.java` → Run
4. Wait for: "Started ApiGatewayApplication"

### Step 3: Wait for Service Registration

After restarting Gateway, wait 30 seconds for Eureka registration to complete.

### Step 4: Verify Eureka Registration

Open: http://localhost:8761

You should see BOTH services:
- **API-GATEWAY** - Status: UP
- **COMMANDE-SERVICE** - Status: UP

If either is missing, restart that service.

### Step 5: Test API Gateway Route

Open Command Prompt and test:

```bash
curl http://localhost:8080/commandes
```

**Expected**: Should return `[]` (empty array) or list of orders

**If you get "404 Not Found"**: Gateway route not working - see Step 6

**If you get connection error**: Gateway not running - see Step 1

### Step 6: Verify Gateway Configuration

The route should be in `ApiGateway/src/main/java/tn/esprit/gateway/GatewayConfig.java`:

```java
.route("commande-service", r -> r
    .path("/commandes/**")
    .uri("lb://COMMANDE-SERVICE"))
```

If it's there but not working:
1. Clean and rebuild the project
2. Restart API Gateway
3. Wait 30 seconds

### Step 7: Test Direct to Service (Bypass Gateway)

Test if the Commandes Service works directly:

```bash
curl http://localhost:8081/commandes
```

**If this works but Gateway doesn't**: Problem is with Gateway routing

**If this doesn't work**: Problem is with Commandes Service

### Step 8: Check Browser Console

Open browser DevTools (F12) → Console tab

Look for specific errors:
- **"Failed to fetch"** = Can't connect to backend
- **"CORS error"** = CORS not configured (but we have it)
- **"404 Not Found"** = Route not found
- **"503 Service Unavailable"** = Service not registered with Eureka

### Step 9: Check Network Tab

In DevTools → Network tab:

1. Try creating an order
2. Look for the POST request to `/commandes`
3. Click on it to see details

**Status Codes**:
- **Failed** (red) = Connection failed - Gateway not running
- **404** = Route not found - Gateway needs restart
- **503** = Service unavailable - Not registered with Eureka
- **500** = Backend error - Check IntelliJ console
- **201** = Success! ✅

## Quick Fix Checklist

Try these in order:

1. [ ] **Restart API Gateway** in IntelliJ
2. [ ] Wait 30 seconds
3. [ ] Test: `curl http://localhost:8080/commandes`
4. [ ] If still fails, restart Commandes Service
5. [ ] Wait 30 seconds
6. [ ] Test again
7. [ ] If still fails, restart Eureka Server
8. [ ] Then restart Gateway and Commandes Service
9. [ ] Wait 30 seconds
10. [ ] Test again

## Alternative: Use Direct Connection (Temporary)

If Gateway still doesn't work, you can temporarily connect Angular directly to the service:

**Change Angular service URL:**

File: `my-app/src/app/services/commande.service.ts`

```typescript
// Change from:
private apiUrl = 'http://localhost:8080/commandes';

// To:
private apiUrl = 'http://localhost:8081/commandes';
```

This bypasses the Gateway and connects directly to the service.

**Remember**: This is temporary! The proper way is through the Gateway.

## Nuclear Option: Restart Everything

If nothing works, restart ALL services in this exact order:

### 1. Stop Everything
- Stop Angular (Ctrl+C in terminal)
- Stop Commandes Service (IntelliJ - red square button)
- Stop API Gateway (IntelliJ - red square button)
- Stop Eureka Server (IntelliJ - red square button)

### 2. Start Eureka Server
```
Right-click EurekaServerApplication.java → Run
Wait for: "Started EurekaServerApplication"
```

### 3. Start API Gateway
```
Right-click ApiGatewayApplication.java → Run
Wait for: "Started ApiGatewayApplication"
```

### 4. Start Commandes Service
```
Right-click CommandesApplication.java → Run
Wait for: "Started CommandesApplication"
```

### 5. Wait 30 Seconds
This is CRITICAL for Eureka registration!

### 6. Verify in Eureka
Open: http://localhost:8761

Should see:
- API-GATEWAY (UP)
- COMMANDE-SERVICE (UP)

### 7. Test Gateway
```bash
curl http://localhost:8080/commandes
```

Should return: `[]`

### 8. Start Angular
```bash
cd my-app
ng serve
```

Wait for: "Compiled successfully"

### 9. Test in Browser
Open: http://localhost:4200

Try creating an order!

## Still Not Working?

If you've tried everything and it still says "Failed to fetch":

### Check Windows Firewall
Windows might be blocking the connection.

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Make sure Java is allowed

### Check Antivirus
Some antivirus software blocks localhost connections.

Temporarily disable it and test.

### Check Port Conflicts
Make sure nothing else is using port 8080:

```bash
netstat -ano | findstr :8080
```

If something is using it, either:
- Stop that application
- Change Gateway port in `application.properties`

### Use Different Browser
Try Chrome, Edge, or Firefox.

Sometimes browser extensions block requests.

## Success Test

After fixing, test with these commands:

```bash
# Test Gateway
curl http://localhost:8080/commandes

# Test direct service
curl http://localhost:8081/commandes

# Test Eureka
curl http://localhost:8761/eureka/apps
```

All three should work!

Then try creating an order in the browser.

---

**Most Common Solution**: Just restart the API Gateway in IntelliJ and wait 30 seconds! 🚀
