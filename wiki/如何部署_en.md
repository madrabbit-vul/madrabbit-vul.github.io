# Deployment Guide

> **Risk Warning**: MadRabbit contains intentionally planted security vulnerabilities. **Do NOT deploy to the public internet.** Use only in an isolated local environment.

## Prerequisites

| Dependency | Minimum Version | Purpose | Verify Command |
|------------|----------------|---------|---------------|
| JDK | 17 | Run Java application | `java -version` |
| Maven | 3.6+ | Build project | `mvn -version` |
| MySQL | 8.0+ | Database service | `mysql --version` |
| Git | 2.0+ | Clone source code | `git --version` |

> JDK version must be 17. The project specifies `<java.version>17</java.version>` in pom.xml. Other versions may cause compilation or runtime failures.

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/zhuifengshaonianhanlu/MadRabbit.git
cd MadRabbit
```

### 2. Initialize the Database

Ensure MySQL service is running:

```bash
# macOS (Homebrew)
brew services start mysql

# Linux (systemd)
sudo systemctl start mysql

# Verify connection
mysql -u root -p -e "SELECT VERSION();"
```

Run the one-click initialization script:

```bash
mysql -u root -p < sql/install_init.sql
```

The script will automatically:
- Create the `madrabbit` database (UTF-8MB4 encoding)
- Create 6 business tables (users, flags, challenge_users, logs_access, logs_error, merchant_orders)
- Insert all initial data (users, level Flags, injection data, access-control orders, etc.)

> The script uses `INSERT IGNORE` syntax and can be safely re-run without primary key conflict errors.

Verify the initialization:

```bash
mysql -u root -p madrabbit -e "SHOW TABLES; SELECT COUNT(*) AS user_count FROM users; SELECT COUNT(*) AS flag_count FROM flags;"
```

Expected output: 6 tables, 6 users, 50+ Flag records.

### 3. Configure Database Connection

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/madrabbit?useSSL=false&serverTimezone=UTC&characterEncoding=utf8
    username: root          # Change to your MySQL username
    password: root@666      # Change to your MySQL password
```

Default configuration: address `127.0.0.1:3306`, username `root`, password `root@666`. If your MySQL password differs, you must update this.

### 4. Build the Project

```bash
mvn clean package -DskipTests
```

The first build will download dependencies, which may take a while. Upon success, `madrabbit-1.0.0.jar` will be generated in the `target/` directory.

> If dependency downloads are slow, configure a domestic Maven mirror (e.g., Alibaba Cloud) by adding mirror settings to `~/.m2/settings.xml`.

### 5. Start the Application

**Option 1: Maven (recommended for development)**

```bash
mvn spring-boot:run
```

**Option 2: JAR file (recommended for deployment)**

```bash
java --add-opens java.naming/javax.naming=ALL-UNNAMED \
     --add-opens java.base/java.lang=ALL-UNNAMED \
     --add-opens java.base/java.lang.reflect=ALL-UNNAMED \
     -jar target/madrabbit-1.0.0.jar
```

> When using `mvn spring-boot:run`, the `--add-opens` JVM arguments configured in `pom.xml` take effect automatically. When using `java -jar`, you must add them manually; otherwise, the deserialization challenge (Log4Shell) will not work properly.

### 6. Verify Deployment

After successful startup, the console will output:

```
Started MadrabbitApplication in X.XXX seconds
```

Access the following URLs to confirm the service is running:

| URL | Description |
|-----|-------------|
| http://localhost:8080 | Homepage |
| http://localhost:8080/login.html | Login page |
| http://localhost:8080/swagger-ui.html | Swagger API docs |

**Default test accounts:**

| Username | Password | Role |
|----------|----------|------|
| admin | 123456 | ADMIN |
| jack | 123456 | LEARNER |
| lucy | 123456 | LEARNER |
| tom | 123456 | LEARNER |

## Troubleshooting

### Q1: Startup error `Communications link failure`

- Verify MySQL service is running
- Check database address, port, username, and password in `application.yml`
- For MySQL 8.0 with `caching_sha2_password` authentication, modify the auth method:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
  FLUSH PRIVILEGES;
  ```

### Q2: Startup error `IncompatibleClassChangeError`

- Confirm JDK version is 17: `java -version`
- Clean and rebuild: `mvn clean package -DskipTests`

### Q3: Deserialization challenge (Log4Shell) cannot be triggered

- Confirm `--add-opens` JVM arguments were added at startup
- This challenge requires JNDI/LDAP external service support; some features may be limited in local environments

### Q4: Swagger documentation page is inaccessible

- Access URL: http://localhost:8080/swagger-ui.html
- If 404, try http://localhost:8080/swagger-ui/index.html
