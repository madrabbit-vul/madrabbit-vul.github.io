# Level 3 — Ineffective CSRF Token

## Challenge Description

This challenge simulates a scenario where CSRF Token exists but is not bound to the user. The server only validates whether the Token is valid, not whether it belongs to the current user. Attackers can use their own Token to forge requests.

**Objective**: Exploit the CSRF Token-not-bound-to-user vulnerability by using another user's Token to capture the Flag.

## Vulnerability Analysis

Endpoint: `GET/POST /api/challenge/csrf/token/change-email?email=xxx&csrf_token=xxx`

**Vulnerable Code**:

```java
// Only checks if Token is in the valid token list
String tokenOwner = validTokens.get(csrf_token);
if (tokenOwner == null) {
    return "Invalid CSRF Token";
}
// ❌ Vulnerability: Does not verify tokenOwner.equals(username)
// Attackers can use their own valid Token to impersonate other users
```

## Walkthrough

### Step 1: Get Your Own CSRF Token

Visit `/api/challenge/csrf/token/csrf-token` to get the current user's Token.

### Step 2: Use Your Token to Change Another User's Email

Construct an email change request using your own Token. Since the Token is not bound to the user, the server accepts it.

### Step 3: Capture the Flag

When Token misuse is detected (Token doesn't belong to the current user), the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/csrf/CsrfTokenController.java` | Backend Token validation, Token not bound to user |
| `service/FlagService.java` | Flag retrieval and validation |
