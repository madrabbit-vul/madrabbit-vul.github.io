# Sensitive Information Exposure — Vulnerability Principles

## What is Sensitive Information Exposure?

Sensitive Information Exposure occurs when an application accidentally reveals data that should not be public, such as database connection strings, API keys, internal paths, framework versions, or user credentials. Attackers use this information to launch more targeted attacks.

The core problem: **Applications fail to effectively hide internal implementation details and sensitive data in error handling, frontend code, or version control systems.**

---

## 1. Error Message Disclosure

### How It Happens

When exceptions occur, the backend returns full stack traces, SQL statements, database connection info, server paths, etc. directly to users. This information should only be logged server-side.

Common leaked content:
- **SQL statements**: Complete queries and database type
- **Database connection info**: JDBC URL, username, pool configuration
- **Server info**: OS, Java version, application path
- **Stack traces**: Full class names, method names, line numbers

---

## 2. Frontend Hardcoded Secrets

### How It Happens

Developers hardcode admin credentials, API keys, encryption keys in JavaScript source code. Frontend code is fully visible to users through browser developer tools.

Common scenarios:
- Admin credentials written in JS variables
- API keys embedded in frontend config files
- Encryption keys in frontend encryption logic
- Debug backdoors left in production

---

## 3. .git Directory Exposure

### How It Happens

The `.git` directory was not removed during web server deployment. Attackers can access `.git/config`, `.git/HEAD`, `.git/logs/HEAD`, and `.git/objects/` to reconstruct the full Git repository history, including sensitive configurations that were committed and later deleted.

**Key Point**: Even after sensitive files are deleted in subsequent commits, Git's object database retains the full content of historical versions.
