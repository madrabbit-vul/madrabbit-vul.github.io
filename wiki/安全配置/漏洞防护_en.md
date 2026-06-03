# Security Misconfiguration — Vulnerability Protection

---

## 1. Actuator Security Configuration

Disable or restrict all Actuator endpoints in production.

```yaml
management:
  endpoints:
    web:
      exposure:
        exclude: "*"
  endpoint:
    env:
      enabled: false
```

---

## 2. Swagger Security Configuration

Disable Swagger in production.

```yaml
springdoc:
  api-docs:
    enabled: false
  swagger-ui:
    enabled: false
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Configuration |
|-------------------|----------------|-------------------|
| Actuator exposure | Restrict endpoint exposure | `exposure.exclude: "*"` |
| Swagger exposure | Disable in production | `springdoc.api-docs.enabled: false` |

**Core Principle**: Audit all default configurations in production. Disable debug and monitoring endpoints.
