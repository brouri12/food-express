# Test Commandes API

## Step 1: Check if service is running

Open browser or use curl:
```bash
curl http://localhost:8081/commandes
```

Expected: Should return `[]` (empty array) or list of commandes

## Step 2: Test creating a commande directly (bypass Angular)

```bash
curl -X POST http://localhost:8081/commandes \
  -H "Content-Type: application/json" \
  -d "{\"clientName\":\"Test Client\",\"product\":\"Test Product\",\"quantity\":2,\"price\":25.50,\"status\":\"PENDING\"}"
```

Expected: Should return the created commande with an ID

## Step 3: Test through API Gateway

```bash
curl -X POST http://localhost:8080/commandes \
  -H "Content-Type: application/json" \
  -d "{\"clientName\":\"Gateway Test\",\"product\":\"Pizza\",\"quantity\":1,\"price\":15.99,\"status\":\"PENDING\"}"
```

## Step 4: Check MySQL Database

Open MySQL and check if data is there:

```sql
USE foodexpress_commandes;
SELECT * FROM commandes;
```

## Common Issues:

### Issue 1: MySQL Connection Failed
**Symptoms**: Service won't start, error about access denied

**Solution**: Update password in application.properties:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Issue 2: Database doesn't exist
**Symptoms**: Error "Unknown database 'foodexpress_commandes'"

**Solution**: The URL has `createDatabaseIfNotExist=true` so it should auto-create. 
If not, create manually:
```sql
CREATE DATABASE foodexpress_commandes;
```

### Issue 3: Table doesn't exist
**Symptoms**: Error "Table 'foodexpress_commandes.commandes' doesn't exist"

**Solution**: Check `spring.jpa.hibernate.ddl-auto=update` is set in application.properties.
This should auto-create tables.

### Issue 4: CORS Error in Browser
**Symptoms**: Angular shows CORS error in console

**Solution**: Already configured with `@CrossOrigin(origins = "*")` in controller.
Check if API Gateway has CORS configured.

### Issue 5: 404 Not Found
**Symptoms**: Angular gets 404 when calling API

**Solution**: 
- Check Eureka dashboard - is COMMANDE-SERVICE registered?
- Check API Gateway routes - is /commandes route configured?
- Wait 30 seconds after starting service for Eureka registration

### Issue 6: Data not persisting
**Symptoms**: POST returns 200 but data not in database

**Solution**: Check these in application.properties:
```properties
spring.jpa.hibernate.ddl-auto=update  # Should be 'update' not 'none'
spring.jpa.show-sql=true              # Shows SQL in console
```

Check IntelliJ console for SQL INSERT statements.
