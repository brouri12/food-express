# UserService

Spring Boot microservice for user management and authentication via Keycloak.

## Prerequisites

| Tool | Required Version | Notes |
|------|-----------------|-------|
| Java (JDK) | **21** | Eclipse Temurin 21 recommended |
| Maven | 3.6.x – 3.9.x | Maven 3.9.x recommended |
| MySQL | 8.x | Database for user persistence |
| Keycloak | 23.x | Required for auth flows |

## Build

```bash
cd UserService
mvn clean install
```

### Verify your active JDK

```bash
mvn -version
```

The output should show `Java version: 21`.

## Running the service

1. Start Keycloak on port 9090 with realm `wordly-realm`.
2. Start MySQL and create (or let Hibernate auto-create) the database `userservice_db`.
3. Start Eureka service on port 8761.
4. Configure `application.properties` with your Keycloak client secret and Stripe API key.
5. Run:

```bash
mvn spring-boot:run
```

The service listens on **port 8081**.

## Key configuration (pom.xml)

The `pom.xml` explicitly declares Lombok as an annotation processor. This is the
fix for the `cannot find symbol` (missing getters/setters/`log`) compilation
errors caused by Lombok not being invoked by the Java compiler:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.11.0</version>
    <configuration>
        <release>${java.version}</release>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

Without the `annotationProcessorPaths` block, newer versions of Maven and Java
may skip Lombok annotation processing, producing errors such as:
- `cannot find symbol: method getUsername()`
- `cannot find symbol: method setPassword(String)`
- `cannot find symbol: variable log`

## Keycloak dependency

`UserService` **requires** Keycloak for:
- User registration (`POST /api/auth/register`)
- Password management
- JWT token validation on all protected endpoints

Without Keycloak, this service cannot start or function. See
[`OPTION_SANS_KEYCLOAK.md`](../OPTION_SANS_KEYCLOAK.md) at the project root for
what you can run without Keycloak.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| GET | `/api/users` | JWT | List all users |
| GET | `/api/users/me` | JWT | Get current user profile |
| PUT | `/api/users/{id}` | JWT | Update a user |
| DELETE | `/api/users/{id}` | JWT | Delete a user |
