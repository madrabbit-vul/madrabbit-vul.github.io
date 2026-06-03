# Authentication & Session Security — Vulnerability Principles

## What is Authentication & Session Security?

In Web applications, **Authentication** is the process by which the server confirms "who you are," and **Session** is a "temporary pass" (usually a Cookie or Token) issued by the server after successful authentication. If either of these two links has a vulnerability, attackers can impersonate legitimate users to access the system.

The core issue of authentication and session security vulnerabilities can be summarized in one sentence: **The server made a mistake when determining "who you are."**

---

## 1. Brute Force

### How It Happens

When a login endpoint lacks the following security measures, it is vulnerable to brute force attacks:

- **No Rate Limiting**: Allows unlimited login attempts from the same IP in a short period
- **No CAPTCHA**: Does not require users to complete a human-verification challenge
- **No Account Lockout**: Does not freeze accounts after consecutive failures
- **No IP Banning**: Does not restrict suspicious IPs

Attackers can use automated scripts combined with password dictionaries to try thousands of password combinations within minutes.

### Real-World Case

In 2019, a major internet company's login endpoint had no rate limiting. An attacker used a dictionary of 20,000 common passwords to crack thousands of weak-password accounts in 30 minutes.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Low (mature tools, extremely low barrier) |
| Impact Scope | High (all users with weak passwords are affected) |
| Exploitation Condition | Only requires an accessible login endpoint |

---

## 2. Password Reset Bypass

### How It Happens

The password reset process typically involves three steps: identity verification → verification code check → password reset. Vulnerabilities arise where **verification logic is missing**:

1. **Verification token not bound to account**: The server validates the verification code/Token's validity but does not check which account the token was issued to. An attacker can use a token obtained for their own account to reset another user's password.

2. **Predictable verification codes**: Verification codes generated using simple algorithms that can be enumerated or calculated.

3. **Response information leakage**: The server returns verification codes or reset links in responses.

```
Normal flow:
  User A requests a code → Code sent to A → Reset A's password with A's token ✅

Exploitation:
  Attacker B requests a code → Gets B's token → Reset A's password with B's token ❌ (token not bound to user)
```

### Real-World Case

In 2017, a social media platform's password reset endpoint only verified whether the SMS code was correct, without checking the binding between the code and the phone number. An attacker could obtain a code for their own phone number and replace the phone number in the request with the target user's number to reset their password.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires understanding the business flow) |
| Impact Scope | High (can reset any user's password) |
| Exploitation Condition | Requires a registered account |

---

## 3. JWT Weak Key Brute Force

### How It Happens

JWT (JSON Web Token) consists of three parts: `Header.Payload.Signature`. The Signature uses a key to sign the first two parts, preventing content tampering.

When using the HS256 (HMAC-SHA256) symmetric encryption algorithm, the same key is used for both signing and verification. If the key strength is insufficient (e.g., common words, short strings, default keys), attackers can:

1. Obtain a valid JWT Token
2. Use dictionaries or tools (such as hashcat, jwt-cracker) to brute force the signing key offline
3. Use the cracked key to forge tokens for any user

```
JWT structure (Base64 encoded):
  Header   : {"alg":"HS256","typ":"JWT"}
  Payload  : {"username":"admin","role":"ADMIN"}
  Signature: HMACSHA256(base64(Header) + "." + base64(Payload), secret_key)

If secret_key = "secret123", attackers can crack it in seconds
```

### Key Padding Issue

HS256 requires a key length of at least 256 bits (32 bytes). Some developers pad short keys to meet the length requirement, for example by repeating the key. This padding approach does not increase the key's entropy. Once the short key is cracked, the full padded key can be reconstructed.

### Real-World Case

In 2015, a well-known SaaS platform's JWT key was `secret`. A security researcher cracked it within minutes and then forged an admin token to gain the highest system privileges.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires brute force tools and key dictionaries) |
| Impact Scope | Extremely High (can forge any user's identity) |
| Exploitation Condition | Requires obtaining a valid JWT Token |
