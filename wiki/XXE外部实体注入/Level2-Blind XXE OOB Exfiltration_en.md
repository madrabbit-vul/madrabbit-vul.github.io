# Level 2 — Blind XXE OOB Exfiltration

## Challenge Description

This challenge simulates XML format validation. The backend parses XML but does not echo parsed content (blind XXE). Attackers must use OOB (Out-of-Band) techniques to exfiltrate data to an external server.

**Objective**: Craft a Blind XXE payload using OOB to exfiltrate virtual file content and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/xxe/level2/validate`

**Characteristic**: Only returns "XML format is valid" or error messages — no entity content echoed.

## Walkthrough

### Step 1: Submit Normal XML

```xml
<?xml version="1.0"?>
<root>test</root>
```

### Step 2: Craft OOB Payload

Set up an external HTTP server and use parameterized DTD to exfiltrate file content.

### Step 3: Capture the Flag

When blind XXE patterns are detected, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/xxe/XxeLevel2Controller.java` | Backend XML validation endpoint (no echo) |
| `service/FlagService.java` | Flag retrieval and validation |
