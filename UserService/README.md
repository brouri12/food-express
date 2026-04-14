# UserService

Spring Boot microservice for user management and authentication via Keycloak.

## Prerequisites

| Tool | Required Version | Notes |
|------|-----------------|-------|
| Java (JDK) | **17** | Eclipse Temurin 17 recommended. See note below about Java 25. |
| Maven | 3.6.x – 3.9.x | Maven 3.9.x recommended |
| MySQL | 8.x | Database for user persistence |
| Keycloak | 23.x | Required for auth flows |

> **⚠️ Java 25 users**: The project targets Java 17. Lombok 1.18.34 has known
> incompatibilities with Java 25 (internal javac API changes cause
> `ExceptionInInitializerError: TypeTag::UNKNOWN`). **Build with JDK 17** to
> avoid this. If you must use Java 25, upgrade Lombok to 1.18.36 or later in
> `pom.xml`.

## Build

```bash
cd UserService
mvn clean install
```

### Verify your active JDK

```bash
mvn -version
```

The output should show `Java version: 17`. If it shows 25 (or another version),
set the `JAVA_HOME` environment variable to point to your JDK 17 installation:

```bash
# Linux / macOS
export JAVA_HOME=/path/to/jdk-17
export PATH=$JAVA_HOME/bin:$PATH

# Windows (PowerShell)
$env:JAVA_HOME = "C:\path\to\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

Then re-run `mvn -version` to confirm Java 17 is active.

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
