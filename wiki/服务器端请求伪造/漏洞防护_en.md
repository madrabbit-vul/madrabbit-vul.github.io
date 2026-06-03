# Server-Side Request Forgery (SSRF) — Vulnerability Protection

---

## 1. URL Whitelist / Protocol Restriction

Only allow HTTP/HTTPS protocols. Block file:// and other dangerous protocols.

---

## 2. Internal IP Validation

Resolve DNS and validate the resulting IP address against internal IP ranges.

---

## 3. Disable Redirect Following

```java
connection.setInstanceFollowRedirects(false);
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Basic SSRF | URL whitelist | Restrict accessible domains/IPs |
| Protocol exploitation | Protocol whitelist | Only allow http/https |
| Filter bypass | Post-resolution IP validation | Validate IP after DNS resolution |
| Redirect bypass | Disable redirects | `setInstanceFollowRedirects(false)` |

**Core Principle**: Never trust user-provided URLs. Always validate the actual target address after resolution before making requests.
