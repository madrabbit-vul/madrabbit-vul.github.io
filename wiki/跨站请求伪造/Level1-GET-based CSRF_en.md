# Level 1 — GET-based CSRF

## Challenge Description

This challenge simulates an email change function without CSRF protection. The sensitive operation is performed via GET request. Attackers can forge requests using image tags on a malicious page.

**Objective**: Exploit the GET-based CSRF vulnerability to change the email and capture the Flag.

## Vulnerability Analysis

Endpoint: `GET /api/challenge/csrf/get/change-email?email=xxx`

**Vulnerabilities**:
1. Sensitive operation (email change) uses GET method
2. No CSRF Token validation
3. Only relies on Cookie/Session for user identification

## Walkthrough

### Step 1: Normal Email Change

Change email through the page normally and observe the request method.

### Step 2: Craft CSRF Attack

Use a GET request to change the email directly.

### Step 3: Capture the Flag

A successful GET request email change returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/csrf/CsrfGetController.java` | Backend email change endpoint, GET-based CSRF |
| `service/FlagService.java` | Flag retrieval and validation |
