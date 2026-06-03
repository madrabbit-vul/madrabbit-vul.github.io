# Cross-Site Request Forgery (CSRF) — Vulnerability Principles

## What is CSRF?

Cross-Site Request Forgery (CSRF) occurs when an attacker tricks an authenticated user into unknowingly sending a malicious request to a target website, leveraging the user's login state to perform unauthorized actions.

The core problem: **Browsers automatically include the target domain's cookies/session, and attackers exploit this to forge requests.**

---

## 1. GET-based CSRF

### How It Happens

When sensitive operations (like changing email or password) are performed via GET requests, attackers can trigger requests using image tags or links:

```html
<img src="https://target.com/api/change-email?email=attacker@evil.com">
```

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Low (just an img tag) |
| Impact Scope | High (any logged-in user who visits the malicious page) |
| Exploitation Condition | Sensitive operation uses GET method |

---

## 2. POST-based CSRF

### How It Happens

Even with POST methods, without CSRF Token validation, attackers can use auto-submitting hidden forms:

```html
<form action="https://target.com/api/change-password" method="POST">
    <input type="hidden" name="newPassword" value="hacked123">
</form>
<script>document.forms[0].submit();</script>
```

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires form construction) |
| Impact Scope | High |
| Exploitation Condition | No CSRF Token validation |

---

## 3. Ineffective CSRF Token

### How It Happens

The server implements CSRF Token but only validates whether the Token is valid, not whether it belongs to the current user. Attackers can use their own valid Token to forge CSRF requests against victims.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | High (requires understanding Token mechanism) |
| Impact Scope | High |
| Exploitation Condition | CSRF Token exists but not bound to user |
