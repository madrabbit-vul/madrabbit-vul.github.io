# Broken Access Control — Vulnerability Protection

---

## 1. Resource Ownership Validation

Always verify that the requested resource belongs to the current user.

---

## 2. Role Validation

Validate roles server-side. Never trust role fields from client requests.

---

## 3. Hidden Endpoints Are Not Secure

All backend endpoints must enforce access control, regardless of frontend visibility.

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Horizontal escalation | Resource ownership check | `order.getOwnerId().equals(currentUserId)` |
| Vertical escalation | Server-side role check | Prohibit role modification via request |
| IDOR | Endpoint access control | Validate access for all endpoints |

**Core Principle**: Never trust client claims. The server must enforce strict permission checks for every request.
