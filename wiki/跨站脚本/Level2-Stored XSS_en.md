# Level 2 — Stored XSS

## Challenge Description

This challenge simulates a comment board feature. User-submitted content is stored without any filtering or escaping, and the frontend renders it using `innerHTML`.

**Objective**: Insert an XSS payload into a comment to capture the Flag.

## Vulnerability Analysis

```
POST /api/challenge/xss/stored/comment
Body: { "author": "username", "content": "comment text" }
```

**Vulnerability**: Comment content is stored directly without any filtering or escaping.

```java
// [VULNERABILITY] Stores user input directly without filtering or escaping
comment.put("content", content);  // Stored as-is, including XSS payload
```

## Walkthrough

### Step 1: View Existing Comments

Visit the comment board and observe how comments are displayed.

### Step 2: Submit Malicious Comment

Enter `<script>alert('XSS')</script>` or `<img src=x onerror=alert(1)>` in the comment content.

### Step 3: Capture the Flag

When an XSS payload is detected, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/xss/StoredXssController.java` | Backend comment endpoint, no input filtering |
| `service/FlagService.java` | Flag retrieval and validation |
