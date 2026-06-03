# Level 2 — POST-based CSRF

## Challenge Description

This challenge simulates a password change function without CSRF Token validation, using POST requests. Attackers can craft auto-submitting forms for CSRF attacks.

**Objective**: Exploit the POST-based CSRF vulnerability to change the password and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/csrf/post/change-password`

**Vulnerability**: No CSRF Token validation — form-submitted requests are processed directly.

## Walkthrough

### Step 1: Observe Normal Request

Change password normally through the page and observe the request format (JSON).

### Step 2: Construct Form Submission

Craft a `application/x-www-form-urlencoded` POST request to submit a new password.

### Step 3: Capture the Flag

Successful form-submitted password change returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/csrf/CsrfPostController.java` | Backend password change endpoint, POST-based CSRF |
| `service/FlagService.java` | Flag retrieval and validation |
