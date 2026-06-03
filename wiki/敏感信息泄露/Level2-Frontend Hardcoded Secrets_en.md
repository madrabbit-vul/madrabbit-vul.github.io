# Level 2 — Frontend Hardcoded Secrets

## Challenge Description

This challenge simulates an admin console where the frontend JavaScript source code contains hardcoded admin credentials. Use browser developer tools to find the credentials and log in.

**Objective**: Discover hardcoded admin credentials in frontend code and log in to capture the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `HardcodedSecretController.java`

```
GET  /api/challenge/info-leak/hardcoded/page    — Get admin console page
POST /api/challenge/info-leak/hardcoded/login   — Admin login
```

**Vulnerability**: Admin credentials are hardcoded in frontend JavaScript, visible to anyone using browser developer tools.

### Source Code Snippet

```java
private static final String ADMIN_USERNAME = "admin";
private static final String ADMIN_PASSWORD = "S3cur3@dm1n!";

@PostMapping("/login")
public Map<String, Object> login(@RequestBody Map<String, String> body) {
    if (ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password)) {
        String flag = flagService.getFlag("info-leak", "level2");
        result.put("flag", flag);
    }
}
```

## Walkthrough

### Step 1: Visit Admin Console

Access the admin console page and observe the content.

### Step 2: Inspect Frontend Source

Open browser developer tools (F12), search for keywords like `admin`, `password`, `secret`, `credential` in JavaScript files.

### Step 3: Login with Found Credentials

Use the discovered credentials to call the login API. The response contains the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/infoleak/HardcodedSecretController.java` | Backend login endpoint |
| `static/challenges/info-leak/` | Frontend page (with hardcoded credentials) |
| `service/FlagService.java` | Flag retrieval and validation |
