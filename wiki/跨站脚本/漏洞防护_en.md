# Cross-Site Scripting (XSS) — Vulnerability Protection

---

## 1. Input Filtering and Output Escaping

### 1.1 Backend Output Escaping (Core Protection)

```java
import org.apache.commons.text.StringEscapeUtils;

// ✅ Safe: HTML output escaping
String safeOutput = StringEscapeUtils.escapeHtml4(userInput);
```

### 1.2 Frontend Safe Rendering

```javascript
// ❌ Dangerous: innerHTML direct rendering
element.innerHTML = userInput;

// ✅ Safe: textContent assignment
element.textContent = userInput;

// ✅ Safe: Use DOMPurify library
element.innerHTML = DOMPurify.sanitize(userInput);
```

### 1.3 Content Security Policy (CSP)

```java
response.setHeader("Content-Security-Policy", 
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
```

---

## 2. Stored XSS Protection

### 2.1 Input Filtering

Remove all HTML tags or use OWASP Java HTML Sanitizer.

### 2.2 Escape Before Storage

```java
comment.put("content", StringEscapeUtils.escapeHtml4(content));
```

---

## 3. DOM-based XSS Protection

Use safe DOM APIs: `textContent` instead of `innerHTML`, avoid `document.write()` and `eval()`.

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Reflected XSS | Output escaping | `escapeHtml4(userInput)` |
| Stored XSS | Input filtering + storage escaping | Escape before storing, re-escape on display |
| DOM-based XSS | Frontend safe rendering | `innerHTML` → `textContent` or DOMPurify |

**Core Principle**: Never trust user input. All content output to HTML must be escaped.
