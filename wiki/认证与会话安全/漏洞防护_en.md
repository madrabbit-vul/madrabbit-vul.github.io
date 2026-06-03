# Authentication & Session Security — Vulnerability Protection

This document provides code-level fixes and protection recommendations for the three types of vulnerabilities covered in the "Authentication & Session Security" module.

---

## 1. Brute Force Protection

### 1.1 Login Rate Limiting

Implement request rate limiting at the Controller layer or interceptor. Redis + sliding window algorithm is recommended:

```java
@Service
public class RateLimitService {
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    /**
     * Check if rate limit is exceeded
     * @param key Rate limit identifier (e.g., IP + username)
     * @param maxAttempts Maximum attempt count
     * @param windowSeconds Time window (seconds)
     */
    public boolean isRateLimited(String key, int maxAttempts, int windowSeconds) {
        String redisKey = "rate_limit:" + key;
        Long count = redisTemplate.opsForValue().increment(redisKey);
        
        if (count != null && count == 1) {
            redisTemplate.expire(redisKey, windowSeconds, TimeUnit.SECONDS);
        }
        
        return count != null && count > maxAttempts;
    }
}

// Usage in login endpoint
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request,
                                                   HttpServletRequest httpRequest) {
    String clientIp = httpRequest.getRemoteAddr();
    String username = request.get("username");
    String limitKey = clientIp + ":" + username;
    
    // Lock for 15 minutes after 5 failures
    if (rateLimitService.isRateLimited(limitKey, 5, 900)) {
        result.put("message", "Too many failed attempts, please try again later");
        return ResponseEntity.status(429).body(result);
    }
    
    // Normal login logic...
}
```

### 1.2 Server-Side CAPTCHA

Use Google Kaptcha or a similar library to generate server-side CAPTCHAs. **Never implement CAPTCHA validation on the frontend**:

```java
@GetMapping("/captcha")
public void generateCaptcha(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Generate CAPTCHA text
    String captchaText = captchaProducer.createText();
    
    // Store in Session (not accessible from the frontend)
    request.getSession().setAttribute("captcha", captchaText);
    
    // Generate image and write to response
    BufferedImage image = captchaProducer.createImage(captchaText);
    ImageIO.write(image, "jpg", response.getOutputStream());
}

@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request,
                                                   HttpSession session) {
    String inputCaptcha = request.get("captcha");
    String serverCaptcha = (String) session.getAttribute("captcha");
    
    // Invalidate CAPTCHA after use
    session.removeAttribute("captcha");
    
    if (serverCaptcha == null || !serverCaptcha.equalsIgnoreCase(inputCaptcha)) {
        result.put("message", "Invalid captcha");
        return ResponseEntity.status(400).body(result);
    }
    
    // Normal login logic...
}
```

### 1.3 Account Lockout

```java
// Lock account for 15 minutes after 5 consecutive failures
if (loginFailedCount >= 5) {
    lockAccount(username, Duration.ofMinutes(15));
    result.put("message", "Account locked due to too many failed attempts");
    return ResponseEntity.status(423).body(result);
}
```

### 1.4 Unified Error Messages

**Never differentiate between "user not found" and "wrong password"**:

```java
// ❌ Dangerous: Leaks whether user exists
if (user == null) {
    return "User does not exist";
}
if (!passwordMatch) {
    return "Password is incorrect";
}

// ✅ Secure: Unified vague message
if (user == null || !passwordMatch) {
    return "Invalid username or password";
}
```

---

## 2. Password Reset Protection

### 2.1 Token-User Binding

This is the core fix for the Level 2 vulnerability in this module — **verify token-target user consistency**:

```java
// ❌ Vulnerable code: Only validates token validity
String tokenUsername = resetTokens.get(token);
if (tokenUsername == null) {
    return "Invalid token";
}
// Directly modifies the password for the requested username without checking binding

// ✅ Secure code: Validates token-username consistency
String tokenUsername = resetTokens.get(token);
if (tokenUsername == null || !tokenUsername.equals(username)) {
    return "Invalid or expired verification token";
}
```

### 2.2 Verification Code Security

```java
// Code generation: Use SecureRandom to ensure unpredictability
private String generateCode() {
    SecureRandom random = new SecureRandom();
    int code = 100000 + random.nextInt(900000);  // 6-digit number
    return String.valueOf(code);
}

// Code storage: Set expiration time
captchaStore.put(key, code);
// Use scheduled tasks or Redis TTL to clean expired codes

// Code usage: One-time consumption
String storedCode = captchaStore.get(key);
if (storedCode != null && storedCode.equals(code)) {
    captchaStore.remove(key);  // Delete immediately to prevent reuse
    // Verification passed...
}
```

### 2.3 Complete Secure Password Reset Flow

