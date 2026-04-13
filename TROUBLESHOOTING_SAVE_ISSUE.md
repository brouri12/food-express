# Troubleshooting: Commande Not Saving to Database

## Quick Diagnostic Steps

### Step 1: Check if MySQL is Running and Accessible

Open Command Prompt and test MySQL connection:
```bash
mysql -u root -p
```

If it connects, run:
```sql
SHOW DATABASES;
```

You should see `foodexpress_commandes` in the list.

### Step 2: Check if Service Started Successfully

Look at IntelliJ console when you start the Commandes Service. You should see:
```
Started CommandesApplication in X.XXX seconds
```

**If you see errors about MySQL connection**, update the password in `application.properties`:
```properties
spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD
```

### Step 3: Check if Table Was Created

In MySQL, run:
```sql
USE foodexpress_commandes;
SHOW TABLES;
```

You should see a table named `commandes`.

If not, check:
```sql
DESCRIBE commandes;
```

### Step 4: Test Backend Directly (Bypass Angular)

Open Command Prompt and run:
```bash
curl -X POST http://localhost:8081/commandes -H "Content-Type: application/json" -d "{\"clientName\":\"Test\",\"product\":\"Pizza\",\"quantity\":1,\"price\":10.50,\"status\":\"PENDING\"}"
```

**Expected Response:**
```json
{
  "id": 1,
  "clientName": "Test",
  "product": "Pizza",
  "quantity": 1,
  "price": 10.50,
  "status": "PENDING"
}
```

### Step 5: Check IntelliJ Console Logs

After creating a commande, look for these logs in IntelliJ console:

**Good Signs:**
```
POST /commandes - Creating new commande: CommandeDTO(...)
Hibernate: insert into commandes (client_name, price, product, quantity, status) values (?, ?, ?, ?, ?)
Commande created successfully with id: 1
```

**Bad Signs:**
```
Error creating commande: ...
Access denied for user 'root'@'localhost'
Table 'foodexpress_commandes.commandes' doesn't exist
```

### Step 6: Verify Data in Database

In MySQL:
```sql
USE foodexpress_commandes;
SELECT * FROM commandes;
```

You should see your test data.

## Common Issues & Solutions

### Issue 1: MySQL Password Wrong

**Symptoms:**
```
Access denied for user 'root'@'localhost' (using password: YES)
```

**Solution:**
Update `commandes/commandes/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_CORRECT_PASSWORD
```

Then restart the service in IntelliJ.

### Issue 2: Database Not Created

**Symptoms:**
```
Unknown database 'foodexpress_commandes'
```

**Solution:**
The URL has `createDatabaseIfNotExist=true` but sometimes it doesn't work.
Create manually:
```sql
CREATE DATABASE foodexpress_commandes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Issue 3: Table Not Created

**Symptoms:**
```
Table 'foodexpress_commandes.commandes' doesn't exist
```

**Solution:**
Check `application.properties` has:
```properties
spring.jpa.hibernate.ddl-auto=update
```

If it's set to `none` or `validate`, change it to `update`.

Restart the service - Hibernate will create the table automatically.

### Issue 4: Data Not Persisting (Transaction Rollback)

**Symptoms:**
- POST returns 201 Created
- Response has an ID
- But data not in database

**Solution:**
I've added `@Transactional` to the service. Restart the service.

Also check for errors in console that might cause rollback.

### Issue 5: Angular Not Sending Request

**Symptoms:**
- No logs in IntelliJ console
- No network request in browser DevTools

**Solution:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try creating a commande
4. Check if you see a POST request to `http://localhost:8080/commandes`

If no request appears:
- Check Angular form validation
- Check browser console for JavaScript errors

If request appears but fails:
- Check response status code
- Check response body for error message

### Issue 6: CORS Error

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:8080/commandes' from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solution:**
Already configured with `@CrossOrigin(origins = "*")` in controller.

If still happening, add CORS to API Gateway:
```java
@Bean
public CorsWebFilter corsWebFilter() {
    CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.addAllowedOrigin("*");
    corsConfig.addAllowedMethod("*");
    corsConfig.addAllowedHeader("*");
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfig);
    
    return new CorsWebFilter(source);
}
```

### Issue 7: Service Not Registered with Eureka

**Symptoms:**
- Angular gets 503 Service Unavailable
- Gateway logs: "No instances available for COMMANDE-SERVICE"

**Solution:**
1. Open http://localhost:8761
2. Check if `COMMANDE-SERVICE` appears in the list
3. If not, wait 30 seconds for registration
4. If still not there, check `application.properties`:
   ```properties
   eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
   eureka.client.register-with-eureka=true
   ```

## Debugging Checklist

Run through this checklist:

- [ ] MySQL is running
- [ ] Database `foodexpress_commandes` exists
- [ ] Table `commandes` exists
- [ ] Commandes Service starts without errors
- [ ] Service is registered in Eureka (http://localhost:8761)
- [ ] API Gateway is running
- [ ] Direct POST to service works (curl to :8081)
- [ ] POST through gateway works (curl to :8080)
- [ ] Angular sends request (check Network tab)
- [ ] IntelliJ console shows SQL INSERT statement
- [ ] Data appears in MySQL

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Restart everything in order:**
   - Stop all services
   - Start Eureka Server
   - Wait 10 seconds
   - Start API Gateway
   - Wait 10 seconds
   - Start Commandes Service
   - Wait 30 seconds (for Eureka registration)
   - Start Angular app

2. **Check IntelliJ console** for the exact error message and share it.

3. **Test with curl** to isolate if it's a backend or frontend issue:
   ```bash
   # Test direct to service
   curl -v -X POST http://localhost:8081/commandes \
     -H "Content-Type: application/json" \
     -d "{\"clientName\":\"Direct Test\",\"product\":\"Burger\",\"quantity\":1,\"price\":8.99,\"status\":\"PENDING\"}"
   
   # Test through gateway
   curl -v -X POST http://localhost:8080/commandes \
     -H "Content-Type: application/json" \
     -d "{\"clientName\":\"Gateway Test\",\"product\":\"Fries\",\"quantity\":2,\"price\":4.50,\"status\":\"PENDING\"}"
   ```

4. **Check MySQL logs** to see if INSERT statements are reaching the database.

---

**After making changes, always restart the Commandes Service in IntelliJ!**
