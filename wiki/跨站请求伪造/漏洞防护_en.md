# Cross-Site Request Forgery (CSRF) — Vulnerability Protection

---

## 1. Use CSRF Tokens

### 1.1 Token Generation and Validation

Generate unique tokens per session and validate on every sensitive request.

### 1.2 Bind Token to User (Critical!)

```java
// ✅ Secure: Token bound to user
String tokenOwner = validTokens.get(csrf_token);
if (tokenOwner == null || !tokenOwner.equals(currentUsername)) {
    return "Invalid or mismatched CSRF Token";
}
```

---

## 2. SameSite Cookie

```java
response.setHeader("Set-Cookie", 
    "session=xxx; Path=/; SameSite=Strict; HttpOnly; Secure");
```

---

## 3. Use POST for Sensitive Operations

Never use GET requests for sensitive operations.

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| GET-based CSRF | Use POST for sensitive operations | `@PostMapping` instead of `@GetMapping` |
| POST-based CSRF | CSRF Token validation | Generate + validate Token |
| Ineffective Token | Bind Token to user | `tokenOwner.equals(username)` |

**Core Principle**: All sensitive operations must validate CSRF Tokens, and Tokens must be bound to the current user.