```java
@PostMapping("/pw_rest")
public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
    String username = request.get("username");
    String newPassword = request.get("newPassword");
    String token = request.get("token");
    
    // 1. Validate token validity
    String tokenBoundUser = resetTokens.get(token);
    if (tokenBoundUser == null) {
        return error("Invalid or expired verification token");
    }
    
    // 2. 【CRITICAL】Validate token-target user binding
    if (!tokenBoundUser.equals(username)) {
        return error("Token does not match the target user");
    }
    
    // 3. Validate new password strength
    if (!isStrongPassword(newPassword)) {
        return error("Password does not meet security requirements");
    }
    
    // 4. Delete used token
    resetTokens.remove(token);
    
    // 5. Update password (store with bcrypt encryption)
    String hashedPassword = passwordEncoder.encode(newPassword);
    userService.updatePassword(username, hashedPassword);
    
    // 6. Log the operation
    auditLogService.log("PASSWORD_RESET", username, request.getRemoteAddr());
    
    // 7. Notify user (email/SMS)
    notificationService.sendPasswordResetNotification(username);
    
    return success("Password reset successful");
}
```

---

## 3. JWT Security Protection

### 3.1 Use Strong Keys

This is the core fix for the Level 3 vulnerability in this module — **use sufficiently long random keys**:

```java
// ❌ Vulnerable code: Weak key + padding
private static final String WEAK_SECRET_KEY = "secret123";
private SecretKey getPaddedKey() {
    StringBuilder padded = new StringBuilder(WEAK_SECRET_KEY);
    while (padded.length() < 32) padded.append(WEAK_SECRET_KEY);
    return Keys.hmacShaKeyFor(padded.substring(0, 32).getBytes());
}

// ✅ Secure code: Use a 256-bit+ random key
private static final SecretKey JWT_KEY = Keys.hmacShaKeyFor(
    "your-very-long-and-complex-secret-key-at-least-32-characters-here!".getBytes(StandardCharsets.UTF_8)
);

// ✅ Better: Use key generator
private static final SecretKey JWT_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
```

### 3.2 Use Asymmetric Encryption (RS256)

```java
// Use RSA key pair: private key signs, public key verifies
// Even if the public key is leaked, attackers cannot forge tokens
KeyPair keyPair = Keys.keyPairFor(SignatureAlgorithm.RS256);

// Issue Token (using private key)
String token = Jwts.builder()
    .setSubject(username)
    .claim("role", role)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 3600000))  // 1 hour
    .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
    .compact();

// Validate Token (using public key)
Claims claims = Jwts.parserBuilder()
    .setSigningKey(keyPair.getPublic())
    .build()
    .parseClaimsJws(token)
    .getBody();
```

### 3.3 JWT Security Configuration Checklist

```java
public class JwtSecurityConfig {
    
    // ✅ Strong key (256-bit+)
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // ✅ Reasonable expiration time (recommend 1-2 hours, not 24 hours)
    private static final long ACCESS_TOKEN_EXPIRATION = 3600000;  // 1 hour
    
    // ✅ Token refresh mechanism
    private static final long REFRESH_TOKEN_EXPIRATION = 604800000;  // 7 days
    
    // ✅ Algorithm whitelist validation (prevents alg=none attacks)
    private static final Set<String> ALLOWED_ALGORITHMS = Set.of("HS256", "RS256");
    
    public Claims validateToken(String token) {
        JwtParser parser = Jwts.parserBuilder()
            .setSigningKey(SECRET_KEY)
            .build();
        
        Claims claims = parser.parseClaimsJws(token).getBody();
        
        // Validate algorithm
        String algorithm = parser.parseClaimsJws(token).getHeader().getAlgorithm();
        if (!ALLOWED_ALGORITHMS.contains(algorithm)) {
            throw new SecurityException("Invalid algorithm: " + algorithm);
        }
        
        return claims;
    }
}
```

### 3.4 Secondary Verification for Sensitive Operations

Do not rely solely on JWT for permission decisions. Add secondary verification for sensitive operations (such as password changes, data deletion):

```java
@DeleteMapping("/account")
public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String auth,
                                        @RequestBody Map<String, String> request) {
    // Even if JWT validation passes, require password confirmation
    String password = request.get("password");
    if (!passwordEncoder.matches(password, currentUser.getPassword())) {
        return ResponseEntity.status(403).body("Password confirmation required");
    }
    
    // Execute deletion...
}
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Brute Force | Rate limiting + server-side CAPTCHA + account lockout | Add RateLimit check to login endpoint |
| Password Reset Bypass | Token-user binding | `resetTokens.get(token).equals(username)` |
| JWT Weak Key | Use strong key or RS256 | Replace `WEAK_SECRET_KEY`, remove padding logic |

**Core Principle**: Never trust any claim from the client. The server must perform strict identity and permission validation for every critical operation.
