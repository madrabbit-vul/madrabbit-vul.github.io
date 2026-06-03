# Sensitive Information Exposure — Vulnerability Protection

---

## 1. Error Message Protection

### Global Exception Handler

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        log.error("Internal error: ", e);
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("message", "Internal server error");
        // Never include stack traces or SQL statements
        return ResponseEntity.status(500).body(result);
    }
}
```

### Environment Isolation

```yaml
server:
  error:
    include-stacktrace: never
    include-message: never
```

---

## 2. Frontend Hardcoded Secrets Protection

Store credentials only in server-side configuration or environment variables. Never place credentials in frontend code.

```java
@Value("${admin.username}")
private String adminUsername;

@Value("${admin.password}")
private String adminPassword;
```

---

## 3. .git Directory Protection

```bash
# Remove .git during deployment
rm -rf /var/www/html/.git
```

```nginx
# Block .git path requests
location ~ /\.git {
    deny all;
    return 404;
}
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Error message disclosure | Global exception handler + disable debug info | `server.error.include-stacktrace: never` |
| Frontend hardcoded secrets | Server-side credential storage + env vars | Use `@Value` injection, not frontend JS |
| .git exposure | Deploy cleanup + Nginx blocking | `rm -rf .git` + `location ~ /\.git { deny all; }` |

**Core Principle**: Follow the principle of minimum information exposure in production. Generalize error messages, server-side credentials, and clean deployment files.
