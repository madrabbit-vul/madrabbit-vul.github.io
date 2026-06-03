# Level 1 — Error Message Disclosure

## Challenge Description

This challenge simulates a user query interface where abnormal input triggers detailed error messages exposing database type, SQL statements, internal paths, and other sensitive information. The Flag is hidden in the `debug_trace` field of the error response.

**Objective**: Trigger error messages through abnormal input and extract the Flag from the leaked information.

## Vulnerability Analysis

### Code Logic

Backend code: `ErrorLeakController.java`

```
GET /api/challenge/info-leak/error/user?id={id}
```

| Input | Trigger | Leaked Information |
|-------|---------|-------------------|
| Non-numeric string | SQL parse error | SQL statement, database type, JDBC URL, stack trace |
| 0 or negative | Array index error | Internal paths, Redis address, config file paths |
| Large number (>99999) | Timeout error | Database connection pool info, username |

**Vulnerability**: Error details including SQL statements, database connection info, stack traces, and server info are returned directly to the client. The Flag is appended to the `debug_trace` field.

### Source Code Snippet

```java
private Map<String, Object> buildSqlParseError(String input) {
    detail.put("sql_statement", "SELECT id, name, email FROM tbl_users WHERE id = " + input);
    detail.put("database", "MySQL 8.0.32");
    detail.put("datasource_url", "jdbc:mysql://192.168.1.100:3306/madx_prod");
    detail.put("debug_trace", "TraceID: a3f8c2e1-9b47-4d6a-b5c0-" + flag);
}
```

## Walkthrough

### Step 1: Normal Query

Enter a valid ID (1-5) and observe the response structure.

### Step 2: Trigger Error

Enter a non-numeric string (e.g., `abc`) to trigger SQL parse error:

```
GET /api/challenge/info-leak/error/user?id=abc
```

### Step 3: Extract the Flag

Find the `detail.debug_trace` field in the error response. The Flag is appended after the TraceID.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/infoleak/ErrorLeakController.java` | Backend user query endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
