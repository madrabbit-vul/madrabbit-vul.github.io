# File Operation Vulnerabilities — Vulnerability Protection

---

## 1. File Upload Protection

Multi-layer validation + rename + isolated storage.

---

## 2. Path Traversal Protection

Normalize paths and validate they stay within the base directory.

```java
Path basePath = Paths.get("/app/downloads").toRealPath();
Path resolvedPath = basePath.resolve(filename).toRealPath();
if (!resolvedPath.startsWith(basePath)) {
    throw new SecurityException("Path traversal detected");
}
```

---

## 3. File Inclusion Protection

Whitelist allowed filenames only.

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| File upload | Multi-layer validation + rename + isolated storage | UUID rename + store outside web root |
| Path traversal | Path normalization + boundary check | `toRealPath().startsWith(basePath)` |
| File inclusion | Whitelist validation | Only allow predefined filenames |

**Core Principle**: Never use user input directly for file path construction. All file operations must use normalized path validation.
