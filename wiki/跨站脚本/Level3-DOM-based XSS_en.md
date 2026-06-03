# Level 3 — DOM-based XSS

## Challenge Description

This challenge simulates a welcome page. The server returns the user's input name as-is, but the vulnerability lies in the frontend using `innerHTML` to directly render the `name` URL parameter.

**Objective**: Craft a URL parameter containing an XSS payload to trigger frontend DOM-based XSS and capture the Flag.

## Vulnerability Analysis

```
GET /api/challenge/xss/dom/greeting?name=xxx
```

**Server behavior**: Returns the `name` parameter as-is: `result.put("name", name);`

**Frontend vulnerability**: The frontend code uses `innerHTML` to render the `name` value without escaping.

## Walkthrough

### Step 1: Normal Access

Visit `?name=Guest` and observe the welcome message.

### Step 2: Craft DOM-based XSS

Visit `?name=<img src=x onerror=alert(1)>` — the frontend `innerHTML` will parse and execute the malicious tag.

### Step 3: Capture the Flag

When the `name` parameter contains XSS patterns, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/xss/DomXssController.java` | Backend greeting endpoint, returns as-is |
| `static/challenges/xss/dom-xss.html` | Frontend page, innerHTML rendering |
| `service/FlagService.java` | Flag retrieval and validation |
