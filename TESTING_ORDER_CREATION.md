# Testing Order Creation - Step by Step

## Prerequisites

Make sure ALL services are running:

1. ✅ **MySQL** - Running on port 3306
2. ✅ **Eureka Server** - Running on port 8761 (http://localhost:8761)
3. ✅ **API Gateway** - Running on port 8080
4. ✅ **Commandes Service** - Running on port 8081
5. ✅ **Angular App** - Running on port 4200 (http://localhost:4200)

## Step-by-Step Testing

### Step 1: Open Browser Developer Tools

1. Open Chrome/Edge
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Go to **Network** tab (keep both visible)

### Step 2: Navigate to Order Form

1. Open: http://localhost:4200
2. You should see the orders list page
3. Click the **"New Order"** button (green button with + icon)
4. You should see the "Add Order" form

### Step 3: Fill in the Form

Fill in these test values:
- **Client Name**: John Doe
- **Product**: Margherita Pizza
- **Quantity**: 2
- **Price**: 15.99
- **Status**: PENDING (should be selected by default)

### Step 4: Submit the Form

1. Click the **"Save Order"** button
2. **Watch the Console tab** - You should see:
   ```
   Form submitted!
   Commande data: {clientName: "John Doe", product: "Margherita Pizza", ...}
   Form validation passed
   Creating new commande...
   Service: Creating commande {clientName: "John Doe", ...}
   Service: Posting to URL: http://localhost:8080/commandes
   ```

3. **Watch the Network tab** - You should see:
   - A POST request to `http://localhost:8080/commandes`
   - Status: **201 Created** (green)
   - Response with the created order including an ID

### Step 5: Check for Success

**If successful**, you'll see:
- Alert popup: "Order created successfully with ID: 1"
- Console log: "Create successful! Response: {id: 1, clientName: "John Doe", ...}"
- Redirected back to orders list page
- Your new order appears in the table

**If failed**, you'll see:
- Alert popup with error message
- Console error with details
- Red error message on the form

## Verification Steps

### Verify in Angular
1. After creating, you should be on the list page
2. Your order should appear in the table
3. Refresh the page (F5) - order should still be there

### Verify in Backend (IntelliJ Console)
Look for these logs:
```
POST /commandes - Creating new commande: CommandeDTO(clientName=John Doe, ...)
Hibernate: insert into commandes (client_name, price, product, quantity, status) values (?, ?, ?, ?, ?)
Commande created successfully with id: 1
```

### Verify in Database (MySQL)
Open MySQL and run:
```sql
USE foodexpress_commandes;
SELECT * FROM commandes;
```

You should see:
```
+----+-------------+-------------------+----------+-------+---------+
| id | client_name | product           | quantity | price | status  |
+----+-------------+-------------------+----------+-------+---------+
|  1 | John Doe    | Margherita Pizza  |        2 | 15.99 | PENDING |
+----+-------------+-------------------+----------+-------+---------+
```

## Common Issues & What to Check

### Issue 1: No Console Logs Appear

**Problem**: Form not submitting

**Check**:
1. Is the form valid? (all fields filled?)
2. Are there any JavaScript errors in console?
3. Is the button disabled?

**Solution**: Check browser console for errors

### Issue 2: Console Shows "Form validation failed"

**Problem**: Form validation not passing

**Check**: Make sure all fields are filled:
- Client Name: not empty
- Product: not empty
- Quantity: greater than 0
- Price: greater than 0

### Issue 3: Network Request Shows 404 Not Found

**Problem**: API Gateway can't find the service

**Check**:
1. Open http://localhost:8761 (Eureka)
2. Is `COMMANDE-SERVICE` listed and UP?
3. Wait 30 seconds after starting service

**Solution**: Restart Commandes Service and wait for Eureka registration

### Issue 4: Network Request Shows 503 Service Unavailable

**Problem**: Service not registered with Eureka

**Check**:
1. Eureka dashboard - is service registered?
2. IntelliJ console - any errors?

**Solution**: 
```properties
# Check application.properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
```

### Issue 5: Network Request Shows 500 Internal Server Error

**Problem**: Backend error (database, code issue)

**Check IntelliJ Console** for error stack trace

**Common causes**:
- MySQL connection failed
- Table doesn't exist
- Data validation error

**Solution**: Check IntelliJ console for exact error

### Issue 6: Request Succeeds but Data Not in Database

**Problem**: Transaction not committing

**Check**:
1. IntelliJ console - do you see SQL INSERT statement?
2. Any errors after INSERT?

**Solution**: 
- I added `@Transactional` - make sure you restarted the service
- Check `spring.jpa.hibernate.ddl-auto=update` in application.properties

### Issue 7: CORS Error

**Problem**: Browser blocking request

**Error in Console**:
```
Access to XMLHttpRequest at 'http://localhost:8080/commandes' from origin 'http://localhost:4200' 
has been blocked by CORS policy
```

**Solution**: Already configured with `@CrossOrigin(origins = "*")` in controller
- Make sure you restarted the Commandes Service after my changes

## Quick Test with curl (Bypass Angular)

If Angular isn't working, test the backend directly:

```bash
# Test direct to service (port 8081)
curl -X POST http://localhost:8081/commandes ^
  -H "Content-Type: application/json" ^
  -d "{\"clientName\":\"Test User\",\"product\":\"Test Pizza\",\"quantity\":1,\"price\":9.99,\"status\":\"PENDING\"}"
```

**Expected Response:**
```json
{
  "id": 1,
  "clientName": "Test User",
  "product": "Test Pizza",
  "quantity": 1,
  "price": 9.99,
  "status": "PENDING"
}
```

If this works but Angular doesn't, the problem is in the frontend.
If this doesn't work, the problem is in the backend.

## Restart Everything (Nuclear Option)

If nothing works, restart in this order:

1. **Stop all services**
   - Stop Angular (Ctrl+C in terminal)
   - Stop Commandes Service (IntelliJ)
   - Stop API Gateway (IntelliJ)
   - Stop Eureka Server (IntelliJ)

2. **Start Eureka Server**
   - Wait until you see: "Started EurekaServerApplication"
   - Open http://localhost:8761 to confirm

3. **Start API Gateway**
   - Wait until you see: "Started ApiGatewayApplication"
   - Check Eureka - should see API-GATEWAY registered

4. **Start Commandes Service**
   - Wait until you see: "Started CommandesApplication"
   - Check Eureka - should see COMMANDE-SERVICE registered
   - **Wait 30 seconds** for full registration

5. **Start Angular**
   ```bash
   cd my-app
   ng serve
   ```
   - Wait until you see: "Compiled successfully"
   - Open http://localhost:4200

6. **Try creating an order again**

## Success Checklist

After creating an order, verify:

- [ ] Alert shows "Order created successfully with ID: X"
- [ ] Redirected to orders list page
- [ ] Order appears in the table
- [ ] IntelliJ console shows SQL INSERT
- [ ] MySQL database has the record
- [ ] Refreshing page still shows the order

If all checked, **IT WORKS!** 🎉

## Still Not Working?

Share with me:
1. **Browser console logs** (copy/paste everything)
2. **Network tab** (screenshot of the POST request)
3. **IntelliJ console logs** (copy/paste the logs when you submit)
4. **MySQL query result** (`SELECT * FROM commandes;`)

This will help me identify exactly what's wrong!
