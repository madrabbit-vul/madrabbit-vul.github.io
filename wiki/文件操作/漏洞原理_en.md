# File Operation Vulnerabilities — Vulnerability Principles

## What are File Operation Vulnerabilities?

File operation vulnerabilities occur when applications have insufficient validation during file upload, download, and include operations, allowing attackers to upload malicious files, read arbitrary files, or execute file inclusion attacks.

---

## 1. File Upload Vulnerability

Incomplete type validation allows attackers to upload files containing malicious code (e.g., WebShell). Three common validation layers and their bypasses:

1. Extension check → Bypassable via image polyglot
2. Content-Type check → Bypassable via forged Content-Type
3. Magic bytes check → Bypassable via image with embedded code

---

## 2. Path Traversal Vulnerability

User-supplied filenames are concatenated directly into paths without filtering `../`, allowing attackers to escape the designated directory.

---

## 3. File Inclusion Vulnerability

Applications dynamically load files based on user input with incomplete `../` filtering (e.g., single-pass replacement). Attackers use `..../` which becomes `../../` after replacement.
